import DigitalDealershipContent, { digitalDealershipJsonLd } from '@/components/b2b/DigitalDealershipContent'

export const metadata = {
  title: 'Dijital Bayilik: E-ticaret Girişimcilerine Özel | PN Parfüm (Pien Parfum)',
  description:
    'E-ticaret yapan girişimcilere özel dijital bayilik: size özel bayilik sistemi, API ve ürün katalog desteği, depo derdi olmadan satış. Tanıtım filmini izleyin, başvurun.',
  keywords: ['dijital bayilik', 'e-ticaret parfüm bayiliği', 'online parfüm bayisi', 'PN Parfüm dijital bayilik'],
  alternates: { canonical: 'https://pnparfume.com/kurumsal/bayilik/dijital' },
  openGraph: {
    title: 'Dijital Bayilik | PN Parfüm',
    description: 'Sen sat, biz gönderelim: e-ticaret girişimcileri için dijital bayilik.',
    url: 'https://pnparfume.com/kurumsal/bayilik/dijital',
    siteName: 'PN Parfüm',
    locale: 'tr_TR',
    type: 'website',
  },
}

export default function DijitalBayilikPage() {
  return (
    <>
      {digitalDealershipJsonLd.map((d) => (
        <script key={d['@type']} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
      <DigitalDealershipContent />
    </>
  )
}
