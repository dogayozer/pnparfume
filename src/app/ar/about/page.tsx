import Link from 'next/link'
import AboutContent from '@/components/b2b/AboutContent'

export const metadata = {
  "title": "عن PN Parfüm: مصنّع عطور تركي منذ 2002 | PN Parfüm (Pien Parfum)",
  "description": "تُنتج PN Parfüm (Pien Parfum) العطور في سيليفري بإسطنبول منذ عام 2002. تعرّف على فلسفتنا وإنتاجنا المتوافق مع IFRA والاتحاد الأوروبي و400 خيار عطري وشبكتنا العالمية.",
  "keywords": [
    "عن PN Parfüm",
    "مصنع عطور تركي",
    "شركة عطور في إسطنبول",
    "مصنع عطور منذ 2002"
  ],
  "alternates": {
    "canonical": "https://pnparfume.com/ar/about",
    "languages": {
      "ar": "https://pnparfume.com/ar/about",
      "en": "https://pnparfume.com/en/about",
      "tr": "https://pnparfume.com/kurumsal/kurumsal-kimlik",
      "x-default": "https://pnparfume.com/en/about"
    }
  },
  "openGraph": {
    "title": "عن PN Parfüm",
    "description": "مصنّع عطور تركي ينتج منذ عام 2002 في سيليفري بإسطنبول.",
    "url": "https://pnparfume.com/ar/about",
    "siteName": "PN Parfüm",
    "locale": "ar",
    "type": "website"
  }
}

const jsonLd = [{"@context": "https://schema.org", "@type": "AboutPage", "name": "عن PN Parfüm", "url": "https://pnparfume.com/ar/about", "inLanguage": "ar", "about": {"@type": "Organization", "name": "PN Parfüm", "alternateName": "Pien Parfum", "url": "https://pnparfume.com", "foundingDate": "2002", "address": {"@type": "PostalAddress", "streetAddress": "Yeni Sanayi Sit. E-Blok 9. Cad. No:8", "addressLocality": "Silivri", "addressRegion": "İstanbul", "addressCountry": "TR"}}}]

export default function ArAboutPage() {
  return (
    <div lang="ar" dir="rtl">
      {jsonLd.map((d) => (
        <script key={d['@type']} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
      <h1 className="sr-only">عن PN Parfüm</h1>
      <AboutContent locale="ar" />
      <p className="text-center mt-16 text-sm text-foreground/40">
        تبحثون عن متجرنا التركي؟ <Link href="/" className="text-accent-gold hover:underline">زوروا pnparfume.com</Link>
      </p>
    </div>
  )
}
