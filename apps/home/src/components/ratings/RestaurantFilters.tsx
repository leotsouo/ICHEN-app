// apps/restaurant-ratings/src/components/ratings/RestaurantFilters.tsx
"use client";

import { useState } from "react";
import styles from "@/app/ratings/page.module.css";

import type { SortOption, FilterOption } from "@ichen-app/shared-ratings";

interface RestaurantFiltersProps {
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (filter: FilterOption) => void;
  currentSort: SortOption;
  currentFilter: FilterOption;
}

export function RestaurantFilters({
  onSortChange,
  onFilterChange,
  currentSort,
  currentFilter,
}: RestaurantFiltersProps) {
  return (
    <div className={styles.filtersSection}>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>排序方式</label>
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className={styles.filterSelect}
        >
          <option value="name">名稱 (A-Z)</option>
          <option value="rating_desc">評分 (高→低)</option>
          <option value="rating_asc">評分 (低→高)</option>
          <option value="reviews_desc">評論數 (多→少)</option>
          <option value="reviews_asc">評論數 (少→多)</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>篩選條件</label>
        <select
          value={currentFilter}
          onChange={(e) => onFilterChange(e.target.value as FilterOption)}
          className={styles.filterSelect}
        >
          <option value="all">全部餐廳</option>
          <option value="rated">已有評分</option>
          <option value="unrated">尚未評分</option>
          <option value="excellent">優秀 (≥4.5★)</option>
          <option value="good">很好 (4.0-4.5★)</option>
          <option value="average">普通 (3.0-4.0★)</option>
          <option value="poor">待改進 (&lt;3.0★)</option>
        </select>
      </div>
    </div>
  );
}

