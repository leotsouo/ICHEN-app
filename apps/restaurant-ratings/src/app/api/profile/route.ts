// apps/restaurant-ratings/src/app/api/profile/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@ichen-app/shared-supabase";

// 獲取用戶資料
export async function GET() {
  try {
    const supabase = await supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "未登入" }, { status: 401 });
    }

    // 從 profiles 表獲取用戶資料
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, display_name")
      .eq("id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 是找不到記錄的錯誤，我們可以忽略它
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data: {
        display_name: profile?.display_name || null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "未知錯誤" },
      { status: 500 }
    );
  }
}

// 更新用戶顯示名稱
export async function POST(request: Request) {
  try {
    const supabase = await supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "未登入" }, { status: 401 });
    }

    const { display_name } = await request.json();

    if (typeof display_name !== "string") {
      return NextResponse.json(
        { error: "display_name 必須是字串" },
        { status: 400 }
      );
    }

    // 驗證長度（例如：1-20 個字元）
    const trimmedName = display_name.trim();
    if (trimmedName.length === 0) {
      return NextResponse.json(
        { error: "顯示名稱不能為空" },
        { status: 400 }
      );
    }
    if (trimmedName.length > 20) {
      return NextResponse.json(
        { error: "顯示名稱不能超過 20 個字元" },
        { status: 400 }
      );
    }

    // 使用 upsert 來更新或創建記錄
    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          display_name: trimmedName,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "id",
        }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "未知錯誤" },
      { status: 500 }
    );
  }
}

