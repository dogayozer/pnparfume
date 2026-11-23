import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Sparkles, ArrowLeft, ShoppingBag, SunMoon, Compass, CalendarRange, Sun, MoonStar, Snowflake, Leaf, Briefcase, Coffee, Wine, Zap, Layers, Plane } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import ProductGallery from '@/components/ProductGallery'
import ProductActions from '@/components/ProductActions'
import ProductReviews from '@/components/ProductReviews'
import ViewTracker from '@/components/ViewTracker'
import { T, Money } from '@/lib/i18n'
import { V_, N_ } from '@/lib/vocab'
import { LocalizedDescription } from '@/components/ProductI18n'
import { productLabel, productBrand } from '@/lib/collections'
import { FREE_SHIPPING_FOR_ALL } from '@/lib/shippingCampaign'

export const revalidate = 86400 // Cache for 24 hours (super fast loading)

// SEO: her ürün sayfası artık kendi başlığını/açıklamasını taşıyor — önceden 339
// ürünün TAMAMI ana layout'un tek, genel başlığını paylaşıyordu, bu da Google'ın
// hiçbir ürünü diğerinden ayırt edememesi anlamına geliyordu.
export async function generateMetadata({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params
  const product = await prisma.product.findUnique({
    where: { sku: decodeURIComponent(sku) },
    select: { sku: true, seo_name: true, gender: true, fragrance_family: true, mood_tag: true, top_notes: true }
  })
  if (!product) return {}

  const displayTitle = product.seo_name || productLabel(product.sku)
  const familyText = product.fragrance_family?.[0] || ''
  const title = `${displayTitle} | ${product.gender} ${familyText} Parfüm | PN Parfüm`
  const description = `${displayTitle} — ${product.mood_tag || 'karakterli bir koku'}. Üst notalar: ${product.top_notes}. Kalıcı, ${familyText.toLowerCase()} bir ${product.gender?.toLowerCase()} parfümü.`.slice(0, 160)

  // 🔴 SKU'larda boşluk var ("M 17" gibi) — encodeURIComponent olmadan canonical/OG URL'i
  // sayfanın gerçekte sunulduğu (Next.js'in otomatik encode ettiği) URL'den farklı olur,
  // bu da Google Search Console'da canonical uyuşmazlığı hatalarına yol açar
  // (bkz. sitemap.ts'teki aynı sınıf hata, aynı sebeple daha önce düzeltilmişti).
  const canonicalUrl = `https://pnparfume.com/urun/${encodeURIComponent(product.sku)}`

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, siteName: 'PN Parfüm', locale: 'tr_TR', type: 'website' }
  }
}

