import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: { root: "/" },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.witchlyapp.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
