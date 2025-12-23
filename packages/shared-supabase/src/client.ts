import { createClient } from "@supabase/supabase-js";

/**
 * Browser-side Supabase client
 * 使用 public schema 確保與服務端一致
 */
export const supabaseBrowser = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: "public" }, // 使用 public schema，與服務端一致
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  );

