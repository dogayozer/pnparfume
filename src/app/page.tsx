import { prisma } from '@/lib/prisma'
import HomeHero from '@/components/home/HomeHero'
import HomeHighlights from '@/components/home/HomeHighlights'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

export default async function Home() {
  // Fetch a selection of top/featured products to display on the homepage
  const products = await prisma.product.findMany({
    take: 12,
    orderBy: { sku: 'asc' }
  })

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
          {products.map(product => (
            <ProductCard 
              key={product.sku} 
              product={{
                sku: product.sku,
                families: product.fragrance_family,
                gender: product.gender,
                price: null,
                longevity: String(product.longevity_score)
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
