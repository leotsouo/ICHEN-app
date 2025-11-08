// apps/restaurant-ratings/src/app/page.tsx
import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ m?: string; t?: string }>;
}) {
  // Next 15/16：拿 URL 參數要 await
  const { m, t } = await searchParams;

  const s = supabaseServer();
  const supabase = await s;

  // 1) 目前使用者
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2) 餐廳總覽（含平均/總數；只算未刪除評論）
  const { data: restaurants, error } = await supabase
    .from("v_restaurant_rating")
    .select("*")
    .order("name");

  if (error) {
    return <main style={{ padding: 16 }}>讀取失敗：{error.message}</main>;
  }

  // 3) 目前使用者的所有「未刪除」舊評論（一次抓，前端用 Map 配對餐廳）
  let myReviewsByRestaurant = new Map<string, any[]>();
  if (user) {
    const { data: myReviews } = await supabase
      .from("reviews")
      .select("id, restaurant_id, rating_half, comment, created_at")
      .is("deleted_at", null)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (myReviews) {
      for (const r of myReviews) {
        const arr = myReviewsByRestaurant.get(r.restaurant_id) ?? [];
        arr.push(r);
        myReviewsByRestaurant.set(r.restaurant_id, arr);
      }
    }
  }

  // ============= Server Actions =============
  // 新增評論（允許多筆；分項評分可選）
  async function addReview(formData: FormData) {
    "use server";
    const s = await supabaseServer();
    const {
      data: { user },
    } = await s.auth.getUser();
    if (!user) throw new Error("未登入");

    const restaurant_id = String(formData.get("restaurant_id") || "");
    const rating = Number(formData.get("rating")); // 0.0 ~ 5.0
    const comment = String(formData.get("comment") || "");
    const rating_half = Math.round(rating * 2); // 轉半星整數 0..10

    if (!restaurant_id || isNaN(rating) || rating_half < 0 || rating_half > 10) {
      throw new Error("參數錯誤");
    }
    if (comment.length > 500) {
      throw new Error("留言過長（最多 500 字）");
    }

    // 1) 先插入 review 主表（回傳 id）
    let review_id: string;
    const { data: inserted, error: insErr } = await s
      .from("reviews")
      .insert({
        restaurant_id,
        user_id: user.id,
        rating_half,
        comment: comment || null,
      })
      .select("id")
      .single();

    if (insErr) {
      // UPSERT：如果是唯一性約束衝突，改用 update
      if (insErr.code === "23505") {  // unique_violation
        const { error: updErr } = await s
          .from("reviews")
          .update({
            rating_half,
            comment: comment || null,
          })
          .eq("restaurant_id", restaurant_id)
          .eq("user_id", user.id);
        if (updErr) throw new Error(updErr.message ?? JSON.stringify(updErr));
        // 取已存在的 review id 以新增分項
        const { data: existing } = await s
          .from("reviews")
          .select("id")
          .eq("restaurant_id", restaurant_id)
          .eq("user_id", user.id)
          .single();
        review_id = existing?.id;
      } else {
        throw new Error(insErr.message ?? JSON.stringify(insErr));
      }
    } else {
      review_id = inserted?.id as string;
    }    // 2) 可選的分項評分（5 個欄位，空值略過）
    const parseAspect = (name: string) => {
      const v = formData.get(name);
      if (v === null || v === "") return null;
      const f = Number(v);
      if (isNaN(f) || f < 0 || f > 5) return null;
      return Math.round(f * 2); // 0..10
    };

    const aspectsPayload: { review_id: string; aspect_id: number; score_half: number }[] = [];
    const aspectMap: Record<string, number> = {
      service: 1,   // 你可以改成從 DB 查，但先用固定 id 映射（aspects: id=1..5）
      ambience: 2,
      value: 3,
      taste: 4,
      hygiene: 5,
    };

    (Object.keys(aspectMap) as (keyof typeof aspectMap)[]).forEach((k) => {
      const scoreHalf = parseAspect(`aspect_${k}`);
      if (scoreHalf !== null) {
        aspectsPayload.push({
          review_id,
          aspect_id: aspectMap[k],
          score_half: scoreHalf,
        });
      }
    });

    if (aspectsPayload.length > 0) {
      const { error: insAspectErr } = await s.from("review_aspect").insert(aspectsPayload);
      if (insAspectErr) throw new Error(insAspectErr.message ?? JSON.stringify(insAspectErr));
    }

    revalidatePath("/");
  }

  // 軟刪除某一筆自己的評論
  async function deleteReview(formData: FormData) {
    "use server";
    const s = await supabaseServer();
    const {
      data: { user },
    } = await s.auth.getUser();
    if (!user) throw new Error("未登入");

    const review_id = String(formData.get("review_id") || "");
    if (!review_id) throw new Error("缺少 review_id");

    // 僅軟刪除自己的評論
    const { error: delErr } = await s
      .from("reviews")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", review_id)
      .eq("user_id", user.id);

  if (delErr) throw new Error(delErr.message ?? JSON.stringify(delErr));

    revalidatePath("/");
  }
  // ============= /Server Actions =============

  const banner =
      m === "sent" ? "已寄出登入連結，請到信箱點擊 Magic Link。"
    : m === "logged_in" ? "登入成功！"
    : m === "logged_out" ? "已登出。"
    : m === "bad_email" ? "Email 格式不正確。"
    : m === "access_denied" ? "登入連結無效或已過期，請重新寄送一封新的。"
    : null;

  return (
    <main style={{ maxWidth: 900, margin: "32px auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h1>餐廳評分</h1>
        {user ? (
          <form action="/auth/logout" method="POST" style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ opacity: 0.8 }}>歡迎，{user.email}</div>
            <button type="submit" style={{ padding: "6px 10px", borderRadius: 8 }}>登出</button>
          </form>
        ) : null}
      </div>

      <a href="http://localhost:3000" style={{ textDecoration: "none" }}>← 回首頁</a>

      {banner && (
        <div style={{ marginTop: 12, padding: 10, borderRadius: 8, background: "#eef6ff", border: "1px solid #cfe3ff" }}>
          {banner}
          {t ? <span style={{ marginLeft: 8, opacity: .6 }}>trace: {t}</span> : null}
        </div>
      )}

      {/* 未登入 → 顯示寄送 Magic Link 表單 */}
      {!user && (
        <section style={{ marginTop: 16, padding: 12, border: "1px dashed #ddd", borderRadius: 12 }}>
          <form action="/auth/login" method="POST" style={{ display: "flex", gap: 8 }}>
            <input
              type="email"
              name="email"
              required
              placeholder="輸入 Email 以接收登入連結（Magic Link）"
              autoComplete="email"
              style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
            />
            <button type="submit" style={{ padding: "8px 12px", borderRadius: 8 }}>寄送登入連結</button>
          </form>
        </section>
      )}

      {/* 餐廳清單 + 我的評論（若已登入） + 新增評論表單 */}
      <ul style={{ display: "grid", gap: 16, marginTop: 16 }}>
        {restaurants?.map((r: any) => {
          const myList = user ? (myReviewsByRestaurant.get(r.id) ?? []) : [];
          return (
            <li key={r.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{r.name}</div>
              <div style={{ opacity: 0.8 }}>{r.address || "（無地址）"}</div>
              <div style={{ marginTop: 6 }}>
                平均：{r.avg_half ? `${(Number(r.avg_half) / 2).toFixed(1)}★` : "—"}（{r.review_count} 則）
              </div>

              {/* 我的舊評論（未刪除） */}
              {user && myList.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>我的歷史評論</div>
                  <ul style={{ display: "grid", gap: 8 }}>
                    {myList.map((rv) => (
                      <li key={rv.id} style={{ background: "#fafafa", border: "1px solid #eee", borderRadius: 8, padding: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <strong>{(rv.rating_half / 2).toFixed(1)}★</strong>
                            <span style={{ opacity: 0.7, marginLeft: 8 }}>
                              {new Date(rv.created_at).toLocaleString()}
                            </span>
                          </div>
                          <form action={deleteReview}>
                            <input type="hidden" name="review_id" value={rv.id} />
                            <button
                              type="submit"
                              style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #ddd", background: "#fff" }}
                              title="刪除本筆評論（軟刪）"
                            >
                              刪除
                            </button>
                          </form>
                        </div>
                        {rv.comment && <div style={{ marginTop: 6 }}>{rv.comment}</div>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 新增評論（允許多筆） */}
              {user ? (
                <form action={addReview} style={{ display: "grid", gap: 8, marginTop: 12 }}>
                  <input type="hidden" name="restaurant_id" value={r.id} />

                  {/* 主評分（0.0~5.0，半星） */}
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <label style={{ width: 80 }}>整體評分</label>
                    <select name="rating" defaultValue="3.0" style={{ padding: 6, borderRadius: 8 }} required>
                      {/* 0.5 ~ 5.0（對應 rating_half 1-10；避開 CHECK 約束） */}
                      {Array.from({ length: 10 }).map((_, i) => {
                        const v = i / 2;
                        return (
                          <option key={i} value={(v + 0.5).toFixed(1)}>
                            {(v + 0.5).toFixed(1)} ★
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* 分項（可選） */}
                  <div style={{ display: "grid", gap: 6, padding: 8, border: "1px dashed #eee", borderRadius: 8 }}>
                    <div style={{ fontWeight: 600, opacity: 0.8 }}>分項（可不填）</div>
                    {[
                      { key: "service", label: "服務" },
                      { key: "ambience", label: "氣氛" },
                      { key: "value", label: "價格CP值" },
                      { key: "taste", label: "口味" },
                      { key: "hygiene", label: "衛生" },
                    ].map((a) => (
                      <div key={a.key} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <label style={{ width: 80 }}>{a.label}</label>
                        <select name={`aspect_${a.key}`} defaultValue="" style={{ padding: 6, borderRadius: 8 }}>
                          <option value="">（不填）</option>
                          {Array.from({ length: 10 }).map((_, i) => {
                            const v = i / 2;
                            return (
                              <option key={i} value={(v + 0.5).toFixed(1)}>
                                {(v + 0.5).toFixed(1)} ★
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    ))}
                  </div>

                  {/* 留言（<=500字） */}
                  <input
                    name="comment"
                    placeholder="寫下你的看法（最多 500 字，可留空）"
                    maxLength={500}
                    style={{ padding: 6, borderRadius: 8, border: "1px solid #ccc" }}
                  />

                  <div>
                    <button type="submit" style={{ padding: "6px 10px", borderRadius: 8 }}>
                      送出評論
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ marginTop: 10, opacity: 0.7 }}>登入後可新增評論</div>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
