import type { NextConfig } from "next";

const DEFAULT_LOCAL_BACKEND_URL = "http://127.0.0.1:8000";
const configuredBackendUrl = process.env.BACKEND_URL?.trim();

if (!configuredBackendUrl && process.env.NODE_ENV === "production") {
  throw new Error(
    "BACKEND_URL must be set in production. Set BACKEND_URL to your backend origin.",
  );
}

const backendUrl = (configuredBackendUrl || DEFAULT_LOCAL_BACKEND_URL).replace(
  /\/+$/,
  "",
);

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
