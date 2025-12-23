import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isProd = process.env.NODE_ENV === "production";

if (!url || !key) {
  throw new Error(
    "Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
}

// TypeScript 类型断言：经过上面的检查，url 和 key 一定是 string
const supabaseUrl: string = url;
const supabaseKey: string = key;

/**
 * Server-side Supabase client for RSC (read-only)
 * 自动处理无效的 refresh token 错误
 */
export async function supabaseServer() {
  const store = await cookies();
  
  // 创建一个包装的 cookie getter，用于安全地处理 cookie
  // 如果检测到可能的 refresh token 问题，返回 undefined 以防止自动刷新
  const cookieStore = {
    get(name: string) {
      try {
        return store.get(name)?.value;
      } catch {
        // 如果读取 cookie 时出错，返回 undefined
        return undefined;
      }
    },
    // RSC doesn't allow cookie modification
    set() {},
    remove() {},
  };
  
  // 使用 try-catch 包装客户端创建，捕获任何初始化错误
  let client;
  try {
    client = createServerClient(supabaseUrl, supabaseKey, {
      db: { schema: "public" }, // 明確指定使用 public schema
      cookies: cookieStore,
      cookieOptions: {
        sameSite: "lax",
        secure: isProd,
        path: "/",
      },
    });
  } catch (error: any) {
    // 如果创建客户端失败（可能是 refresh token 问题），创建一个干净的客户端
    const cleanCookieStore = {
      get() { return undefined; },
      set() {},
      remove() {},
    };
    client = createServerClient(supabaseUrl, supabaseKey, {
      db: { schema: "public" }, // 明確指定使用 public schema
      cookies: cleanCookieStore,
      cookieOptions: {
        sameSite: "lax",
        secure: isProd,
        path: "/",
      },
    });
  }
  
  // 辅助函数：检查是否是认证相关错误
  function isAuthError(error: any): boolean {
    if (!error) return false;
    
    try {
      const errorMessage = String(error?.message || '').toLowerCase();
      const errorCode = String(error?.code || '').toLowerCase();
      const errorName = String(error?.name || '').toLowerCase();
      const errorType = String(error?.type || '').toLowerCase();
      const errorStatus = error?.status;
      const constructorName = String(error?.constructor?.name || '').toLowerCase();
      
      // 检查各种可能的认证错误标识
      return (
        // 错误代码检查
        errorCode.includes('refresh_token') ||
        errorCode === 'refresh_token_not_found' ||
        errorCode.includes('token') ||
        // 错误消息检查
        errorMessage.includes('refresh token') ||
        errorMessage.includes('refresh_token') ||
        errorMessage.includes('invalid refresh token') ||
        errorMessage.includes('token not found') ||
        errorMessage.includes('token expired') ||
        // 错误名称检查
        errorName === 'authapierror' ||
        errorName === 'auth error' ||
        // 错误类型检查
        errorType === 'auth' ||
        // 其他标识
        error?.__isAuthError === true ||
        // HTTP 状态码检查
        errorStatus === 400 ||
        errorStatus === 401 ||
        // 检查错误构造函数名称（用于捕获 AuthApiError）
        constructorName === 'authapierror' ||
        constructorName.includes('auth')
      );
    } catch {
      // 如果检查过程中出错，保守地视为认证错误
      return true;
    }
  }

  // 拦截无效的 refresh token 错误
  // 包装 getUser 方法以静默处理所有认证相关错误
  const originalGetUser = client.auth.getUser.bind(client.auth);
  client.auth.getUser = async (jwt?: string) => {
    // 使用 Promise.resolve 确保捕获所有可能的错误
    return Promise.resolve(originalGetUser(jwt))
      .then((result) => {
        // 检查返回的错误（Supabase 可能返回错误而不是抛出异常）
        if (result?.error) {
          const error = result.error as any;
          if (isAuthError(error)) {
            // 静默处理，返回未登入状态（使用 unknown 中转类型断言）
            return { data: { user: null }, error: null } as unknown as Awaited<ReturnType<typeof originalGetUser>>;
          }
        }
        return result;
      })
      .catch((error: any) => {
        // 捕获所有可能的错误（包括在 HTTP 请求层面抛出的错误）
        if (isAuthError(error)) {
          // 静默处理所有认证错误，返回未登入状态（使用 unknown 中转类型断言）
          return { data: { user: null }, error: null } as unknown as Awaited<ReturnType<typeof originalGetUser>>;
        }
        
        // 其他非认证错误正常抛出
        throw error;
      });
  };
  
  return client;
}

/**
 * Server-side Supabase client for Route Handlers (can write cookies)
 */
export async function supabaseRoute(res?: NextResponse) {
  const response = res ?? NextResponse.next();
  const store = await cookies();

  const cookieOpts: CookieOptions = {
    sameSite: "lax",
    secure: isProd,
    path: "/",
  };

  const client = createServerClient(supabaseUrl, supabaseKey, {
    db: { schema: "public" }, // 明確指定使用 public schema
    cookies: {
      get(name: string) {
        return store.get(name)?.value;
      },
      set(name: string, value: string, options?: CookieOptions) {
        response.cookies.set(name, value, { ...cookieOpts, ...options });
      },
      remove(name: string, options?: CookieOptions) {
        response.cookies.set(name, "", {
          ...cookieOpts,
          ...options,
          expires: new Date(0),
        });
      },
    },
    cookieOptions: cookieOpts,
  });

  return { supabase: client, response };
}

