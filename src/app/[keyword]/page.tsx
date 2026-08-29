import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import Pagination from '@/components/catalog/Pagination'
import { getSeoLandingPage, SEO_LANDING_PAGES } from '@/lib/seoLandingPages'
import type { Metadata } from 'next'

// Bu, /erkek-parfum, /kis-parfumu gibi temiz SEO URL'lerini karşılayan tek, genel
// route. Next.js'te aynı seviyedeki sabit route'lar (katalog, admin, hesap, vb.)
// bu dinamik [keyword] segmentinden HER ZAMAN önce eşleşir, yani mevcut sayfalarla
// çakışma riski yok — sadece seoLandingPages.ts'te tanımlı bilinmeyen bir slug için
// devreye girer, tanımsız bir slug'da ise normal 404 döner.

export const revalidate = 3600 // 1 saat — ürün fiyat/stok değişimlerini makul sürede yansıtır

export async function generateStaticParams() {
  return SEO_LANDING_PAGES.map(p => ({ keyword: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ keyword: string }> }): Promise<Metadata> {
  const { keyword } = await params
  const page = getSeoLandingPage(keyword)
  if (!page) return {}

  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical: `https://pnparfume.com/${page.slug}` },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url: `https://pnparfume.com/${page.slug}`,
      siteName: 'PN Parfüm',
      locale: 'tr_TR',
      type: 'website'
    }
  }
}

export default async function SeoKeywordPage({
  params,
  searchParams
}: {
  params: Promise<{ keyword: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { keyword } = await params
  const page = getSeoLandingPage(keyword)
  if (!page) notFound()

  const sp = await searchParams
  const pageParam = typeof sp.page === 'string' ? parseInt(sp.page, 10) : 1
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam

  const { filters } = page
  const whereClause: any = { publish_status: { not: 'DRAFT' } }
  if (filters.gender) {
    whereClause.gender = filters.gender === 'Unisex' ? { in: ['Unisex', 'UNISEX', 'unisex'] } : filters.gender
  }
  if (filters.family) whereClause.fragrance_family = { has: filters.family }
  if (filters.occasion) whereClause.occasion_tag = filters.occasion
  if (filters.season) whereClause.season_tag = filters.season
  if (filters.persona) whereClause.persona_tag = filters.persona

  const allProducts = await prisma.product.findMany({
    where: whereClause,
    orderBy: { sku: 'asc' },
    include: { marketplaceListings: true }
  })

  let processed = allProducts.map((product: any) => {
    const trendyolListing = product.marketplaceListings?.find((l: any) => l.platform === 'trendyol')
    return {
      ...product,
      trendyolListing,
      finalImageUrl: trendyolListing?.images?.[0] || null
    }
  })

  // "İndirimli" — gerçek piyasa fiyatının (marketPrice) altında satılan ürünler.
  if (filters.discountOnly) {
    processed = processed.filter(p => p.trendyolListing?.marketPrice && p.trendyolListing.marketPrice > p.trendyolListing.price)
  }

  if (filters.sortBy === 'price_asc') {
    processed.sort((a: any, b: any) => (a.trendyolListing?.price || a.base_cost) - (b.trendyolListing?.price || b.base_cost))
  } else if (filters.sortBy === 'longevity_desc') {
    processed.sort((a: any, b: any) => (b.longevity_score || 0) - (a.longevity_score || 0))
  } else if (filters.sortBy === 'newest') {
    processed.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const ITEMS_PER_PAGE = 24
  const totalPages = Math.ceil(processed.length / ITEMS_PER_PAGE)
  const paginated = processed.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen px-6 py-12 md:px-12 max-w-7xl mx-auto">
      <div className="mb-12 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-light mb-4">{page.h1}</h1>
        <p className="text-foreground/60 leading-relaxed">{page.intro}</p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm text-foreground/50">{processed.length} ürün bulundu</span>
        <Link
          href={`/katalog${page.katalogQuery ? `?${page.katalogQuery}` : ''}`}
          className="text-xs md:text-sm font-medium hover:text-accent-rose transition-colors underline underline-offset-4"
        >
          Tüm Filtrelerle İncele &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginated.map(product => (
          <ProductCard
            key={product.sku}
            product={{
              sku: product.sku,
              families: product.fragrance_family,
              gender: product.gender,
              price: product.trendyolListing?.price || product.base_cost,
              longevity: String(product.longevity_score),
              imageUrl: product.finalImageUrl,
              seoName: product.seo_name,
              publishStatus: product.publish_status
            }}
          />
        ))}
      </div>

      {processed.length === 0 && (
        <div className="text-center py-20 bg-foreground/[0.02] rounded-2xl border border-foreground/5">
          <h3 className="text-lg font-medium mb-2">Şu an bu kritere uygun ürün yok</h3>
          <p className="text-foreground/50">
            <Link href="/katalog" className="underline underline-offset-4 hover:text-accent-rose">Tüm koleksiyonu</Link> inceleyebilirsiniz.
          </p>
        </div>
      )}

      {processed.length > 0 && (
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      )}
    </div>
  )
}
