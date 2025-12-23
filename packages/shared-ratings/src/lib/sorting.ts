import type { Restaurant, SortOption, FilterOption } from "./types";
import { halfToRating } from "./validation";

/**
 * 排序餐廳列表
 */
export function sortRestaurants(
  restaurants: Restaurant[],
  sortOption: SortOption
): Restaurant[] {
  const sorted = [...restaurants];

  switch (sortOption) {
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "zh-TW"));

    case "rating_desc":
      return sorted.sort((a, b) => {
        const ratingA = a.avg_half ? halfToRating(a.avg_half) : 0;
        const ratingB = b.avg_half ? halfToRating(b.avg_half) : 0;
        return ratingB - ratingA;
      });

    case "rating_asc":
      return sorted.sort((a, b) => {
        const ratingA = a.avg_half ? halfToRating(a.avg_half) : 0;
        const ratingB = b.avg_half ? halfToRating(b.avg_half) : 0;
        return ratingA - ratingB;
      });

    case "reviews_desc":
      return sorted.sort(
        (a, b) => (b.review_count || 0) - (a.review_count || 0)
      );

    case "reviews_asc":
      return sorted.sort(
        (a, b) => (a.review_count || 0) - (b.review_count || 0)
      );

    default:
      return sorted;
  }
}

/**
 * 篩選餐廳列表
 */
export function filterRestaurants(
  restaurants: Restaurant[],
  filterOption: FilterOption
): Restaurant[] {
  switch (filterOption) {
    case "all":
      return restaurants;

    case "rated":
      return restaurants.filter((r) => (r.review_count || 0) > 0);

    case "unrated":
      return restaurants.filter((r) => (r.review_count || 0) === 0);

    case "excellent":
      return restaurants.filter((r) => {
        if (!r.avg_half) return false;
        return halfToRating(r.avg_half) >= 4.5;
      });

    case "good":
      return restaurants.filter((r) => {
        if (!r.avg_half) return false;
        const rating = halfToRating(r.avg_half);
        return rating >= 4.0 && rating < 4.5;
      });

    case "average":
      return restaurants.filter((r) => {
        if (!r.avg_half) return false;
        const rating = halfToRating(r.avg_half);
        return rating >= 3.0 && rating < 4.0;
      });

    case "poor":
      return restaurants.filter((r) => {
        if (!r.avg_half) return false;
        return halfToRating(r.avg_half) < 3.0;
      });

    default:
      return restaurants;
  }
}

