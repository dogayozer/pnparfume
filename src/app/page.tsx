import { prisma } from '@/lib/prisma'
import HomeHero from '@/components/home/HomeHero'
import HomeHighlights from '@/components/home/HomeHighlights'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import MobileFilterSort from '@/components/catalog/MobileFilterSort'
import PerksBanner from '@/components/PerksBanner'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const sort = typeof params.sort === 'string' ? params.sort : 'best_sellers'

  // Admin panelinde "Vitrin Seçimi"nden elle işaretlenen ürünler varsa ("Çok Satanlar"
  // filtresi seçiliyken) önce onlar gösterilir — hiç seçim yapılmamışsa eskisi gibi
  // otomatik (ilk 12, gerçek fotoğrafı olan) davranışa düşülür.
  let allProducts
  if (sort === 'best_sellers') {
    const featured = await prisma.product.findMany({
      where: { publish_status: { not: 'DRAFT' }, is_featured: true },
      orderBy: { sku: 'asc' },
      include: { marketplaceListings: true }
    })
    allProducts = featured.length > 0 ? featured : null
  }
  if (!allProducts) {
    allProducts = await prisma.product.findMany({
      take: 48,
      where: {
        publish_status: {
          not: 'DRAFT'
        }
      },
      orderBy: { sku: 'asc' },
      include: { marketplaceListings: true }
    })
  }

  let processedProducts = allProducts
    .map((product: any) => {
      const trendyolListing = product.marketplaceListings?.find((l: any) => l.platform === 'trendyol')
      return {
        ...product,
        trendyolListing,
        finalImageUrl: trendyolListing?.images?.[0] || null
      }
    })
    // Gerçek ürün fotoğrafı olmayan kalemleri "Çok Satanlar" vitrininden hariç tut.
    // Önceden burada gerçek fotoğraf yoksa rastgele, ürünle hiç alakası olmayan bir
    // görsel (eski "kasap" placeholder seti) gösteriliyordu — bu artık kullanılmıyor;
    // ProductCard, imageUrl boşsa zaten kendi zarif "fotoğraf yok" görünümünü gösteriyor,
    // ama vitrinde sadece gerçek fotoğrafı olan ürünleri öne çıkarmak daha doğru.
    .filter((p: any) => p.finalImageUrl)

  if (sort === 'price_asc') {
    processedProducts.sort((a: any, b: any) => (a.trendyolListing?.price || a.base_cost) - (b.trendyolListing?.price || b.base_cost))
  } else if (sort === 'newest') {
    processedProducts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
  
  const productsWithImages = processedProducts.slice(0, 12) // Show top 12 best sellers

  return (
    <div className="flex flex-col min-h-screen">
      
      <HomeHero />

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

      <div className="pb-16">
        <PerksBanner />
      </div>

      <HomeHighlights />

    </div>
  )
}
