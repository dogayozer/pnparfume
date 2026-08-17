import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Sparkles, ArrowLeft, ShoppingBag, SunMoon, Compass, CalendarRange, Sun, MoonStar, Snowflake, Leaf, Briefcase, Coffee, Wine, Zap, Layers } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import ProductGallery from '@/components/ProductGallery'
import ProductActions from '@/components/ProductActions'

export const revalidate = 86400 // Cache for 24 hours (super fast loading)

function parseDescription(desc: string) {
  if (desc.includes('<p>') || desc.includes('<div>') || desc.includes('<br>')) return desc;
  
  if (desc.includes(';')) {
    const lines = desc.split(';').map(s => s.trim().replace(/^-/, '').trim()).filter(Boolean);
    if (lines.length > 1) {
      return `<ul class="list-disc pl-5 space-y-2">\n${lines.map(line => `<li>${line}</li>`).join('\n')}\n</ul>`;
    }
  }
  
  return `<p>${desc}</p>`;
}

const getSeasonIcon = (tag: string | null) => {
  if (!tag) return <CalendarRange size={14} />
  if (tag.includes('Kış') || tag.includes('Sonbahar')) return <Leaf size={14} />
  if (tag.includes('Yaz')) return <Sun size={14} />
  if (tag.includes('Dört')) return <Layers size={14} />
  return <CalendarRange size={14} />
}

const getTimeIcon = (tag: string | null) => {
  if (!tag) return <SunMoon size={14} />
  if (tag === 'Gündüz') return <Sun size={14} />
  if (tag === 'Gece') return <MoonStar size={14} />
  return <SunMoon size={14} />
}

const getOccasionIcon = (tag: string | null) => {
  if (!tag) return <Compass size={14} />
  if (tag.includes('Ofis') || tag.includes('Toplantı')) return <Briefcase size={14} />
  if (tag.includes('Günlük')) return <Coffee size={14} />
  if (tag.includes('Davet') || tag.includes('Gece')) return <Wine size={14} />
  if (tag.includes('Spor') || tag.includes('Dinamik')) return <Zap size={14} />
  return <Compass size={14} />
}

