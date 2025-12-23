// apps/restaurant-ratings/src/lib/auth/utils.ts
import { NextResponse } from "next/server";

/**
 * 認證相關的訊息類型
 */
export type AuthMessage =
  | "sent"
  | "registered"
  | "logged_in"
  | "logged_out"
  | "bad_email"
  | "bad_password"
  | "weak_password"
  | "email_exists"
  | "user_not_found"
  | "invalid_credentials"
  | "access_denied"
  | "error";

/**
 * 認證錯誤類型
 */
export type AuthError = {
  message: AuthMessage;
  error?: string;
  trace?: string;
};

/**
 * Email 驗證正則表達式
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 驗證 Email 格式
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

/**
 * 驗證密碼強度
 * - 至少 8 個字元
 * - 至少包含一個字母和一個數字
 */
export function isValidPassword(password: string): {
  valid: boolean;
  error?: string;
} {
  if (password.length < 8) {
    return { valid: false, error: "密碼至少需要 8 個字元" };
  }
  if (!/[a-zA-Z]/.test(password)) {
    return { valid: false, error: "密碼必須包含至少一個字母" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "密碼必須包含至少一個數字" };
  }
  return { valid: true };
}

/**
 * 遮罩 Email（用於日誌）
 * 例如：ab***@example.com
 */
export function maskEmail(email: string): string {
  return email.replace(/^(.{2}).*(@.*)$/, "$1***$2");
}

/**
 * 從 Supabase URL 提取專案引用
 */
export function getProjectRefFromUrl(url: string): string {
  try {
    const host = new URL(url).hostname; // xxx.supabase.co
    return host.split(".")[0];
  } catch {
    return "";
  }
}

/**
 * 創建帶有認證訊息的重定向 URL
 */
export function createAuthRedirectUrl(
  origin: string,
  message: AuthMessage,
  trace?: string,
  error?: string
): URL {
  const url = new URL("/", origin);
  url.searchParams.set("m", message);
  if (trace) {
    url.searchParams.set("t", trace);
  }
  if (error) {
    url.searchParams.set("error", encodeURIComponent(error));
  }
  return url;
}

/**
 * 創建認證重定向 Response
 */
export function createAuthRedirect(
  origin: string,
  message: AuthMessage,
  trace?: string,
  error?: string,
  status: number = 307
): NextResponse {
  const url = createAuthRedirectUrl(origin, message, trace, error);
  return NextResponse.redirect(url, { status });
}

/**
 * 從 URL 解析認證訊息
 */
export function parseAuthMessage(searchParams: URLSearchParams): {
  message?: AuthMessage;
  trace?: string;
  error?: string;
} {
  const message = searchParams.get("m") as AuthMessage | null;
  const trace = searchParams.get("t") || undefined;
  const error = searchParams.get("error") || undefined;

  return {
    message: message && isValidAuthMessage(message) ? message : undefined,
    trace,
    error: error ? decodeURIComponent(error) : undefined,
  };
}

/**
 * 驗證是否為有效的認證訊息類型
 */
function isValidAuthMessage(value: string): value is AuthMessage {
  return [
    "sent",
    "registered",
    "logged_in",
    "logged_out",
    "bad_email",
    "bad_password",
    "weak_password",
    "email_exists",
    "user_not_found",
    "invalid_credentials",
    "access_denied",
    "error",
  ].includes(value);
}

/**
 * 獲取認證訊息的顯示文字
 */
export function getAuthMessageText(
  message?: AuthMessage,
  error?: string
): { type: "info" | "warn" | "success"; text: string } | null {
  if (error) {
    return { type: "warn", text: error };
  }

  switch (message) {
    case "sent":
      return {
        type: "info",
        text: "已寄出登入連結，請到信箱點擊 Magic Link。",
      };
    case "registered":
      return {
        type: "success",
        text: "註冊成功！已寄出驗證郵件，請到信箱點擊連結完成驗證。",
      };
    case "logged_in":
      return { type: "success", text: "登入成功！" };
    case "logged_out":
      return { type: "info", text: "已登出。" };
    case "bad_email":
      return { type: "warn", text: "Email 格式不正確。" };
    case "bad_password":
      return { type: "warn", text: "密碼格式不正確。" };
    case "weak_password":
      return {
        type: "warn",
        text: "密碼強度不足，請使用至少 8 個字元，包含字母和數字。",
      };
    case "email_exists":
      return {
        type: "warn",
        text: "此 Email 已被註冊，請直接登入或使用忘記密碼功能。",
      };
    case "user_not_found":
      return {
        type: "warn",
        text: "找不到此帳號，請確認 Email 是否正確或先註冊。",
      };
    case "invalid_credentials":
      return {
        type: "warn",
        text: "Email 或密碼錯誤，請重新輸入。",
      };
    case "access_denied":
      return {
        type: "warn",
        text: "登入連結無效或已過期，請重新寄送一封新的。",
      };
    case "error":
      return { type: "warn", text: "發生錯誤，請稍後再試。" };
    default:
      return null;
  }
}

/**
 * 將 Supabase 錯誤轉換為 AuthMessage
 */
export function mapSupabaseError(error: any): AuthMessage {
  const message = error?.message?.toLowerCase() || "";

  if (message.includes("email") && message.includes("already")) {
    return "email_exists";
  }
  if (message.includes("password") && message.includes("weak")) {
    return "weak_password";
  }
  if (message.includes("invalid") && message.includes("credentials")) {
    return "invalid_credentials";
  }
  if (message.includes("user") && message.includes("not found")) {
    return "user_not_found";
  }
  if (message.includes("email")) {
    return "bad_email";
  }
  if (message.includes("password")) {
    return "bad_password";
  }

  return "error";
}
