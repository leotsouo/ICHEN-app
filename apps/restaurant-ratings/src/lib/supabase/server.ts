// apps/restaurant-ratings/src/lib/supabase/server.ts
import { createClient } from "@supabase/supabase-js";

export function supabaseServer() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: "rest" }, // 你的資料都在 rest schema
      auth: {
        // 不使用登入，就不要持久化／自動刷新，避免任何 cookie 行為
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
}
