import { supabaseAdmin } from "../supabase/admin";
import { PipelineSummary, processSourceHomepageHtml } from "./pipeline";

/**
 * Safe parser for JSON returned by Oxylabs that prevents large 64-bit integers
 * from losing precision when parsed by standard JavaScript JSON.parse.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseJsonWithLargeInts(text: string): any {
  const wrappedText = text.replace(/(:\s*|\[\s*|,\s*)(\d{15,})/g, '$1"$2"');
  return JSON.parse(wrappedText);
}

/**
 * Helper to make authenticated requests to Oxylabs Scheduler API.
 */
async function callOxylabsApi(path: string, method: string = "GET", body?: unknown): Promise<string> {
  const username = process.env.OXY_WSA_USERNAME;
  const password = process.env.OXY_WSA_PASSWORD;

  if (!username || !password) {
    throw new Error("Missing Oxylabs WSA credentials (OXY_WSA_USERNAME and OXY_WSA_PASSWORD) in environment.");
  }

  const url = `https://data.oxylabs.io${path}`;
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Oxylabs Scheduler API error on ${method} ${path}: Status ${response.status} - ${errorText}`);
  }

  return response.text();
}

/**
 * Sync active sources from DB to Oxylabs schedules.
 * Deactivates orphaned schedules on Oxylabs.
 */
export async function syncSchedules(): Promise<{
  syncedSources: string[];
  createdSchedulesCount: number;
  deactivatedSchedulesCount: number;
}> {
  console.log("=== SYNCING OXYLABS SCHEDULES ===");
  
  // 1. Fetch active sources
  const { data: sources, error: sourcesError } = await supabaseAdmin
    .from("sources")
    .select("*")
    .eq("active", true);

  if (sourcesError) {
    throw new Error(`Failed to load sources for schedule sync: ${sourcesError.message}`);
  }

  // 2. Fetch existing local schedule records
  const { data: localSchedules, error: localSchedulesError } = await supabaseAdmin
    .from("oxylabs_schedules")
    .select("*");

  if (localSchedulesError) {
    throw new Error(`Failed to load local schedules: ${localSchedulesError.message}`);
  }

  const localSchedulesMap = new Map(
    localSchedules.map((s) => [s.source_id, s.oxylabs_schedule_id])
  );

  const syncedSources: string[] = [];
  let createdSchedulesCount = 0;

  // 5 years in the future for end_time (indefinite runs constraint)
  const fiveYearsFuture = new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000);
  const endTimeStr = fiveYearsFuture.toISOString().replace("T", " ").slice(0, 19);

  // 3. Sync each active source
  for (const source of sources) {
    syncedSources.push(source.name);
    const existingScheduleId = localSchedulesMap.get(source.id);

    if (!existingScheduleId) {
      console.log(`Creating Oxylabs schedule for source: ${source.name}`);
      
      const payload = {
        cron: "0 * * * *", // Hourly at top of hour
        end_time: endTimeStr,
        items: [
          {
            source: "universal",
            url: source.listing_url,
            render: "html",
            user_agent_type: "desktop_chrome",
          },
        ],
      };

      try {
        const responseText = await callOxylabsApi("/v1/schedules", "POST", payload);
        const scheduleObj = parseJsonWithLargeInts(responseText);
        const oxylabsScheduleId = scheduleObj.schedule_id || scheduleObj.id;

        if (!oxylabsScheduleId) {
          throw new Error("Oxylabs creation response did not contain schedule ID.");
        }

        // Insert local record
        const { error: insertError } = await supabaseAdmin
          .from("oxylabs_schedules")
          .insert({
            source_id: source.id,
            oxylabs_schedule_id: String(oxylabsScheduleId),
          });

        if (insertError) {
          throw new Error(`Failed to save schedule record to DB: ${insertError.message}`);
        }

        console.log(`Created schedule ${oxylabsScheduleId} for ${source.name}`);
        createdSchedulesCount++;
      } catch (err: unknown) {
        console.error(`Failed to create schedule for source ${source.name}:`, err);
      }
    } else {
      console.log(`Schedule already exists for source ${source.name}: ${existingScheduleId}`);
    }
  }

  // 4. Deactivate orphaned schedules (Section 18)
  let deactivatedSchedulesCount = 0;
  try {
    const listResponseText = await callOxylabsApi("/v1/schedules", "GET");
    const schedulesListObj = parseJsonWithLargeInts(listResponseText);
    const remoteScheduleIds: string[] = Array.isArray(schedulesListObj)
      ? schedulesListObj.map((s: unknown) => (typeof s === "object" && s !== null && "id" in s) ? String((s as { id: string | number }).id) : String(s))
      : (schedulesListObj.schedules || schedulesListObj.results || []).map((s: unknown) => (typeof s === "object" && s !== null && "id" in s) ? String((s as { id: string | number }).id) : String(s));

    // Get current DB stored schedule IDs
    const { data: updatedLocalSchedules } = await supabaseAdmin
      .from("oxylabs_schedules")
      .select("oxylabs_schedule_id");

    const activeDbScheduleIds = new Set((updatedLocalSchedules || []).map((s) => s.oxylabs_schedule_id));

    for (const remoteId of remoteScheduleIds) {
      if (!activeDbScheduleIds.has(remoteId)) {
        console.log(`Deactivating orphaned schedule on Oxylabs: ${remoteId}`);
        try {
          await callOxylabsApi(`/v1/schedules/${remoteId}/state`, "PUT", { active: false });
          deactivatedSchedulesCount++;
        } catch (deactivateErr) {
          console.error(`Failed to deactivate schedule ${remoteId}:`, deactivateErr);
        }
      }
    }
  } catch (err) {
    console.error("Failed to query/deactivate remote schedules list:", err);
  }

  console.log("=== SCHEDULE SYNC COMPLETE ===");
  return {
    syncedSources,
    createdSchedulesCount,
    deactivatedSchedulesCount,
  };
}

/**
 * Process completed Oxylabs schedule runs by downloading their HTML
 * and feeding them through the scraping pipeline.
 */
export async function processScheduledResults(options?: {
  limitPerSource?: number;
}): Promise<PipelineSummary> {
  const startTime = Date.now();
  console.log("=== PROCESSING SCHEDULED RESULTS ===");

  const limitPerSource = options?.limitPerSource || 5;
  const summary: PipelineSummary = {
    status: "success",
    sourcesChecked: [],
    candidatesFound: 0,
    candidatesRejected: 0,
    duplicatesSkipped: 0,
    detailPagesScraped: 0,
    articlesInserted: 0,
    articlesRejected: 0,
    articlesFailed: 0,
    totalDurationMs: 0,
    rejectionReasons: {},
  };

  try {
    // 1. Fetch local schedules
    const { data: dbSchedules, error: dbSchedulesError } = await supabaseAdmin
      .from("oxylabs_schedules")
      .select("*");
 
    if (dbSchedulesError) {
      throw new Error(`Failed to load schedules from DB: ${dbSchedulesError.message}`);
    }
 
    if (!dbSchedules || dbSchedules.length === 0) {
      console.log("No schedules registered in local database.");
      summary.totalDurationMs = Date.now() - startTime;
      return summary;
    }

    // 2. Fetch active sources
    const { data: activeSources, error: activeSourcesError } = await supabaseAdmin
      .from("sources")
      .select("*")
      .eq("active", true);

    if (activeSourcesError) {
      throw new Error(`Failed to load active sources from DB: ${activeSourcesError.message}`);
    }

    const activeSourcesMap = new Map(activeSources.map((s) => [s.id, s]));
 
    // 3. Fetch already processed run IDs to prevent duplicate processing
    const { data: processedRuns, error: processedRunsError } = await supabaseAdmin
      .from("oxylabs_schedule_runs")
      .select("oxylabs_run_id");
 
    if (processedRunsError) {
      throw new Error(`Failed to load processed runs list: ${processedRunsError.message}`);
    }
 
    const processedRunIdsSet = new Set((processedRuns || []).map((r) => r.oxylabs_run_id));
 
    // 4. For each schedule, look up runs on Oxylabs
    for (const schedule of dbSchedules) {
      const source = activeSourcesMap.get(schedule.source_id);
      if (!source) continue;
      
      console.log(`Checking runs for ${source.name} (Schedule: ${schedule.oxylabs_schedule_id})`);
      summary.sourcesChecked.push(source.name);

      let runsDataText = "";
      try {
        runsDataText = await callOxylabsApi(`/v1/schedules/${schedule.oxylabs_schedule_id}/runs`, "GET");
      } catch (err: unknown) {
        console.error(`Failed to fetch runs for schedule ${schedule.oxylabs_schedule_id}:`, err);
        continue;
      }

      const runsObj = parseJsonWithLargeInts(runsDataText);
      const runsList = Array.isArray(runsObj) ? runsObj : (runsObj.runs || []);

      // Filter runs with result_status === 'done' that have not been processed yet (Section 18)
      const unprocessedDoneRuns = runsList.filter((run: { run_id?: string | number; id?: string | number; status?: string; started_at?: string; jobs?: { id?: string | number; result_status?: string }[] }) => {
        const firstJob = run.jobs?.[0];
        const isDone = firstJob?.result_status === "done" || run.status === "done" || run.status === "success";
        const runId = String(run.run_id || run.id);
        return isDone && !processedRunIdsSet.has(runId);
      });

      console.log(`Found ${unprocessedDoneRuns.length} new completed runs to process for ${source.name}`);

      for (const run of unprocessedDoneRuns) {
        const runId = String(run.run_id || run.id);
        const jobId = String(run.jobs?.[0]?.id || runId);
        console.log(`Processing completed job run: ${runId} (Job/Query ID: ${jobId})`);

        let resultsText = "";
        try {
          // Fetch results from Push-Pull Queries API (Section 18)
          resultsText = await callOxylabsApi(`/v1/queries/${jobId}/results`, "GET");
        } catch (err: unknown) {
          console.error(`Failed to retrieve results for job ${jobId}:`, err);
          continue;
        }

        const resultsObj = parseJsonWithLargeInts(resultsText);
        const homepageHtml = resultsObj.results?.[0]?.content || "";

        if (!homepageHtml) {
          console.error(`Empty content returned for run results of job ${runId}`);
          continue;
        }

        console.log(`Successfully fetched job HTML for run ${runId}. Size: ${homepageHtml.length} chars.`);

        // Parse HTML and process articles
        try {
          await processSourceHomepageHtml(homepageHtml, source, limitPerSource, summary);

          // Save run record to database to mark as processed
          const { error: runInsertError } = await supabaseAdmin
            .from("oxylabs_schedule_runs")
            .insert({
              oxylabs_schedule_id: schedule.oxylabs_schedule_id,
              oxylabs_run_id: runId,
              status: "done",
              started_at: run.started_at || new Date().toISOString(),
              processed_at: new Date().toISOString(),
            });

          if (runInsertError) {
            console.error(`Failed to save processed schedule run record to DB: ${runInsertError.message}`);
          } else {
            console.log(`Successfully logged run ${runId} as processed.`);
            processedRunIdsSet.add(runId);
          }
        } catch (procErr) {
          console.error(`Error processing job HTML for run ${runId}:`, procErr);
        }
      }
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Scheduler process runs crashed:", msg);
    summary.status = "failed";
  }

  summary.totalDurationMs = Date.now() - startTime;
  console.log("=== SCHEDULED RESULTS PROCESS COMPLETED ===");
  console.log(JSON.stringify(summary, null, 2));

  // Write log to DB
  try {
    await supabaseAdmin.from("logs").insert({
      type: "scrape",
      status: summary.status,
      message: `Scheduler runs processing finished. Checked ${summary.sourcesChecked.length} schedules, processed runs, inserted ${summary.articlesInserted} articles.`,
      metadata: JSON.parse(JSON.stringify(summary)),
    });
  } catch (logErr) {
    console.error("Failed to write scheduler process log to Supabase:", logErr);
  }

  return summary;
}
