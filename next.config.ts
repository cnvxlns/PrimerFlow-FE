import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // ... 기타 설정들 ...

    async rewrites() {
        return [
            {
                // 1. 프론트엔드 코드에서 보내는 주소 (건드리지 않음)
                source: "/api/v1/primer/design",

                // 2. 실제 백엔드가 기다리는 주소 (Swagger에서 본 그 주소!)
                destination: "http://127.0.0.1:8000/design",
            },
        ];
    },
};

export default nextConfig;
