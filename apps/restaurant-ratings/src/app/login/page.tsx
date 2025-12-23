// apps/restaurant-ratings/src/app/login/page.tsx
import { redirect } from "next/navigation";
import styles from "../page.module.css";
import { supabaseServer } from "@ichen-app/shared-supabase";
import { parseAuthMessage, getAuthMessageText } from "@/lib/auth/utils";
import { AuthForm } from "@/components/ratings/AuthForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string; error?: string }>;
}) {
  const params = await searchParams;
  
  // 若已登入，直接回首頁
  const supabase = await supabaseServer();
  let user = null;
  try {
    const {
      data: { user: currentUser },
      error: authError,
    } = await supabase.auth.getUser();
    
    // 如果 refresh token 无效，忽略错误（用户未登入）
    if (authError && authError.message?.includes("Refresh Token")) {
      // 清除无效的 session（通过登出）
      try {
        await supabase.auth.signOut();
      } catch {
        // 忽略登出错误
      }
      user = null;
    } else {
      user = currentUser;
    }
  } catch (error) {
    // 捕获其他认证错误，视为未登入
    user = null;
  }
  
  if (user) redirect("/");

  // 解析認證訊息
  const searchParamsObj = new URLSearchParams();
  if (params.m) searchParamsObj.set("m", params.m);
  if (params.error) searchParamsObj.set("error", params.error);
  
  const { message, error } = parseAuthMessage(searchParamsObj);
  const banner = getAuthMessageText(message, error);

  return (
    <main className={styles.rrMain}>
      {/* Header */}
      <div className={styles.rrHeader}>
        <h1 className={styles.rrTitle}>登入 / 註冊</h1>
        <a href="/" className={styles.rrLink}>
          ← 回列表
        </a>
      </div>

      {/* 提示訊息 */}
      {banner && (
        <div
          className={`${styles.rrBanner} ${
            banner.type === "success"
              ? styles.success || styles.info
              : banner.type === "info"
              ? styles.info
              : styles.warn
          }`}
        >
          {banner.text}
        </div>
      )}

      {/* 登入/註冊表單 */}
      <AuthForm />
    </main>
  );
}
