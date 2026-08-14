# Implementation Prompt - biasly AI Article Analysis Pipeline

## Goal
Implement the **AI article analysis pipeline** using Vercel AI SDK with the **Groq** provider (`llama-3.3-70b-versatile`), analyzing pending articles and inserting the results into the `article_analyses` table in Supabase.

## Skills Read
- Vercel AI SDK guides (`.agents/skills/ai-sdk/SKILL.md`)
- Supabase developer guides (`.agents/skills/supabase/SKILL.md`)

## Existing Code Inspected
- `lib/supabase/client.ts` (Supabase Anon and Admin connection clients)
- `lib/supabase/types.ts` (Database table interfaces)

## Decisions or Assumptions
1. **AI Provider**: Groq, using the `@ai-sdk/groq` package.
2. **Model**: `llama-3.3-70b-versatile` (or fallback).
3. **Structured Outputs**: We will use `generateObject` from `ai` package with a Zod schema to ensure structured data returned matches database constraints.
4. **Percentage Normalization**: Programmatically adjust left/center/right percentages to sum to exactly 100, preventing Postgres CHECK constraint failures.
5. **Pending check**: Detect pending articles using a SQL LEFT JOIN or equivalent query looking for articles that do not have an entry in the `article_analyses` table.
6. **API Route**: Triggered via `POST /api/analyze` secured with the `x-biasly-admin-secret` header.

## Files Likely to Change
- [NEW] `lib/ai/groq.ts` (Initializes Groq provider with fallback API key)
- [NEW] `lib/ai/pipeline.ts` (Orchestrates fetching pending items, running Groq, validating constraints, updating DB)
- [NEW] `app/api/analyze/route.ts` (Endpoint route handler)

## Security Requirements
- Require the `x-biasly-admin-secret` header. Reject missing or incorrect secrets with status `401`.
- Do not expose `BIASLY_ADMIN_SECRET` or `GROQ_API`/`GROQ_API_KEY` to the client.
- Use `supabaseAdmin` for pipeline reads and writes to bypass RLS.

## Acceptance Criteria
1. `POST /api/analyze` detects articles missing an analysis, runs the Groq analysis, and updates the database.
2. Political percentages are numbers from 0 to 100 and sum to exactly 100.
3. The derived `bias_score` is calculated as `(right_percentage - left_percentage) / 100`.
4. Returns a JSON summary: articles checked, analyses saved, failed count, skipped count, and duration.

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

## Manual Verification Steps
- Trigger manual analysis run via curl:
  ```bash
  curl -X POST http://localhost:3000/api/analyze \
    -H "Content-Type: application/json" \
    -H "x-biasly-admin-secret: asjshsahdhasdj" \
    -d '{"limit": 2}'
  ```
- Check the server console log for step-by-step progress tracking.
