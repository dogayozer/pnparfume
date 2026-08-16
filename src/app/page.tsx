import { prisma } from '@/lib/prisma'
import HomeHero from '@/components/home/HomeHero'
import HomeHighlights from '@/components/home/HomeHighlights'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

export default async function Home() {
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

  const productsWithImages = allProducts.map((product) => {
    const trendyolListing = product.marketplaceListings?.find(l => l.platform === 'trendyol')
    const trendyolImage = trendyolListing?.images?.[0] || null
    
    return {
      ...product,
      trendyolListing,
      finalImageUrl: trendyolImage
    }
  }).filter(product => product.finalImageUrl).slice(0, 12) // Only keep those with images, up to 12

  return (
    <div className="flex flex-col min-h-screen">
      
      <HomeHero />

      {/* Featured Perfume Collection */}
      <section className="pt-2 md:pt-8 pb-20 px-4 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-4 md:mb-12">
          <div>
            <h2 className="text-2xl md:text-4xl font-light mb-2 md:mb-4">Çok Satanlar</h2>
            <p className="text-foreground/60 max-w-xl hidden md:block">
              Müşterilerimiz tarafından beğenilen, teninizle en iyi uyumu yakalayacak özel harmanlar.
            </p>
          </div>
          <Link href="/katalog" className="hidden md:flex text-sm font-medium hover:text-accent-rose transition-colors animate-pulse">
            Tüm Koleksiyonu Gör &rarr;
          </Link>
        </div>

        {/* Mobile Filter and Sort Controls */}
        <div className="flex items-center gap-3 mb-6 md:hidden">
           <Link href="/katalog" className="flex-1 flex items-center justify-between border border-foreground/20 rounded px-4 py-2.5 text-[13px] font-bold bg-background">
              Filtrele
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
           </Link>
           <Link href="/katalog" className="flex-1 flex items-center justify-between border border-foreground/20 rounded px-4 py-2.5 text-[13px] font-bold bg-background">
              Çok Satanlar
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
           </Link>
        </div>
        
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
