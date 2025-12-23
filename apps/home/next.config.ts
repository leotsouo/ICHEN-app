import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 轉譯 workspace 包以確保正確解析
  transpilePackages: [
    "@ichen-app/shared-ratings",
    "@ichen-app/shared-supabase",
  ],
  // 性能優化
  compress: true,
  poweredByHeader: false,
  // 優化圖片處理
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // 實驗性功能優化
  experimental: {
    optimizePackageImports: [
      "@react-google-maps/api",
      "@supabase/supabase-js",
    ],
  },
};

export default nextConfig;
