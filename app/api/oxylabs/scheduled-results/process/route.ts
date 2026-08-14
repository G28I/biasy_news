import { NextRequest, NextResponse } from "next/server";
import { processScheduledResults } from "@/lib/scraping/scheduler";

export async function POST(req: NextRequest) {
  // 1. Verify admin secret
  const authHeader = req.headers.get("x-biasly-admin-secret");
  const adminSecret = process.env.BIASLY_ADMIN_SECRET;

  if (!adminSecret) {
    return NextResponse.json(
      { error: "Server error: BIASLY_ADMIN_SECRET environment variable is not configured." },
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
    // 2. Parse optional limit parameters
    let body: { limit?: number } = {};
    try {
      body = await req.json();
    } catch {
      // Body is optional
    }

    const { limit } = body;

    // 3. Process completed runs
    const summary = await processScheduledResults({
      limitPerSource: limit,
    });

    return NextResponse.json(summary);
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("API process scheduled results route handler failed:", errMsg);
    return NextResponse.json(
      { error: `Processing scheduled results failed: ${errMsg}` },
      { status: 500 }
    );
  }
}
