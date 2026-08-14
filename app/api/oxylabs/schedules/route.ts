import { NextRequest, NextResponse } from "next/server";
import { syncSchedules } from "@/lib/scraping/scheduler";
import { supabaseAdmin } from "@/lib/supabase/admin";

function checkAdminAuth(req: NextRequest) {
  const authHeader = req.headers.get("x-biasly-admin-secret");
  const adminSecret = process.env.BIASLY_ADMIN_SECRET;

  if (!adminSecret) {
    throw new Error("Server error: BIASLY_ADMIN_SECRET environment variable is not configured on the host.");
  }

  if (!authHeader || authHeader !== adminSecret) {
    throw new Error("Unauthorized: Missing or invalid x-biasly-admin-secret header.");
  }
}

export async function POST(req: NextRequest) {
  try {
    checkAdminAuth(req);
  } catch (authErr: unknown) {
    const message = authErr instanceof Error ? authErr.message : String(authErr);
    const status = message.includes("Server error") ? 500 : 401;
    return NextResponse.json({ error: message }, { status });
  }

  try {
    const result = await syncSchedules();
    return NextResponse.json(result);
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("API sync schedules route handler failed:", errMsg);
    return NextResponse.json(
      { error: `Schedule sync failed: ${errMsg}` },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    checkAdminAuth(req);
  } catch (authErr: unknown) {
    const message = authErr instanceof Error ? authErr.message : String(authErr);
    const status = message.includes("Server error") ? 500 : 401;
    return NextResponse.json({ error: message }, { status });
  }

  try {
    const { data: schedules, error: selectError } = await supabaseAdmin
      .from("oxylabs_schedules")
      .select("*, sources(*)");

    if (selectError) {
      throw selectError;
    }

    return NextResponse.json(schedules);
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("API list schedules route handler failed:", errMsg);
    return NextResponse.json(
      { error: `List schedules failed: ${errMsg}` },
      { status: 500 }
    );
  }
}
