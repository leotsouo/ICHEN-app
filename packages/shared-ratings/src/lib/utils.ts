import { halfToRating, normalizeRating } from "./validation";
import { REVIEW_CONSTANTS } from "./constants";

/**
 * 獲取評分等級描述
 */
export function getRatingLevel(rating: number | null | undefined): {
  level: string;
  color: string;
  description: string;
} {
  if (rating === null || rating === undefined) {
    return {
      level: "無評分",
      color: "#999",
      description: "尚無評分",
    };
  }

  const normalized = normalizeRating(rating);

  if (normalized >= 4.5) {
    return {
      level: "優秀",
      color: "#22c55e",
      description: "非常推薦",
    };
  } else if (normalized >= 4.0) {
    return {
      level: "很好",
      color: "#84cc16",
      description: "值得推薦",
    };
  } else if (normalized >= 3.5) {
    return {
      level: "良好",
      color: "#eab308",
      description: "還不錯",
    };
  } else if (normalized >= 3.0) {
    return {
      level: "普通",
      color: "#f59e0b",
      description: "一般般",
    };
  } else if (normalized >= 2.5) {
    return {
      level: "尚可",
      color: "#ef4444",
      description: "有待改進",
    };
  } else {
    return {
      level: "不佳",
      color: "#dc2626",
      description: "不推薦",
    };
  }
}

/**
 * 計算評分變化趨勢
 */
export function calculateRatingTrend(
  currentAvg: number | null,
  previousAvg: number | null
): {
  direction: "up" | "down" | "stable";
  change: number;
  percentage: number;
} {
  if (currentAvg === null || previousAvg === null) {
    return {
      direction: "stable",
      change: 0,
      percentage: 0,
    };
  }

  const change = currentAvg - previousAvg;
  const percentage = previousAvg !== 0 ? (change / previousAvg) * 100 : 0;

  if (Math.abs(change) < 0.1) {
    return {
      direction: "stable",
      change: 0,
      percentage: 0,
    };
  }

  return {
    direction: change > 0 ? "up" : "down",
    change: Math.abs(change),
    percentage: Math.abs(percentage),
  };
}

/**
 * 格式化評分範圍顯示
 */
export function formatRatingRange(
  min: number | null,
  max: number | null,
  avg: number | null
): string {
  if (min === null || max === null || avg === null) {
    return "—";
  }

  const normalizedMin = normalizeRating(min);
  const normalizedMax = normalizeRating(max);
  const normalizedAvg = normalizeRating(avg);

  if (normalizedMin === normalizedMax) {
    return `${normalizedAvg.toFixed(1)}★`;
  }

  return `${normalizedMin.toFixed(1)}-${normalizedMax.toFixed(1)}★ (平均 ${normalizedAvg.toFixed(1)}★)`;
}

/**
 * 驗證評分是否在合理範圍內
 */
export function isRatingReasonable(
  rating: number,
  aspectRatings?: Record<string, number>
): { valid: boolean; warning?: string } {
  const normalized = normalizeRating(rating);

  // 檢查是否為極端評分（需要額外驗證）
  if (normalized <= 1.0 || normalized >= 4.5) {
    return {
      valid: true,
      warning: "您給出了極端評分，請確認這是您的真實感受",
    };
  }

  // 如果有分項評分，檢查一致性
  if (aspectRatings) {
    const aspectValues = Object.values(aspectRatings).filter(
      (v) => v !== undefined && v !== null
    ) as number[];

    if (aspectValues.length > 0) {
      const avgAspect =
        aspectValues.reduce((a, b) => a + b, 0) / aspectValues.length;
      const diff = Math.abs(avgAspect - normalized);

      if (diff > 1.5) {
        return {
          valid: true,
          warning: `整體評分與分項平均（${avgAspect.toFixed(1)}★）差距較大，請確認`,
        };
      }
    }
  }

  return { valid: true };
}

