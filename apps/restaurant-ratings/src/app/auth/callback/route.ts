// apps/restaurant-ratings/src/app/auth/callback/route.ts
import { supabaseRoute } from "@ichen-app/shared-supabase";
import { mkTrace } from "@/lib/supabase/debug";
import { createAuthRedirect } from "@/lib/auth/utils";

export async function GET(req: Request) {
  const trace = mkTrace("AUTH_CALLBACK");
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  // 先準備 redirect response，再交給 supabaseRoute 讓 cookie 寫在這個 response
  const redirect = createAuthRedirect(url.origin, "logged_in", trace.id);
  const { supabase, response } = await supabaseRoute(redirect);

  if (!code) {
    trace.err("missing code parameter");
    return createAuthRedirect(url.origin, "access_denied", trace.id);
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    trace.err("exchangeCodeForSession error", error);
    return createAuthRedirect(url.origin, "access_denied", trace.id);
  }

  // 自動創建用戶資料（如果不存在）
  if (data.user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: data.user.id,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "id",
        }
      );

    if (profileError) {
      trace.log("profile creation/update failed (non-critical)", {
        error: profileError.message,
      });
    } else {
      trace.log("profile created/updated successfully");
    }
  }

  trace.log("login successful", { userId: data.user?.id });
  return response;
}
