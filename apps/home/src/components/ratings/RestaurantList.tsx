// apps/restaurant-ratings/src/components/ratings/RestaurantList.tsx
"use client";

import { useState, useMemo } from "react";
import type { Restaurant, Review } from "@ichen-app/shared-ratings";
import { sortRestaurants, filterRestaurants } from "@ichen-app/shared-ratings";
import { RestaurantCard } from "./RestaurantCard";
import { RestaurantFilters } from "./RestaurantFilters";
import type { SortOption, FilterOption } from "@ichen-app/shared-ratings";
import styles from "@/app/ratings/page.module.css";

interface RestaurantListProps {
  restaurants: Restaurant[];
  userReviewsByRestaurant: Map<string, Review[]>;
  isLoggedIn: boolean;
  currentUserId?: string;
}

export function RestaurantList({
  restaurants,
  userReviewsByRestaurant,
  isLoggedIn,
  currentUserId,
}: RestaurantListProps) {
  const [sortOption, setSortOption] = useState<SortOption>("name");
  const [filterOption, setFilterOption] = useState<FilterOption>("all");

  // 排序和篩選
  const processedRestaurants = useMemo(() => {
    const filtered = filterRestaurants(restaurants, filterOption);
    return sortRestaurants(filtered, sortOption);
  }, [restaurants, sortOption, filterOption]);

  return (
    <div>
      <RestaurantFilters
        currentSort={sortOption}
        currentFilter={filterOption}
        onSortChange={setSortOption}
        onFilterChange={setFilterOption}
      />
      
      {processedRestaurants.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔍</div>
          <div className={styles.emptyText}>沒有符合條件的餐廳</div>
        </div>
      ) : (
        <>
          <div className={styles.resultsCount}>
            顯示 {processedRestaurants.length} / {restaurants.length} 間餐廳
          </div>
          <ul className={styles.restaurantList}>
            {processedRestaurants.map((restaurant) => {
              const myReviews = isLoggedIn
                ? userReviewsByRestaurant.get(restaurant.id) ?? []
                : [];
              return (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  userReviews={myReviews}
                  isLoggedIn={isLoggedIn}
                  currentUserId={currentUserId}
                />
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

