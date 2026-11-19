import Link from 'next/link'
import B2BSubNav from '@/components/b2b/B2BSubNav'
import DealershipContent, { dealershipJsonLd } from '@/components/b2b/DealershipContent'

export const metadata = {
  "title": "Become a Perfume Dealer: PN Parfüm Dealership Application | PN Parfüm (Pien Parfum)",
  "description": "Producing since 2002. Apply to sell PN Parfüm perfumes in your store or online: watch the promo film, fill in the form and our team will get in touch.",
  "keywords": [
    "perfume dealership",
    "become a perfume dealer",
    "PN Parfüm dealer",
    "perfume reseller Turkey",
    "perfume wholesale dealer"
  ],
  "alternates": {
    "canonical": "https://pnparfume.com/en/dealership",
    "languages": {
      "tr": "https://pnparfume.com/kurumsal/bayilik",
      "en": "https://pnparfume.com/en/dealership",
      "ar": "https://pnparfume.com/ar/dealership",
      "x-default": "https://pnparfume.com/en/dealership"
    }
  },
  "openGraph": {
    "title": "Become a PN Parfüm Dealer",
    "description": "Watch the dealership film and apply to become a PN Parfüm dealer.",
    "url": "https://pnparfume.com/en/dealership",
    "siteName": "PN Parfüm",
    "locale": "en_US",
    "type": "website"
  }
}

export default function EnDealershipPage() {
  return (
    <div lang="en" className="min-h-screen max-w-5xl mx-auto px-6 py-16 md:px-12 md:py-24">
      {dealershipJsonLd('en', 'https://pnparfume.com/en/dealership').map((d) => (
        <script key={d['@type']} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
      <B2BSubNav locale="en" />
      <h1 className="sr-only">Become a PN Parfüm dealer</h1>
      <DealershipContent locale="en" />
      <p className="text-center mt-16 text-sm text-foreground/40">
        Looking for our Turkish store? <Link href="/" className="text-accent-gold hover:underline">Visit pnparfume.com</Link>
      </p>
    </div>
  )
}
