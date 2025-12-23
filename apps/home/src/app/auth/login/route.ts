// apps/restaurant-ratings/src/app/auth/login/route.ts
import { supabaseRoute } from "@ichen-app/shared-supabase";
import { mkTrace } from "@/lib/supabase/debug";
import {
  isValidEmail,
  maskEmail,
  createAuthRedirect,
  mapSupabaseError,
} from "@/lib/auth/utils";

export async function POST(req: Request) {
  const trace = mkTrace("AUTH_LOGIN");
  const form = await req.formData();
  const email = String(form.get("email") || "").trim();
  const password = String(form.get("password") || "");
  const mode = String(form.get("mode") || "magic-link");
  const { origin } = new URL(req.url);

  // 驗證 Email 格式
  if (!isValidEmail(email)) {
    trace.log("invalid email format", { emailMasked: maskEmail(email) });
    return createAuthRedirect(origin, "bad_email", trace.id);
  }

  // 先建好 redirect Response，等等 cookie 都寫在它上面
  const redirect = createAuthRedirect(
    origin,
    mode === "password" ? "logged_in" : "sent",
    trace.id
  );
  const { supabase, response } = await supabaseRoute(redirect);

  if (mode === "password") {
    // 密碼登入
    if (!password) {
      trace.log("missing password");
      return createAuthRedirect(origin, "bad_password", trace.id);
    }

    trace.log("password login attempt", { emailMasked: maskEmail(email) });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      trace.err("signInWithPassword error", error);
      const authMessage = mapSupabaseError(error);
      return createAuthRedirect(origin, authMessage, trace.id, error.message);
    }

    trace.log("password login successful", {
      emailMasked: maskEmail(email),
      userId: data.user?.id,
    });

    return response;
  } else {
    // Magic Link 登入
    trace.log("sending magic link", { emailMasked: maskEmail(email) });

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${origin}/auth/callback` },
    });

    if (error) {
      trace.err("signInWithOtp error", error);
      const authMessage = mapSupabaseError(error);
      return createAuthRedirect(origin, authMessage, trace.id, error.message);
    }

    trace.log("magic link sent successfully");
    return response;
  }
}
