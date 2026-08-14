# Implementation Prompt - Oxylabs Scheduler & Vercel Cron Pipeline

This prompt outlines the plan to implement the Oxylabs Scheduler API, deactivation of orphaned schedules, async processing of completed schedule runs, vercel cron setup, and the automatic hourly scraping + AI analysis pipeline.

---

## Goal
1. Refactor `lib/scraping/pipeline.ts` to extract the homepage HTML processing logic so that it can be shared with both manual scraping and scheduled scraping.
2. Implement Oxylabs Scheduler client functions (`syncSchedules`, `processScheduledResults`) in `lib/scraping/scheduler.ts`.
3. Support deactivation of orphaned schedules during sync.
4. Support parsing of large 64-bit integer IDs (schedule_id, run_id) safely as strings in JS.
5. Create the API routes:
   - `POST /api/oxylabs/schedules` (triggers sync schedules)
   - `GET /api/oxylabs/schedules` (lists schedules)
   - `POST /api/oxylabs/scheduled-results/process` (manual process route)
   - `GET /api/oxylabs/runs` (lists runs)
   - `GET /api/cron/pipeline` (Vercel Cron endpoint)
6. Add `vercel.json` defining the cron job configuration.

---

## Skills Read
- `.agents/skills/supabase`
- `.agents/skills/web-scraper-api`

---

## Existing Code Inspected
- `lib/scraping/pipeline.ts`: Scrape-to-insert pipeline.
- `lib/scraping/oxylabs.ts`: Scraper HTTP helper.
- `lib/ai/pipeline.ts`: AI analysis pipeline.
- `supabase/schema.sql`: Schedules and runs table structure.

---

## Decisions & Assumptions
- **Large Int Parsing**: We will write a regex helper to parse JSON response texts from Oxylabs, wrapping any sequence of 15+ digits in double quotes before passing them to `JSON.parse`. This avoids silent corruption of 64-bit integers.
- **Vercel Cron Security**: The `/api/cron/pipeline` route will verify the Vercel-injected `Authorization: Bearer <CRON_SECRET>` header. In local development (`process.env.NODE_ENV === "development"`), this check will be bypassed to allow manual testing.
- **Orphan Deactivation**: The sync route will retrieve the active schedules from Oxylabs, compare them against schedules stored in Supabase, and call `PUT /v1/schedules/{id}/state` with `{"active": false}` for any orphaned schedules.

---

## Proposed Changes

### 1. Scraping Pipeline Refactoring
#### [MODIFY] [pipeline.ts](file:///c:/Users/ramak/OneDrive/Desktop/new-skew/lib/scraping/pipeline.ts)
- Extract the candidate URL checking, detail scraping, validation, and database insertion loop into `processSourceHomepageHtml(homepageHtml, source, limitPerSource, summary)`.
- Update `runScrapingPipeline` to call this helper.

### 2. Scheduler Helper & API Client
#### [NEW] [scheduler.ts](file:///c:/Users/ramak/OneDrive/Desktop/new-skew/lib/scraping/scheduler.ts)
- Implement `syncSchedules()`:
  - Fetches active sources from DB.
  - Submits schedules to `POST https://data.oxylabs.io/v1/schedules`.
  - Deactivates orphaned schedules from `GET https://data.oxylabs.io/v1/schedules`.
- Implement `processScheduledResults()`:
  - Fetches runs from `GET https://data.oxylabs.io/v1/schedules/{id}/runs` for each DB schedule.
  - Filters to runs with status `"done"` that have not been processed.
  - Fetches the HTML result from `GET https://data.oxylabs.io/v1/queries/{run_id}/results`.
  - Calls `processSourceHomepageHtml` to extract and insert articles.
  - Registers processed runs in `oxylabs_schedule_runs`.

### 3. API Routes
#### [NEW] [schedules/route.ts](file:///c:/Users/ramak/OneDrive/Desktop/new-skew/app/api/oxylabs/schedules/route.ts)
- `POST` to sync schedules (requires `x-biasly-admin-secret`).
- `GET` to list stored schedules (requires `x-biasly-admin-secret` or authenticated admin session).

#### [NEW] [process/route.ts](file:///c:/Users/ramak/OneDrive/Desktop/new-skew/app/api/oxylabs/scheduled-results/process/route.ts)
- `POST` to trigger manual scheduler processing (requires `x-biasly-admin-secret`).

#### [NEW] [runs/route.ts](file:///c:/Users/ramak/OneDrive/Desktop/new-skew/app/api/oxylabs/runs/route.ts)
- `GET` to list processed schedule runs.

#### [NEW] [pipeline/route.ts](file:///c:/Users/ramak/OneDrive/Desktop/new-skew/app/api/cron/pipeline/route.ts)
- `GET` Cron route:
  - Performs `processScheduledResults`.
  - Performs `runAnalysisPipeline`.
  - Bypasses secret checks locally; verifies `CRON_SECRET` in production.

### 4. Configuration
#### [NEW] [vercel.json](file:///c:/Users/ramak/OneDrive/Desktop/new-skew/vercel.json)
- Configures `/api/cron/pipeline` to run hourly at `:15`.

---

## Security Requirements
- Admin secret checked on `/api/oxylabs/*` actions.
- `CRON_SECRET` checked on `/api/cron/pipeline` in production.
- Credentials (`OXY_WSA_USERNAME`, `OXY_WSA_PASSWORD`, `BIASLY_ADMIN_SECRET`) kept server-side.

---

## Acceptance Criteria
1. TypeScript compiles with 0 errors.
2. Linter runs with 0 errors.
3. API endpoints return correct responses.
4. Schedule synchronization correctly registers and deactivates orphans.

---

## Verification Plan

### Automated Checks
- `npx tsc --noEmit`
- `npx eslint .`

### Manual Test Steps
1. Sync schedules:
   ```powershell
   curl.exe -X POST http://localhost:3000/api/oxylabs/schedules -H "x-biasly-admin-secret: asjshsahdhasdj"
   ```
2. Trigger the cron pipeline locally:
   ```powershell
   curl.exe http://localhost:3000/api/cron/pipeline
   ```
   Check terminal logs to verify runs processing and AI analysis triggering.
