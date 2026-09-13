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
        hostname: 'cdn.dsmcdn.com',
      },
      {
        protocol: 'http',
        hostname: 'parfumtasarla.com',
      },
      {
        protocol: 'https',
        hostname: 'parfumtasarla.com',
      },
      {
        protocol: 'http',
        hostname: 'www.parfumtasarla.com',
      },
      {
        protocol: 'https',
        hostname: 'www.parfumtasarla.com',
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
    ignoreBuildErrors: false,
  },
  // Güvenlik: önceden hiç özel header yoktu, sadece Vercel'in otomatik HSTS'i
  // vardı. X-Frame-Options/frame-ancestors (clickjacking), X-Content-Type-Options
  // (MIME sniffing) ve Referrer-Policy risksiz eklenebilir. CSP'de script-src
  // 'unsafe-inline' bilinçli bir taviz: layout.tsx GTM'i ve JSON-LD'yi inline
  // <script> ile enjekte ediyor (nonce tabanlı bir CSP daha sıkı olurdu ama
  // middleware + next/script entegrasyonunda ayrı bir değişiklik gerektirir) —
  // yine de script KAYNAKLARINI (hangi domainlerden script yüklenebileceğini)
  // ve frame-ancestors'ı kısıtlıyor, hiç CSP olmamasından çok daha iyi.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.paytr.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https: http:",
              "font-src 'self' data:",
              "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com",
              "frame-src 'self' https://www.paytr.com",
              "frame-ancestors 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
};

export default nextConfig;
