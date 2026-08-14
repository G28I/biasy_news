# Implementation Prompt - biasly Supabase Setup

## Goal
Configure the **Supabase** database structure, RLS permissions, client helper classes, and typescript type mappings for **biasly** news application.

## Skills Read
- Supabase developer guides (`.agents/skills/supabase`, `supabase-postgres-best-practices`)
- Next.js documentation (from `node_modules/next/dist/docs/`)

## Existing Code Inspected
- `.env.local` (Local credentials and variables)
- `package.json` (Installed package dependencies)

## Decisions or Assumptions
1. **No local CLI migrations**: We will author the declarative schema at `supabase/schema.sql` and output it for the user to paste into the **Supabase Dashboard -> SQL Editor**.
2. **Double Client Pattern**:
   - `supabaseAnon`: using publishable keys for public reads (front-end views).
   - `supabaseAdmin`: using service role keys for system writes and updates (bypassing RLS).
3. **Index optimizations**: Indexes on `articles(original_url)` for dedupe, `articles(published_at)` for feed order, and `article_analyses(article_id)` for joins.
4. **Schedule IDs**: Large 64-bit Oxylabs IDs will be stored as `text` type to prevent Javascript number precision loss.

## Files Likely to Change
- [NEW] `supabase/schema.sql` (Database structure migration)
- [NEW] `lib/supabase/types.ts` (Typescript schema mappings)
- [NEW] `lib/supabase/client.ts` (Supabase connection wrapper)

## Visual & Layout Requirements
- None (Core database infrastructure and data access layer).

## Security Requirements
- Enable RLS on all 6 tables.
- Grant `SELECT` permissions on `sources`, `articles`, and `article_analyses` to public roles (`anon` and `authenticated`).
- Restrict write/update permissions exclusively to the `service_role` (system client).
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is kept server-side only and never imported in any client page/component.

## Acceptance Criteria
1. The `supabase/schema.sql` file defines all core tables, RLS policies, index optimizations, and seeds default active sources.
2. The `lib/supabase/client.ts` exports both public `supabaseAnon` and system `supabaseAdmin` clients properly.
3. The project compiles successfully with Next.js Turbopack build constraints.
4. Active sources stored in the database can be retrieved successfully using database helper connections.

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

## Manual Verification Steps
1. Instruct the user to execute the contents of `supabase/schema.sql` in their Supabase project SQL Editor.
2. Run a temporary Node.js connection test script to select and output the seeded news sources.
