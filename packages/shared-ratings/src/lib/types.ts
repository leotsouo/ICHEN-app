/**
 * 餐廳資料類型
 */
export interface Restaurant {
  id: string;
  name: string;
  address?: string;
  avg_half?: number; // 平均評分（半星制，0-10）
  review_count?: number;
  created_by?: string; // 建立者 ID
  latitude?: number; // 緯度（來自 Google Places）
  longitude?: number; // 經度（來自 Google Places）
  place_id?: string; // Google Places ID
}

/**
 * 新增餐廳的表單資料
 */
export interface RestaurantFormData {
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  place_id?: string;
}

/**
 * 評論資料類型
 */
export interface Review {
  id: string;
  restaurant_id: string;
  user_id: string;
  rating_half: number; // 半星制，0-10
  comment?: string | null;
  created_at: string;
  deleted_at?: string | null;
  // 擴展欄位（從 profiles 表 join）
  profiles?: {
    email?: string;
  } | null;
}

/**
 * 分項評分類型
 */
export interface ReviewAspect {
  id?: string;
  review_id: string;
  aspect_id: number;
  score_half: number; // 半星制，0-10
}

/**
 * 評分分項類型
 */
export type AspectType = "service" | "ambience" | "value" | "taste" | "hygiene";

/**
 * 分項評分配置
 */
export interface AspectConfig {
  key: AspectType;
  label: string;
  id: number;
}

/**
 * 新增評論的表單資料
 */
export interface ReviewFormData {
  restaurant_id: string;
  rating: number; // 0.0 ~ 5.0
  comment?: string;
  aspects?: Partial<Record<AspectType, number>>; // 可選的分項評分
}

/**
 * 評論驗證結果
 */
export interface ReviewValidationResult {
  valid: boolean;
  error?: string;
  warning?: string;
}

/**
 * 評分統計資料
 */
export interface RatingStats {
  average: number;
  count: number;
  distribution: Record<string, number>;
  min?: number;
  max?: number;
  median?: number;
}

/**
 * 評分等級資訊
 */
export interface RatingLevel {
  level: string;
  color: string;
  description: string;
}

/**
 * 評分趨勢資訊
 */
export interface RatingTrend {
  direction: "up" | "down" | "stable";
  change: number;
  percentage: number;
}

/**
 * 排序選項
 */
export type SortOption = "name" | "rating_desc" | "rating_asc" | "reviews_desc" | "reviews_asc";

/**
 * 篩選選項
 */
export type FilterOption = "all" | "rated" | "unrated" | "excellent" | "good" | "average" | "poor";

