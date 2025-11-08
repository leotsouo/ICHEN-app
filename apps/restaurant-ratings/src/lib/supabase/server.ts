// apps/restaurant-ratings/src/lib/supabase/server.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const isProd = process.env.NODE_ENV === "production";

// 讀取用（RSC）
export async function supabaseServer() {
  const store = await cookies();
  return createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return store.get(name)?.value;
      },
      // RSC 不允許改 cookie，留空避免噴錯
      set() {},
      remove() {},
    },
    cookieOptions: {
      // 讀取不影響，但保留一致性
      sameSite: "lax",
      secure: isProd,
      path: "/",
    },
  });
}

// Route 專用（可寫 cookie）。若呼叫端已經建立了 redirect Response，傳進來用同一個。
export async function supabaseRoute(res?: NextResponse) {
  const response = res ?? NextResponse.next();
  const store = await cookies();

  const cookieOpts: CookieOptions = {
    sameSite: "lax",
    secure: isProd, // 本機 http ⇒ false；Production https ⇒ true
    path: "/",
  };

  const client = createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return store.get(name)?.value;
      },
      set(name: string, value: string, options?: CookieOptions) {
        response.cookies.set(name, value, { ...cookieOpts, ...options });
      },
      remove(name: string, options?: CookieOptions) {
        response.cookies.set(name, "", {
          ...cookieOpts,
          ...options,
          expires: new Date(0),
        });
      },
    },
    cookieOptions: cookieOpts,
  });

  return { supabase: client, response };
}
