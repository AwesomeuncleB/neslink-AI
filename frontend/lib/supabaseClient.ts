import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xbznwwkpovfrspvhslyq.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhiem53d2twb3ZmcnNwdmhzbHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NjcyODQsImV4cCI6MjEwMjU0MzI4NH0.edOYgFI1P4mXaXDLdynaMhLEFLLNT8hgchxyPyB2qQk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
