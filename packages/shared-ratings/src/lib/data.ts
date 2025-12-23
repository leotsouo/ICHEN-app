import type { SupabaseClient } from "@supabase/supabase-js";
import type { Restaurant, Review } from "./types";

/**
 * 獲取所有餐廳（含平均評分和評論數）
 */
export async function getRestaurants(
  supabase: SupabaseClient
): Promise<{ data: Restaurant[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("v_restaurant_rating")
    .select("*")
    .order("name");

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: data as Restaurant[], error: null };
}

/**
 * 獲取使用者的所有評論（未刪除）
 */
export async function getUserReviews(
  supabase: SupabaseClient,
  userId: string
): Promise<{ data: Review[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, restaurant_id, rating_half, comment, created_at")
    .is("deleted_at", null)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: data as Review[], error: null };
}

/**
 * 獲取餐廳的所有評論（未刪除，包含所有用戶）
 */
export async function getRestaurantReviews(
  supabase: SupabaseClient,
  restaurantId: string
): Promise<{ data: Review[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id,
      restaurant_id,
      user_id,
      rating_half,
      comment,
      created_at,
      deleted_at,
      profiles:user_id (
        email
      )
    `)
    .eq("restaurant_id", restaurantId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: data as Review[], error: null };
}

/**
 * 將評論按餐廳 ID 分組
 */
export function groupReviewsByRestaurant(
  reviews: Review[]
): Map<string, Review[]> {
  const map = new Map<string, Review[]>();
  for (const review of reviews) {
    const arr = map.get(review.restaurant_id) ?? [];
    arr.push(review);
    map.set(review.restaurant_id, arr);
  }
  return map;
}

