import Link from 'next/link'
import B2BSubNav from '@/components/b2b/B2BSubNav'
import ContactContent from '@/components/b2b/ContactContent'

export const metadata = {
  "title": "Contact PN Parfüm: Address, Phone, Email | PN Parfüm (Pien Parfum)",
  "description": "Contact PN Parfüm in Silivri, İstanbul: phone (+90) 212 736 09 90, info@pnparfume.com, working hours and a contact form for orders, distribution and private label.",
  "keywords": [
    "contact PN Parfüm",
    "perfume manufacturer contact Turkey",
    "PN Parfüm address"
  ],
  "alternates": {
    "canonical": "https://pnparfume.com/en/contact",
    "languages": {
      "en": "https://pnparfume.com/en/contact",
      "ar": "https://pnparfume.com/ar/contact",
      "tr": "https://pnparfume.com/kurumsal/iletisim",
      "x-default": "https://pnparfume.com/en/contact"
    }
  },
  "openGraph": {
    "title": "Contact PN Parfüm",
    "description": "Address, phone, email and contact form of PN Parfüm in Silivri, İstanbul.",
    "url": "https://pnparfume.com/en/contact",
    "siteName": "PN Parfüm",
    "locale": "en_US",
    "type": "website"
  }
}

const jsonLd = [{"@context": "https://schema.org", "@type": "ContactPage", "name": "Contact PN Parfüm", "url": "https://pnparfume.com/en/contact", "inLanguage": "en", "mainEntity": {"@type": "Organization", "name": "PN Parfüm", "alternateName": "Pien Parfum", "url": "https://pnparfume.com", "email": "info@pnparfume.com", "telephone": "+90 212 736 09 90", "address": {"@type": "PostalAddress", "streetAddress": "Yeni Sanayi Sit. E-Blok 9. Cad. No:8", "addressLocality": "Silivri", "addressRegion": "İstanbul", "addressCountry": "TR"}, "contactPoint": {"@type": "ContactPoint", "contactType": "customer service", "telephone": "+90 212 736 09 90", "email": "info@pnparfume.com", "availableLanguage": ["tr", "en", "ar"], "hoursAvailable": {"@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "opens": "09:00", "closes": "18:00"}}}}]

export default function EnContactPage() {
  return (
    <div lang="en" className="min-h-screen max-w-5xl mx-auto px-6 py-16 md:px-12 md:py-24">
      {jsonLd.map((d) => (
        <script key={d['@type']} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
      <B2BSubNav locale="en" />
      <h1 className="sr-only">Contact PN Parfüm</h1>
      <ContactContent locale="en" />
      <p className="text-center mt-16 text-sm text-foreground/40">
        Looking for our Turkish store? <Link href="/" className="text-accent-gold hover:underline">Visit pnparfume.com</Link>
      </p>
    </div>
  )
}
