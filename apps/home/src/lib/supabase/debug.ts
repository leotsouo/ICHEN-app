// apps/home/src/lib/supabase/debug.ts

/**
 * 簡單的追蹤工具，用於記錄認證相關的日誌
 */
export function mkTrace(prefix: string) {
  const id = `${prefix}#${Date.now()}`;
  
  return {
    id,
    log(message: string, data?: Record<string, any>) {
      if (process.env.NODE_ENV === "development") {
        console.log(`[${id}]`, message, data || "");
      }
    },
    err(message: string, error?: any) {
      if (process.env.NODE_ENV === "development") {
        console.error(`[${id}]`, message, error || "");
      }
    },
  };
}

