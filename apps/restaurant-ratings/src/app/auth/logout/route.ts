import { NextResponse } from "next/server";
import { supabaseServerMutable } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const s = await supabaseServerMutable();
  await s.auth.signOut();
  const { origin } = new URL(req.url);
  return NextResponse.redirect(`${origin}/`);
}
