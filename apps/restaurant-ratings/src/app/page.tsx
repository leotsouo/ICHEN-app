// apps/restaurant-ratings/src/app/page.tsx
import { supabaseServer } from "@/lib/supabase/server";

export default async function Page({
  searchParams,
}: {
  // Next 16：searchParams 是 Promise，先 await 再使用
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const msg = typeof sp?.m === "string" ? sp.m : undefined;

  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 讀餐廳 + 平均評分
  const { data, error } = await supabase
    .from("v_restaurant_rating")
    .select("*")
    .order("name");

  if (error) return <main style={{ padding: 16 }}>讀取失敗：{error.message}</main>;

  // 頂端提示訊息（可選）
  const banner =
    msg === "sent"
      ? "已寄出登入連結，請到信箱點擊 Magic Link 完成登入。"
      : msg === "bad_email"
      ? "Email 格式不正確。"
      : msg === "logged_in"
      ? "登入成功！"
      : msg === "send_fail"
      ? "登入連結寄送失敗，請稍後再試。"
      : null;

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      {/* 頂部列：左標題／右使用者資訊 */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>餐廳評分（read-only）</h1>
          <a href="http://localhost:3000" style={{ textDecoration: "none" }}>
            ← 回首頁
          </a>
        </div>

        {/* 右上角使用者顯示 */}
        {user ? (
          <form action="/auth/logout" method="POST" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ opacity: 0.9 }}>歡迎，{user.email}</span>
            <button
              type="submit"
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid #ddd",
                background: "#f7f7f7",
                cursor: "pointer",
              }}
            >
              登出
            </button>
          </form>
        ) : null}
      </header>

      {/* 訊息條 */}
      {banner && (
        <div
          style={{
            marginTop: 4,
            marginBottom: 12,
            padding: 10,
            borderRadius: 8,
            background: "#eef6ff",
            border: "1px solid #cfe3ff",
          }}
        >
          {banner}
        </div>
      )}

      {/* 未登入時顯示登入表單（Magic Link） */}
      {!user && (
        <section style={{ marginTop: 8, padding: 12, border: "1px dashed #ddd", borderRadius: 12 }}>
          <form action="/auth/login" method="POST" style={{ display: "flex", gap: 8 }}>
            <input
              type="email"
              name="email"
              placeholder="輸入 Email 以接收登入連結（Magic Link）"
              required
              autoComplete="email"
              style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
            />
            <button type="submit" style={{ padding: "8px 12px", borderRadius: 8 }}>
              寄送登入連結
            </button>
          </form>
        </section>
      )}

      {/* 餐廳列表（唯讀） */}
      <ul style={{ display: "grid", gap: 16, marginTop: 16 }}>
        {data?.map((r: any) => (
          <li key={r.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{r.name}</div>
            <div style={{ opacity: 0.8 }}>{r.address || "（無地址）"}</div>
            <div style={{ marginTop: 6 }}>
              平均：{r.avg_half ? `${(Number(r.avg_half) / 2).toFixed(1)}★` : "—"}（{r.review_count} 則）
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
