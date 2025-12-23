// apps/restaurant-ratings/src/components/ratings/RestaurantCard.tsx
"use client";

import { useState, useTransition } from "react";
import type { Restaurant, Review } from "@ichen-app/shared-ratings";
import { formatRating, halfToRating, getRatingLevel, deleteRestaurant } from "@ichen-app/shared-ratings";
import { CollapsibleSection } from "./CollapsibleSection";
import { ReviewForm } from "./ReviewForm";
import { ReviewList } from "./ReviewList";
import { AllReviews } from "./AllReviews";
import { ConfirmDialog } from "./ConfirmDialog";
import styles from "@/app/page.module.css";

interface RestaurantCardProps {
  restaurant: Restaurant;
  userReviews?: Review[];
  isLoggedIn: boolean;
  currentUserId?: string;
}

export function RestaurantCard({
  restaurant,
  userReviews = [],
  isLoggedIn,
  currentUserId,
}: RestaurantCardProps) {
  const rating = restaurant.avg_half ? halfToRating(restaurant.avg_half) : null;
  const ratingLevel = getRatingLevel(rating);
  const hasRating = (restaurant.review_count || 0) > 0;
  const hasUserReviews = isLoggedIn && userReviews.length > 0;
  const isCreator = isLoggedIn && currentUserId === restaurant.created_by;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);
    const formData = new FormData();
    formData.append("restaurant_id", restaurant.id);

    startTransition(async () => {
      try {
        await deleteRestaurant(formData);
        // 成功後頁面會自動重新驗證
      } catch (err) {
        setError(err instanceof Error ? err.message : "刪除餐廳失敗");
      }
    });
  };

  return (
    <li className={styles.restaurantCard}>
      {/* 餐廳基本資訊 */}
      <div className={styles.restaurantHeader}>
        <div className={styles.restaurantName}>{restaurant.name}</div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {hasRating && (
            <div
              className={styles.ratingBadge}
              style={{ background: `${ratingLevel.color}20`, color: ratingLevel.color }}
            >
              {ratingLevel.level}
            </div>
          )}
          {isCreator && (
            <>
              {hasRating ? (
                <button
                  type="button"
                  className={styles.deleteButton}
                  disabled
                  title={`無法刪除：該餐廳已有 ${restaurant.review_count || 0} 則評論`}
                  style={{
                    opacity: 0.5,
                    cursor: "not-allowed",
                  }}
                >
                  🗑️
                </button>
              ) : (
                <ConfirmDialog
                  title="刪除餐廳"
                  message={`確定要刪除餐廳「${restaurant.name}」嗎？此操作無法復原。`}
                  confirmText="刪除"
                  cancelText="取消"
                  onConfirm={handleDelete}
                  danger={true}
                >
                  {(openDialog) => (
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={openDialog}
                      disabled={isPending}
                      title="刪除餐廳"
                    >
                      🗑️
                    </button>
                  )}
                </ConfirmDialog>
              )}
            </>
          )}
        </div>
      </div>

      {error && (
        <div className={styles.bannerWarn} style={{ marginTop: "8px", marginBottom: "8px" }}>
          {error}
        </div>
      )}
      
      <div className={styles.restaurantAddress}>
        {restaurant.address || "（無地址）"}
      </div>
      
      <div className={styles.restaurantRating}>
        {hasRating ? (
          <>
            <span className={styles.ratingValue}>
              <strong>{formatRating(restaurant.avg_half)}</strong>
            </span>
            <span className={styles.ratingCount}>
              （{restaurant.review_count || 0} 則評論）
            </span>
            <span className={styles.ratingDesc}>{ratingLevel.description}</span>
          </>
        ) : (
          <span className={styles.noRating}>尚無評分</span>
        )}
      </div>

      {/* 可展開的功能區塊 */}
      <div className={styles.restaurantActions}>
        {/* 查看所有評論 */}
        {hasRating && (
          <CollapsibleSection
            title={`查看所有評論 (${restaurant.review_count || 0})`}
            icon="💬"
            defaultOpen={false}
          >
            <AllReviews restaurantId={restaurant.id} currentUserId={currentUserId} />
          </CollapsibleSection>
        )}

        {/* 我的評論 */}
        {hasUserReviews && (
          <CollapsibleSection
            title={`我的評論 (${userReviews.length})`}
            icon="📝"
            defaultOpen={false}
          >
            <ReviewList reviews={userReviews} />
          </CollapsibleSection>
        )}

        {/* 新增評論 */}
        {isLoggedIn && (
          <CollapsibleSection
            title="新增評論"
            icon="✍️"
            defaultOpen={false}
          >
            <ReviewForm restaurantId={restaurant.id} />
          </CollapsibleSection>
        )}

        {!isLoggedIn && (
          <div className={styles.loginPrompt}>登入後可查看和新增評論</div>
        )}
      </div>
    </li>
  );
}

