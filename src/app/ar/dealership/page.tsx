import Link from 'next/link'
import B2BSubNav from '@/components/b2b/B2BSubNav'
import DealershipContent, { dealershipJsonLd } from '@/components/b2b/DealershipContent'

export const metadata = {
  "title": "طلب وكالة عطور: كن وكيل PN Parfüm | PN Parfüm (Pien Parfum)",
  "description": "ننتج منذ عام 2002. قدّم طلب وكالة لبيع عطور PN Parfüm في متجرك أو عبر الإنترنت: شاهد الفيلم الترويجي واملأ النموذج وسيتواصل معك فريقنا.",
  "keywords": [
    "وكالة عطور",
    "وكيل عطور",
    "PN Parfüm وكيل",
    "وكيل عطور من تركيا",
    "بيع عطور بالجملة"
  ],
  "alternates": {
    "canonical": "https://pnparfume.com/ar/dealership",
    "languages": {
      "tr": "https://pnparfume.com/kurumsal/bayilik",
      "en": "https://pnparfume.com/en/dealership",
      "ar": "https://pnparfume.com/ar/dealership",
      "x-default": "https://pnparfume.com/en/dealership"
    }
  },
  "openGraph": {
    "title": "كن وكيل PN Parfüm",
    "description": "شاهد فيلم الوكالة وقدّم طلبك لتصبح وكيل PN Parfüm.",
    "url": "https://pnparfume.com/ar/dealership",
    "siteName": "PN Parfüm",
    "locale": "ar",
    "type": "website"
  }
}

export default function ArDealershipPage() {
  return (
    <div lang="ar" dir="rtl" className="min-h-screen max-w-5xl mx-auto px-6 py-16 md:px-12 md:py-24">
      {dealershipJsonLd('ar', 'https://pnparfume.com/ar/dealership').map((d) => (
        <script key={d['@type']} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
      <B2BSubNav locale="ar" />
      <h1 className="sr-only">كن وكيل PN Parfüm</h1>
      <DealershipContent locale="ar" />
      <p className="text-center mt-16 text-sm text-foreground/40">
        تبحثون عن متجرنا التركي؟ <Link href="/" className="text-accent-gold hover:underline">زوروا pnparfume.com</Link>
      </p>
    </div>
  )
}
