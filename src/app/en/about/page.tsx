import Link from 'next/link'
import AboutContent from '@/components/b2b/AboutContent'

export const metadata = {
  "title": "About PN Parfüm: Turkish Perfume Manufacturer Since 2002 | PN Parfüm (Pien Parfum)",
  "description": "PN Parfüm (Pien Parfum) has produced perfume in Silivri, İstanbul since 2002. Discover our philosophy, IFRA and EU-compliant production, 400 fragrance options and global dealer network.",
  "keywords": [
    "about PN Parfüm",
    "Turkish perfume manufacturer",
    "perfume manufacturer Istanbul",
    "perfume company since 2002"
  ],
  "alternates": {
    "canonical": "https://pnparfume.com/en/about",
    "languages": {
      "en": "https://pnparfume.com/en/about",
      "ar": "https://pnparfume.com/ar/about",
      "tr": "https://pnparfume.com/kurumsal/kurumsal-kimlik",
      "x-default": "https://pnparfume.com/en/about"
    }
  },
  "openGraph": {
    "title": "About PN Parfüm",
    "description": "Turkish perfume manufacturer producing since 2002 in Silivri, İstanbul.",
    "url": "https://pnparfume.com/en/about",
    "siteName": "PN Parfüm",
    "locale": "en_US",
    "type": "website"
  }
}

const jsonLd = [{"@context": "https://schema.org", "@type": "AboutPage", "name": "About PN Parfüm", "url": "https://pnparfume.com/en/about", "inLanguage": "en", "about": {"@type": "Organization", "name": "PN Parfüm", "alternateName": "Pien Parfum", "url": "https://pnparfume.com", "foundingDate": "2002", "address": {"@type": "PostalAddress", "streetAddress": "Yeni Sanayi Sit. E-Blok 9. Cad. No:8", "addressLocality": "Silivri", "addressRegion": "İstanbul", "addressCountry": "TR"}}}]

export default function EnAboutPage() {
  return (
    <div lang="en">
      {jsonLd.map((d) => (
        <script key={d['@type']} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
      <h1 className="sr-only">About PN Parfüm</h1>
      <AboutContent locale="en" />
      <p className="text-center mt-16 text-sm text-foreground/40">
        Looking for our Turkish store? <Link href="/" className="text-accent-gold hover:underline">Visit pnparfume.com</Link>
      </p>
    </div>
  )
}
