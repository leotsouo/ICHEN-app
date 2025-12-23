// apps/restaurant-ratings/src/components/ratings/ReviewList.tsx
import type { Review } from "@ichen-app/shared-ratings";
import { formatRating, deleteReview } from "@ichen-app/shared-ratings";
import styles from "@/app/ratings/page.module.css";

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div className={styles.reviewSection}>
      <div className={styles.reviewSectionTitle}>我的歷史評論</div>
      <ul className={styles.reviewList}>
        {reviews.map((review) => (
          <li key={review.id} className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
              <div>
                <span className={styles.reviewRating}>
                  {formatRating(review.rating_half)}
                </span>
                <span className={styles.reviewDate}>
                  {new Date(review.created_at).toLocaleString()}
                </span>
              </div>
              <form action={deleteReview}>
                <input type="hidden" name="review_id" value={review.id} />
                <button
                  type="submit"
                  className={styles.deleteButton}
                  title="刪除本筆評論（軟刪）"
                >
                  刪除
                </button>
              </form>
            </div>
            {review.comment && (
              <div className={styles.reviewComment}>{review.comment}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

