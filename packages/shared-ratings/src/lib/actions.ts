"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@ichen-app/shared-supabase";
import {
  validateReviewFormData,
  validateRestaurantFormData,
  ratingToHalf,
  normalizeRating,
} from "./validation";
import { ASPECT_ID_MAP, REVIEW_CONSTANTS } from "./constants";
import type { ReviewFormData, RestaurantFormData } from "./types";

/**
 * 新增評論（允許多筆；分項評分可選）
 */
export async function addReview(formData: FormData) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("未登入");
  }

  // 解析表單資料
  const restaurant_id = String(formData.get("restaurant_id") || "");
  const ratingRaw = Number(formData.get("rating"));
  // 正規化評分以確保精度正確
  const rating = normalizeRating(ratingRaw);
  const comment = String(formData.get("comment") || "").trim();
  const rating_half = ratingToHalf(rating);

  // 驗證資料
  const validation = validateReviewFormData({
    restaurant_id,
    rating,
    comment: comment || undefined,
  });

  if (!validation.valid) {
    throw new Error(validation.error || "參數錯誤");
  }

  // 解析分項評分（正規化以確保精度）
  const aspects: Partial<Record<string, number>> = {};
  for (const key of Object.keys(ASPECT_ID_MAP)) {
    const value = formData.get(`aspect_${key}`);
    if (value && value !== "") {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        // 正規化分項評分
        const normalized = normalizeRating(numValue);
        if (
          normalized >= REVIEW_CONSTANTS.MIN_RATING &&
          normalized <= REVIEW_CONSTANTS.MAX_RATING
        ) {
          aspects[key] = normalized;
        }
      }
    }
  }

  // 驗證分項評分
  const aspectValidation = validateReviewFormData({
    restaurant_id,
    rating,
    comment: comment || undefined,
    aspects,
  });

  if (!aspectValidation.valid) {
    throw new Error(aspectValidation.error || "分項評分錯誤");
  }

  // 1) 先插入或更新 review 主表
  let review_id: string;
  const { data: inserted, error: insErr } = await supabase
    .from("reviews")
    .insert({
      restaurant_id,
      user_id: user.id,
      rating_half,
      comment: comment || null,
    })
    .select("id")
    .single();

  if (insErr) {
    // UPSERT：如果是唯一性約束衝突，改用 update
    if (insErr.code === "23505") {
      // unique_violation
      const { error: updErr } = await supabase
        .from("reviews")
        .update({
          rating_half,
          comment: comment || null,
        })
        .eq("restaurant_id", restaurant_id)
        .eq("user_id", user.id);

      if (updErr) {
        throw new Error(updErr.message ?? JSON.stringify(updErr));
      }

      // 取已存在的 review id 以新增分項
      const { data: existing } = await supabase
        .from("reviews")
        .select("id")
        .eq("restaurant_id", restaurant_id)
        .eq("user_id", user.id)
        .single();

      if (!existing?.id) {
        throw new Error("無法取得評論 ID");
      }

      review_id = existing.id;
    } else {
      throw new Error(insErr.message ?? JSON.stringify(insErr));
    }
  } else {
    if (!inserted?.id) {
      throw new Error("無法取得評論 ID");
    }
    review_id = inserted.id;
  }

  // 2) 處理分項評分（無論是否有新分項，都先刪除舊的）
  // 先刪除舊的分項評分（如果有的話）
  await supabase.from("review_aspect").delete().eq("review_id", review_id);

  // 如果有新的分項評分，插入它們
  const aspectsPayload = Object.entries(aspects)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => ({
      review_id,
      aspect_id: ASPECT_ID_MAP[key],
      score_half: ratingToHalf(value!),
    }));

  if (aspectsPayload.length > 0) {
    const { error: insAspectErr } = await supabase
      .from("review_aspect")
      .insert(aspectsPayload);

    if (insAspectErr) {
      throw new Error(insAspectErr.message ?? JSON.stringify(insAspectErr));
    }
  }

  revalidatePath("/");
}

/**
 * 軟刪除某一筆自己的評論
 */
