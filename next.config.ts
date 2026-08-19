import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dsmcdn.com',
      },
      {
        protocol: 'http',
        hostname: 'kasaptanetyiyelim.com',
      },
      {
        protocol: 'https',
        hostname: 'kasaptanetyiyelim.com',
      },
      {
        protocol: 'http',
        hostname: 'www.kasaptanetyiyelim.com',
      },
      {
        protocol: 'https',
        hostname: 'www.kasaptanetyiyelim.com',
      }
    ],
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
