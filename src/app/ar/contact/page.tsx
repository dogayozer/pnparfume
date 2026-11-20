import Link from 'next/link'
import ContactContent from '@/components/b2b/ContactContent'

export const metadata = {
  "title": "اتصل بـ PN Parfüm: العنوان والهاتف والبريد | PN Parfüm (Pien Parfum)",
  "description": "تواصل مع PN Parfüm في سيليفري بإسطنبول: الهاتف (+90) 212 736 09 90 والبريد info@pnparfume.com وساعات العمل ونموذج اتصال للطلبات والتوزيع والعلامة الخاصة.",
  "keywords": [
    "اتصل بـ PN Parfüm",
    "مصنع عطور تركيا تواصل",
    "عنوان PN Parfüm"
  ],
  "alternates": {
    "canonical": "https://pnparfume.com/ar/contact",
    "languages": {
      "ar": "https://pnparfume.com/ar/contact",
      "en": "https://pnparfume.com/en/contact",
      "tr": "https://pnparfume.com/kurumsal/iletisim",
      "x-default": "https://pnparfume.com/en/contact"
    }
  },
  "openGraph": {
    "title": "اتصل بـ PN Parfüm",
    "description": "عنوان وهاتف وبريد ونموذج اتصال PN Parfüm في سيليفري بإسطنبول.",
    "url": "https://pnparfume.com/ar/contact",
    "siteName": "PN Parfüm",
    "locale": "ar",
    "type": "website"
  }
}

const jsonLd = [{"@context": "https://schema.org", "@type": "ContactPage", "name": "اتصل بـ PN Parfüm", "url": "https://pnparfume.com/ar/contact", "inLanguage": "ar", "mainEntity": {"@type": "Organization", "name": "PN Parfüm", "alternateName": "Pien Parfum", "url": "https://pnparfume.com", "email": "info@pnparfume.com", "telephone": "+90 212 736 09 90", "address": {"@type": "PostalAddress", "streetAddress": "Yeni Sanayi Sit. E-Blok 9. Cad. No:8", "addressLocality": "Silivri", "addressRegion": "İstanbul", "addressCountry": "TR"}, "contactPoint": {"@type": "ContactPoint", "contactType": "customer service", "telephone": "+90 212 736 09 90", "email": "info@pnparfume.com", "availableLanguage": ["tr", "en", "ar"], "hoursAvailable": {"@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "opens": "09:00", "closes": "18:00"}}}}]

export default function ArContactPage() {
  return (
    <div lang="ar" dir="rtl">
      {jsonLd.map((d) => (
        <script key={d['@type']} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
      <h1 className="sr-only">اتصل بـ PN Parfüm</h1>
      <ContactContent locale="ar" />
      <p className="text-center mt-16 text-sm text-foreground/40">
        تبحثون عن متجرنا التركي؟ <Link href="/" className="text-accent-gold hover:underline">زوروا pnparfume.com</Link>
      </p>
    </div>
  )
}
