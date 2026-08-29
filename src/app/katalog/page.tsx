import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import FilterSidebar from '@/components/catalog/FilterSidebar'
import MobileFilterSort from '@/components/catalog/MobileFilterSort'
import Pagination from '@/components/catalog/Pagination'

// SEO: aktif filtreye göre başlık/açıklama üretiyoruz — önceden ?gender=Erkek olsun
// olmasın katalog hep aynı "Tüm Parfümler" başlığını taşıyordu.
export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const gender = typeof sp.gender === 'string' ? sp.gender : undefined
  const family = typeof sp.family === 'string' ? sp.family : undefined

  if (!gender && !family) {
    return {
      title: 'Tüm Parfümler | Erkek, Kadın ve Unisex Koleksiyon | PN Parfüm',
      description: 'Yapay zeka destekli koku analiziyle sana en uygun parfümü bul. Erkek, kadın ve unisex parfüm koleksiyonunun tamamı tek sayfada.'
    }
  }
  const parts = [family, gender].filter(Boolean).join(' ')
  return {
    title: `${parts} Parfüm Koleksiyonu | Filtrelenmiş Katalog | PN Parfüm`,
    description: `${parts} parfüm seçeneklerini incele, teninize uygun olanı filtrele. PN Parfüm koleksiyonundan ${parts.toLowerCase()} kokular.`
  }
}

export default async function KatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams

  const season = typeof params.season === 'string' ? params.season : undefined
  const occasion = typeof params.occasion === 'string' ? params.occasion : undefined
  const gender = typeof params.gender === 'string' ? params.gender : undefined
  const persona = typeof params.persona === 'string' ? params.persona : undefined
  const family = typeof params.family === 'string' ? params.family : undefined
  const pageParam = typeof params.page === 'string' ? parseInt(params.page, 10) : 1
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam

  const whereClause: any = {
    publish_status: {
      not: 'DRAFT'
    }
  }

  if (season) whereClause.season_tag = season
  if (occasion) whereClause.occasion_tag = occasion
  if (gender) {
    if (gender === 'Unisex') {
      whereClause.gender = { in: ['Unisex', 'UNISEX', 'unisex'] }
    } else {
      whereClause.gender = gender
    }
  }
  if (persona) whereClause.persona_tag = persona
  if (family) whereClause.fragrance_family = { has: family }

  const sort = typeof params.sort === 'string' ? params.sort : 'best_sellers'

  const allProducts = await prisma.product.findMany({
    where: whereClause,
    orderBy: { sku: 'asc' },
    include: { marketplaceListings: true }
  })

  let processedProducts = allProducts.map((product: any) => {
    const trendyolListing = product.marketplaceListings?.find((l: any) => l.platform === 'trendyol')
    // Gerçek fotoğrafı olmayan ürünlerde artık rastgele/alakasız bir görsel (eski
    // "kasap" placeholder seti) gösterilmiyor — imageUrl boş kalır, ProductCard
    // bu durumda kendi zarif "fotoğraf yok" görünümünü (SKU çerçevesi) gösterir.
    // Katalogda ürünü tamamen gizlemiyoruz (best-sellers vitrininden farklı olarak),
    // çünkü müşteri hâlâ inceleyip satın alabilmeli.
    return {
      ...product,
      trendyolListing,
      finalImageUrl: trendyolListing?.images?.[0] || null
    }
  })

  if (sort === 'price_asc') {
    processedProducts.sort((a: any, b: any) => (a.trendyolListing?.price || a.base_cost) - (b.trendyolListing?.price || b.base_cost))
  } else if (sort === 'newest') {
    processedProducts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const products = processedProducts
  const ITEMS_PER_PAGE = 24
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE)
  const paginatedProducts = products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen px-6 py-12 md:px-12 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-light mb-4">Tüm Parfümler</h1>
        <p className="text-foreground/60 max-w-2xl">
          yapay zeka analiz algoritmamızla analiz edilmiş, teninize en uygun koku profilini bulabileceğiniz koleksiyonumuz.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <MobileFilterSort />
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 pb-6">
            <FilterSidebar />
          </div>
        </aside>

        <main className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <span className="text-sm text-foreground/50">{products.length} ürün bulundu</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map(product => (
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

          {products.length === 0 && (
            <div className="text-center py-20 bg-foreground/[0.02] rounded-2xl border border-foreground/5">
              <h3 className="text-lg font-medium mb-2">Ürün Bulunamadı</h3>
              <p className="text-foreground/50">Seçtiğiniz filtrelere uygun parfüm bulunmuyor. Lütfen filtreleri esnetmeyi deneyin.</p>
            </div>
          )}

          {products.length > 0 && (
            <Pagination totalPages={totalPages} currentPage={currentPage} />
          )}
        </main>
      </div>
    </div>
  )
}
