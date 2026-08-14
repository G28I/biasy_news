import { NextRequest, NextResponse } from "next/server";
import { processScheduledResults } from "@/lib/scraping/scheduler";
import { runAnalysisPipeline } from "@/lib/ai/pipeline";

export async function GET(req: NextRequest) {
  // 1. Verify Vercel Cron authorization (Section 18)
  const isLocal = process.env.NODE_ENV === "development" || !process.env.VERCEL;
  
  if (!isLocal) {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      return NextResponse.json(
        { error: "Server error: CRON_SECRET environment variable is not configured." },
        { status: 500 }
      );
    }

    if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid Cron Authorization header." },
        { status: 401 }
      );
    }
  }

  console.log("=== HOURLY CRON PIPELINE TRIGGERED ===");
  
  const results = {
    scraping: null as unknown,
    analysis: null as unknown,
    scrapingError: null as string | null,
    analysisError: null as string | null,
  };

  // Step 1: Process scheduled results
  try {
    console.log("Starting Step 1: Processing scheduled scraping results...");
    results.scraping = await processScheduledResults();
    console.log("Step 1 finished successfully.");
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("Step 1 (Scraping) failed:", errMsg);
    results.scrapingError = errMsg;
  }

  // Step 2: Run AI analysis (Must run even if scraping fails! Section 18)
  try {
    console.log("Starting Step 2: Running AI analysis pipeline...");
    results.analysis = await runAnalysisPipeline();
    console.log("Step 2 finished successfully.");
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("Step 2 (AI Analysis) failed:", errMsg);
    results.analysisError = errMsg;
  }

  console.log("=== HOURLY CRON PIPELINE FINISHED ===");
  
  const hasError = results.scrapingError !== null || results.analysisError !== null;
  const status = hasError ? 500 : 200;

  return NextResponse.json(
    {
      message: "Hourly pipeline execution finished.",
      scraping: results.scraping || { status: "failed", error: results.scrapingError },
      analysis: results.analysis || { status: "failed", error: results.analysisError },
    },
    { status }
  );
}
export const dynamic = "force-dynamic";
export const revalidate = 0;
