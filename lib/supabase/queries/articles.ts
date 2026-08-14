import { supabaseAdmin } from "../admin";
import { Database } from "../types";

type Article = Database["public"]["Tables"]["articles"]["Row"] & {
  sources: Database["public"]["Tables"]["sources"]["Row"] | null;
  article_analyses: Database["public"]["Tables"]["article_analyses"]["Row"] | Database["public"]["Tables"]["article_analyses"]["Row"][] | null;
};

/**
 * Executes a vector similarity query against public.article_analyses matching
 * the current article's embedding, and resolves full article joined models.
 */
export async function getRelatedArticles(
  articleId: string,
  embedding: number[] | string
): Promise<Article[]> {
  try {
    // Safely parse the embedding if it is returned as a string by Supabase / PostgREST
    const parsedEmbedding: number[] = typeof embedding === "string"
      ? JSON.parse(embedding)
      : embedding;

    if (!Array.isArray(parsedEmbedding)) {
      console.error("Invalid embedding format received for related articles query.");
      return [];
    }

    // Convert float array to Postgres vector format string, e.g. '[0.1, 0.2, ...]'
    const vectorStr = `[${parsedEmbedding.join(",")}]`;

    // Query similar article IDs via RPC matching function (bypassing RLS with admin client)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: matchedIds, error: rpcError } = await (supabaseAdmin as any).rpc(
      "match_articles",
      {
        query_embedding: vectorStr,
        current_article_id: articleId,
        match_limit: 5,
      }
    );

    if (rpcError) {
      console.error("Error executing match_articles RPC query:", rpcError.message);
      return [];
    }

    if (!matchedIds || matchedIds.length === 0) {
      return [];
    }

    const ids = matchedIds.map((row: { article_id: string }) => row.article_id);

    // Fetch full article items matching these IDs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: articles, error: fetchError } = await (supabaseAdmin as any)
      .from("articles")
      .select(`
        *,
        sources (*),
        article_analyses (*)
      `)
      .in("id", ids);

    if (fetchError) {
      console.error("Error retrieving article details for related articles:", fetchError.message);
      return [];
    }

    // Preserve the similarity ranking order returned from RPC
    if (articles) {
      return (articles as Article[]).sort(
        (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id)
      );
    }

    return [];
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Error loading related articles via pgvector:", msg);
    return [];
  }
}
