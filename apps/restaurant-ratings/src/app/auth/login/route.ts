// apps/restaurant-ratings/src/app/auth/login/route.ts
import { NextResponse } from "next/server";
import { supabaseRoute } from "@/lib/supabase/server";

function maskEmail(e: string) {
  return e.replace(/^(.{2}).*(@.*)$/, "$1***$2");
}
function projectRefFromUrl(u: string) {
  try {
    const host = new URL(u).hostname; // xxx.supabase.co
    return host.split(".")[0];
  } catch {
    return "";
  }
}

export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get("email") || "").trim();
  const trace = crypto.randomUUID();

  const { origin } = new URL(req.url);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.redirect(new URL(`/?m=bad_email&t=${trace}`, origin));
  }

  // 先建好 redirect Response，等等 cookie 都寫在它上面
  const redirect = NextResponse.redirect(
    new URL(`/?m=sent&t=${trace}`, origin),
    { status: 307 }
  );

  const { supabase, response } = await supabaseRoute(redirect);

  console.log(`[AUTH_LOGIN#${trace}] incoming { emailMasked: '${maskEmail(email)}' }`);

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  // 除錯：確認 code_verifier 是否真的被寫進這個 response
  const ref = projectRefFromUrl(process.env.NEXT_PUBLIC_SUPABASE_URL!);
  const cvName = ref ? `sb-${ref}-code-verifier` : undefined;
  const hasCV = cvName ? Boolean(response.cookies.get(cvName)) : false;
  console.log(`[AUTH_LOGIN#${trace}] magic link ${error ? "FAILED" : "sent"}; code_verifier cookie ${hasCV ? "SET" : "MISSING"}`);

  if (error) {
    console.error(`[AUTH_LOGIN#${trace}] signInWithOtp error`, error);
    return NextResponse.redirect(new URL(`/?m=access_denied&t=${trace}`, origin));
  }

  return response; // 一定要回傳同一個 response，確保 cookie 帶回去
}
