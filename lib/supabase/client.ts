import { createClient } from "@supabase/supabase-js";
import { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Support both ANNON_KEY (double-N) and ANON_KEY spellings present in env configuration
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANNON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.");
}

// Client for public reads (anonymous client matching RLS rules)
export const supabaseAnon = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey || ""
);