function parseDescription(desc: string) {
  if (!desc) return '';
  if (desc.includes('<p>') || desc.includes('<div>') || desc.includes('<br>')) return desc;
  
  // Split by newlines or semicolons if formatted as bullet points
  let lines: string[] = []
  if (desc.includes('\n')) {
    lines = desc.split('\n').map(s => s.trim().replace(/^[-•*]\s*/, '').trim()).filter(Boolean);
  } else if (desc.includes(';')) {
    lines = desc.split(';').map(s => s.trim().replace(/^[-•*]\s*/, '').trim()).filter(Boolean);
  }

  if (lines.length > 1) {
    return `<ul class="list-disc pl-5 space-y-2.5 text-foreground/80 leading-relaxed text-base">\n${lines.map(line => `<li>${line}</li>`).join('\n')}\n</ul>`;
  }
  
  return `<p class="text-foreground/80 leading-relaxed text-base">${desc}</p>`;
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

  if (!product) {
    notFound()
  }

  // SEO: Google'ın arama sonuçlarında fiyat/stok/puan gösterebilmesi (rich result)
  // için schema.org Product yapılandırılmış verisi — önceden hiç yoktu, sayfa
  // Google'a sıradan bir metin sayfası gibi görünüyordu.
  const reviewAgg = await prisma.review.aggregate({
    where: { productSku: product.sku, isApproved: true },
    _avg: { rating: true },
    _count: { rating: true }
  })

  // Google Search Console "aggregateRating varken review eksik" uyarısı verdiği
  // için — birkaç gerçek onaylı yorumu da yapılandırılmış veriye dahil ediyoruz.
  const sampleReviews = reviewAgg._count.rating > 0
    ? await prisma.review.findMany({
        where: { productSku: product.sku, isApproved: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { customerName: true, rating: true, comment: true, createdAt: true }
      })
    : []

  // Kargo ücreti (Senaryo Kuralları → SHIPPING_COST) — sepet/kupon durumuna göre
  // ücretsiz kargoya düşebilir (bkz. dynamicShipping.ts), ama schema.org
  // OfferShippingDetails tek bir sabit değer istiyor; burada müşteriden varsayılan
  // olarak alınan standart ücret temsili değer olarak kullanılıyor.
  const shippingRule = await prisma.scenarioRule.findUnique({ where: { rule_key: 'SHIPPING_COST' } })
  const shippingCost = FREE_SHIPPING_FOR_ALL ? 0 : shippingRule && shippingRule.is_active ? shippingRule.rule_value : 120

  const trendyolListing = product.marketplaceListings?.find((l: any) => l.platform === 'trendyol')
  const finalImageUrl = trendyolListing?.images?.[0] || null
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
  const label = productLabel(product.sku)
  const title = product.seo_name && product.seo_name !== label ? `${product.seo_name} - ${label}` : label
  // 🔴 sitemap.ts'teki ile aynı hata: SKU'da boşluk var ("M 17"), encode edilmeden
  // URL'e basılırsa geçersiz olur — burada da encodeURIComponent şart.
  const canonicalUrl = `https://pnparfume.com/urun/${encodeURIComponent(product.sku)}`
  // Google Search Console "sku alanındaki değer geçersiz" uyarısı verdi —
  // Merchant listing doğrulayıcısı SKU'da boşluk istemiyor, görünen isim aynı
  // kalsın diye sadece yapılandırılmış veride boşluksuz halini kullanıyoruz.
  const schemaSku = product.sku.replace(/\s+/g, '')

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    sku: schemaSku,
    description: (product.seo_name || label) + ' — ' + (product.mood_tag || 'karakterli bir koku'),
    image: finalImageUrl ? [finalImageUrl] : undefined,
    brand: { '@type': 'Brand', name: productBrand(product.sku) },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'TRY',
      price: displayPrice,
      availability: isOutOfStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      // İptal ve İade Koşulları'ndaki (Mesafeli Sözleşmeler Yönetmeliği, madde 11-22)
      // yasal 14 günlük cayma hakkı ve iade masrafının satıcıya ait olması (madde 14).
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'TR',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn'
      },
      // "24 saat içerisinde kargoya teslim edilecektir" (bkz. basarili/page.tsx) —
      // teslimat (transit) süresi sitede yazılı olarak belirtilmediği için yurt içi
      // kargo için makul bir varsayım kullanıldı (1-3 iş günü); gerçek kargo firması
      // SLA'sı netleşirse burası güncellenmeli.
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: shippingCost, currency: 'TRY' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'TR' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' }
        }
      }
    },
    ...(reviewAgg._count.rating > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: reviewAgg._avg.rating,
        reviewCount: reviewAgg._count.rating
      },
      review: sampleReviews.map(r => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: r.customerName },
        datePublished: r.createdAt.toISOString().slice(0, 10),
        reviewBody: r.comment,
        reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 }
      }))
    } : {})
  }

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 md:px-12 py-6 md:py-12">
      <ViewTracker sku={product.sku} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Link href="/katalog" className="inline-flex items-center gap-2 text-foreground/50 hover:text-accent-rose mb-6 md:mb-12 transition-colors text-base md:text-lg">
        <ArrowLeft size={18} /> <T tr="Kataloğa Dön" en="Back to Catalog" ar="العودة إلى الكتالوج" />
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start min-w-0">
        <div>
          {/* Left: Product Visual/Gallery */}
          <ProductGallery 
            images={trendyolListing?.images?.length ? trendyolListing.images : []}
            title={title}
            isOutOfStock={isOutOfStock}
            sku={product.sku}
          />

          {/* Etkinlik ve Kullanım Simgeleri */}
          <div className="flex flex-wrap gap-3 justify-center pt-6">
            {product.season_tag && product.season_tag !== 'Bilinmiyor' && (
               <div className="flex items-center gap-2 px-4 py-2 bg-foreground/5 hover:bg-foreground/10 transition-colors rounded-full text-sm font-medium text-foreground/70 cursor-default" title="Season">
                  {getSeasonIcon(product.season_tag)}
                  <V_ value={product.season_tag} />
               </div>
            )}
            {product.time_of_day_tag && product.time_of_day_tag !== 'Bilinmiyor' && (
               <div className="flex items-center gap-2 px-4 py-2 bg-foreground/5 hover:bg-foreground/10 transition-colors rounded-full text-sm font-medium text-foreground/70 cursor-default" title="Time of day">
                  {getTimeIcon(product.time_of_day_tag)}
                  <V_ value={product.time_of_day_tag} />
               </div>
            )}
            {product.occasion_tag && product.occasion_tag !== 'Bilinmiyor' && (
               <div className="flex items-center gap-2 px-4 py-2 bg-foreground/5 hover:bg-foreground/10 transition-colors rounded-full text-sm font-medium text-foreground/70 cursor-default" title="Occasion">
                  {getOccasionIcon(product.occasion_tag)}
                  <V_ value={product.occasion_tag} />
               </div>
            )}
          </div>

          {/* Koku Piramidi - Sol Alt Kısım (Niche Tasarım) */}
          <div className="mt-8 md:mt-16 pt-8 md:pt-12 border-t border-foreground/10">
            <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8 text-foreground/50">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-[0.2em] mb-1">
                  <T tr="Kalıcılık" en="Longevity" ar="الثبات" /> <span className="text-accent-gold ml-1">({product.longevity_score || 0}/10)</span>
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={`h-1.5 w-4 rounded-full ${i < Math.ceil((product.longevity_score || 0) / 2) ? 'bg-accent-gold' : 'bg-foreground/10'}`}></div>
                  ))}
                </div>
              </div>
              <span className="text-foreground/20">|</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-[0.2em] mb-1">
                  <T tr="Silaj (İz)" en="Sillage (Trail)" ar="الانتشار" /> <span className="text-accent-gold ml-1">({product.sillage_score || 0}/10)</span>
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={`h-1.5 w-4 rounded-full ${i < Math.ceil((product.sillage_score || 0) / 2) ? 'bg-accent-gold' : 'bg-foreground/10'}`}></div>
                  ))}
                </div>
              </div>
            </div>

            <h3 className="text-2xl md:text-3xl font-light mb-6 md:mb-8 tracking-tight"><T tr="Koku Mimarisi" en="Fragrance Structure" ar="هيكل العطر" /></h3>
            
            <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-[5px] before:w-[1px] before:bg-gradient-to-b before:from-accent-gold/50 before:to-transparent ml-2">
              <div className="relative pl-8">
                <div className="absolute left-[3px] top-2 w-1.5 h-1.5 rounded-full bg-accent-gold"></div>
                <h4 className="text-sm font-bold text-foreground/40 uppercase tracking-[0.2em] mb-2"><T tr="Tepe Notaları" en="Top Notes" ar="النوتات العليا" /></h4>
                <p className="text-foreground text-base font-medium tracking-wide leading-relaxed">
                  <V_ value={(product.top_notes || 'Gizli Formül').split(',').map(n => n.trim()).join(' • ')} />
                </p>
              </div>

              <div className="relative pl-8">
                <div className="absolute left-[3px] top-2 w-1.5 h-1.5 rounded-full bg-accent-gold/60"></div>
                <h4 className="text-sm font-bold text-foreground/40 uppercase tracking-[0.2em] mb-2"><T tr="Kalp Notaları" en="Heart Notes" ar="نوتات القلب" /></h4>
                <p className="text-foreground text-base font-medium tracking-wide leading-relaxed">
                  <V_ value={(product.heart_notes || 'Gizli Formül').split(',').map(n => n.trim()).join(' • ')} />
                </p>
              </div>

              <div className="relative pl-8">
                <div className="absolute left-[3px] top-2 w-1.5 h-1.5 rounded-full bg-foreground/20"></div>
                <h4 className="text-sm font-bold text-foreground/40 uppercase tracking-[0.2em] mb-2"><T tr="Dip Notalar" en="Base Notes" ar="النوتات القاعدية" /></h4>
                <p className="text-foreground text-base font-medium tracking-wide leading-relaxed">
                  <V_ value={(product.base_notes || 'Gizli Formül').split(',').map(n => n.trim()).join(' • ')} />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Info */}
        <div className="space-y-6 md:space-y-8 mt-4 md:mt-0">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 mb-3">
              <span className="text-sm md:text-base font-medium tracking-widest text-accent-gold">
                <span className="uppercase"><V_ value={product.fragrance_family?.[0] || 'Özel Harman'} /></span>
              </span>
              <div className="flex items-center gap-3">
                <span className="text-3xl md:text-4xl font-light text-foreground"><Money tl={displayPrice} /></span>
                {marketPrice && marketPrice > displayPrice && (
                  <span className="text-lg md:text-xl text-foreground/40 line-through"><Money tl={marketPrice} /></span>
                )}
                {displayPrice > 3000 && !isOutOfStock && (
                  <span className="text-xs md:text-sm bg-foreground/10 px-2 py-1 uppercase tracking-widest text-foreground/70"><T tr="Premium Kargo" en="Premium Shipping" ar="شحن مميز" /></span>
                )}
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-light text-foreground tracking-tight leading-snug">
              {label}
            </h1>
            {product.seo_name && (
              <h2 className="text-lg md:text-xl text-foreground/70 mt-1 md:mt-2 font-medium leading-relaxed">
                <N_ value={product.seo_name} />
              </h2>
            )}
            <p className="text-xs md:text-sm text-foreground/40 mt-1 md:mt-2 uppercase tracking-widest">
              <V_ value={product.fragrance_family?.join(', ') || 'Gizli Formül'} />
            </p>
          </div>

          <LocalizedDescription html={description} mood={product.mood_tag} top={product.top_notes} heart={product.heart_notes} base={product.base_notes} family={product.fragrance_family?.join(', ')} />

          {/* Tek bir yerde, kod seviyesinde tutuluyor — 339 ürünün açıklama metnine
              tek tek yazmak yerine burada, çünkü hepsi zaten aynı varsayılan 50ml
              kompakt şişeyle satılıyor (bkz. bottleOptions.ts). Böylece yeni eklenen
              ürünlerde de otomatik görünür, elle güncellenmesi gerekmez. */}
          <p className="flex items-center gap-2 text-sm text-foreground/60">
            <Plane size={16} className="text-accent-gold flex-shrink-0" />
            <T tr="50 mililitrelik kompakt şişe boyutu sayesinde seyahat dostudur." en="Its compact 50 ml bottle makes it travel-friendly." ar="زجاجته المدمجة بحجم 50 مل تجعله مناسبًا للسفر." />
          </p>

          <ProductActions
            sku={product.sku}
            name={title}
            price={displayPrice}
            trendyolUrl={trendyolListing?.url}
            isOutOfStock={isOutOfStock}
            gender={product.gender}
          />

        </div>
      </div>

      {/* Customer Reviews & UGC Section */}
      <ProductReviews sku={product.sku} productName={title} />
    </div>
  )
}
