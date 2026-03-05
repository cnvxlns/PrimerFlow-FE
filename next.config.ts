import type { NextConfig } from "next";

const LOCAL_BACKEND_URL = "http://127.0.0.1:8000";
const backendUrl = LOCAL_BACKEND_URL.replace(/\/+$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
