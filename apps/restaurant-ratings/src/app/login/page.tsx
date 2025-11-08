// apps/restaurant-ratings/src/app/login/page.tsx
import { redirect } from "next/navigation";
import styles from "../page.module.css";
import { supabaseServer } from "@/lib/supabase/server";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string; error?: string }>;
}) {
  const { m, error } = await searchParams;

  // 若已登入，直接回首頁
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (user) redirect("/");

  const banner =
    m === "sent"
      ? { type: "info", text: "已寄出登入連結，請到信箱點擊 Magic Link。" }
      : m === "access_denied"
      ? { type: "warn", text: "登入連結無效或已過期，請重新寄送一封新的。" }
      : m === "bad_email"
      ? { type: "warn", text: "Email 格式不正確，請再確認一次。" }
      : error
      ? { type: "warn", text: decodeURIComponent(error) }
      : null;

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
            banner.type === "info" ? styles.info : styles.warn
          }`}
        >
          {banner.text}
        </div>
      )}

      {/* Magic Link 表單 */}
      <section style={{ marginTop: 12 }}>
        <form action="/auth/login" method="POST" className={styles.rrForm}>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="輸入 Email 以接收登入連結（Magic Link）"
            className={styles.rrInput}
          />
          <button type="submit" className={styles.rrBtn}>
            寄送登入連結
          </button>
        </form>
        <p
          style={{
            marginTop: 10,
            fontSize: 14,
            opacity: 0.7,
            lineHeight: "22px",
          }}
        >
          我們採用無密碼登入（Magic Link）。輸入 Email 後，前往信箱點擊連結即可完成登入。
        </p>
      </section>
    </main>
  );
}
