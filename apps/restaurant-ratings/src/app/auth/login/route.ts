import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const email = String(form.get("email") || "");
  const origin = new URL(req.url).origin; // e.g. http://localhost:3001

  // 簡單 email 驗證
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.redirect(`${origin}/?m=bad_email`);
  }

  const res = NextResponse.redirect(`${origin}/?m=sent`);
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: "rest" }, // 你的表在 rest schema（僅為一致性）
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => res.cookies.set({ name, value, ...options }),
        remove: (name, options) => res.cookies.set({ name, value: "", ...options }),
      },
    }
  );

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  if (error) return NextResponse.redirect(`${origin}/?m=bad_email`);
  return res;
}
