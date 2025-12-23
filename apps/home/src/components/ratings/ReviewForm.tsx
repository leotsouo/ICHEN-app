// apps/restaurant-ratings/src/components/ratings/ReviewForm.tsx
import { addReview, RATING_OPTIONS, ASPECT_CONFIGS } from "@ichen-app/shared-ratings";
import styles from "@/app/ratings/page.module.css";

interface ReviewFormProps {
  restaurantId: string;
}

export function ReviewForm({ restaurantId }: ReviewFormProps) {
  return (
    <form action={addReview} className={styles.reviewForm}>
      <input type="hidden" name="restaurant_id" value={restaurantId} />

      {/* 主評分（0.0~5.0，半星） */}
      <div className={styles.formRow}>
        <label className={styles.formLabel}>整體評分</label>
        <select name="rating" defaultValue="3.0" className={styles.formSelect} required>
          {RATING_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 分項（可選） */}
      <div className={styles.aspectsSection}>
        <div className={styles.aspectsTitle}>分項（可不填）</div>
        {ASPECT_CONFIGS.map((aspect) => (
          <div key={aspect.key} className={styles.formRow}>
            <label className={styles.formLabel}>{aspect.label}</label>
            <select
              name={`aspect_${aspect.key}`}
              defaultValue=""
              className={styles.formSelect}
            >
              <option value="">（不填）</option>
              {RATING_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* 留言（<=500字） */}
      <input
        name="comment"
        placeholder="寫下你的看法（最多 500 字，可留空）"
        maxLength={500}
        className={styles.formInput}
      />

      <div>
        <button type="submit" className={styles.submitButton}>
          送出評論
        </button>
      </div>
    </form>
  );
}

