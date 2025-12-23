// apps/restaurant-ratings/src/components/ratings/AuthForm.tsx
"use client";

import { useState, FormEvent } from "react";
import styles from "@/app/page.module.css";

type AuthMode = "magic-link" | "password" | "register";

interface AuthFormProps {
  defaultMode?: AuthMode;
}

export function AuthForm({ defaultMode = "magic-link" }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setErrors((prev) => ({ ...prev, email: "請輸入 Email" }));
      return false;
    }
    if (!emailRegex.test(email.trim())) {
      setErrors((prev) => ({ ...prev, email: "Email 格式不正確" }));
      return false;
    }
    setErrors((prev => ({ ...prev, email: undefined })));
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (mode === "magic-link") return true;
    
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "請輸入密碼" }));
      return false;
    }
    if (password.length < 8) {
      setErrors((prev) => ({ ...prev, password: "密碼至少需要 8 個字元" }));
      return false;
    }
    if (!/[a-zA-Z]/.test(password)) {
      setErrors((prev) => ({ ...prev, password: "密碼必須包含至少一個字母" }));
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setErrors((prev) => ({ ...prev, password: "密碼必須包含至少一個數字" }));
      return false;
    }
    setErrors((prev => ({ ...prev, password: undefined })));
    return true;
  };

  const validateConfirmPassword = (confirmPassword: string): boolean => {
    if (mode !== "register") return true;
    
    if (!confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "請確認密碼" }));
      return false;
    }
    if (confirmPassword !== password) {
      setErrors((prev) => ({ ...prev, confirmPassword: "密碼不一致" }));
      return false;
    }
    setErrors((prev => ({ ...prev, confirmPassword: undefined })));
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // 驗證
    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);
    const confirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!emailValid || !passwordValid || !confirmPasswordValid) {
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email.trim());
      formData.append("mode", mode);
      
      if (mode !== "magic-link") {
        formData.append("password", password);
      }

      const action = mode === "register" 
        ? "/auth/register" 
        : "/auth/login";
      
      const response = await fetch(action, {
        method: "POST",
        body: formData,
      });

      if (response.redirected) {
        window.location.href = response.url;
      } else {
        const data = await response.json();
        if (data.error) {
          setErrors({ email: data.error });
        }
        setIsLoading(false);
      }
    } catch (error) {
      setErrors({ email: "發生錯誤，請稍後再試" });
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.authSection}>
      <div className={styles.authTabs}>
        <button
          type="button"
          className={`${styles.authTab} ${mode === "magic-link" ? styles.authTabActive : ""}`}
          onClick={() => {
            setMode("magic-link");
            setPassword("");
            setConfirmPassword("");
            setErrors({});
          }}
        >
          Magic Link
        </button>
        <button
          type="button"
          className={`${styles.authTab} ${mode === "password" ? styles.authTabActive : ""}`}
          onClick={() => {
            setMode("password");
            setConfirmPassword("");
            setErrors({});
          }}
        >
          密碼登入
        </button>
        <button
          type="button"
          className={`${styles.authTab} ${mode === "register" ? styles.authTabActive : ""}`}
          onClick={() => {
            setMode("register");
            setErrors({});
          }}
        >
          註冊
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.authForm}>
        <div className={styles.authField}>
          <label htmlFor="email" className={styles.authLabel}>
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) validateEmail(e.target.value);
            }}
            onBlur={() => validateEmail(email)}
            required
            autoComplete="email"
            placeholder="your@email.com"
            className={`${styles.authInput} ${errors.email ? styles.authInputError : ""}`}
            disabled={isLoading}
          />
          {errors.email && (
            <span className={styles.authError}>{errors.email}</span>
          )}
        </div>

        {mode !== "magic-link" && (
          <div className={styles.authField}>
            <label htmlFor="password" className={styles.authLabel}>
              密碼
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) validatePassword(e.target.value);
              }}
              onBlur={() => validatePassword(password)}
              required
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              placeholder={mode === "register" ? "至少 8 個字元，包含字母和數字" : "輸入密碼"}
              className={`${styles.authInput} ${errors.password ? styles.authInputError : ""}`}
              disabled={isLoading}
            />
            {errors.password && (
              <span className={styles.authError}>{errors.password}</span>
            )}
          </div>
        )}

        {mode === "register" && (
          <div className={styles.authField}>
            <label htmlFor="confirmPassword" className={styles.authLabel}>
              確認密碼
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) validateConfirmPassword(e.target.value);
              }}
              onBlur={() => validateConfirmPassword(confirmPassword)}
              required
              autoComplete="new-password"
              placeholder="再次輸入密碼"
              className={`${styles.authInput} ${errors.confirmPassword ? styles.authInputError : ""}`}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <span className={styles.authError}>{errors.confirmPassword}</span>
            )}
          </div>
        )}

        <button
          type="submit"
          className={styles.authSubmitButton}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className={styles.authLoading}>處理中...</span>
          ) : mode === "register" ? (
            "註冊"
          ) : mode === "password" ? (
            "登入"
          ) : (
            "寄送 Magic Link"
          )}
        </button>
      </form>

      {mode === "magic-link" && (
        <p className={styles.authHint}>
          我們採用無密碼登入（Magic Link）。輸入 Email 後，前往信箱點擊連結即可完成登入。
        </p>
      )}
      {mode === "password" && (
        <p className={styles.authHint}>
          使用密碼登入。如果忘記密碼，請使用 Magic Link 方式登入。
        </p>
      )}
      {mode === "register" && (
        <p className={styles.authHint}>
          註冊後會收到驗證郵件，請點擊連結完成驗證。密碼需至少 8 個字元，包含字母和數字。
        </p>
      )}
    </section>
  );
}

