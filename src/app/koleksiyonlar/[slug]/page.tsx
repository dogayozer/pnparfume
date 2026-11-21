import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import { COLLECTIONS, getCollection } from '@/lib/collections'

export const revalidate = 300

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const collection = getCollection(slug)
  if (!collection) return {}
  return {
    title: `${collection.name} Koleksiyonu | PN Parfüm`,
    description: collection.description,
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const collection = getCollection(slug)
  if (!collection) notFound()

  const products = await prisma.product.findMany({
    where: { publish_status: { not: 'DRAFT' }, sku: { startsWith: collection.skuPrefix } },
    orderBy: { sku: 'asc' },
    include: { marketplaceListings: true },
  })

  const items = products
    .map((p: any) => {
      const listing = p.marketplaceListings?.find((l: any) => l.platform === 'trendyol')
      return { ...p, listing, imageUrl: listing?.images?.[0] || null }
    })
    .filter((p: any) => p.imageUrl)

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <section className="pt-24 pb-10 px-6 text-center border-b border-foreground/5">
        <span className="text-accent-gold text-xs font-medium uppercase tracking-[0.3em] block mb-4">Koleksiyon</span>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">{collection.name}</h1>
        <p className="text-foreground/70 max-w-2xl mx-auto leading-relaxed">{collection.description}</p>
        <div className="mt-6 flex justify-center gap-4 text-sm">
          <Link href="/katalog" className="underline underline-offset-4 hover:text-accent-rose">Tüm ürünler</Link>
        </div>
      </section>

      <section className="px-4 md:px-12 max-w-7xl mx-auto w-full mt-10">
        {items.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6">
            {items.map((product: any) => (
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
        ) : (
          <p className="text-center text-foreground/50 py-16">Bu koleksiyondaki ürünler yakında burada olacak.</p>
        )}
      </section>
    </div>
  )
}
