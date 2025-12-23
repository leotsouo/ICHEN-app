// apps/home/src/components/ratings/AuthBanner.tsx
import type { AuthMessage } from "@/lib/auth/utils";
import { getAuthMessageText } from "@/lib/auth/utils";
import styles from "@/app/ratings/page.module.css";

interface AuthBannerProps {
  message?: AuthMessage;
  error?: string;
  trace?: string;
}

export function AuthBanner({ message, error, trace }: AuthBannerProps) {
  const bannerInfo = getAuthMessageText(message, error);

  if (!bannerInfo) {
    return null;
  }

  const bannerClass =
    bannerInfo.type === "success"
      ? styles.bannerSuccess
      : bannerInfo.type === "warn"
      ? styles.bannerWarn
      : styles.bannerInfo;

  return (
    <div className={`${styles.banner} ${bannerClass}`}>
      {bannerInfo.text}
      {trace ? (
        <span className={styles.bannerTrace}>trace: {trace}</span>
      ) : null}
    </div>
  );
}

