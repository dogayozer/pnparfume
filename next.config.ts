import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dsmcdn.com',
      }
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
