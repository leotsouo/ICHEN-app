// apps/home/src/app/page.tsx
export default function Home() {
  const apps = [
    { name: "餐廳評分系統", desc: "撰寫/瀏覽評論（0.5★ 刻度）", url: "http://localhost:3001" }
  ];

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1>我的超級平台（secure）</h1>
      <p>選擇一個子系統進入：</p>
      <div style={{ display: "grid", gap: 12 }}>
        {apps.map(a => (
          <a
            key={a.name}
            href={a.url}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 16,
              textDecoration: "none",
              color: "inherit"
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700 }}>{a.name}</div>
            <div style={{ opacity: 0.8 }}>{a.desc}</div>
          </a>
        ))}
      </div>
    </main>
  );
}
