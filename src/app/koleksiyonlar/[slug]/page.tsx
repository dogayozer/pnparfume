import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import FilterSidebar from '@/components/catalog/FilterSidebar'
import MobileFilterSort from '@/components/catalog/MobileFilterSort'
import Pagination from '@/components/catalog/Pagination'
import { COLLECTIONS, getCollection, collectionScope } from '@/lib/collections'

// /katalog ile aynı filtre menüsü, sıralama ve sayfalama; kapsam koleksiyonla sınırlıdır.
const getCachedProducts = unstable_cache(
  async (whereClause: any) => prisma.product.findMany({
    where: whereClause,
    orderBy: { sku: 'asc' },
    include: { marketplaceListings: true },
  }),
  ['koleksiyon-products-v2'],
  { revalidate: 3600, tags: ['katalog'] }
)

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const collection = getCollection(slug)
  if (!collection) return {}
  return {
    title: `${collection.name} Parfüm Koleksiyonu | Erkek, Kadın, Unisex | PN Parfüm`,
    description: collection.description,
    alternates: { canonical: `https://pnparfume.com/koleksiyonlar/${collection.slug}` },
    openGraph: {
      title: `${collection.name} Parfüm Koleksiyonu | PN Parfüm`,
      description: collection.description,
      url: `https://pnparfume.com/koleksiyonlar/${collection.slug}`,
      siteName: 'PN Parfüm',
      locale: 'tr_TR',
      type: 'website',
    },
  }
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params
  const collection = getCollection(slug)
  if (!collection) notFound()
  const sp = await searchParams
  const str = (k: string) => (typeof sp[k] === 'string' ? (sp[k] as string) : undefined)

  const season = str('season')
  const occasion = str('occasion')
  const gender = str('gender')
  const persona = str('persona')
  const family = str('family')
  const sort = str('sort') || 'best_sellers'
  const pageParam = parseInt(str('page') || '1', 10)
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam

  const whereClause: any = { publish_status: { not: 'DRAFT' }, ...collectionScope(collection) }
  if (season) whereClause.season_tag = season
  if (occasion) whereClause.occasion_tag = occasion
  if (gender) whereClause.gender = gender === 'Unisex' ? { in: ['Unisex', 'UNISEX', 'unisex'] } : gender
  if (persona) whereClause.persona_tag = persona
  if (family) whereClause.fragrance_family = { has: family }

  const allProducts = await getCachedProducts(whereClause)
  const products = allProducts.map((p: any) => {
    const listing = p.marketplaceListings?.find((l: any) => l.platform === 'trendyol')
    return { ...p, listing, imageUrl: listing?.images?.[0] || null }
  })
  if (sort === 'price_asc') {
    products.sort((a: any, b: any) => (a.listing?.price || a.base_cost) - (b.listing?.price || b.base_cost))
  } else if (sort === 'newest') {
    products.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const ITEMS_PER_PAGE = 24
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE)
  const pageItems = products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const pageUrl = `https://pnparfume.com/koleksiyonlar/${collection.slug}`
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${collection.name} Parfüm Koleksiyonu`,
      description: collection.description,
      url: pageUrl,
      inLanguage: 'tr',
      isPartOf: { '@type': 'WebSite', name: 'PN Parfüm', url: 'https://pnparfume.com' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://pnparfume.com' },
        { '@type': 'ListItem', position: 2, name: 'Parfümler', item: 'https://pnparfume.com/katalog' },
        { '@type': 'ListItem', position: 3, name: collection.name, item: pageUrl },
      ],
    },
    // Filtresiz ilk sayfadaki ürünler (yapay zekâ ve arama motorları için ürün listesi)
    ...(currentPage === 1 && !season && !occasion && !gender && !persona && !family
      ? [{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          numberOfItems: products.length,
          itemListElement: pageItems.map((p: any, i: number) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `https://pnparfume.com/urun/${encodeURIComponent(p.sku)}`,
            name: p.seo_name || p.sku,
          })),
        }]
      : []),
  ]

  return (
    <div className="min-h-screen px-6 py-12 md:px-12 max-w-7xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mb-12">
        <span className="text-accent-gold text-xs font-medium uppercase tracking-[0.3em] block mb-4">Koleksiyon</span>
        <h1 className="text-4xl md:text-5xl font-light mb-4">{collection.name}</h1>
        <p className="text-foreground/60 max-w-2xl">{collection.description}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <MobileFilterSort />
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto pr-2 pb-6">
            <FilterSidebar />
          </div>
        </aside>

        <main className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <span className="text-sm text-foreground/50">{products.length} ürün bulundu</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pageItems.map((product: any) => (
              <ProductCard
                key={product.sku}
                product={{
                  sku: product.sku,
                  families: product.fragrance_family,
                  gender: product.gender,
                  price: product.listing?.price || product.base_cost,
                  originalPrice: product.listing?.marketPrice,
                  longevity: String(product.longevity_score),
                  imageUrl: product.imageUrl,
                  seoName: product.seo_name,
                  publishStatus: product.publish_status,
                }}
              />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-20 bg-foreground/[0.02] rounded-2xl border border-foreground/5">
              <h3 className="text-lg font-medium mb-2">Ürün Bulunamadı</h3>
              <p className="text-foreground/50">Seçtiğiniz filtrelere uygun parfüm bulunmuyor. Lütfen filtreleri esnetmeyi deneyin.</p>
            </div>
          )}

          {products.length > 0 && <Pagination totalPages={totalPages} currentPage={currentPage} />}
        </main>
      </div>
    </div>
  )
}
