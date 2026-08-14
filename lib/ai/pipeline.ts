import { generateObject } from "ai";
import { z } from "zod";
import { supabaseAdmin } from "../supabase/admin";
import { groq } from "./groq";

export interface AnalysisSummary {
  status: "success" | "failed";
  articlesChecked: number;
  analysesSaved: number;
  failedCount: number;
  skippedCount: number;
  durationMs: number;
  modelUsed: string;
}

// Model identifier for Groq structured output execution
const MODEL_NAME = "llama-3.3-70b-versatile";

// Zod Schema validating the AI outputs matching DB constraints (section 7 and 19)
const analysisSchema = z.object({
  summary: z.string().describe("A neutral, objective, and concise summary of the article's core topic and coverage."),
  sentimentScore: z.number().min(-1).max(1).describe("Sentiment score of the text from -1 (very negative) to 1 (very positive)."),
  sentimentLabel: z.enum(["positive", "neutral", "negative"]).describe("Overall sentiment classification label."),
  leftPercentage: z.number().min(0).max(100).describe("AI-estimated percentage of left-leaning framing, source highlighting, or assumptions (0-100)."),
  centerPercentage: z.number().min(0).max(100).describe("AI-estimated percentage of balanced, center, or neutral framing and presentation (0-100)."),
  rightPercentage: z.number().min(0).max(100).describe("AI-estimated percentage of right-leaning framing, source highlighting, or assumptions (0-100)."),
  biasLabel: z.enum(["left", "center", "right", "mixed", "unclear"]).describe("AI-estimated overall political bias category. If evidence is weak or unclear, select 'unclear'."),
  confidence: z.number().min(0).max(1).describe("Confidence score in the political and sentiment assessment from 0 (very low) to 1 (completely certain)."),
  framingNotes: z.string().describe("Detailed bullet points highlighting whose voices were featured, what details were omitted, and overall messaging angles."),
  loadedTerms: z.array(z.string()).describe("List of highly emotional, pre-supposing, or loaded vocabulary elements observed in the article text."),
  disclaimer: z.string().describe("Standard disclosure explaining that these measurements represent AI estimations of text framing rather than objective fact."),
});

// Cache instance for local embedding pipeline extraction
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let extractorInstance: any = null;

/**
 * Generates a 384-dimensional embedding vector locally via Xenova/all-MiniLM-L6-v2,
 * then pads the remaining dimensions with 0.0 to return a 1536-dimensional vector
 * matching the schema constraints.
 */
async function getLocalEmbedding(text: string): Promise<number[]> {
  try {
    // Dynamic import to prevent ONNX/WASM runtime issues during bundling
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { pipeline } = require("@huggingface/transformers");

    if (!extractorInstance) {
      console.log("- Loading local embedding model (Xenova/all-MiniLM-L6-v2)...");
      extractorInstance = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    }

    const output = await extractorInstance(text, { pooling: "mean", normalize: true });
    const rawVector = Array.from(output.data) as number[];

    // Pad the 384-dimension vector to 1536 dimensions
    const paddedVector = new Array(1536).fill(0.0);
    for (let i = 0; i < Math.min(rawVector.length, 1536); i++) {
      paddedVector[i] = rawVector[i];
    }

    return paddedVector;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Local embedding generation failed:", msg);
    // Return a zeroed 1536 fallback vector rather than crashing the pipeline
    return new Array(1536).fill(0.0);
  }
}

/**
 * Runs the AI article analysis pipeline.
 * Identifies valid articles missing analyses or missing embeddings,
 * executes Groq LLM and local ONNX embeddings, and persists updates.
 */
