import Link from 'next/link'
import B2BLeadForm from '@/components/b2b/B2BLeadForm'
import { MapPin, Package, FlaskConical, ShieldCheck, ChevronDown } from 'lucide-react'

export const metadata = {
  title: 'Wholesale Perfume Supplier from Turkey | PN Parfüm',
  description: 'PN Parfüm is a Turkish perfume manufacturer offering wholesale distribution of designer-alternative fragrances. 338+ fragrance catalog, alcohol-free oil line available.',
  keywords: [
    'wholesale perfume supplier Turkey', 'perfume distributor Turkey', 'buy perfume wholesale',
    'fragrance manufacturer Turkey', 'designer alternative perfume supplier', 'exclusive perfume distributor'
  ],
  alternates: {
    canonical: 'https://pnparfume.com/en/wholesale',
    languages: { 'en': 'https://pnparfume.com/en/wholesale', 'ar': 'https://pnparfume.com/ar/wholesale' }
  },
  openGraph: {
    title: 'Wholesale Perfume Supplier from Turkey | PN Parfüm',
    description: 'Turkish perfume manufacturer offering wholesale distribution of designer-alternative fragrances.',
    url: 'https://pnparfume.com/en/wholesale',
    siteName: 'PN Parfüm',
    locale: 'en_US',
    type: 'website'
  }
}

const faqs = [
  {
    q: 'How can I become a wholesale distributor for PN Parfüm?',
    a: 'Fill out the distributor application form on this page with your country, company details, and estimated monthly volume. Our team will respond with pricing, minimum order quantities, and next steps.'
  },
  {
    q: 'What is the minimum order quantity (MOQ) for wholesale?',
    a: 'MOQ depends on your target market and product mix — smaller pilot orders are available for new distributors, with better pricing at higher volumes.'
  },
  {
    q: 'Where are PN Parfüm fragrances manufactured?',
    a: 'All fragrances are produced at our own facility in Silivri, İstanbul, Turkey, under formulations that follow IFRA and EU Cosmetics Regulation standards.'
  },
  {
    q: 'Do you offer alcohol-free fragrance options for wholesale?',
    a: 'Yes — alongside our alcohol-based EDP line, we also produce oil-based, alcohol-free fragrances, a popular option in markets with religious or cultural preferences for alcohol-free products.'
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a }
  }))
}

export default function WholesalePage() {
  return (
    <div lang="en" className="min-h-screen max-w-5xl mx-auto px-6 py-16 md:px-12 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-2xl mb-16">
        <span className="text-xs font-medium uppercase tracking-widest text-accent-gold">Wholesale Distribution</span>
        <h1 className="text-4xl md:text-5xl font-light mt-4 mb-6 leading-tight">
          Become a PN Parfüm distributor in your market
        </h1>
        <p className="text-foreground/70 leading-relaxed text-lg">
          We produce and export designer-alternative fragrances from our facility in Silivri, İstanbul, Turkey. Partner with us for wholesale distribution — competitive pricing, a large ready-made catalog, and logistics support for your region.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        <div className="p-6 border border-foreground/10 rounded-2xl bg-background">
          <MapPin className="text-accent-gold mb-3" size={22} />
          <h3 className="font-medium text-lg mb-2">Made in Turkey</h3>
          <p className="text-sm text-foreground/60">Produced at our own facility in Silivri, İstanbul — Turkey is one of the world's largest fragrance-producing countries.</p>
        </div>
        <div className="p-6 border border-foreground/10 rounded-2xl bg-background">
          <Package className="text-accent-gold mb-3" size={22} />
          <h3 className="font-medium text-lg mb-2">338+ Fragrance Catalog</h3>
          <p className="text-sm text-foreground/60">A ready-made catalog spanning men's, women's and unisex fragrance families — no need to start from scratch.</p>
        </div>
        <div className="p-6 border border-foreground/10 rounded-2xl bg-background">
          <FlaskConical className="text-accent-gold mb-3" size={22} />
          <h3 className="font-medium text-lg mb-2">Alcohol-Free Oil Line</h3>
          <p className="text-sm text-foreground/60">In addition to our alcohol-based EDP line, we also produce oil-based (alcohol-free) fragrances — simpler and more cost-effective to ship as samples.</p>
        </div>
        <div className="p-6 border border-foreground/10 rounded-2xl bg-background">
          <ShieldCheck className="text-accent-gold mb-3" size={22} />
          <h3 className="font-medium text-lg mb-2">IFRA & EU Compliant</h3>
          <p className="text-sm text-foreground/60">Our formulations follow IFRA (International Fragrance Association) standards and EU Cosmetics Regulation requirements.</p>
        </div>
      </div>

      <div className="mb-16 p-8 bg-foreground/[0.02] rounded-3xl border border-foreground/5">
        <h2 className="text-2xl font-light mb-4">Looking to start your own brand instead?</h2>
        <p className="text-foreground/60 mb-4">If you'd rather build your own perfume brand from concept to shelf, our private label program may be a better fit.</p>
        <Link href="/en/private-label" className="text-accent-gold font-medium hover:underline">Explore Private Label →</Link>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-light mb-8">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group border border-foreground/10 rounded-2xl p-5">
              <summary className="flex items-center justify-between cursor-pointer list-none font-medium gap-4">
                {f.q}
                <ChevronDown className="text-foreground/40 group-open:rotate-180 transition-transform flex-shrink-0" size={18} />
              </summary>
              <p className="text-sm text-foreground/60 leading-relaxed mt-3">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      <B2BLeadForm defaultInterest="Distributor" />

      {/* middleware.ts kök sayfayı ("/") bu bölgelerden gelen ziyaretçiler için
          buraya yönlendiriyor — geri dönmek isteyenler için bir çıkış yolu. */}
      <p className="text-center mt-10 text-sm text-foreground/40">
        Looking for our Turkish store? <Link href="/" className="text-accent-gold hover:underline">Visit pnparfume.com</Link>
      </p>
    </div>
  )
}
