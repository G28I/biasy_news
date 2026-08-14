import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getRelatedArticles } from "@/lib/supabase/queries/articles";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Fetch current article embedding
    const { data: analysisData, error: analysisError } = await supabaseAdmin
      .from("article_analyses")
      .select("embedding")
      .eq("article_id", id)
      .single();

    if (analysisError || !analysisData || !analysisData.embedding) {
      // Return empty array if article doesn't have an embedding yet
      return NextResponse.json([]);
    }

    // 2. Fetch top 5 related articles using pgvector similarity query
    const related = await getRelatedArticles(id, analysisData.embedding);

    return NextResponse.json(related);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("API Error fetching related articles:", msg);
    return NextResponse.json([], { status: 500 });
  }
}
