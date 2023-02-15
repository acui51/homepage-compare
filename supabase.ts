import { createClient } from "@supabase/supabase-js";

// TODO: move to browser public env vars
const supabaseUrl = "https://nvpoxnhyhnoxikpasiwv.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52cG94bmh5aG5veGlrcGFzaXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQ3ODAyODgsImV4cCI6MTk5MDM1NjI4OH0.-aCVYj85FKsW48DPlHsG8X2Xk3HTHnJsl2t3o0fg55c";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
