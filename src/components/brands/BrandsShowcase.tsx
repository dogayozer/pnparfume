import Image from 'next/image'
import Link from 'next/link'

type Locale = 'tr' | 'en'

const IMAGES = [
  '/markalar/pien-serisi.jpg',
  '/markalar/pien-intense.jpg',
  '/markalar/asik-parfum.jpg',
  '/markalar/pien-luxury.jpg',
  '/markalar/pn.jpg',
  '/markalar/pn-ozel-seri.jpg',
] as const

export const BRANDS = {
  tr: {
    eyebrow: "2002'den beri üretimdeyiz",
    heading: 'Markalarımız ve Ürün Serilerimiz',
    intro:
      'Günlük kullanımdan davet ve özel günlere, ekonomik serilerden lüks koleksiyonlara kadar her ihtiyaca göre tasarladığımız altı marka ve seri.',
    cta: 'Koleksiyonu Keşfet',
    ctaHref: '/katalog',
    items: [
      {
        name: 'Pien Serisi',
        tag: 'Günlük • Ekonomik',
        chips: ['%20 esans oranı', 'Günlük kullanım'],
        text: 'Günlük kullanım için tasarlanmış, ekonomik ve %20 esans oranına sahip bir ürün serisi.',
        alt: 'Pien Serisi parfüm şişesi, narenciye ve su sıçramaları arasında gün batımı ışığında',
      },
      {
        name: 'Pien Intense',
        tag: 'Yoğun • Günlük',
        chips: ['%20 daha fazla esans', 'Özel tasarım kokular'],
        text: '%20 daha fazla esans oranına sahip, özel tasarlanmış kokulardan oluşan; ekonomik ve günlük kullanım için tasarlanmış bir ürün serisi.',
        alt: 'Siyah Pien Intense parfüm şişesi, yağmurlu gece şehir ışıklarında',
      },
      {
        name: 'Aşık Parfüm',
        tag: 'Özel Seri • Davet',
        chips: ['Yüksek esans yoğunluğu', 'Özel kokular'],
        text: 'Özel kokular içeren, yüksek esans yoğunluklu ve şık tasarımlı; davet ve özel günlerde kullanılan özel seri bir koleksiyon.',
        alt: 'Altın desenli Aşık Parfüm şişesi, kadife masa üzerinde romantik bir akşam sahnesinde',
      },
      {
        name: 'Pien Luxury',
        tag: 'Lüks • 100 ml',
        chips: ['Çok yoğun esans', 'Özel esansiyel yağlar', '100 ml'],
        text: 'Çok yoğun esans ve çok özel esansiyel yağlarla üretilmiş, şık tasarımlı, 100 ml şişe hacmiyle lüks serisinde bir parfüm koleksiyonu.',
        alt: 'Siyah ve altın Pien Luxury Perfume kutusu ile amber şişe, ud ağacı, baharatlar ve duman arasında',
      },
      {
        name: 'PN',
        tag: 'Günlük • 1. Sınıf Esans',
        chips: ['1. sınıf esans', 'Özel seriler', 'Özel tasarım serileri'],
        text: 'Günlük kullanım için tasarlanmış, 1. sınıf esansa sahip; kendi içinde özel serileri ve özel tasarım serileri de olan bir koleksiyon.',
        alt: 'Pembe PN Parfume NUDE parfüm kutusu, gül yaprakları ve ipek kurdele arasında',
      },
      {
        name: 'PN Özel Seri',
        tag: 'Özel Seri • 100 ml',
        chips: ['Özel tasarım şişe', 'PN çatısı altında', '100 ml'],
        text: 'PN çatısı altında, özel tasarlanmış amber şişesiyle sunulan, 100 ml hacimli özel seri bir parfüm koleksiyonu.',
        alt: 'Altın kapaklı amber PN Parfume şişesi, ud ağacı parçaları, gül yaprakları ve duman arasında',
      },
    ],
  },
  en: {
    eyebrow: 'Producing since 2002',
    heading: 'Our Brands and Product Lines',
    intro:
      'Six brands and lines designed for every need, from everyday wear to evenings and special occasions, and from affordable lines to luxury collections.',
    cta: 'Wholesale & Private Label',
    ctaHref: '/en/private-label',
    items: [
      {
        name: 'Pien Series',
        tag: 'Everyday • Affordable',
        chips: ['20% fragrance concentration', 'Everyday wear'],
        text: 'An affordable product line designed for everyday use, with a 20% fragrance concentration.',
        alt: 'Pien Series perfume bottle among citrus fruit and water splashes in sunset light',
      },
      {
        name: 'Pien Intense',
        tag: 'Intense • Everyday',
        chips: ['20% more fragrance', 'Specially designed scents'],
        text: 'An affordable everyday line made of specially designed scents with a 20% higher fragrance concentration.',
        alt: 'Black Pien Intense perfume bottle in the rain against night city lights',
      },
      {
        name: 'Aşık Parfüm',
        tag: 'Special Series • Occasions',
        chips: ['High fragrance concentration', 'Special scents'],
        text: 'A special-series collection of elegantly designed, high-concentration fragrances with unique scents, made for evenings and special occasions.',
        alt: 'Gold-patterned Aşık Parfüm bottle on a velvet table in a romantic evening scene',
      },
      {
        name: 'Pien Luxury',
        tag: 'Luxury • 100 ml',
        chips: ['Very high concentration', 'Special essential oils', '100 ml'],
        text: 'A luxury perfume collection in an elegant 100 ml bottle, made with a very high fragrance concentration and very special essential oils.',
        alt: 'Black and gold Pien Luxury Perfume box with an amber bottle among oud wood, spices and smoke',
      },
      {
        name: 'PN',
        tag: 'Everyday • First-Class Essence',
        chips: ['First-class essence', 'Special series', 'Special design series'],
        text: 'A collection designed for everyday use with first-class essence, including its own special series and special design series.',
        alt: 'Pink PN Parfume NUDE perfume box among rose petals and silk ribbon',
      },
      {
        name: 'PN Special Series',
        tag: 'Special Series • 100 ml',
        chips: ['Custom-designed bottle', 'Under the PN umbrella', '100 ml'],
        text: 'A special-series perfume collection under the PN umbrella, presented in a custom-designed amber bottle with a 100 ml volume.',
        alt: 'Amber PN Parfume bottle with a gold cap among oud wood pieces, rose petals and smoke',
      },
    ],
  },
} as const

