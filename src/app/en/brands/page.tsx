import Link from 'next/link'
import BrandsShowcase, { BRANDS } from '@/components/brands/BrandsShowcase'
import UmbrellaSeries from '@/components/brands/UmbrellaSeries'

export const metadata = {
  title: 'Our Perfume Brands: Pien, Pien Intense, Aşık, Pien Luxury, PN, PN Special Series | PN Parfüm',
  description:
    'Producing since 2002. Pien Series, Pien Intense, Aşık Parfüm, Pien Luxury, PN and PN Special Series: perfume brands and product lines from everyday wear to special occasions and luxury collections.',
  keywords: [
    'Turkish perfume brands', 'Pien perfume', 'Pien Intense', 'Pien Luxury', 'Aşık Parfüm', 'PN Parfüm',
    'perfume manufacturer Turkey', 'affordable perfume', 'luxury perfume 100 ml',
  ],
  alternates: {
    canonical: 'https://pnparfume.com/en/brands',
    languages: {
      en: 'https://pnparfume.com/en/brands',
      tr: 'https://pnparfume.com/kurumsal/markalarimiz',
    },
  },
  openGraph: {
    title: 'Our Perfume Brands and Product Lines | PN Parfüm',
    description:
      'Pien Series, Pien Intense, Aşık Parfüm, Pien Luxury, PN and PN Special Series: six perfume brands and lines for every need.',
    url: 'https://pnparfume.com/en/brands',
    siteName: 'PN Parfüm',
    locale: 'en_US',
    type: 'website',
  },
}

const faqs = [
  {
    q: 'Which perfume brands and product lines does PN Parfüm produce?',
    a: 'We produce six brands and lines: Pien Series, Pien Intense, Aşık Parfüm, Pien Luxury, PN and PN Special Series. They are designed for different needs, from everyday wear to evenings and special occasions, and from affordable lines to luxury collections.',
  },
  {
    q: 'What is the difference between Pien Series and Pien Intense?',
    a: 'Pien Series is an affordable everyday line with a 20% fragrance concentration. Pien Intense is also an affordable everyday line, made of specially designed scents with a 20% higher fragrance concentration.',
  },
  {
    q: 'What size is Pien Luxury and what makes it special?',
    a: 'Pien Luxury is a luxury perfume collection in an elegant 100 ml bottle, made with a very high fragrance concentration and very special essential oils.',
  },
  {
    q: 'When is Aşık Parfüm worn?',
    a: 'Aşık Parfüm is a special series of elegantly designed, high-concentration fragrances with unique scents, made for evenings and special occasions.',
  },
  {
    q: 'Can I create my own series under the PN brand without building my own brand?',
    a: 'Yes. Under the PN brand umbrella you can launch a sub-brand series of your own (for example MIX or AGORA). This lets you cut your costs and avoid the high production quantity limits of an independent brand. Scope, quantities and terms are agreed per project.',
  },
  {
    q: 'What is special about the PN brand?',
    a: 'PN is a collection designed for everyday use with first-class essence, and it includes its own special series and special design series.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'PN Parfüm brands and product lines',
    inLanguage: 'en',
    itemListElement: BRANDS.en.items.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Brand',
        name: b.name,
        description: b.text,
        url: 'https://pnparfume.com/en/brands',
      },
    })),
  },
]

export default function BrandsPage() {
  return (
    <div lang="en" className="min-h-screen max-w-5xl mx-auto px-6 py-16 md:px-12 md:py-24">
      {jsonLd.map((d) => (
        <script
          key={d['@type']}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}

      <h1 className="sr-only">Our perfume brands and product lines</h1>

      <div className="mb-16">
        <BrandsShowcase locale="en" />
      </div>

      <div className="mb-16">
        <UmbrellaSeries locale="en" />
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-light mb-8">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group border border-foreground/10 rounded-2xl p-5">
              <summary className="cursor-pointer list-none font-medium">{f.q}</summary>
              <p className="text-sm text-foreground/60 leading-relaxed mt-3">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      <p className="text-center mt-10 text-sm text-foreground/40">
        Looking for our Turkish store? <Link href="/" className="text-accent-gold hover:underline">Visit pnparfume.com</Link>
      </p>
    </div>
  )
}
