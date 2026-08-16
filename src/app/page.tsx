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

  // Prepare images and filter
  const aiImages = [
    '/images/products/perfume_rose_vanilla_1786862022661.jpg',
    '/images/products/perfume_jasmine_sandalwood_1786862034617.jpg',
    '/images/products/perfume_citrus_bergamot_1786862045892.jpg',
    '/images/products/perfume_oud_amber_1786862058224.jpg',
    '/images/products/perfume_lavender_musk_1786862068668.jpg'
  ]

  const productsWithImages = allProducts.map((product, index) => {
    const trendyolListing = product.marketplaceListings?.find(l => l.platform === 'trendyol')
    const trendyolImage = trendyolListing?.images?.[0] || null
    const finalImageUrl = index < aiImages.length ? aiImages[index] : trendyolImage
    
    return {
      ...product,
      trendyolListing,
      finalImageUrl
    }
  }).filter(product => product.finalImageUrl).slice(0, 12) // Only keep those with images, up to 12

  return (
    <div className="flex flex-col min-h-screen">
      
      <HomeHero />

      {/* Featured Perfume Collection */}
      <section className="pt-8 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-light mb-4">Çok Satanlar</h2>
            <p className="text-foreground/60 max-w-xl">
              Müşterilerimiz tarafından beğenilen, teninizle en iyi uyumu yakalayacak özel harmanlar.
            </p>
          </div>
          <Link href="/katalog" className="hidden md:flex text-sm font-medium hover:text-accent-rose transition-colors animate-pulse">
            Tüm Koleksiyonu Gör &rarr;
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
