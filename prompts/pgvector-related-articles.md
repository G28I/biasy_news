# Implementation Prompt - pgvector & Related Articles (Local Model)

This prompt outlines the plan to enable the Postgres `pgvector` extension in Supabase, calculate embeddings for articles using a local ONNX model (`Xenova/all-MiniLM-L6-v2` via `@huggingface/transformers`), support embedding backfills in the AI pipeline, and fetch similar articles by cosine distance to render a "Related Stories" section.

---

## Goal
1. Enable pgvector and add the `embedding vector(1536)` column to the `article_analyses` table.
2. Install the `@huggingface/transformers` package.
3. Update the AI analysis pipeline to generate 384-dimensional embeddings locally, pad them to 1536 dimensions for schema compliance, and persist them in the database.
4. Support incremental backfills for articles that have analyses but lack embeddings.
5. Create a PostgreSQL function `match_articles` to perform cosine similarity searches.
6. Expose a `/api/article/[id]/related` API endpoint to fetch similar articles.
7. Integrate the dynamic related articles list into the news details page.

---

## Skills Read
- `.agents/skills/supabase`

---

## Existing Code Inspected
- `supabase/schema.sql`: Table structure and RLS policy configurations.
- `lib/ai/pipeline.ts`: Analysis orchestration and Supabase writes.
- `app/article/[id]/page.tsx`: Details page layout and related articles mapping.

---

## Decisions & Assumptions
- **Embedding Model**: We will use `@huggingface/transformers` with the `Xenova/all-MiniLM-L6-v2` model (384 dimensions) running locally in Node.js (server-side).
- **Dimension Padding**: Since the model produces 384-dimensional vectors but `AGENTS.md` mandates `vector(1536)` for the database column, we will pad the remaining 1152 indices with `0.0`. This guarantees schema compliance and leaves cosine distance comparisons intact.
- **Server/Client Boundary**: The details page is a client component, so it cannot run direct database queries or import files containing `supabaseAdmin` (as they include the service role key). We will expose a thin route handler `GET /api/article/[id]/related` to query related articles.

---

## Proposed Changes

### 1. Database Migrations
#### [MODIFY] [schema.sql](file:///c:/Users/ramak/OneDrive/Desktop/new-skew/supabase/schema.sql)
- Enable the `vector` extension.
- Update `article_analyses` to include the `embedding vector(1536)` column.
- Add an IVFFlat cosine index on the `embedding` column.
- Add the `match_articles` RPC function.

#### [NEW] [ALTER SQL to Execute in Supabase SQL Editor]
```sql
-- Enable vector extension
create extension if not exists vector;

-- Add embedding column
alter table public.article_analyses
add column if not exists embedding vector(1536);

-- Create IVFFlat Cosine Index
create index if not exists idx_analyses_embedding_cosine on public.article_analyses
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- Create RPC matching function
create or replace function match_articles (
  query_embedding vector(1536),
  current_article_id uuid,
  match_limit int default 5
)
returns table (
  article_id uuid
)
language sql stable
as $$
  select
    aa.article_id
  from public.article_analyses aa
  join public.articles a on a.id = aa.article_id
  where aa.embedding is not null
    and a.analyzed_at is not null
    and a.id <> current_article_id
  order by aa.embedding <=> query_embedding
  limit match_limit;
$$;
```

### 2. Backends & AI Pipeline
#### [MODIFY] [pipeline.ts](file:///c:/Users/ramak/OneDrive/Desktop/new-skew/lib/ai/pipeline.ts)
- Import `@huggingface/transformers` dynamically inside the pipeline function to avoid bundling issues in API routes.
- Update the pending articles query to select `article_analyses(id, embedding)`.
- Update the filter to pick up articles with no analysis or `embedding IS NULL`.
- In the processing loop:
  - If the article has an analysis but no embedding, generate and save the embedding only (backfill).
  - If the article has neither, perform both the Groq LLM analysis and local embedding generation.
  - Save to `article_analyses.embedding` and only update `analyzed_at` after both are saved.

### 3. Database Queries & API
#### [NEW] [articles.ts](file:///c:/Users/ramak/OneDrive/Desktop/new-skew/lib/supabase/queries/articles.ts)
- Create `getRelatedArticles(articleId, embedding)` wrapper executing `match_articles` RPC via `supabaseAdmin` and fetching full article objects using `.in("id", matchedIds)`.

#### [NEW] [route.ts](file:///c:/Users/ramak/OneDrive/Desktop/new-skew/app/api/article/[id]/related/route.ts)
- Expose `GET /api/article/[id]/related` to fetch the current article's embedding, query `getRelatedArticles`, and return the JSON array of related articles.

### 4. UI Components
#### [MODIFY] [page.tsx](file:///c:/Users/ramak/OneDrive/Desktop/new-skew/app/article/[id]/page.tsx)
- Fetch related articles dynamically from `/api/article/[id]/related`.
- Hide the "Related Stories" section entirely if the current article has no embedding/analyses.

---

## Security Requirements
- All service role client imports (`supabaseAdmin`) remain in server modules (`queries/articles.ts` and `api/` routes).
- No keys or service role objects are imported or exposed in dynamic details UI pages.

---

## Acceptance Criteria
1. TypeScript compilation is clean (`npm run typecheck` or `npx tsc --noEmit`).
2. ESLint checks are clean (`npm run lint` or `npx eslint .`).
3. Next.js production build completes without warnings or errors.
4. Calling `/api/analyze` successfully backfills embeddings for existing articles.
5. Details page loads dynamically and fetches similar articles by cosine similarity.

---

## Verification Plan

### Automated Checks
- `npx tsc --noEmit`
- `npx eslint .`
- `npm run build`

### Manual Test Steps
1. Execute the ALTER SQL in the Supabase Dashboard SQL Editor.
2. Trigger the analysis API `/api/analyze` to backfill embeddings for the existing 16 articles.
3. Open the details page for an article (e.g. `/article/<id>`) and verify that 5 related articles are loaded dynamically.
