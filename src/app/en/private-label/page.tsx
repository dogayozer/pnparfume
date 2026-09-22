import Link from 'next/link'
import B2BLeadForm from '@/components/b2b/B2BLeadForm'
import { Lightbulb, TestTube, Factory, PackageCheck, Truck, ChevronDown } from 'lucide-react'

export const metadata = {
  title: 'Private Label Perfume Manufacturer Turkey | PN Parfüm',
  description: 'Create your own perfume brand with PN Parfüm — a Turkish private label fragrance manufacturer. From concept to sample to production to your shelf.',
  keywords: [
    'private label perfume manufacturer', 'contract manufacturing perfume', 'create your own perfume brand',
    'perfume OEM Turkey', 'fragrance contract manufacturer', 'custom perfume manufacturer Turkey', 'white label perfume'
  ],
  alternates: {
    canonical: 'https://pnparfume.com/en/private-label',
    languages: { 'en': 'https://pnparfume.com/en/private-label', 'ar': 'https://pnparfume.com/ar/private-label' }
  },
  openGraph: {
    title: 'Private Label Perfume Manufacturer Turkey | PN Parfüm',
    description: 'Create your own perfume brand — a Turkish private label fragrance manufacturer.',
    url: 'https://pnparfume.com/en/private-label',
    siteName: 'PN Parfüm',
    locale: 'en_US',
    type: 'website'
  }
}

const faqs = [
  {
    q: 'What is contract manufacturing (OEM) for perfume?',
    a: 'It means we produce fragrances under YOUR brand name — you provide the branding and identity, we handle formulation, production, and packaging at our facility in İstanbul.'
  },
  {
    q: 'Can I use my own custom formula, or must I choose from your catalog?',
    a: 'Both options are available — start from our 338+ fragrance library to save time and cost, or commission a fully custom scent based on your brief.'
  },
  {
    q: 'What is the minimum order quantity for private label production?',
    a: 'MOQs vary by bottle format — stock bottle options allow smaller starting orders, while fully custom bottle designs require a higher minimum.'
  },
  {
    q: 'Are your formulations compliant with EU and international cosmetic regulations?',
    a: 'Yes, all formulations follow IFRA standards and EU Cosmetics Regulation requirements, with safety assessment documentation (CPSR) available on request.'
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

const steps = [
  { icon: Lightbulb, title: 'Concept', desc: 'Tell us your brand vision — fragrance family, mood, target audience.' },
  { icon: TestTube, title: 'Sample', desc: 'We prepare samples based on our existing fragrance library or a custom brief.' },
  { icon: Factory, title: 'Production', desc: 'Once approved, we produce at our facility in Silivri, İstanbul.' },
  { icon: PackageCheck, title: 'Packaging & Label', desc: 'Choose bottle, box and label options — with your own brand identity.' },
  { icon: Truck, title: 'Shipment', desc: 'Your finished, labeled product is prepared for export to your market.' },
]

export default function PrivateLabelPage() {
  return (
    <div lang="en" className="min-h-screen max-w-5xl mx-auto px-6 py-16 md:px-12 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-2xl mb-16">
        <span className="text-xs font-medium uppercase tracking-widest text-accent-gold">Private Label</span>
        <h1 className="text-4xl md:text-5xl font-light mt-4 mb-6 leading-tight">
          Create your own perfume brand
        </h1>
        <p className="text-foreground/70 leading-relaxed text-lg">
          PN Parfüm produces fragrances at our own facility in Silivri, İstanbul, Turkey. Under our private label program, you bring the brand — we bring the formulation, production and packaging.
        </p>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-light mb-8">How it works</h2>
        <div className="space-y-6">
          {steps.map((s, i) => (
            <div key={s.title} className="flex items-start gap-5">
              <div className="w-11 h-11 rounded-full bg-foreground/5 flex items-center justify-center flex-shrink-0">
                <s.icon className="text-accent-gold" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">{i + 1}. {s.title}</h3>
                <p className="text-sm text-foreground/60">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-16 p-8 bg-foreground/[0.02] rounded-3xl border border-foreground/5">
        <h2 className="text-2xl font-light mb-4">Already have a brand and want to buy wholesale instead?</h2>
        <p className="text-foreground/60 mb-4">If you'd rather distribute our existing 338+ fragrance catalog under our brand, our wholesale program may be a better fit.</p>
        <Link href="/en/wholesale" className="text-accent-gold font-medium hover:underline">Explore Wholesale →</Link>
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

      <B2BLeadForm defaultInterest="Private Label" />

      {/* middleware.ts kök sayfayı ("/") bu bölgelerden gelen ziyaretçiler için
          buraya yönlendiriyor — geri dönmek isteyenler için bir çıkış yolu. */}
      <p className="text-center mt-10 text-sm text-foreground/40">
        Looking for our Turkish store? <Link href="/" className="text-accent-gold hover:underline">Visit pnparfume.com</Link>
      </p>
    </div>
  )
}
