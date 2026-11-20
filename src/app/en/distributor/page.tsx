import Link from 'next/link'
import DistributorContent, { distributorJsonLd } from '@/components/b2b/DistributorContent'

export const metadata = {
  title: 'Become a Perfume Distributor: PN Parfüm Distributor Application | PN Parfüm (Pien Parfum)',
  description:
    'Producing since 2002. Apply to distribute PN Parfüm perfumes in your country or city: share your region, sub-dealer network and industry experience and our team will get in touch.',
  keywords: [
    'perfume distributor', 'become a perfume distributor', 'perfume distribution Turkey',
    'wholesale perfume distributor', 'PN Parfüm distributor', 'perfume dealer network',
  ],
  alternates: {
    canonical: 'https://pnparfume.com/en/distributor',
    languages: {
      en: 'https://pnparfume.com/en/distributor',
      tr: 'https://pnparfume.com/kurumsal/distributorluk',
      ar: 'https://pnparfume.com/ar/distributor',
      'x-default': 'https://pnparfume.com/en/distributor',
    },
  },
  openGraph: {
    title: 'Become a PN Parfüm Distributor',
    description: 'Apply to distribute PN Parfüm in your region: share your country, city, sub-dealer network and experience.',
    url: 'https://pnparfume.com/en/distributor',
    siteName: 'PN Parfüm',
    locale: 'en_US',
    type: 'website',
  },
}

export default function EnDistributorPage() {
  return (
    <div lang="en">
      {distributorJsonLd('en', 'https://pnparfume.com/en/distributor').map((d) => (
        <script key={d['@type']} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
      <h1 className="sr-only">Become a PN Parfüm distributor</h1>
      <DistributorContent locale="en" />
      <p className="text-center mt-16 text-sm text-foreground/40">
        Looking for our Turkish store? <Link href="/" className="text-accent-gold hover:underline">Visit pnparfume.com</Link>
      </p>
    </div>
  )
}
