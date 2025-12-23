// apps/home/src/app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@ichen-app/shared-supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get("restaurant_id");

  if (!restaurantId) {
    return NextResponse.json(
      { error: "缺少 restaurant_id 參數" },
      { status: 400 }
    );
  }

  try {
    const supabase = await supabaseServer();
    
    // 獲取評論
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select(`
        id,
        restaurant_id,
        user_id,
        rating_half,
        comment,
        created_at,
        deleted_at
      `)
      .eq("restaurant_id", restaurantId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!reviews || reviews.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // 提取唯一 ID 用於並行查詢
    const userIds = [...new Set(reviews.map((r) => r.user_id).filter(Boolean))];
    const reviewIds = reviews.map((r) => r.id);

    // 並行查詢用戶資料和分項評分以提升性能
    const [profilesResult, aspectsResult] = await Promise.all([
      userIds.length > 0
        ? supabase
            .from("profiles")
            .select("id, display_name")
            .in("id", userIds)
        : Promise.resolve({ data: [], error: null }),
      reviewIds.length > 0
        ? supabase
            .from("review_aspect")
            .select("review_id, aspect_id, score_half")
            .in("review_id", reviewIds)
        : Promise.resolve({ data: [], error: null }),
    ]);

    // 構建用戶資料映射
    const profilesMap = new Map<string, { display_name?: string }>();
    if (!profilesResult.error && profilesResult.data) {
      for (const profile of profilesResult.data) {
        profilesMap.set(profile.id, { display_name: profile.display_name || undefined });
      }
    }

    // 構建分項評分映射
    const aspectsMap = new Map<string, any[]>();
    if (!aspectsResult.error && aspectsResult.data) {
      for (const aspect of aspectsResult.data) {
        const arr = aspectsMap.get(aspect.review_id) ?? [];
        arr.push(aspect);
        aspectsMap.set(aspect.review_id, arr);
      }
    }

    // 合併評論、用戶資料和分項評分
    const data = reviews.map((review) => ({
      ...review,
      profiles: review.user_id ? profilesMap.get(review.user_id) || null : null,
      aspects: aspectsMap.get(review.id) || [],
    }));

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "未知錯誤" },
      { status: 500 }
    );
  }
}

