import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "pub-f31e5a1131f24fa3b0666977d969de05.r2.dev",
                port: "",
                pathname: "/**",
            },
        ],
    },
}

export default nextConfig
