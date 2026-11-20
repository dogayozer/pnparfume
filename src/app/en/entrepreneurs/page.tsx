import Link from 'next/link'
import EntrepreneursContent, { entrepreneursJsonLd } from '@/components/b2b/EntrepreneursContent'

export const metadata = {
  "title": "Build Your Own Perfume Brand: Guide for Entrepreneurs | PN Parfüm (Pien Parfum)",
  "description": "Producing since 2002. Entrepreneurs can build a perfume brand with PN Parfüm: 400 fragrances, trademark guidance, logo, bottle, box and label design, regulation support and contract manufacturing.",
  "keywords": [
    "start a perfume brand",
    "perfume brand for entrepreneurs",
    "how to start a perfume line",
    "contract manufacturing perfume Turkey"
  ],
  "alternates": {
    "canonical": "https://pnparfume.com/en/entrepreneurs",
    "languages": {
      "en": "https://pnparfume.com/en/entrepreneurs",
      "ar": "https://pnparfume.com/ar/entrepreneurs",
      "tr": "https://pnparfume.com/kurumsal/girisimcilere-ozel",
      "x-default": "https://pnparfume.com/en/entrepreneurs"
    }
  },
  "openGraph": {
    "title": "Build Your Own Perfume Brand",
    "description": "A guide for entrepreneurs: fragrance, trademark, logo, bottle, box, label and regulation support.",
    "url": "https://pnparfume.com/en/entrepreneurs",
    "siteName": "PN Parfüm",
    "locale": "en_US",
    "type": "website"
  }
}

const jsonLd = entrepreneursJsonLd('en', 'https://pnparfume.com/en/entrepreneurs')

export default function EnEntrepreneursPage() {
  return (
    <div lang="en">
      {jsonLd.map((d) => (
        <script key={d['@type']} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
      <h1 className="sr-only">Build your own perfume brand: a guide for entrepreneurs</h1>
      <EntrepreneursContent locale="en" />
      <p className="text-center mt-16 text-sm text-foreground/40">
        Looking for our Turkish store? <Link href="/" className="text-accent-gold hover:underline">Visit pnparfume.com</Link>
      </p>
    </div>
  )
}