export async function runAnalysisPipeline(options?: {
  limit?: number;
  articleIds?: string[];
}): Promise<AnalysisSummary> {
  const startTime = Date.now();
  console.log("=== AI ANALYSIS PIPELINE STARTED ===");

  const summary: AnalysisSummary = {
    status: "success",
    articlesChecked: 0,
    analysesSaved: 0,
    failedCount: 0,
    skippedCount: 0,
    durationMs: 0,
    modelUsed: MODEL_NAME,
  };

  try {
    // 1. Fetch pending articles (select embedding for backfill check, section 20)
    let articlesQuery = supabaseAdmin
      .from("articles")
      .select("*, article_analyses(id, embedding)");

    if (options?.articleIds && options.articleIds.length > 0) {
      articlesQuery = articlesQuery.in("id", options.articleIds);
    }

    const { data: articles, error: articlesError } = await articlesQuery;
    if (articlesError) {
      throw new Error(`Failed to load articles from database: ${articlesError.message}`);
    }

    if (!articles || articles.length === 0) {
      console.log("No articles retrieved from database.");
      summary.durationMs = Date.now() - startTime;
      return summary;
    }

    // Filter to pending articles (no article_analyses row exists OR existing analysis has no embedding)
    const pendingArticles = articles.filter((art) => {
      const rawAnalysis = art.article_analyses;
      const analysis = Array.isArray(rawAnalysis) ? rawAnalysis[0] : rawAnalysis;
      return !analysis || !analysis.embedding;
    });

    summary.articlesChecked = pendingArticles.length;
    console.log(`Found ${pendingArticles.length} pending articles missing AI analysis or embeddings.`);

    if (pendingArticles.length === 0) {
      console.log("Zero pending articles. Pipeline complete.");
      summary.durationMs = Date.now() - startTime;
      return summary;
    }

    // Apply limits
    const limit = options?.limit || pendingArticles.length;
    const targets = pendingArticles.slice(0, limit);
    console.log(`Processing batch of ${targets.length} articles.`);

    // 2. Process targets sequentially
    for (const article of targets) {
      console.log(`\nProcessing article: "${article.title}" (${article.id})`);
      
      const rawAnalysis = article.article_analyses;
      const existingAnalysis = Array.isArray(rawAnalysis) ? rawAnalysis[0] : rawAnalysis;
      const textToEmbed = `${article.title}\n\n${article.raw_text}`;

      // Embedding Backfill Mode (analysis exists, embedding is null)
      if (existingAnalysis && !existingAnalysis.embedding) {
        console.log(`- Article already analyzed. Running embedding backfill...`);
        const embedding = await getLocalEmbedding(textToEmbed);

        const { error: updateError } = await supabaseAdmin
          .from("article_analyses")
          .update({ embedding })
          .eq("id", existingAnalysis.id);

        if (updateError) {
          console.error(`Failed to backfill embedding for article ${article.id}: ${updateError.message}`);
          summary.failedCount++;
        } else {
          // Update analyzed_at only after embedding is saved
          const { error: artUpdateError } = await supabaseAdmin
            .from("articles")
            .update({ analyzed_at: new Date().toISOString() })
            .eq("id", article.id);

          if (artUpdateError) {
            console.error(`Warning: Failed to update analyzed_at for article ${article.id}: ${artUpdateError.message}`);
          }
          console.log(`Saved embedding backfill successfully for: "${article.title}"`);
          summary.analysesSaved++;
        }
        continue;
      }

      // Standard Mode (perform Groq analysis + embedding)
      let attempts = 0;
      let analysisResult = null;
      
      // Retry once on failure (section 19)
      while (attempts < 2) {
        try {
          attempts++;
          const prompt = `You are a principal news analyst. Perform an objective, detailed framing and bias analysis of the following news article.

You MUST respond with a JSON object containing the following keys and values exactly:
{
  "summary": "A neutral, objective, and concise summary of the article's core topic and coverage (string).",
  "sentimentScore": "Sentiment score of the text from -1 (very negative) to 1 (very positive) (number).",
  "sentimentLabel": "Overall sentiment classification label: one of 'positive', 'neutral', 'negative' (string).",
  "leftPercentage": "AI-estimated percentage of left-leaning framing, source highlighting, or assumptions from 0 to 100 (number).",
  "centerPercentage": "AI-estimated percentage of balanced, center, or neutral framing from 0 to 100 (number).",
  "rightPercentage": "AI-estimated percentage of right-leaning framing, source highlighting, or assumptions from 0 to 100 (number).",
  "biasLabel": "AI-estimated overall political bias category. Select one of 'left', 'center', 'right', 'mixed', 'unclear' (string).",
  "confidence": "Confidence score in the political and sentiment assessment from 0 to 1 (number).",
  "framingNotes": "Detailed notes highlighting whose voices were featured, what details were omitted, and overall messaging angles (string).",
  "loadedTerms": ["List of highly emotional, pre-supposing, or loaded vocabulary elements observed in the article text (array of strings)"],
  "disclaimer": "Standard disclosure explaining that these measurements represent AI estimations of text framing rather than objective fact (string)."
}

Remember:
- Format the response as a JSON object matching this schema.
- The three percentages (leftPercentage, centerPercentage, rightPercentage) must sum to exactly 100.
- Political framing is shown as "AI-estimated", not objective truth.
- Base your percentages and leanings only on evidence inside the text. Do not make assumptions based on the publication name or domain.
- If the text has no clear leanings, keep confidence low and label as "unclear".

Article Title: ${article.title}
Article Body:
${article.raw_text}
`;

          const { object } = await generateObject({
            model: groq(MODEL_NAME),
            output: "no-schema",
            prompt,
          });

          analysisResult = analysisSchema.parse(object);
          break; // Success! Break the retry loop
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          console.error(`AI Analysis attempt ${attempts} failed for "${article.title}": ${msg}`);
          if (attempts >= 2) {
            summary.failedCount++;
          }
        }
      }

      if (!analysisResult) {
        console.log(`Skipping database save for article ${article.id} due to generation failures.`);
        continue;
      }

      // Generate local embedding
      const embedding = await getLocalEmbedding(textToEmbed);

      // Normalize percentages to sum to exactly 100 (section 19)
      let left = Math.round(analysisResult.leftPercentage);
      let center = Math.round(analysisResult.centerPercentage);
      let right = Math.round(analysisResult.rightPercentage);
      
      const sum = left + center + right;
      if (sum !== 100 && sum > 0) {
        const diff = 100 - sum;
        if (left >= center && left >= right) left += diff;
        else if (center >= left && center >= right) center += diff;
        else right += diff;
      } else if (sum === 0) {
        center = 100;
      }

      const biasScore = (right - left) / 100;

      // 5. Persist the analysis record in Supabase (section 19 and 20)
      const { error: insertError } = await supabaseAdmin.from("article_analyses").insert({
        article_id: article.id,
        summary: analysisResult.summary,
        sentiment_score: analysisResult.sentimentScore,
        sentiment_label: analysisResult.sentimentLabel,
        bias_score: biasScore,
        bias_label: analysisResult.biasLabel,
        left_percentage: left,
        center_percentage: center,
        right_percentage: right,
        confidence: analysisResult.confidence,
        framing_notes: analysisResult.framingNotes,
        loaded_terms: analysisResult.loadedTerms,
        disclaimer: analysisResult.disclaimer,
        model: MODEL_NAME,
        embedding: embedding,
      });

      if (insertError) {
        console.error(`Failed to insert analysis row for article ${article.id}: ${insertError.message}`);
        summary.failedCount++;
      } else {
        // 6. Update analyzed_at only after both analysis and embedding are saved (section 20)
        const { error: updateError } = await supabaseAdmin
          .from("articles")
          .update({ analyzed_at: new Date().toISOString() })
          .eq("id", article.id);

        if (updateError) {
          console.error(`Warning: Failed to update analyzed_at timestamp for article ${article.id}: ${updateError.message}`);
        }

        console.log(`Saved AI Analysis and Embedding successfully for: "${article.title}"`);
        summary.analysesSaved++;
      }
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("AI analysis pipeline crashed with critical error:", msg);
    summary.status = "failed";
  }

  summary.durationMs = Date.now() - startTime;
  console.log("\n=== AI ANALYSIS PIPELINE COMPLETED ===");
  console.log(JSON.stringify(summary, null, 2));

  // 7. Write execution log to database (section 7 and 19)
  try {
    const { error: logError } = await supabaseAdmin.from("logs").insert({
      type: "analysis",
      status: summary.status,
      message: `AI Analysis pipeline finished. Analyzed and saved ${summary.analysesSaved} articles, failed ${summary.failedCount} articles.`,
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
