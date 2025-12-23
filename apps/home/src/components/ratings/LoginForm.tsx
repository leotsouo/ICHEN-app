// apps/restaurant-ratings/src/components/ratings/LoginForm.tsx
import styles from "@/app/ratings/page.module.css";

export function LoginForm() {
  return (
    <section className={styles.loginSection}>
      <form action="/auth/login" method="POST" className={styles.loginForm}>
        <input
          type="email"
          name="email"
          required
          placeholder="輸入 Email 以接收登入連結（Magic Link）"
          autoComplete="email"
          className={styles.loginInput}
        />
        <button type="submit" className={styles.loginButton}>
          寄送登入連結
        </button>
      </form>
    </section>
  );
}

