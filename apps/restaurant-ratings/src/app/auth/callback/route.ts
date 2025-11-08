// apps/restaurant-ratings/src/app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { supabaseRoute } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const trace = crypto.randomUUID();
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  // 先準備 redirect response，再交給 supabaseRoute 讓 cookie 寫在這個 response
  const redirect = NextResponse.redirect(new URL(`/?m=logged_in&t=${trace}`, url.origin), { status: 307 });
  const { supabase, response } = await supabaseRoute(redirect);

  if (!code) {
    console.error(`[AUTH_CB#${trace}] missing code`);
    return NextResponse.redirect(new URL(`/?m=access_denied&t=${trace}`, url.origin));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error(`[AUTH_CB#${trace}] exchangeCodeForSession error`, error);
    return NextResponse.redirect(new URL(`/?m=access_denied&t=${trace}`, url.origin));
  }

  console.log(`[AUTH_CB#${trace}] login OK`);
  return response;
}
