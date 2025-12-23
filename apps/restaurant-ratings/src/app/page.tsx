// apps/restaurant-ratings/src/app/page.tsx
import { supabaseServer } from "@ichen-app/shared-supabase";
import { parseAuthMessage } from "@/lib/auth/utils";
import {
  getRestaurants,
  getUserReviews,
  groupReviewsByRestaurant,
  type Review,
} from "@ichen-app/shared-ratings";
import { StatsOverview } from "@/components/ratings/StatsOverview";
import { RestaurantList } from "@/components/ratings/RestaurantList";
import { AuthBanner } from "@/components/ratings/AuthBanner";
import { AuthForm } from "@/components/ratings/AuthForm";
import { UserHeader } from "@/components/ratings/UserHeader";
import { CollapsibleSection } from "@/components/ratings/CollapsibleSection";
import { RestaurantForm } from "@/components/ratings/RestaurantForm";
import styles from "./page.module.css";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ m?: string; t?: string }>;
}) {
  // Next 15/16：拿 URL 參數要 await
  const params = await searchParams;
  const { t } = params;

  // 解析認證訊息
  const searchParamsObj = new URLSearchParams();
  if (params.m) searchParamsObj.set("m", params.m);
  const { message, error } = parseAuthMessage(searchParamsObj);

  // 初始化變數
  let user = null;
  let restaurants: any[] = [];
  let restaurantsError: Error | null = null;
  let myReviewsByRestaurant = new Map<string, Review[]>();
  let userReviewCount = 0;

  // 1) 安全地獲取 Supabase 客戶端和用戶認證
  try {
    const supabase = await supabaseServer();
    
    // 安全地獲取用戶（所有錯誤都視為未登入）
    // 使用雙重錯誤處理確保捕獲所有可能的錯誤
    try {
      const result = await supabase.auth.getUser().catch((err: any) => {
        // 捕獲 Promise rejection，視為未登入
        return { data: { user: null }, error: err };
      });
      
      // 檢查結果
      if (result && !result.error && result.data?.user) {
        user = result.data.user;
      }
      // 所有其他情況（包括 refresh token 錯誤）都視為未登入，不拋出錯誤
    } catch (authErr: any) {
      // 靜默處理所有認證錯誤（包括同步錯誤），視為未登入
      user = null;
    }

    // 2) 獲取餐廳列表（即使認證失敗也要顯示餐廳）
    try {
      const result = await getRestaurants(supabase);
      if (result.error) {
        restaurantsError = result.error;
      } else {
        restaurants = result.data || [];
      }
    } catch (err: any) {
      restaurantsError = err instanceof Error ? err : new Error(String(err));
    }

    // 3) 如果用戶已登入，獲取用戶評論
    if (user) {
      try {
        const { data: myReviews, error: reviewsError } = await getUserReviews(
          supabase,
          user.id
        );

        if (!reviewsError && myReviews) {
          myReviewsByRestaurant = groupReviewsByRestaurant(myReviews);
          userReviewCount = myReviews.length;
        }
      } catch (reviewsErr: any) {
        // 靜默處理評論獲取錯誤，不影響頁面渲染
      }
    }
  } catch (supabaseErr: any) {
    // 如果 Supabase 客戶端創建失敗，仍然渲染頁面（只是沒有數據）
    restaurantsError = new Error("無法連接到服務");
  }

  // 始終渲染完整頁面結構，即使有錯誤或沒有數據
  return (
    <main className={styles.warmMain}>
      <div className={styles.header}>
        <h1>餐廳評分系統</h1>
        {user && <UserHeader userEmail={user.email || ""} />}
      </div>

      <a 
        href={process.env.NEXT_PUBLIC_HOME_URL || "http://localhost:3000"} 
        className={styles.backLink}
      >
        ← 回首頁
      </a>

      <CollapsibleSection title="顯示QR Code" icon="📱" defaultOpen={false}>
        <div className={styles.qrSection}>
          <img
            src="/qr-code.png"
            alt="QR Code for restaurant ratings"
            width={160}
            height={160}
          />
          <div className={styles.qrText}>
            <div className={styles.qrTitle}>用手機掃描快速開啟</div>
            <div className={styles.qrUrl}>
              https://ichen-app-restaurant-ratings.vercel.app
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <AuthBanner message={message} error={error} trace={t} />

      {/* 未登入 → 顯示寄送 Magic Link 表單 */}
      {!user && <AuthForm />}

      {/* 新增餐廳（僅登入用戶可見） */}
      {user && (
        <CollapsibleSection title="新增餐廳" icon="➕" defaultOpen={false}>
          <RestaurantForm />
        </CollapsibleSection>
      )}

      {/* 顯示錯誤訊息（如果有） */}
      {restaurantsError && (
        <div className={styles.bannerWarn} style={{ marginBottom: "12px" }}>
          讀取餐廳資料時發生錯誤：{restaurantsError.message}
        </div>
      )}

      {/* 統計總覽（只有在有餐廳數據時顯示） */}
      {restaurants.length > 0 && (
        <StatsOverview
          restaurants={restaurants}
          userReviewCount={userReviewCount}
        />
      )}

      {/* 餐廳清單或空狀態 */}
      {restaurants.length > 0 ? (
        <RestaurantList
          restaurants={restaurants}
          userReviewsByRestaurant={myReviewsByRestaurant}
          isLoggedIn={!!user}
          currentUserId={user?.id}
        />
      ) : (
        !restaurantsError && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🍽️</div>
            <div className={styles.emptyText}>尚無餐廳資料</div>
            {user && (
              <div style={{ marginTop: "12px", fontSize: "14px", color: "var(--muted)" }}>
                點擊上方「新增餐廳」開始新增第一間餐廳吧！
              </div>
            )}
          </div>
        )
      )}
    </main>
  );
}
