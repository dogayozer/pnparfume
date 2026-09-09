import Link from 'next/link'
import B2BLeadForm from '@/components/b2b/B2BLeadForm'
import { Lightbulb, TestTube, Factory, PackageCheck, Truck } from 'lucide-react'

export const metadata = {
  title: 'Private Label Perfume Manufacturer Turkey | PN Parfüm',
  description: 'Create your own perfume brand with PN Parfüm — a Turkish private label fragrance manufacturer. From concept to sample to production to your shelf.',
  alternates: { canonical: 'https://pnparfume.com/en/private-label' },
  openGraph: {
    title: 'Private Label Perfume Manufacturer Turkey | PN Parfüm',
    description: 'Create your own perfume brand — a Turkish private label fragrance manufacturer.',
    url: 'https://pnparfume.com/en/private-label',
    siteName: 'PN Parfüm',
    locale: 'en_US',
    type: 'website'
  }
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

      <B2BLeadForm defaultInterest="Private Label" />
    </div>
  )
}
