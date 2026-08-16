import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import FilterSidebar from '@/components/catalog/FilterSidebar'

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

  const whereClause: any = {
    publish_status: {
      not: 'DRAFT'
    }
  }

  if (season) whereClause.season_tag = season
  if (occasion) whereClause.occasion_tag = occasion
  if (gender) whereClause.gender = gender
  if (persona) whereClause.persona_tag = persona
  if (family) whereClause.fragrance_family = { has: family }

  const allProducts = await prisma.product.findMany({
    where: whereClause,
    orderBy: { sku: 'asc' },
    include: { marketplaceListings: true }
  })

  // Prepare images and filter out those without images
  const aiImages = [
    '/images/products/perfume_rose_vanilla_1786862022661.jpg',
    '/images/products/perfume_jasmine_sandalwood_1786862034617.jpg',
    '/images/products/perfume_citrus_bergamot_1786862045892.jpg',
    '/images/products/perfume_oud_amber_1786862058224.jpg',
    '/images/products/perfume_lavender_musk_1786862068668.jpg'
  ]

  const products = allProducts.map((product, index) => {
    const trendyolListing = product.marketplaceListings?.find(l => l.platform === 'trendyol')
    const trendyolImage = trendyolListing?.images?.[0] || null
    // Fallback images for the first 5 products to make the demo look good, others use real images if available
    const finalImageUrl = index < aiImages.length ? aiImages[index] : trendyolImage
    
    return {
      ...product,
      trendyolListing,
      finalImageUrl
    }
  }).filter(product => product.finalImageUrl)

  return (
    <div className="min-h-screen px-6 py-12 md:px-12 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-light mb-4">Tüm Parfümler</h1>
        <p className="text-foreground/60 max-w-2xl">
          yapay zeka analiz algoritmamızla analiz edilmiş, teninize en uygun koku profilini bulabileceğiniz koleksiyonumuz.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 pb-6">
            <FilterSidebar />
          </div>
        </aside>

        <main className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <span className="text-sm text-foreground/50">{products.length} ürün bulundu</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
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
        </main>
      </div>
    </div>
  )
}
