# biasly – AI-Powered News Aggregator & Bias Analysis

**biasly** is a production-grade, AI-powered news analysis and aggregation platform. It collects news articles from configured sources, analyzes them with AI to estimate sentiment and political framing, and presents them in a premium, reader-friendly interface. It features semantic similarity searches, automated scraper scheduling, and an interactive newsletter system.

---

## 🚀 Key Features

### 📰 Core Website & UI
- **News Dashboard**: Displays news cards with real-time AI political framing indicators (Left / Center / Right ratio).
- **News Details**: Deep-dive details including neutral summaries, sentiment score & label, bias indicators, framing notes, loaded terms detection, and a disclaimer list.
- **Authentication**: Powered by **Clerk** with protected routes and modals.

### 🕷️ Oxylabs Scraping & Scheduler
- **Manual Scraping (`POST /api/scrape`)**: Instantly fetches live homepages of active Supabase sources via Oxylabs Web Scraper API, extracts story card links, filters duplicates, validates content quality, and inserts new articles.
- **Oxylabs Scheduler**: Synchronizes active sources to remote Oxylabs hourly schedules, automatically deactivates orphaned schedules to save costs, and downloads completed run HTML.
- **Orchestration**: Robust parsing handling 64-bit integer schedule IDs without precision loss.

### 🤖 AI Analysis Pipeline (`POST /api/analyze`)
- **Groq API**: Leverages `llama-3.3-70b-versatile` to perform deep content auditing.
- **Derived Metrics**: Auto-calculates bias score based on left/right percentages: `(right_percentage - left_percentage) / 100`.
- **Output Validation**: Strict JSON schema audits using Zod before DB persistence.

### 🧬 Semantic Search & Related Stories
- **Local Embeddings**: Generates 384-dimension text embeddings client-free on the server using Hugging Face's ONNX-optimized `all-MiniLM-L6-v2` model, padded to 1536-dimensions for DB alignment.
- **pgvector Search**: Performs cosine similarity queries on Supabase using pgvector indexing and custom RPC.

### ⏰ Automatic Hourly Pipeline
- **Vercel Cron (`/api/cron/pipeline`)**: Runs hourly at `:15` to process completed Oxylabs scheduler results, insert valid new articles, and immediately trigger AI analysis & embedding generation.

### ✉️ Interactive Newsletter System
- **Inline Subscription Toggle**: Custom form fields in the layout header modal and article details page that transform into a red "Unsubscribe" button upon subscription.
- **Cross-Component Sync**: Real-time synchronization across different views using LocalStorage and window listeners.
- **SMTP Notification**: Dispatches customized HTML welcome and unsubscription confirmation emails using `nodemailer` (falling back to Ethereal developer test preview mailboxes in development).

---

## 🛠️ Tech Stack
- **Core**: Next.js (App Router, Turbopack, Tailwind CSS, lucide-react)
- **Authentication**: Clerk Auth
- **Database**: Supabase (Postgres, RLS, pgvector extension, RPC matching)
- **Scraping**: Oxylabs Web Scraper API & Scheduler
- **AI/LLM**: Groq API (Vercel AI SDK + OpenAI provider compatibility)
- **Embeddings**: `@huggingface/transformers` (local execution)
- **Mail Delivery**: Nodemailer (SMTP transport)
- **Analytics**: PostHog-js & PostHog-node

---

## ⚙️ Environment Variables (`.env.local`)

Create a `.env.local` in your root folder and add the following keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Supabase Configurations
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANNON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Admin and Scraping Secret
BIASLY_ADMIN_SECRET=your_admin_secret_string

# Oxylabs Credentials
OXY_WSA_USERNAME=your_oxylabs_username
OXY_WSA_PASSWORD=your_oxylabs_password

# AI Model Credentials
GROQ_API=your_groq_api_key

# Analytics (PostHog)
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=your_posthog_token
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com

# SMTP Email Configurations (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
```

---

## 🗄️ Database Setup (Supabase)

Run the following SQL migrations in your **Supabase Dashboard → SQL Editor** to construct the tables, extensions, and RPC functions:

```sql
-- 1. Enable the Vector Extension
create extension if not exists vector;

-- 2. Core Tables
create table public.sources (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  listing_url text not null,
  parser_strategy text,
  active boolean default true not null,
  logo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.articles (
  id uuid default gen_random_uuid() primary key,
  source_id uuid references public.sources(id) on delete cascade not null,
  original_url text unique not null,
  canonical_url text,
  title text not null,
  image_url text,
  published_at timestamp with time zone not null,
  raw_text text not null,
  scraped_at timestamp with time zone default timezone('utc'::text, now()) not null,
  analyzed_at timestamp with time zone
);

create table public.article_analyses (
  id uuid default gen_random_uuid() primary key,
  article_id uuid references public.articles(id) on delete cascade unique not null,
  summary text not null,
  sentiment_score numeric not null,
  sentiment_label text not null,
  bias_score numeric not null,
  bias_label text not null,
  left_percentage integer not null,
  center_percentage integer not null,
  right_percentage integer not null,
  confidence numeric not null,
  framing_notes text[],
  loaded_terms text[],
  disclaimer text,
  model text not null,
  embedding vector(1536),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.oxylabs_schedules (
  id uuid default gen_random_uuid() primary key,
  source_id uuid references public.sources(id) on delete cascade unique not null,
  oxylabs_schedule_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.oxylabs_schedule_runs (
  id uuid default gen_random_uuid() primary key,
  oxylabs_run_id text unique not null,
  oxylabs_schedule_id text not null,
  status text not null,
  processed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.logs (
  id uuid default gen_random_uuid() primary key,
  pipeline_type text not null,
  status text not null,
  details jsonb,
  duration_ms integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Cosine Distance Index for Embeddings
create index idx_analyses_embedding_cosine on public.article_analyses
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- 4. Cosine Similarity RPC Search Function
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

---

## 🏃 Local Run & APIs

### 1. Launch Next.js Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 2. Manual Scraper API Call
```bash
curl -X POST http://localhost:3000/api/scrape \
  -H "x-biasly-admin-secret: your_admin_secret"
```

### 3. Sync Oxylabs Schedules API Call
```bash
curl -X POST http://localhost:3000/api/oxylabs/schedules \
  -H "x-biasly-admin-secret: your_admin_secret"
```

### 4. Trigger Automatic Pipeline (Results Scrape + LLM analysis + pgvector embeddings)
```bash
curl http://localhost:3000/api/cron/pipeline
```

---

## 📄 License
This project is proprietary. All rights reserved.
