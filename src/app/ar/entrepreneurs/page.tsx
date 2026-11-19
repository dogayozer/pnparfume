import Link from 'next/link'
import B2BSubNav from '@/components/b2b/B2BSubNav'
import EntrepreneursContent, { entrepreneursJsonLd } from '@/components/b2b/EntrepreneursContent'

export const metadata = {
  "title": "أنشئ علامة عطورك الخاصة: دليل لرواد الأعمال | PN Parfüm (Pien Parfum)",
  "description": "ننتج منذ عام 2002. يمكن لرواد الأعمال بناء علامة عطور مع PN Parfüm: 400 عطر وإرشاد تسجيل العلامة وتصميم الشعار والزجاجة والعلبة والملصق ودعم اللوائح والتصنيع بالعقد.",
  "keywords": [
    "إنشاء علامة عطور",
    "علامة عطور لرواد الأعمال",
    "كيف أبدأ خط عطور",
    "تصنيع عطور بالعقد تركيا"
  ],
  "alternates": {
    "canonical": "https://pnparfume.com/ar/entrepreneurs",
    "languages": {
      "ar": "https://pnparfume.com/ar/entrepreneurs",
      "en": "https://pnparfume.com/en/entrepreneurs",
      "tr": "https://pnparfume.com/kurumsal/girisimcilere-ozel",
      "x-default": "https://pnparfume.com/en/entrepreneurs"
    }
  },
  "openGraph": {
    "title": "أنشئ علامة عطورك الخاصة",
    "description": "دليل لرواد الأعمال: العطر وتسجيل العلامة والشعار والزجاجة والعلبة والملصق ودعم اللوائح.",
    "url": "https://pnparfume.com/ar/entrepreneurs",
    "siteName": "PN Parfüm",
    "locale": "ar",
    "type": "website"
  }
}

const jsonLd = entrepreneursJsonLd('ar', 'https://pnparfume.com/ar/entrepreneurs')

export default function ArEntrepreneursPage() {
  return (
    <div lang="ar" dir="rtl" className="min-h-screen max-w-5xl mx-auto px-6 py-16 md:px-12 md:py-24">
      {jsonLd.map((d) => (
        <script key={d['@type']} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
      <B2BSubNav locale="ar" />
      <h1 className="sr-only">أنشئ علامة عطورك الخاصة: دليل لرواد الأعمال</h1>
      <EntrepreneursContent locale="ar" />
      <p className="text-center mt-16 text-sm text-foreground/40">
        تبحثون عن متجرنا التركي؟ <Link href="/" className="text-accent-gold hover:underline">زوروا pnparfume.com</Link>
      </p>
    </div>
  )
}
