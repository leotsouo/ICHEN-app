import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { mkTrace } from "@/lib/supabase/debug";

export async function POST(req: Request) {
  const t = mkTrace("AUTH_LOGOUT");
  const s = await supabaseServer();
  const { error } = await s.auth.signOut();
  if (error) t.err("signOut error", error);
  else t.log("logout ok");

  return NextResponse.redirect(new URL(`/?m=logged_out&t=${t.id}`, req.url));
}
