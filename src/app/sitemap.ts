import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { SEO_LANDING_PAGES } from '@/lib/seoLandingPages'
import { articles } from '@/data/articles'
import { COLLECTIONS } from '@/lib/collections'

const SITE = 'https://pnparfume.com'

// TR / EN / AR karşılıkları olan kurumsal-B2B sayfa grupları
const GROUPS: Record<string, { tr?: string; en: string; ar: string }> = {
  brands: { tr: '/kurumsal/markalarimiz', en: '/en/brands', ar: '/ar/brands' },
  distributor: { tr: '/kurumsal/distributorluk', en: '/en/distributor', ar: '/ar/distributor' },
  dealership: { tr: '/kurumsal/bayilik', en: '/en/dealership', ar: '/ar/dealership' },
  entrepreneurs: { tr: '/kurumsal/girisimcilere-ozel', en: '/en/entrepreneurs', ar: '/ar/entrepreneurs' },
  about: { tr: '/kurumsal/kurumsal-kimlik', en: '/en/about', ar: '/ar/about' },
  contact: { tr: '/kurumsal/iletisim', en: '/en/contact', ar: '/ar/contact' },
  privateLabel: { en: '/en/private-label', ar: '/ar/private-label' },
  wholesale: { en: '/en/wholesale', ar: '/ar/wholesale' },
}

const ALT_GROUPS: Record<string, Record<string, string>> = {}
const B2B_ROUTES = new Set<string>()
for (const g of Object.values(GROUPS)) {
  const languages: Record<string, string> = { en: SITE + g.en, ar: SITE + g.ar }
  if (g.tr) languages.tr = SITE + g.tr
  for (const path of [g.tr, g.en, g.ar]) {
    if (path) {
      ALT_GROUPS[path] = languages
      B2B_ROUTES.add(path)
    }
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product.findMany({
    where: { publish_status: { not: 'DRAFT' } },
    select: { sku: true, updatedAt: true, marketplaceListings: { where: { platform: 'trendyol' }, select: { images: true } } }
  })

  // "erkek parfüm", "yaz parfümü" gibi hedeflenen anahtar kelime sayfaları — her biri
  // src/lib/seoLandingPages.ts'te tanımlı, temiz bir URL'de (/[keyword]/page.tsx).
  const keywordUrls = SEO_LANDING_PAGES.map((p) => ({
    url: `https://pnparfume.com/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  // 🔴 KRİTİK: SKU'larda boşluk var ("M 17" gibi) — encodeURIComponent olmadan
  // sitemap'e ham boşlukla yazılıyordu (geçersiz XML/URL). Google Search Console
  // bu yüzden 300+ ürün URL'sini "geçersiz" diye reddediyor, hiç indekslemiyor
  // olabilir — muhtemelen "sitemiz bulunamıyor" şikayetinin ana sebeplerinden biri.
  // Görsel sitemap'i: sayfadaki ile aynı adresler (parfumtasarla.com görselleri sitenin kendi
  // /api/media-proxy yolundan sunulur; bkz. ProductCard.toSecureUrl). Google Görseller için.
  const toImageUrl = (u: string): string | null => {
    if (!u || u.includes('placehold.co')) return null
    if (u.startsWith('http://parfumtasarla.com') || u.startsWith('http://kasaptanetyiyelim.com')) {
      return `${SITE}/api/media-proxy?url=${encodeURIComponent(u)}`
    }
    if (u.startsWith('/')) return `${SITE}${u}`
    return /^https:\/\//.test(u) ? u : null
  }
  const productUrls = products.map((p: any) => {
    const images = (p.marketplaceListings?.[0]?.images ?? []).map(toImageUrl).filter((x: string | null): x is string => !!x)
    return {
      url: `https://pnparfume.com/urun/${encodeURIComponent(p.sku)}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      ...(images.length ? { images } : {}),
    }
  })

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
    ...COLLECTIONS.map((c) => `/koleksiyonlar/${c.slug}`),
    '/kurumsal/girisimcilere-ozel',
    '/kurumsal/iletisim',
    '/kurumsal/kurumsal-kimlik',
    '/kurumsal/markalarimiz',
    '/kurumsal/distributorluk',
    '/kurumsal/bayilik',
    '/kurumsal/bayilik/dijital',
    '/kendi-parfum-markani-yarat',
    '/mix/b2b',
    '/mix/discovery-set',
    '/profil',
    '/quiz',
    '/en/wholesale',
    '/en/private-label',
    '/en/brands',
    '/en/entrepreneurs',
    '/en/distributor',
    '/en/dealership',
    '/en/about',
    '/en/contact',
    '/ar/wholesale',
    '/ar/private-label',
    '/ar/brands',
    '/ar/entrepreneurs',
    '/ar/distributor',
    '/ar/dealership',
    '/ar/about',
    '/ar/contact',
    '/ar/gulf-market-strategy'
  ].map((route) => ({
    url: `https://pnparfume.com${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/katalog' || route.startsWith('/koleksiyonlar/') ? 'daily' as const : 'weekly' as const,
    priority: route === '' ? 1 : route === '/katalog' ? 0.9 : route.startsWith('/koleksiyonlar/') ? 0.85 : B2B_ROUTES.has(route) ? 0.8 : 0.7,
    // Aynı içeriğin TR/EN/AR karşılıkları: arama motorlarına dil eşleşmesi (hreflang)
    ...(ALT_GROUPS[route] ? { alternates: { languages: ALT_GROUPS[route] } } : {}),
  }))

  return [...staticRoutes, ...keywordUrls, ...articleUrls, ...productUrls]
}
