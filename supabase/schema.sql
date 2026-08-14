-- biasly News Database Schema SQL
-- Author: Antigravity AI agent
-- Date: August 13, 2026

-- Enable UUID and vector extensions if not already present
create extension if not exists "uuid-ossp";
create extension if not exists "vector";

-- =========================================================================
-- 1. SOURCES TABLE
-- =========================================================================
create table if not exists public.sources (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  listing_url text not null, -- homepage URL used as scraping entry page
  parser_strategy text, -- specific parser strategy for story extraction
  active boolean default true not null, -- status: only active sources are scraped
  logo_url text, -- optional logo image URL
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- 2. ARTICLES TABLE
-- =========================================================================
create table if not exists public.articles (
  id uuid default gen_random_uuid() primary key,
  source_id uuid references public.sources(id) on delete cascade not null,
  original_url text unique not null, -- original URL used for deduplication
  canonical_url text not null, -- canonical URL
  title text not null,
  image_url text not null, -- image URL (required before saving)
  published_at timestamp with time zone not null, -- published date (required before saving)
  raw_text text not null, -- cleaned body text of the article
  scraped_at timestamp with time zone default timezone('utc'::text, now()) not null,
  analyzed_at timestamp with time zone -- set when AI analysis is completed
);

-- =========================================================================
-- 3. ARTICLE ANALYSES TABLE
-- =========================================================================
create table if not exists public.article_analyses (
  id uuid default gen_random_uuid() primary key,
  article_id uuid references public.articles(id) on delete cascade unique not null,
  summary text not null, -- neutral AI summary
  sentiment_score numeric not null check (sentiment_score >= -1 and sentiment_score <= 1),
  sentiment_label text not null check (sentiment_label in ('positive', 'neutral', 'negative')),
  bias_score numeric not null check (bias_score >= -1 and bias_score <= 1), -- derived: (right_p - left_p) / 100
  bias_label text not null check (bias_label in ('left', 'center', 'right', 'mixed', 'unclear')),
  left_percentage integer not null check (left_percentage >= 0 and left_percentage <= 100),
  center_percentage integer not null check (center_percentage >= 0 and center_percentage <= 100),
  right_percentage integer not null check (right_percentage >= 0 and right_percentage <= 100),
  confidence numeric not null check (confidence >= 0 and confidence <= 1),
  framing_notes text,
  loaded_terms text[], -- array of biased or loaded terms detected
  disclaimer text not null, -- AI disclaimer statement
  model text not null, -- model version name used
  embedding vector(1536), -- vector embedding for similarity search (padded to 1536)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint check_percentages_sum check (left_percentage + center_percentage + right_percentage = 100)
);

-- =========================================================================
-- 4. SYSTEM RUN LOGS TABLE
-- =========================================================================
create table if not exists public.logs (
  id uuid default gen_random_uuid() primary key,
  type text not null, -- e.g., 'scrape', 'analysis', 'cron'
  status text not null, -- e.g., 'success', 'failed', 'running'
  message text,
  metadata jsonb, -- structured summary object (counts, times, etc.)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- 5. OXYLABS SCHEDULER TABLES
-- =========================================================================
create table if not exists public.oxylabs_schedules (
  id uuid default gen_random_uuid() primary key,
  source_id uuid references public.sources(id) on delete cascade unique not null,
  oxylabs_schedule_id text not null unique, -- 64-bit integer stored as text (avoid precision loss)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.oxylabs_schedule_runs (
  id uuid default gen_random_uuid() primary key,
  oxylabs_schedule_id text references public.oxylabs_schedules(oxylabs_schedule_id) on delete cascade not null,
  oxylabs_run_id text not null unique, -- 64-bit integer stored as text
  status text not null, -- e.g. 'done', 'pending', 'faulted'
  started_at timestamp with time zone,
  processed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- 6. PERFORMANCE OPTIMIZATION INDEXES
-- =========================================================================
create index if not exists idx_articles_original_url on public.articles(original_url);
create index if not exists idx_articles_published_at on public.articles(published_at desc);
create index if not exists idx_articles_source_id on public.articles(source_id);
create index if not exists idx_analyses_article_id on public.article_analyses(article_id);
create index if not exists idx_analyses_embedding_cosine on public.article_analyses
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);
create index if not exists idx_schedules_source_id on public.oxylabs_schedules(source_id);
create index if not exists idx_schedule_runs_schedule_id on public.oxylabs_schedule_runs(oxylabs_schedule_id);

-- =========================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
alter table public.sources enable row level security;
alter table public.articles enable row level security;
alter table public.article_analyses enable row level security;
alter table public.logs enable row level security;
alter table public.oxylabs_schedules enable row level security;
alter table public.oxylabs_schedule_runs enable row level security;

-- Public tables: Allow read access to anyone (anonymous & authenticated)
create policy "Allow public read access to sources" on public.sources
  for select to anon, authenticated using (true);

create policy "Allow public read access to articles" on public.articles
  for select to anon, authenticated using (true);

create policy "Allow public read access to article_analyses" on public.article_analyses
  for select to anon, authenticated using (true);

-- System tables (logs, oxylabs_schedules, oxylabs_schedule_runs) do not have
-- public read policies. They are only reachable via service_role DB clients.

-- RPC similarity matching function for pgvector similarity searches
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

-- =========================================================================
-- 8. SEED DATA - INITIAL ACTIVE SOURCES
-- =========================================================================
insert into public.sources (name, listing_url, parser_strategy, active) values
  ('Reuters', 'https://www.reuters.com', 'reuters', true),
  ('NPR', 'https://www.npr.org', 'npr', true),
  ('AP News', 'https://apnews.com', 'ap', true),
  ('BBC News', 'https://www.bbc.com/news', 'bbc', true)
on conflict do nothing;
