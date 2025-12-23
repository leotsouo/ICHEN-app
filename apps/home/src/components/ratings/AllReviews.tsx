// apps/restaurant-ratings/src/components/ratings/AllReviews.tsx
"use client";

import { useState, useEffect } from "react";
import type { Review } from "@ichen-app/shared-ratings";
import { formatRating, halfToRating } from "@ichen-app/shared-ratings";
import { ReviewAspects } from "./ReviewAspects";
import styles from "@/app/ratings/page.module.css";

interface AllReviewsProps {
  restaurantId: string;
  currentUserId?: string;
}

interface ReviewWithUser extends Omit<Review, 'profiles'> {
  user_email?: string;
  display_name?: string;
  aspects?: Array<{
    aspect_id: number;
    score_half: number;
  }>;
  profiles?: {
    display_name?: string;
    email?: string;
  } | null;
}

export function AllReviews({ restaurantId, currentUserId }: AllReviewsProps) {
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);
        
        // 使用 API 路由獲取評論
        const response = await fetch(`/api/reviews?restaurant_id=${restaurantId}`);
        const json = await response.json();
        
        if (!response.ok) {
          throw new Error(json.error || "載入評論失敗");
        }
        
        const { data } = json;
        
        // 格式化評論資料
        const reviewsWithUser: ReviewWithUser[] = (data || []).map((review: any) => {
          // 優先使用 display_name，否則使用 user_id 的前幾位作為顯示（保護隱私）
          const displayName = review.profiles?.display_name 
            || (review.user_id ? `用戶 ${review.user_id.slice(0, 8)}` : "匿名用戶");
          
          return {
            ...review,
            display_name: displayName,
            user_email: displayName, // 保持向後兼容
          };
        });

        setReviews(reviewsWithUser);
      } catch (err) {
        setError(err instanceof Error ? err.message : "載入評論失敗");
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [restaurantId]);

  if (loading) {
    return (
      <div className={styles.reviewsLoading}>
        <div className={styles.loadingSpinner}>載入中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.reviewsError}>
        載入評論時發生錯誤：{error}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className={styles.noReviews}>
        <div className={styles.noReviewsIcon}>💬</div>
        <div className={styles.noReviewsText}>尚無評論</div>
      </div>
    );
  }

  return (
    <div className={styles.allReviewsList}>
        {reviews.map((review) => {
        const isOwnReview = currentUserId && review.user_id === currentUserId;
        const rating = halfToRating(review.rating_half);
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        const displayName = isOwnReview 
          ? "我" 
          : review.display_name || review.user_email || "匿名用戶";
        const avatarChar = displayName === "我" 
          ? "我" 
          : (displayName?.charAt(0) || "?").toUpperCase();
        
        return (
          <div
            key={review.id}
            className={`${styles.reviewItem} ${isOwnReview ? styles.ownReview : ""}`}
          >
            <div className={styles.reviewHeader}>
              <div className={styles.reviewUserInfo}>
                <div className={styles.reviewUserAvatar}>
                  {avatarChar}
                </div>
                <div className={styles.reviewUserDetails}>
                  <div className={styles.reviewUserName}>
                    {displayName}
                    {isOwnReview && (
                      <span className={styles.ownReviewBadge}>（我的評論）</span>
                    )}
                  </div>
                  <div className={styles.reviewDate}>
                    {new Date(review.created_at).toLocaleDateString("zh-TW", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <div className={styles.reviewRating}>
                <span className={styles.reviewStars}>
                  {"★".repeat(fullStars)}
                  {hasHalfStar && "½"}
                  {"☆".repeat(emptyStars)}
                </span>
                <span className={styles.reviewRatingValue}>
                  {formatRating(review.rating_half)}
                </span>
              </div>
            </div>
            {review.comment && (
              <div className={styles.reviewComment}>{review.comment}</div>
            )}
            {review.aspects && review.aspects.length > 0 && (
              <ReviewAspects aspects={review.aspects} />
            )}
          </div>
        );
      })}
    </div>
  );
}

