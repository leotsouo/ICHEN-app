// apps/home/src/app/page.tsx
import styles from "./page.module.css";

export default function Home() {
  const apps = [
    { name: "餐廳評分系統", desc: "撰寫／瀏覽評論", url: "http://localhost:3001" },
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
