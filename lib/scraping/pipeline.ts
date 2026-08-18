import { supabaseAdmin } from "../supabase/admin";
import { scrapeUrl } from "./oxylabs";
import { extractHomepageLinks, parseArticleDetail } from "./parser";

export interface PipelineSummary {
  status: "success" | "failed";
  sourcesChecked: string[];
  candidatesFound: number;
  candidatesRejected: number;
  duplicatesSkipped: number;
  detailPagesScraped: number;
  articlesInserted: number;
  articlesRejected: number;
  articlesFailed: number;
  totalDurationMs: number;
  rejectionReasons: { [reason: string]: number };
}

/**
 * Executes the scrape-to-insert news pipeline.
 * By default runs all active sources from the DB up to `limitPerSource` valid articles per source.
 */
export async function runScrapingPipeline(options?: {
  limitPerSource?: number;
  sourceNames?: string[];
}): Promise<PipelineSummary> {
  const startTime = Date.now();
  console.log("=== SCRAPING PIPELINE STARTED ===");

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
    // 1. Fetch active sources from DB (section 7 & 8)
    let sourcesQuery = supabaseAdmin.from("sources").select("*").eq("active", true);
    if (options?.sourceNames && options.sourceNames.length > 0) {
      sourcesQuery = sourcesQuery.in("name", options.sourceNames);
    }

    const { data: sources, error: sourcesError } = await sourcesQuery;
    if (sourcesError) {
      throw new Error(`Failed to load sources from database: ${sourcesError.message}`);
    }

    if (!sources || sources.length === 0) {
      console.log("No active sources found to scrape.");
      summary.totalDurationMs = Date.now() - startTime;
      return summary;
    }

    console.log(`Selected active sources: ${sources.map((s) => s.name).join(", ")}`);
    summary.sourcesChecked = sources.map((s) => s.name);

    // 2. Process each source
    for (const source of sources) {
      console.log(`\n--- Starting scrape for source: ${source.name} ---`);
      
      let homepageHtml = "";
      try {
        homepageHtml = await scrapeUrl(source.listing_url, false);
        console.log(`Fetched homepage HTML for ${source.name}. Size: ${homepageHtml.length} chars.`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`Failed to fetch homepage for ${source.name}: ${msg}`);
        summary.articlesFailed++;
        continue;
      }

      // Extract links and process the homepage HTML
      await processSourceHomepageHtml(homepageHtml, source, limitPerSource, summary);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Pipeline crashed with critical error:", msg);
    summary.status = "failed";
  }

  summary.totalDurationMs = Date.now() - startTime;
  console.log("\n=== SCRAPING PIPELINE COMPLETED ===");
  console.log(JSON.stringify(summary, null, 2));

  // Write execution summary to DB logs (section 7)
  try {
    const { error: logError } = await supabaseAdmin.from("logs").insert({
      type: "scrape",
      status: summary.status,
      message: `Scraping pipeline finished. Inserted ${summary.articlesInserted} articles, skipped ${summary.duplicatesSkipped} duplicates.`,
      metadata: JSON.parse(JSON.stringify(summary)),
    });
    if (logError) {
      console.error(`Failed to write logs to Supabase: ${logError.message}`);
    }
  } catch (logErr: unknown) {
    const msg = logErr instanceof Error ? logErr.message : String(logErr);
    console.error(`Failed to write logs to Supabase: ${msg}`);
  }

  return summary;
}

