import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 性能優化
  compress: true,
  poweredByHeader: false,
  // 優化圖片處理
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
