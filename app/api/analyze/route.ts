import { NextRequest, NextResponse } from "next/server";
import { runAnalysisPipeline } from "../../../lib/ai/pipeline";
import { getPostHogClient } from "@/lib/posthog-server";

export async function POST(req: NextRequest) {
  // 1. Verify admin secret in header (section 15)
  const authHeader = req.headers.get("x-biasly-admin-secret");
  const adminSecret = process.env.BIASLY_ADMIN_SECRET;

  if (!adminSecret) {
    return NextResponse.json(
      { error: "Server error: BIASLY_ADMIN_SECRET environment variable is not configured on the host." },
      { status: 500 }
    );
  }

  if (!authHeader || authHeader !== adminSecret) {
    return NextResponse.json(
      { error: "Unauthorized: Missing or invalid x-biasly-admin-secret header." },
      { status: 401 }
    );
  }

  try {
    // 2. Parse request body parameters
    let body: { limit?: number; articleIds?: string[] } = {};
    try {
      body = await req.json();
    } catch {
      // Body is optional
    }

    const { limit, articleIds } = body;

    // 3. Trigger the AI analysis pipeline
    const summary = await runAnalysisPipeline({
      limit,
      articleIds,
    });

    // Track analysis pipeline run
    const posthog = getPostHogClient();
    if (posthog) {
      posthog.capture({
        distinctId: "system",
        event: "analysis_pipeline_run",
        properties: {
          limit: limit ?? null,
          article_ids_filter: articleIds ?? null,
          articles_analyzed: (summary as { totalAnalyzed?: number })?.totalAnalyzed ?? null,
        },
      });
      await posthog.flush();
    }

    return NextResponse.json(summary);
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("API analysis route handler failed:", errMsg);
    return NextResponse.json(
      { error: `Analysis failed: ${errMsg}` },
      { status: 500 }
    );
  }
}
