import DistributorContent, { distributorJsonLd } from '@/components/b2b/DistributorContent'

export const metadata = {
  title: 'Distribütörlük Başvurusu: PN Parfüm ile Bölgenizde Çalışın | PN Parfüm (Pien Parfum)',
  description:
    '2002’den beri üretimdeyiz. Ülke ve şehrinizde PN Parfüm ürünlerinin distribütörü olmak için talep bırakın: bölge, alt bayi ağı ve sektör deneyiminizi paylaşın, ekibimiz sizinle iletişime geçsin.',
  keywords: ['parfüm distribütörlüğü', 'parfüm bayiliği', 'PN Parfüm distribütör', 'parfüm toptan distribütör'],
  alternates: {
    canonical: 'https://pnparfume.com/kurumsal/distributorluk',
    languages: {
      tr: 'https://pnparfume.com/kurumsal/distributorluk',
      en: 'https://pnparfume.com/en/distributor',
      ar: 'https://pnparfume.com/ar/distributor',
      'x-default': 'https://pnparfume.com/en/distributor',
    },
  },
  openGraph: {
    title: 'Distribütörlük Başvurusu | PN Parfüm',
    description:
      'PN Parfüm ile bölgenizde distribütör olun: ülke, şehir, alt bayi ağı ve sektör deneyiminizi paylaşarak talep bırakın.',
    url: 'https://pnparfume.com/kurumsal/distributorluk',
    siteName: 'PN Parfüm',
    locale: 'tr_TR',
    type: 'website',
  },
}

export default function DistributorlukPage() {
  return (
    <>
      {distributorJsonLd('tr', 'https://pnparfume.com/kurumsal/distributorluk').map((d) => (
        <script key={d['@type']} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
      <DistributorContent locale="tr" />
    </>
  )
}