export default async function ProductPage({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params
  
  const product = await prisma.product.findUnique({
    where: { sku: decodeURIComponent(sku) },
    include: {
      ingredients: {
        include: {
          ingredient: true
        }
      },
      marketplaceListings: true
    }
  })

  if (!product || product.publish_status === 'DRAFT') {
    notFound()
  }

  const trendyolListing = product.marketplaceListings?.find(l => l.platform === 'trendyol')
  const imageUrl = trendyolListing?.images?.[0]
  const displayPrice = trendyolListing?.price || product.base_cost
  const marketPrice = trendyolListing?.marketPrice
  const description = trendyolListing?.description ? parseDescription(trendyolListing.description) : `
    <div class="space-y-4">
      <p><strong>Duygusal Etki:</strong> Çevrenizde <em>${product.mood_tag || 'etkileyici'}</em> bir izlenim bırakmak için özel olarak formüle edilmiştir.</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 p-4 bg-foreground/5 rounded-2xl border border-foreground/10">
        <div>
          <h4 class="text-accent-gold font-medium text-sm mb-1 uppercase tracking-widest">Üst Notalar</h4>
          <p class="text-foreground/80 text-sm">${product.top_notes}</p>
        </div>
        <div>
          <h4 class="text-accent-gold font-medium text-sm mb-1 uppercase tracking-widest">Kalp Notaları</h4>
          <p class="text-foreground/80 text-sm">${product.heart_notes}</p>
        </div>
        <div>
          <h4 class="text-accent-gold font-medium text-sm mb-1 uppercase tracking-widest">Dip Notalar</h4>
          <p class="text-foreground/80 text-sm">${product.base_notes}</p>
        </div>
      </div>
    </div>
  `

  const isOutOfStock = product.publish_status === 'OUT_OF_STOCK'
  const title = product.seo_name ? `${product.seo_name} - PN ${product.sku}` : `PN ${product.sku}`

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 md:px-12 py-6 md:py-12">
      <Link href="/katalog" className="inline-flex items-center gap-2 text-foreground/50 hover:text-accent-rose mb-6 md:mb-12 transition-colors text-sm md:text-base">
        <ArrowLeft size={16} /> Kataloğa Dön
      </Link>

      <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
        <div>
          {/* Left: Product Visual/Gallery */}
          <ProductGallery 
            images={trendyolListing?.images || []}
            title={title}
            isOutOfStock={isOutOfStock}
            sku={product.sku}
          />

          {/* Etkinlik ve Kullanım Simgeleri */}
          <div className="flex flex-wrap gap-3 justify-center pt-6">
            {product.season_tag && product.season_tag !== 'Bilinmiyor' && (
               <div className="flex items-center gap-2 px-4 py-2 bg-foreground/5 hover:bg-foreground/10 transition-colors rounded-full text-xs font-medium text-foreground/70 cursor-default" title="Mevsimsellik">
                  {getSeasonIcon(product.season_tag)}
                  {product.season_tag}
               </div>
            )}
            {product.time_of_day_tag && product.time_of_day_tag !== 'Bilinmiyor' && (
               <div className="flex items-center gap-2 px-4 py-2 bg-foreground/5 hover:bg-foreground/10 transition-colors rounded-full text-xs font-medium text-foreground/70 cursor-default" title="Kullanım Zamanı">
                  {getTimeIcon(product.time_of_day_tag)}
                  {product.time_of_day_tag}
               </div>
            )}
            {product.occasion_tag && product.occasion_tag !== 'Bilinmiyor' && (
               <div className="flex items-center gap-2 px-4 py-2 bg-foreground/5 hover:bg-foreground/10 transition-colors rounded-full text-xs font-medium text-foreground/70 cursor-default" title="Etkinlik / Mekan">
                  {getOccasionIcon(product.occasion_tag)}
                  {product.occasion_tag}
               </div>
            )}
          </div>

          {/* Koku Piramidi - Sol Alt Kısım (Niche Tasarım) */}
          <div className="mt-8 md:mt-16 pt-8 md:pt-12 border-t border-foreground/10">
            <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8 text-foreground/50">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
                  Kalıcılık <span className="text-accent-gold ml-1">({product.longevity_score || 0}/10)</span>
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={`h-1 w-4 rounded-full ${i < Math.ceil((product.longevity_score || 0) / 2) ? 'bg-accent-gold' : 'bg-foreground/10'}`}></div>
                  ))}
                </div>
              </div>
              <span className="text-foreground/20">|</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
                  Silaj (İz) <span className="text-accent-gold ml-1">({product.sillage_score || 0}/10)</span>
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={`h-1 w-4 rounded-full ${i < Math.ceil((product.sillage_score || 0) / 2) ? 'bg-accent-gold' : 'bg-foreground/10'}`}></div>
                  ))}
                </div>
              </div>
            </div>

            <h3 className="text-xl md:text-2xl font-light mb-6 md:mb-8 tracking-tight">Koku Mimarisi</h3>
            
            <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-[5px] before:w-[1px] before:bg-gradient-to-b before:from-accent-gold/50 before:to-transparent ml-2">
              <div className="relative pl-8">
                <div className="absolute left-[3px] top-2 w-1.5 h-1.5 rounded-full bg-accent-gold"></div>
                <h4 className="text-xs font-bold text-foreground/40 uppercase tracking-[0.2em] mb-2">Tepe Notaları</h4>
                <p className="text-foreground text-sm font-medium tracking-wide leading-relaxed">
                  {(product.top_notes || 'Gizli Formül').split(',').map(n => n.trim()).join(' • ')}
                </p>
              </div>

              <div className="relative pl-8">
                <div className="absolute left-[3px] top-2 w-1.5 h-1.5 rounded-full bg-accent-gold/60"></div>
                <h4 className="text-xs font-bold text-foreground/40 uppercase tracking-[0.2em] mb-2">Kalp Notaları</h4>
                <p className="text-foreground text-sm font-medium tracking-wide leading-relaxed">
                  {(product.heart_notes || 'Gizli Formül').split(',').map(n => n.trim()).join(' • ')}
                </p>
              </div>

              <div className="relative pl-8">
                <div className="absolute left-[3px] top-2 w-1.5 h-1.5 rounded-full bg-foreground/20"></div>
                <h4 className="text-xs font-bold text-foreground/40 uppercase tracking-[0.2em] mb-2">Dip Notalar</h4>
                <p className="text-foreground text-sm font-medium tracking-wide leading-relaxed">
                  {(product.base_notes || 'Gizli Formül').split(',').map(n => n.trim()).join(' • ')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Info */}
        <div className="space-y-6 md:space-y-8 mt-4 md:mt-0">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 mb-3">
              <span className="text-xs md:text-sm font-medium tracking-widest text-accent-gold">
                {product.fragrance_family?.[0]?.toUpperCase() || 'ÖZEL HARMAN'}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-2xl md:text-3xl font-light text-foreground">{displayPrice.toLocaleString('tr-TR')} ₺</span>
                {marketPrice && marketPrice > displayPrice && (
                  <span className="text-base md:text-lg text-foreground/40 line-through">{marketPrice.toLocaleString('tr-TR')} ₺</span>
                )}
                {displayPrice > 3000 && !isOutOfStock && (
                  <span className="text-[10px] md:text-xs bg-foreground/10 px-2 py-1 uppercase tracking-widest text-foreground/70">Premium Kargo</span>
                )}
              </div>
            </div>
            <h1 className="text-2xl md:text-4xl font-light text-foreground tracking-tight leading-snug">
              PN {product.sku}
            </h1>
            {product.seo_name && (
              <h2 className="text-base md:text-lg text-foreground/70 mt-1 md:mt-2 font-medium leading-relaxed">
                {product.seo_name}
              </h2>
            )}
            <p className="text-[10px] md:text-xs text-foreground/40 mt-1 md:mt-2 uppercase tracking-widest">
              {product.fragrance_family?.join(', ') || 'Gizli Formül'}
            </p>
          </div>

          <div className="text-foreground/80 leading-relaxed text-sm md:text-lg font-light" dangerouslySetInnerHTML={{ __html: description }} />

          <ProductActions 
            sku={product.sku}
            name={title}
            price={displayPrice}
            trendyolUrl={trendyolListing?.url} 
            isOutOfStock={isOutOfStock} 
          />

        </div>
      </div>
    </div>
  )
}
