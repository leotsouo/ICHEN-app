// apps/restaurant-ratings/src/app/auth/register/route.ts
import { supabaseRoute } from "@ichen-app/shared-supabase";
import { mkTrace } from "@/lib/supabase/debug";
import {
  isValidEmail,
  isValidPassword,
  maskEmail,
  createAuthRedirect,
  mapSupabaseError,
} from "@/lib/auth/utils";

export async function POST(req: Request) {
  const trace = mkTrace("AUTH_REGISTER");
  const form = await req.formData();
  const email = String(form.get("email") || "").trim();
  const password = String(form.get("password") || "");
  const { origin } = new URL(req.url);

  // 驗證 Email 格式
  if (!isValidEmail(email)) {
    trace.log("invalid email format", { emailMasked: maskEmail(email) });
    return createAuthRedirect(origin, "bad_email", trace.id);
  }

  // 驗證密碼
  const passwordValidation = isValidPassword(password);
  if (!passwordValidation.valid) {
    trace.log("invalid password", { reason: passwordValidation.error });
    return createAuthRedirect(origin, "bad_password", trace.id);
  }

  // 先建好 redirect Response，等等 cookie 都寫在它上面
  const redirect = createAuthRedirect(origin, "registered", trace.id);
  const { supabase, response } = await supabaseRoute(redirect);

  trace.log("registering user", { emailMasked: maskEmail(email) });

  // 註冊用戶
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    trace.err("signUp error", error);
    const authMessage = mapSupabaseError(error);
    return createAuthRedirect(origin, authMessage, trace.id, error.message);
  }

  trace.log("registration successful", { 
    emailMasked: maskEmail(email),
    userId: data.user?.id 
  });

  // 如果用戶已存在但未驗證，Supabase 會返回用戶但不會創建新帳號
  // 這種情況下我們仍然返回成功，因為會發送驗證郵件

  return response;
}

