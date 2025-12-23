// apps/restaurant-ratings/src/app/error-handler.ts
// 全局错误处理器，用于捕获和静默 Supabase refresh token 错误

// 只在服务器端设置错误处理器
if (typeof process !== 'undefined') {
  // 辅助函数：检查是否是认证相关错误
  function isAuthError(error: any): boolean {
    if (!error) return false;
    
    try {
      const errorMessage = String(error?.message || '').toLowerCase();
      const errorCode = String(error?.code || '').toLowerCase();
      const errorName = String(error?.name || '').toLowerCase();
      const constructorName = String(error?.constructor?.name || '').toLowerCase();
      const errorStatus = error?.status;
      
      return (
        errorCode === 'refresh_token_not_found' ||
        errorCode.includes('refresh_token') ||
        errorMessage.includes('refresh token') ||
        errorMessage.includes('refresh_token_not_found') ||
        errorMessage.includes('invalid refresh token') ||
        errorName === 'authapierror' ||
        constructorName === 'authapierror' ||
        error?.__isAuthError === true ||
        (errorStatus === 400 && error?.__isAuthError) ||
        errorStatus === 401
      );
    } catch {
      return false;
    }
  }

  // 拦截所有 console 方法来静默认证错误
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  
  console.error = (...args: any[]) => {
    // 检查所有参数
    for (const arg of args) {
      if (isAuthError(arg)) {
        // 静默处理认证错误，不输出
        return;
      }
      
      const errorMessage = String(arg || '').toLowerCase();
      if (
        errorMessage.includes('refresh token') ||
        errorMessage.includes('refresh_token') ||
        errorMessage.includes('authapierror') ||
        errorMessage.includes('invalid refresh token')
      ) {
        // 静默处理
        return;
      }
    }
    
    // 其他错误正常输出
    originalConsoleError.apply(console, args);
  };

  console.warn = (...args: any[]) => {
    // 检查所有参数
    for (const arg of args) {
      if (isAuthError(arg)) {
        // 静默处理认证错误，不输出
        return;
      }
      
      const errorMessage = String(arg || '').toLowerCase();
      if (
        errorMessage.includes('refresh token') ||
        errorMessage.includes('refresh_token') ||
        errorMessage.includes('authapierror')
      ) {
        // 静默处理
        return;
      }
    }
    
    // 其他警告正常输出
    originalConsoleWarn.apply(console, args);
  };

  // 捕获未处理的 Promise 拒绝
  const originalHandler = process.listeners('unhandledRejection');
  process.removeAllListeners('unhandledRejection');
  
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    // 如果是 refresh token 错误，静默处理
    if (isAuthError(reason)) {
      // 静默处理，不输出错误
      return;
    }
    
    // 调用原有的错误处理器
    originalHandler.forEach((handler: any) => {
      try {
        handler(reason, promise);
      } catch {
        // 忽略处理器错误
      }
    });
  });

  // 捕获未处理的异常
  const originalExceptionHandler = process.listeners('uncaughtException');
  process.removeAllListeners('uncaughtException');
  
  process.on('uncaughtException', (error: Error) => {
    // 如果是 refresh token 错误，静默处理
    if (isAuthError(error)) {
      // 静默处理，不输出错误
      return;
    }
    
    // 调用原有的异常处理器
    originalExceptionHandler.forEach((handler: any) => {
      try {
        handler(error);
      } catch {
        // 忽略处理器错误
      }
    });
  });
}

