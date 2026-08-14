import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
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
    const { data: runs, error: selectError } = await supabaseAdmin
      .from("oxylabs_schedule_runs")
      .select("*")
      .order("created_at", { ascending: false });

    if (selectError) {
      throw selectError;
    }

    return NextResponse.json(runs);
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("API list runs route handler failed:", errMsg);
    return NextResponse.json(
      { error: `List runs failed: ${errMsg}` },
      { status: 500 }
    );
  }
}
