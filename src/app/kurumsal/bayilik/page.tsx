import DealershipContent, { dealershipJsonLd } from '@/components/b2b/DealershipContent'

export const metadata = {
  "title": "Bayilik Başvurusu: PN Parfüm Bayisi Olun | PN Parfüm (Pien Parfum)",
  "description": "2002’den beri üretimdeyiz. Kendi mağazanızda veya online kanalınızda PN Parfüm ürünlerini satmak için bayilik başvurusu yapın: tanıtım filmini izleyin, formu doldurun, ekibimiz sizinle iletişime geçsin.",
  "keywords": [
    "parfüm bayiliği",
    "parfüm bayisi olmak",
    "PN Parfüm bayilik",
    "parfüm toptan bayi",
    "bayilik başvurusu"
  ],
  "alternates": {
    "canonical": "https://pnparfume.com/kurumsal/bayilik",
    "languages": {
      "tr": "https://pnparfume.com/kurumsal/bayilik",
      "en": "https://pnparfume.com/en/dealership",
      "ar": "https://pnparfume.com/ar/dealership",
      "x-default": "https://pnparfume.com/en/dealership"
    }
  },
  "openGraph": {
    "title": "Bayilik Başvurusu | PN Parfüm",
    "description": "PN Parfüm bayisi olun: tanıtım filmini izleyin ve bayilik başvuru formunu doldurun.",
    "url": "https://pnparfume.com/kurumsal/bayilik",
    "siteName": "PN Parfüm",
    "locale": "tr_TR",
    "type": "website"
  }
}

export default function BayilikPage() {
  return (
    <>
      {dealershipJsonLd('tr', 'https://pnparfume.com/kurumsal/bayilik').map((d) => (
        <script key={d['@type']} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
      <DealershipContent locale="tr" />
    </>
  )
}
