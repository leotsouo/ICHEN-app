import type { AspectConfig } from "./types";

/**
 * 評分分項配置
 */
export const ASPECT_CONFIGS: AspectConfig[] = [
  { key: "service", label: "服務", id: 1 },
  { key: "ambience", label: "氣氛", id: 2 },
  { key: "value", label: "價格CP值", id: 3 },
  { key: "taste", label: "口味", id: 4 },
  { key: "hygiene", label: "衛生", id: 5 },
];

/**
 * 分項 ID 映射（用於快速查找）
 */
export const ASPECT_ID_MAP: Record<string, number> = {
  service: 1,
  ambience: 2,
  value: 3,
  taste: 4,
  hygiene: 5,
};

/**
 * 評論相關常數
 */
export const REVIEW_CONSTANTS = {
  MAX_COMMENT_LENGTH: 500,
  MIN_RATING: 0.5,
  MAX_RATING: 5.0,
  RATING_STEP: 0.5,
} as const;

/**
 * 評分選項（0.5 ~ 5.0，半星）
 */
export const RATING_OPTIONS = Array.from({ length: 10 }, (_, i) => {
  const value = (i + 1) * 0.5;
  return {
    value: value.toFixed(1),
    label: `${value.toFixed(1)} ★`,
  };
});

