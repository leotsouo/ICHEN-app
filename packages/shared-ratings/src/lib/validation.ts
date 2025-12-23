import type { ReviewValidationResult, ReviewFormData, RestaurantFormData } from "./types";
import { REVIEW_CONSTANTS } from "./constants";

/**
 * 驗證評分值是否為有效的半星值（0.5的倍數）
 */
export function isValidHalfStarRating(rating: number): boolean {
  if (isNaN(rating) || !isFinite(rating)) {
    return false;
  }

  // 檢查是否為 0.5 的倍數（允許小數精度誤差）
  const remainder = Math.abs((rating * 2) % 1);
  const isHalfStar = remainder < 0.01 || remainder > 0.99;

  return (
    isHalfStar &&
    rating >= REVIEW_CONSTANTS.MIN_RATING &&
    rating <= REVIEW_CONSTANTS.MAX_RATING
  );
}

/**
 * 驗證評分值（向後兼容）
 */
export function validateRating(rating: number): boolean {
  return isValidHalfStarRating(rating);
}

/**
 * 將評分正規化為最接近的半星值
 */
export function normalizeRating(rating: number): number {
  if (isNaN(rating) || !isFinite(rating)) {
    return REVIEW_CONSTANTS.MIN_RATING;
  }

  // 限制在有效範圍內
  const clamped = Math.max(
    REVIEW_CONSTANTS.MIN_RATING,
    Math.min(REVIEW_CONSTANTS.MAX_RATING, rating)
  );

  // 四捨五入到最接近的半星值
  return Math.round(clamped * 2) / 2;
}

/**
 * 驗證評論表單資料
 */
export function validateReviewFormData(
  data: Partial<ReviewFormData>
): ReviewValidationResult {
  // 驗證餐廳 ID
  if (!data.restaurant_id || typeof data.restaurant_id !== "string") {
    return { valid: false, error: "缺少餐廳 ID" };
  }

  // 驗證評分
  if (data.rating === undefined || data.rating === null) {
    return { valid: false, error: "缺少評分" };
  }

  if (!isValidHalfStarRating(data.rating)) {
    return {
      valid: false,
      error: `評分必須是 ${REVIEW_CONSTANTS.MIN_RATING} ~ ${REVIEW_CONSTANTS.MAX_RATING} 之間的半星值（0.5的倍數）`,
    };
  }

  // 驗證留言長度
  if (
    data.comment &&
    data.comment.length > REVIEW_CONSTANTS.MAX_COMMENT_LENGTH
  ) {
    return {
      valid: false,
      error: `留言過長（最多 ${REVIEW_CONSTANTS.MAX_COMMENT_LENGTH} 字）`,
    };
  }

  // 驗證分項評分
  if (data.aspects) {
    for (const [key, value] of Object.entries(data.aspects)) {
      if (value !== undefined && value !== null) {
        if (!isValidHalfStarRating(value)) {
          return {
            valid: false,
            error: `分項「${key}」的評分必須是有效的半星值`,
          };
        }
      }
    }
  }

  // 檢查分項評分與整體評分的一致性（可選的警告檢查）
  // 如果分項平均與整體評分差距過大（>1.5星），給出警告但不阻止提交
  // 這只是邏輯檢查，不影響驗證結果
  // 注意：目前此檢查已移除，因為不影響驗證結果

  return { valid: true };
}

/**
 * 驗證餐廳表單資料
 */
export function validateRestaurantFormData(
  data: Partial<RestaurantFormData>
): ReviewValidationResult {
  // 驗證餐廳名稱
  if (!data.name || typeof data.name !== "string") {
    return { valid: false, error: "缺少餐廳名稱" };
  }

  const trimmedName = data.name.trim();
  if (trimmedName.length === 0) {
    return { valid: false, error: "餐廳名稱不能為空" };
  }

  if (trimmedName.length > 100) {
    return {
      valid: false,
      error: "餐廳名稱過長（最多 100 字）",
    };
  }

  // 驗證地址長度（如果提供）
  if (data.address && data.address.length > 200) {
    return {
      valid: false,
      error: "地址過長（最多 200 字）",
    };
  }

  // 驗證座標（如果提供）
  if (data.latitude !== undefined) {
    if (isNaN(data.latitude) || data.latitude < -90 || data.latitude > 90) {
      return { valid: false, error: "無效的緯度值" };
    }
  }

  if (data.longitude !== undefined) {
    if (isNaN(data.longitude) || data.longitude < -180 || data.longitude > 180) {
      return { valid: false, error: "無效的經度值" };
    }
  }

  return { valid: true };
}

/**
 * 將評分轉換為半星整數（0-10）
 * 使用正規化確保精度正確
 */
export function ratingToHalf(rating: number): number {
  const normalized = normalizeRating(rating);
  const half = Math.round(normalized * 2);

  // 確保結果在有效範圍內（1-10，對應 0.5-5.0星）
  return Math.max(1, Math.min(10, half));
}

/**
 * 將半星整數轉換為評分（0.0-5.0）
 */
export function halfToRating(half: number): number {
  return half / 2;
}

/**
 * 格式化評分顯示
 */
export function formatRating(half: number | null | undefined): string {
  if (half === null || half === undefined) {
    return "—";
  }
  const rating = halfToRating(half);
  return `${rating.toFixed(1)}★`;
}

/**
 * 格式化評分顯示（帶星級圖示）
 */
export function formatRatingWithStars(
  half: number | null | undefined
): string {
  if (half === null || half === undefined) {
    return "—";
  }
  const rating = halfToRating(half);
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    "★".repeat(fullStars) +
    (hasHalfStar ? "½" : "") +
    "☆".repeat(emptyStars) +
    ` ${rating.toFixed(1)}`
  );
}

/**
 * 計算評分統計
 */
export function calculateRatingStats(ratings: number[]): {
  average: number;
  count: number;
  distribution: Record<string, number>;
} {
  if (ratings.length === 0) {
    return {
      average: 0,
      count: 0,
      distribution: {},
    };
  }

  const validRatings = ratings.filter((r) => !isNaN(r) && isFinite(r));
  const average =
    validRatings.reduce((a, b) => a + b, 0) / validRatings.length;

  // 計算評分分佈（按星級分組）
  const distribution: Record<string, number> = {};
  for (const rating of validRatings) {
    const star = Math.floor(rating);
    const key = `${star}.0-${star}.5`;
    distribution[key] = (distribution[key] || 0) + 1;
  }

  return {
    average: normalizeRating(average),
    count: validRatings.length,
    distribution,
  };
}

