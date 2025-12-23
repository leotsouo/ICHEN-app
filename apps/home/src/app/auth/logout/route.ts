// apps/restaurant-ratings/src/app/auth/logout/route.ts
import { supabaseServer } from "@ichen-app/shared-supabase";
import { mkTrace } from "@/lib/supabase/debug";
import { createAuthRedirect } from "@/lib/auth/utils";

export async function POST(req: Request) {
  const trace = mkTrace("AUTH_LOGOUT");
  const { origin } = new URL(req.url);
  const supabase = await supabaseServer();

  const { error } = await supabase.auth.signOut();

  if (error) {
    trace.err("signOut error", error);
    return createAuthRedirect(origin, "error", trace.id, error.message);
  }

  trace.log("logout successful");
  return createAuthRedirect(origin, "logged_out", trace.id);
}
