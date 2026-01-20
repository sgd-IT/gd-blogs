import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 启用 standalone 模式，减少部署文件大小
  output: "standalone",
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8124";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
