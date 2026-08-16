import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/hesap/', '/api/', '/_next/'],
    },
    sitemap: 'https://pnparfume.com/sitemap.xml',
  }
}
