import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { SEO_LANDING_PAGES } from '@/lib/seoLandingPages'
import { articles } from '@/data/articles'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product.findMany({
    where: { publish_status: { not: 'DRAFT' } },
    select: { sku: true, updatedAt: true }
  })

  // "erkek parfüm", "yaz parfümü" gibi hedeflenen anahtar kelime sayfaları — her biri
  // src/lib/seoLandingPages.ts'te tanımlı, temiz bir URL'de (/[keyword]/page.tsx).
  const keywordUrls = SEO_LANDING_PAGES.map((p) => ({
    url: `https://pnparfume.com/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  const productUrls = products.map((p: any) => ({
    url: `https://pnparfume.com/urun/${p.sku}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // "Koku Rehberi" (/kesfet) blog makaleleri — src/data/articles.ts'te tanımlı,
  // generateStaticParams ile statik üretiliyor ama sitemap'te hiç yer almıyordu.
  const articleUrls = articles.map((a) => ({
    url: `https://pnparfume.com/kesfet/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const staticRoutes = [
    '',
    '/katalog',
    '/kesfet',
    '/koleksiyonlar/kolonya-ve-kitler',
    '/kurumsal/girisimcilere-ozel',
    '/kurumsal/iletisim',
    '/kurumsal/kurumsal-kimlik',
    '/mix',
    '/mix/b2b',
    '/mix/discovery-set',
    '/mix/engine',
    '/profil',
    '/quiz'
  ].map((route) => ({
    url: `https://pnparfume.com${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/katalog' ? 'daily' as const : 'weekly' as const,
    priority: route === '' ? 1 : route === '/katalog' ? 0.9 : 0.7,
  }))

  return [...staticRoutes, ...keywordUrls, ...articleUrls, ...productUrls]
}