export default function BrandsShowcase({ locale = 'tr' }: { locale?: Locale }) {
  const c = BRANDS[locale]

  return (
    <section aria-labelledby={`brands-heading-${locale}`} className="space-y-12" lang={locale}>
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent-gold">
          {c.eyebrow}
        </p>
        <h2 id={`brands-heading-${locale}`} className="text-3xl font-light text-foreground">
          {c.heading}
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-foreground/70">{c.intro}</p>
      </div>

      <div className="space-y-8">
        {c.items.map((b, i) => (
          <article
            key={b.name}
            className="grid grid-cols-1 overflow-hidden rounded-3xl border border-foreground/10 bg-background md:grid-cols-2"
          >
            <div
              className={`relative aspect-[4/5] w-full md:aspect-auto md:min-h-[460px] ${
                i % 2 === 1 ? 'md:order-2' : ''
              }`}
            >
              <Image
                src={IMAGES[i]}
                alt={b.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center gap-4 p-7 md:p-10">
              <p className="text-xs uppercase tracking-[0.2em] text-accent-gold">{b.tag}</p>
              <h3 className="text-3xl font-light text-foreground">{b.name}</h3>
              <p className="text-sm leading-relaxed text-foreground/70">{b.text}</p>
              <ul className="flex flex-wrap gap-2">
                {b.chips.map((chip) => (
                  <li
                    key={chip}
                    className="rounded-full border border-accent-gold/40 px-3 py-1 text-xs text-foreground/75"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <div>
        <Link
          href={c.ctaHref}
          className="inline-block rounded-full border border-accent-gold px-6 py-3 text-sm font-medium text-accent-gold transition-colors hover:bg-accent-gold hover:text-background"
        >
          {c.cta}
        </Link>
      </div>
    </section>
  )
}