export async function processSourceHomepageHtml(
  homepageHtml: string,
  source: {
    id: string;
    name: string;
    listing_url: string;
    parser_strategy: string | null;
    active: boolean;
    logo_url: string | null;
  },
  limitPerSource: number,
  summary: PipelineSummary
): Promise<number> {
  const recordRejection = (reason: string) => {
    summary.articlesRejected++;
    summary.rejectionReasons[reason] = (summary.rejectionReasons[reason] || 0) + 1;
  };

  // Extract links from homepage story cards only
  const candidateLinks = extractHomepageLinks(homepageHtml, source.listing_url, source.parser_strategy || "");
  console.log(`Extracted ${candidateLinks.length} candidate story links from homepage cards.`);
  summary.candidatesFound += candidateLinks.length;

  if (candidateLinks.length === 0) {
    console.log(`No article links extracted for ${source.name}. Skipping detail scraping.`);
    return 0;
  }

  // URL existence check in batches of <= 15 URLs (section 9)
  const existingUrlsSet = new Set<string>();
  const chunkSize = 15;
  for (let i = 0; i < candidateLinks.length; i += chunkSize) {
    const chunk = candidateLinks.slice(i, i + chunkSize);
    const { data: existing, error: existError } = await supabaseAdmin
      .from("articles")
      .select("original_url")
      .in("original_url", chunk);

    if (existError) {
      console.error(`URL existence check chunk failed: ${existError.message}`);
    } else if (existing) {
      existing.forEach((row) => existingUrlsSet.add(row.original_url));
    }
  }

  const freshCandidates = candidateLinks.filter((url) => {
    const isDuplicate = existingUrlsSet.has(url);
    if (isDuplicate) {
      summary.duplicatesSkipped++;
    }
    return !isDuplicate;
  });

  console.log(`Filtered duplicates. Fresh candidate links count: ${freshCandidates.length}`);

  // Scrape detail pages for fresh candidate URLs up to the source limit
  let sourceInsertedCount = 0;
  let attemptsCount = 0;
  const maxAttempts = limitPerSource * 2;
  
  for (const articleUrl of freshCandidates) {
    if (sourceInsertedCount >= limitPerSource) {
      console.log(`Reached limit of ${limitPerSource} inserted articles for ${source.name}. Stopping.`);
      break;
    }
    if (attemptsCount >= maxAttempts) {
      console.log(`Reached maximum attempts limit of ${maxAttempts} for ${source.name}. Stopping.`);
      break;
    }
 
    attemptsCount++;
    console.log(`Scraping article detail page: ${articleUrl}`);
    summary.detailPagesScraped++;

    let detailHtml = "";
    try {
      detailHtml = await scrapeUrl(articleUrl, false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`Failed to fetch article page ${articleUrl}: ${msg}`);
      summary.articlesFailed++;
      continue;
    }

    // Parse detail page
    const parsed = parseArticleDetail(detailHtml, articleUrl, source.parser_strategy || "");

    // Article content gate validation (section 13)
    if (!parsed.title) {
      console.log(`Rejected ${articleUrl}: Title is missing or generic.`);
      recordRejection("missing_title");
      continue;
    }

    if (!parsed.imageUrl) {
      console.log(`Rejected ${articleUrl}: Image URL is missing.`);
      recordRejection("missing_image_url");
      continue;
    }

    // Parse published date
    let publishedDate: Date | null = null;
    if (parsed.publishedAt) {
      const d = new Date(parsed.publishedAt);
      if (!isNaN(d.getTime())) {
        publishedDate = d;
      }
    }

    if (!publishedDate) {
      console.log(`Rejected ${articleUrl}: Published date is missing or invalid.`);
      recordRejection("missing_published_date");
      continue;
    }

    // Validate body quality (paragraphs >= 3 OR characters >= 900)
    const cleanedText = parsed.rawText.trim();
    const paragraphCount = cleanedText.split("\n\n").filter(Boolean).length;
    const charCount = cleanedText.length;
    
    const passesBodyQuality = paragraphCount >= 3 || charCount >= 900;
    if (!passesBodyQuality) {
      console.log(`Rejected ${articleUrl}: Body text fails quality rules (got ${paragraphCount} paragraphs, ${charCount} chars).`);
      recordRejection("low_body_quality");
      continue;
    }

    // Append-only insertion into Supabase (section 10)
    const { error: insertError } = await supabaseAdmin.from("articles").insert({
      source_id: source.id,
      original_url: articleUrl,
      canonical_url: parsed.canonicalUrl,
      title: parsed.title,
      image_url: parsed.imageUrl,
      published_at: publishedDate.toISOString(),
      raw_text: cleanedText,
      scraped_at: new Date().toISOString(),
      analyzed_at: null, // Null until analyzed
    });

    if (insertError) {
      if (insertError.code === "23505") { // Unique key constraint conflict
        console.log(`Skipped insert: unique constraint conflict on ${articleUrl}.`);
        summary.duplicatesSkipped++;
      } else {
        console.error(`Failed to insert article ${articleUrl}: ${insertError.message}`);
        summary.articlesFailed++;
      }
    } else {
      console.log(`Inserted valid article: "${parsed.title}"`);
      summary.articlesInserted++;
      sourceInsertedCount++;
    }
  }

  return sourceInsertedCount;
}
