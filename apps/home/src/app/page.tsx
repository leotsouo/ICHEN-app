// apps/home/src/app/page.tsx
import { redirect } from "next/navigation";
import styles from "./page.module.css";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  // 如果 URL 中有 code 參數（Magic Link 認證），重定向到 callback
  const params = await searchParams;
  if (params.code) {
    redirect(`/auth/callback?code=${params.code}`);
  }

  const apps = [
    { 
      name: "餐廳評分系統", 
      desc: "撰寫／瀏覽評論", 
      url: "/ratings" // 使用相對路徑，指向同一個域名的 /ratings 路徑
    },
  ];

  return (
    <main className={styles.warmMain}>
      <section className={styles.hero}>
        <div className={styles.title}>
          <span className={styles.emoji}>🍮</span>
          <h1>ICHEN-apps！</h1>
        </div>
        <p className={styles.subtitle}>選擇一個子系統進入，For我最愛的鍾小蓁。☕</p>
      </section>

      <section className={styles.grid}>
        {apps.map((a) => (
          <a key={a.name} href={a.url} className={styles.card}>
            <div className={styles.cardText}>
              <div className={styles.cardTitle}>{a.name}</div>
              <div className={styles.cardDesc}>{a.desc}</div>
            </div>
            <span className={styles.cardCta}>前往 →</span>
          </a>
        ))}
      </section>

      <footer className={styles.foot}>
        <span>© {new Date().getFullYear()} ICHEN-app</span>
      </footer>
    </main>
  );
}