export async function deleteReview(formData: FormData) {
  const supabase = await supabaseServer();
  
  // 確保認證上下文正確設置
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`認證錯誤：${authError.message}`);
  }

  if (!user) {
    throw new Error("未登入");
  }

  const review_id = String(formData.get("review_id") || "");
  if (!review_id) {
    throw new Error("缺少 review_id");
  }

  // 先檢查評論是否存在且屬於當前用戶
  const { data: existingReview, error: fetchError } = await supabase
    .from("reviews")
    .select("id, user_id")
    .eq("id", review_id)
    .single();

  if (fetchError) {
    throw new Error(`查詢評論時發生錯誤：${fetchError.message}`);
  }

  if (!existingReview) {
    throw new Error("評論不存在");
  }

  if (existingReview.user_id !== user.id) {
    throw new Error("只能刪除自己的評論");
  }

  // 僅軟刪除自己的評論
  // 方法 1: 嘗試使用 RPC 函數（如果存在）
  // 方法 2: 如果 RPC 函數不存在，使用直接更新
  
  // 先嘗試使用 RPC 函數（繞過 RLS 問題）
  const { error: rpcError, data: rpcData } = await supabase.rpc("delete_review", {
    review_id_param: review_id,
  });
  
  let delErr = rpcError;
  let updatedData = rpcData ? [{ id: rpcData }] : null;
  
  // 如果 RPC 函數不存在或失敗，使用直接更新
  if (rpcError && rpcError.message?.includes("function") && rpcError.message?.includes("does not exist")) {
    // RPC 函數不存在，使用直接更新
    const { error: updateError, data: updateData } = await supabase
      .from("reviews")
      .update({ 
        deleted_at: new Date().toISOString()
        // 明確不設置 user_id，讓它保持原值
        // 策略的 WITH CHECK 會確保 user_id = auth.uid()
      })
      .eq("id", review_id)
      .eq("user_id", user.id)  // 確保只更新屬於當前用戶的評論
      .select("id");
    
    delErr = updateError;
    updatedData = updateData;
  }
  
  // 調試：檢查認證上下文
  if (delErr) {
    const { data: { user: debugUser }, error: debugAuthError } = await supabase.auth.getUser();
    console.error("刪除失敗 - 調試信息:", {
      error: delErr,
      authError: debugAuthError,
      currentUserId: user.id,
      authUserId: debugUser?.id,
      reviewId: review_id,
      existingReviewUserId: existingReview.user_id,
      errorCode: delErr.code,
      errorMessage: delErr.message,
      rpcError: rpcError?.message,
    });
  }

  if (delErr) {
    // 輸出完整的錯誤資訊用於診斷
    const errorDetails = {
      message: delErr.message,
      code: delErr.code,
      details: delErr.details,
      hint: delErr.hint,
      fullError: JSON.stringify(delErr, null, 2),
    };
    
    // 檢查是否是 RLS 策略錯誤
    if (delErr.message?.includes("row-level security") || delErr.code === "42501") {
      throw new Error(
        `刪除失敗：資料庫權限設定問題。\n` +
        `錯誤代碼: ${delErr.code}\n` +
        `錯誤訊息: ${delErr.message}\n` +
        `詳細資訊: ${delErr.details || "無"}\n` +
        `提示: ${delErr.hint || "無"}\n` +
        `完整錯誤: ${errorDetails.fullError}`
      );
    }
    throw new Error(`刪除評論失敗：${delErr.message ?? JSON.stringify(delErr)}`);
  }

  // 驗證更新是否成功
  if (!updatedData || updatedData.length === 0) {
    throw new Error("刪除失敗：無法更新評論，可能是評論不存在或已被刪除");
  }

  revalidatePath("/");
}

/**
 * 新增餐廳（需要登入，檢查名稱重複）
 * 
 * @throws {Error} 當用戶未登入、驗證失敗、餐廳名稱重複或插入失敗時拋出錯誤
 */
