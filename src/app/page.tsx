import { prisma } from '@/lib/prisma'
import HomeHero from '@/components/home/HomeHero'
import HomeHighlights from '@/components/home/HomeHighlights'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import MobileFilterSort from '@/components/catalog/MobileFilterSort'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const sort = typeof params.sort === 'string' ? params.sort : 'best_sellers'
  // Fetch a larger pool of products to ensure we can filter out those without images
  const allProducts = await prisma.product.findMany({
    take: 50,
    where: {
      publish_status: {
        not: 'DRAFT'
      }
    },
    orderBy: { sku: 'asc' },
    include: { marketplaceListings: true }
  })

  let processedProducts = allProducts.map((product) => {
    const trendyolListing = product.marketplaceListings?.find(l => l.platform === 'trendyol')
    const trendyolImage = trendyolListing?.images?.[0] || null
    
    return {
      ...product,
      trendyolListing,
      finalImageUrl: trendyolImage
    }
  }).filter(product => product.finalImageUrl)

  if (sort === 'price_asc') {
    processedProducts.sort((a, b) => (a.trendyolListing?.price || a.base_cost) - (b.trendyolListing?.price || b.base_cost))
  } else if (sort === 'newest') {
    processedProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
  
  const productsWithImages = processedProducts.slice(0, 12) // Only keep those with images, up to 12

  return (
    <div className="flex flex-col min-h-screen">
      
      <HomeHero />

      {/* PayTR Test Section */}
      <section className="pt-8 px-4 md:px-12 max-w-7xl mx-auto w-full">
        <div className="bg-accent-gold/10 border border-accent-gold/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-medium text-accent-gold mb-2">PayTR Sanal POS Testi</h2>
            <p className="text-sm text-foreground/70">Ödeme altyapısını test etmek için 1 TL'lik deneme ürününü sepetinize ekleyin. (Kargo ücretsizdir)</p>
          </div>
          <Link href="/urun/PAYTR" className="bg-accent-gold text-background px-6 py-3 rounded-xl font-medium hover:bg-accent-gold/90 transition-colors whitespace-nowrap">
            1 TL Test Ürününü İncele
          </Link>
        </div>
      </section>

      {/* Featured Perfume Collection */}
      <section className="pt-8 pb-20 px-4 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-4 md:mb-12">
          <div>
            <h2 className="text-lg md:text-4xl font-medium md:font-light mb-2 md:mb-4">Çok Satanlar</h2>
            <p className="text-foreground/60 max-w-xl hidden md:block">
              Müşterilerimiz tarafından beğenilen, teninizle en iyi uyumu yakalayacak özel harmanlar.
            </p>
          </div>
          <Link href="/katalog" className="text-[11px] md:text-sm font-medium hover:text-accent-rose transition-colors pb-2 md:pb-0 underline underline-offset-4">
            Tüm Ürünler &rarr;
          </Link>
        </div>

        <MobileFilterSort />
        
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6">
          {productsWithImages.map(product => (
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

        <div className="mt-12 text-center md:hidden">
           <Link href="/katalog" className="inline-block border border-foreground text-foreground px-8 py-3 rounded-full text-sm font-medium hover:bg-foreground hover:text-background transition-colors">
             Tümünü Gör
           </Link>
        </div>
      </section>

      <HomeHighlights />

    </div>
  )
}
