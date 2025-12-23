// apps/restaurant-ratings/src/components/ratings/StatsOverview.tsx
import type { Restaurant } from "@ichen-app/shared-ratings";
import { halfToRating } from "@ichen-app/shared-ratings";
import { CollapsibleSection } from "./CollapsibleSection";
import styles from "@/app/ratings/page.module.css";

interface StatsOverviewProps {
  restaurants: Restaurant[];
  userReviewCount?: number;
}

export function StatsOverview({ restaurants, userReviewCount = 0 }: StatsOverviewProps) {
  // 計算總體統計
  const totalRestaurants = restaurants.length;
  const restaurantsWithReviews = restaurants.filter((r) => (r.review_count || 0) > 0);
  const totalReviews = restaurants.reduce((sum, r) => sum + (r.review_count || 0), 0);
  
  // 評分分佈
  const ratingDistribution = {
    excellent: restaurants.filter((r) => r.avg_half && halfToRating(r.avg_half) >= 4.5).length,
    good: restaurants.filter((r) => {
      const rating = r.avg_half ? halfToRating(r.avg_half) : 0;
      return rating >= 4.0 && rating < 4.5;
    }).length,
    average: restaurants.filter((r) => {
      const rating = r.avg_half ? halfToRating(r.avg_half) : 0;
      return rating >= 3.0 && rating < 4.0;
    }).length,
    poor: restaurants.filter((r) => {
      const rating = r.avg_half ? halfToRating(r.avg_half) : 0;
      return rating < 3.0;
    }).length,
  };

  return (
    <div className={styles.statsOverview}>
      <div className={styles.statsGrid}>
        {/* 總體統計 */}
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalRestaurants}</div>
          <div className={styles.statLabel}>餐廳總數</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalReviews}</div>
          <div className={styles.statLabel}>總評論數</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statValue}>{restaurantsWithReviews.length}</div>
          <div className={styles.statLabel}>已有評分</div>
        </div>
        
        {userReviewCount > 0 && (
          <div className={styles.statCard}>
            <div className={styles.statValue}>{userReviewCount}</div>
            <div className={styles.statLabel}>我的評論</div>
          </div>
        )}
      </div>

      {/* 評分分佈（可摺疊） */}
      {totalRestaurants > 0 && (
        <CollapsibleSection title="評分分佈" icon="📊" defaultOpen={false}>
          <div className={styles.ratingDistribution}>
            <div className={styles.distributionBars}>
              <div className={styles.distributionBar}>
                <div className={styles.barLabel}>優秀 (≥4.5)</div>
                <div className={styles.barContainer}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: `${(ratingDistribution.excellent / totalRestaurants) * 100}%`,
                      background: "#22c55e",
                    }}
                  />
                  <span className={styles.barValue}>{ratingDistribution.excellent}</span>
                </div>
              </div>
              
              <div className={styles.distributionBar}>
                <div className={styles.barLabel}>很好 (4.0-4.5)</div>
                <div className={styles.barContainer}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: `${(ratingDistribution.good / totalRestaurants) * 100}%`,
                      background: "#84cc16",
                    }}
                  />
                  <span className={styles.barValue}>{ratingDistribution.good}</span>
                </div>
              </div>
              
              <div className={styles.distributionBar}>
                <div className={styles.barLabel}>普通 (3.0-4.0)</div>
                <div className={styles.barContainer}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: `${(ratingDistribution.average / totalRestaurants) * 100}%`,
                      background: "#eab308",
                    }}
                  />
                  <span className={styles.barValue}>{ratingDistribution.average}</span>
                </div>
              </div>
              
              <div className={styles.distributionBar}>
                <div className={styles.barLabel}>待改進 (&lt;3.0)</div>
                <div className={styles.barContainer}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: `${(ratingDistribution.poor / totalRestaurants) * 100}%`,
                      background: "#ef4444",
                    }}
                  />
                  <span className={styles.barValue}>{ratingDistribution.poor}</span>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
}

