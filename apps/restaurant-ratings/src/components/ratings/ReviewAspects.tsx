// apps/restaurant-ratings/src/components/ratings/ReviewAspects.tsx
import { halfToRating, ASPECT_CONFIGS } from "@ichen-app/shared-ratings";
import styles from "@/app/page.module.css";

interface Aspect {
  aspect_id: number;
  score_half: number;
}

interface ReviewAspectsProps {
  aspects: Aspect[];
}

export function ReviewAspects({ aspects }: ReviewAspectsProps) {
  if (!aspects || aspects.length === 0) {
    return null;
  }

  // 建立 aspect_id 到配置的映射
  const aspectMap = new Map(
    ASPECT_CONFIGS.map((config) => [config.id, config])
  );

  return (
    <div className={styles.reviewAspects}>
      <div className={styles.aspectsTitle}>分項評分</div>
      <div className={styles.aspectsGrid}>
        {aspects.map((aspect) => {
          const config = aspectMap.get(aspect.aspect_id);
          if (!config) return null;
          
          const rating = halfToRating(aspect.score_half);
          return (
            <div key={aspect.aspect_id} className={styles.aspectItem}>
              <span className={styles.aspectLabel}>{config.label}</span>
              <span className={styles.aspectRating}>
                {rating.toFixed(1)}★
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

