import Link from 'next/link'
import DistributorContent, { distributorJsonLd } from '@/components/b2b/DistributorContent'

export const metadata = {
  title: 'كن موزّع عطور: طلب توزيع PN Parfüm | PN Parfüm (Pien Parfum)',
  description:
    'ننتج منذ عام 2002. قدّم طلب توزيع عطور PN Parfüm في بلدك أو مدينتك: شاركنا منطقتك وشبكة وكلائك الفرعيين وخبرتك في القطاع وسيتواصل معك فريقنا.',
  keywords: ['موزع عطور', 'توزيع عطور من تركيا', 'وكيل عطور', 'توزيع عطور بالجملة', 'PN Parfüm موزع'],
  alternates: {
    canonical: 'https://pnparfume.com/ar/distributor',
    languages: {
      ar: 'https://pnparfume.com/ar/distributor',
      en: 'https://pnparfume.com/en/distributor',
      tr: 'https://pnparfume.com/kurumsal/distributorluk',
      'x-default': 'https://pnparfume.com/en/distributor',
    },
  },
  openGraph: {
    title: 'كن موزّع PN Parfüm',
    description: 'قدّم طلب توزيع PN Parfüm في منطقتك: شاركنا بلدك ومدينتك وشبكة وكلائك الفرعيين وخبرتك.',
    url: 'https://pnparfume.com/ar/distributor',
    siteName: 'PN Parfüm',
    locale: 'ar',
    type: 'website',
  },
}

export default function ArDistributorPage() {
  return (
    <div lang="ar" dir="rtl">
      {distributorJsonLd('ar', 'https://pnparfume.com/ar/distributor').map((d) => (
        <script key={d['@type']} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
      <h1 className="sr-only">كن موزّع PN Parfüm</h1>
      <DistributorContent locale="ar" />
      <p className="text-center mt-16 text-sm text-foreground/40">
        تبحثون عن متجرنا التركي؟ <Link href="/" className="text-accent-gold hover:underline">زوروا pnparfume.com</Link>
      </p>
    </div>
  )
}
