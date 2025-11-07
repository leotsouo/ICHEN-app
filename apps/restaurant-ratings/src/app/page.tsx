// apps/restaurant-ratings/src/app/page.tsx
import { supabaseServer } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = supabaseServer();

  // 只讀取餐廳 + 平均評分
  const { data, error } = await supabase
    .from("v_restaurant_rating") // 已在 server.ts 指定 schema=rest
    .select("*")
    .order("name");

  if (error) {
    return <main style={{ padding: 16 }}>讀取失敗：{error.message}</main>;
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h1>餐廳評分（read-only）</h1>
      <a href="http://localhost:3000" style={{ textDecoration: "none" }}>← 回首頁</a>

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
