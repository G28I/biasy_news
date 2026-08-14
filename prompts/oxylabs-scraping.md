# Implementation Prompt - biasly Oxylabs Scraping Pipeline

## Goal
Implement the **Oxylabs Realtime universal scraper pipeline** to fetch news source homepages, extract candidate stories, check against database duplicates, scrape article detail pages, validate content attributes, and insert new records into Supabase.

## Skills Read
- Web Scraper API developer guide (`.agents/skills/web-scraper-api/SKILL.md`)
- Supabase client guides (`.agents/skills/supabase/SKILL.md`)

## Existing Code Inspected
- `supabase/schema.sql` (Database structures and sources seed)
- `lib/supabase/client.ts` (Supabase Anon and Admin connection clients)

## Decisions or Assumptions
1. **Oxylabs Realtime universal**: We will use the `universal` source endpoint with Basic authentication.
2. **Deduplication**: We will normalize URLs by removing query params/hashes, then run the **URL existence check** in chunks of <= 15 elements using Supabase's `.in()` filter.
3. **Cheerio parsing**: Standard selectors mapped for Fox News, Reuters, NPR, AP, and BBC.
4. **Validation Gate**: Reject articles missing an image URL, published date, or title. Clean raw text of inline styles/ads.
5. **Admin authentication**: Gated route `POST /api/scrape` requiring `x-biasly-admin-secret` header.

## Files Likely to Change
- [NEW] `lib/scraping/oxylabs.ts` (Oxylabs API caller helper)
- [NEW] `lib/scraping/parser.ts` (Candidate filters and details extractors)
- [NEW] `lib/scraping/pipeline.ts` (Orchestrates queries, filtering, and database appends)
- [NEW] `app/api/scrape/route.ts` (Admin trigger route handler)

## Security Requirements
- Require the `x-biasly-admin-secret` request header. Reject missing or incorrect secrets with status `401`.
- Do not expose the admin secret key to client/browser contexts.
- Use `supabaseAdmin` client (bypassing RLS policies) for pipeline reads/writes.

## Acceptance Criteria
1. Running `POST /api/scrape` scans active sources, runs homepage extraction, checks duplicates, scrapes details, and inserts new articles.
2. Re-running the pipeline on identical homepage states logs candidates as duplicates and performs zero duplicate database insertions.
3. Errors on a single source are logged but do not block the pipeline from processing other active sources.
4. Returns a JSON summary: sources checked, candidates found, duplicates skipped, articles inserted, and rejections.

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

## Manual Verification Steps
- Trigger manual scraping via curl:
  ```bash
  curl -X POST http://localhost:3000/api/scrape \
    -H "Content-Type: application/json" \
    -H "x-biasly-admin-secret: your_admin_secret_key" \
    -d '{"limit": 2}'
  ```
- Review the Next.js server console logs to verify step-by-step progress metrics.
