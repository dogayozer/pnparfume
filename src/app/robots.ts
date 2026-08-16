import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/hesap/', '/api/', '/_next/'],
    },
    sitemap: 'https://pienparfume.com.tr/sitemap.xml',
  }
}
