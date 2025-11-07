// apps/restaurant-ratings/src/lib/supabase/server.ts
import { headers } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// 解析 Cookie header（RSC 環境只讀，不寫）
function parseCookieHeader(raw: string) {
  const map = new Map<string, string>();
  if (!raw) return map;
  for (const part of raw.split(/; */)) {
    const i = part.indexOf("=");
    if (i <= 0) continue;
    const k = decodeURIComponent(part.slice(0, i).trim());
    const v = decodeURIComponent(part.slice(i + 1));
    map.set(k, v);
  }
  return map;
}

export async function supabaseServer() {
  const h = await headers();
  const jar = parseCookieHeader(h.get("cookie") ?? "");

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: "rest" }, // 關鍵：預設查詢 rest schema
      cookies: {
        get(name: string) {
          return jar.get(name);
        },
        set() {},     // RSC 不能改 cookie：no-op
        remove() {},  // RSC 不能改 cookie：no-op
      },
    }
  );
}
