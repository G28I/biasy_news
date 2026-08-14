/* eslint-disable */
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

const dotenvPath = "./.env.local";
let url = "";
let serviceKey = "";

if (fs.existsSync(dotenvPath)) {
  const content = fs.readFileSync(dotenvPath, "utf8");
  const urlMatch = content.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)/);
  const keyMatch = content.match(/SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.*)/);
  if (urlMatch) url = urlMatch[1].trim().replace(/['"]/g, "");
  if (keyMatch) serviceKey = keyMatch[1].trim().replace(/['"]/g, "");
}

const supabase = createClient(url, serviceKey);

async function runQuery() {
  const { data: analyses, error: fetchErr } = await supabase
    .from("article_analyses")
    .select("article_id, embedding")
    .not("embedding", "is", null)
    .limit(1);

  if (fetchErr || !analyses || analyses.length === 0) {
    console.error("Could not find article analysis with embedding:", fetchErr);
    return;
  }

  const articleId = analyses[0].article_id;
  const embedding = analyses[0].embedding;
  console.log(`Current article ID: ${articleId}`);

  // Call RPC
  const vectorStr = `[${JSON.parse(embedding).join(",")}]`;
  const { data: matchedIds, error: rpcError } = await supabase.rpc(
    "match_articles",
    {
      query_embedding: vectorStr,
      current_article_id: articleId,
      match_limit: 5,
    }
  );

  if (rpcError) {
    console.error("RPC Error:", rpcError);
    return;
  }

  console.log("Matched IDs:", matchedIds);
  const ids = matchedIds.map(row => row.article_id);

  // Fetch full records
  const { data: articles, error: fetchError } = await supabase
    .from("articles")
    .select(`
      *,
      sources (*),
      article_analyses (*)
    `)
    .in("id", ids);

  if (fetchError) {
    console.error("Fetch Error:", fetchError);
    return;
  }

  console.log(`Successfully fetched ${articles.length} related articles!`);
  articles.forEach((art, idx) => {
    console.log(`${idx + 1}. ID: ${art.id}, Title: "${art.title}"`);
    console.log(`   Source: ${art.sources ? art.sources.name : "null"}`);
    console.log(`   Analysis: ${art.article_analyses ? (Array.isArray(art.article_analyses) ? art.article_analyses.length : "object") : "null"}`);
  });
}

runQuery();