export async function addRestaurant(formData: FormData) {
  const supabase = await supabaseServer();
  
  // 檢查用戶登入狀態
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("未登入，請先登入後再新增餐廳");
  }

  // 解析表單資料
  const name = String(formData.get("name") || "").trim();
  const addressRaw = formData.get("address");
  const address = addressRaw ? String(addressRaw).trim() || null : null;
  const latitudeRaw = formData.get("latitude");
  const longitudeRaw = formData.get("longitude");
  const place_idRaw = formData.get("place_id");
  const place_id = place_idRaw ? String(place_idRaw).trim() || null : null;

  // 解析座標（驗證格式）
  let latitude: number | undefined;
  let longitude: number | undefined;
  
  if (latitudeRaw) {
    const latNum = Number(latitudeRaw);
    if (!isNaN(latNum) && isFinite(latNum)) {
      latitude = latNum;
    }
  }
  
  if (longitudeRaw) {
    const lngNum = Number(longitudeRaw);
    if (!isNaN(lngNum) && isFinite(lngNum)) {
      longitude = lngNum;
    }
  }

  // 驗證資料
  const validation = validateRestaurantFormData({
    name,
    address: address || undefined,
    latitude,
    longitude,
    place_id: place_id || undefined,
  });

  if (!validation.valid) {
    throw new Error(validation.error || "參數錯誤");
  }

  // 檢查餐廳名稱是否重複（不區分大小寫）
  // 使用 LOWER() 函數進行不區分大小寫的比較
  const { data: existingRestaurants, error: checkError } = await supabase
    .from("restaurants")
    .select("id, name")
    .ilike("name", name)
    .limit(1);

  if (checkError) {
    throw new Error(`檢查餐廳名稱時發生錯誤：${checkError.message}`);
  }

  if (existingRestaurants && existingRestaurants.length > 0) {
    const existingName = existingRestaurants[0].name;
    throw new Error(`餐廳「${existingName}」已存在，請使用不同的名稱`);
  }

  // 構建插入資料
  const insertData: {
    name: string;
    address?: string | null;
    created_by: string;
    latitude?: number;
    longitude?: number;
    place_id?: string | null;
  } = {
    name,
    address,
    created_by: user.id,
  };

  // 只有在座標有效時才添加
  if (latitude !== undefined && longitude !== undefined) {
    // 驗證座標範圍
    if (latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
      insertData.latitude = latitude;
      insertData.longitude = longitude;
    }
  }
  
  if (place_id) {
    insertData.place_id = place_id;
  }

  // 插入新餐廳
  const { data: insertedData, error: insertError } = await supabase
    .from("restaurants")
    .insert(insertData)
    .select("id, name")
    .single();

  if (insertError) {
    // 處理唯一性約束衝突（可能是並發問題）
    if (insertError.code === "23505") {
      // 再次檢查以獲取實際存在的餐廳名稱
      const { data: existing } = await supabase
        .from("restaurants")
        .select("name")
        .ilike("name", name)
        .limit(1)
        .single();
      
      const existingName = existing?.name || name;
      throw new Error(`餐廳「${existingName}」已存在，請使用不同的名稱`);
    }
    
    // 處理其他資料庫錯誤
    const errorMessage = insertError.message || "未知錯誤";
    throw new Error(`新增餐廳失敗：${errorMessage}`);
  }

  // 驗證插入結果
  if (!insertedData || !insertedData.id) {
    throw new Error("新增餐廳失敗：無法取得新增的餐廳資料");
  }

  // 重新驗證頁面以更新餐廳列表
  revalidatePath("/");
}

/**
 * 刪除餐廳（只有創建者可以刪除，且餐廳不能有評論）
 * 
 * @throws {Error} 當用戶未登入、不是創建者、餐廳有評論或刪除失敗時拋出錯誤
 */
export async function deleteRestaurant(formData: FormData) {
  const supabase = await supabaseServer();
  
  // 檢查用戶登入狀態
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("未登入，請先登入後再刪除餐廳");
  }

  // 解析餐廳 ID
  const restaurant_id = String(formData.get("restaurant_id") || "").trim();
  
  if (!restaurant_id) {
    throw new Error("缺少餐廳 ID");
  }

  // 1) 檢查餐廳是否存在，並確認創建者
  const { data: restaurant, error: fetchError } = await supabase
    .from("restaurants")
    .select("id, name, created_by")
    .eq("id", restaurant_id)
    .single();

  if (fetchError) {
    throw new Error(`查詢餐廳時發生錯誤：${fetchError.message}`);
  }

  if (!restaurant) {
    throw new Error("餐廳不存在");
  }

  // 2) 檢查是否為創建者
  if (restaurant.created_by !== user.id) {
    throw new Error("只有餐廳創建者可以刪除餐廳");
  }

  // 3) 檢查是否有評論（選項 C：不允許刪除有評論的餐廳）
  // 使用視圖中的 review_count，或直接查詢 reviews 表
  const { count: reviewCount, error: countError } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("restaurant_id", restaurant_id)
    .is("deleted_at", null);

  if (countError) {
    throw new Error(`檢查評論時發生錯誤：${countError.message}`);
  }

  if (reviewCount && reviewCount > 0) {
    throw new Error(`無法刪除餐廳「${restaurant.name}」，因為該餐廳已有 ${reviewCount} 則評論。請先刪除所有評論後再刪除餐廳。`);
  }

  // 4) 刪除餐廳（硬刪除，因為沒有評論所以可以安全刪除）
  const { error: deleteError } = await supabase
    .from("restaurants")
    .delete()
    .eq("id", restaurant_id)
    .eq("created_by", user.id); // 再次確認權限

  if (deleteError) {
    throw new Error(`刪除餐廳失敗：${deleteError.message}`);
  }

  // 重新驗證頁面以更新餐廳列表
  revalidatePath("/");
}

