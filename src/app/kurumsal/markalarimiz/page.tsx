import BrandsShowcase, { BRANDS } from '@/components/brands/BrandsShowcase'
import UmbrellaSeries from '@/components/brands/UmbrellaSeries'

export const metadata = {
  title: 'Markalarımız ve Ürün Serilerimiz: Pien, Pien Intense, Aşık, Pien Luxury, PN | PN Parfüm',
  description:
    '2002’den beri üretimdeyiz. Pien Serisi, Pien Intense, Aşık Parfüm, Pien Luxury ve PN: günlük kullanımdan davet ve lüks koleksiyonlara kadar parfüm markalarımız ve ürün serilerimiz.',
  alternates: {
    canonical: 'https://pnparfume.com/kurumsal/markalarimiz',
    languages: {
      tr: 'https://pnparfume.com/kurumsal/markalarimiz',
      en: 'https://pnparfume.com/en/brands',
    },
  },
  openGraph: {
    title: 'Markalarımız ve Ürün Serilerimiz | PN Parfüm',
    description:
      'Pien Serisi, Pien Intense, Aşık Parfüm, Pien Luxury ve PN: her ihtiyaca göre tasarlanmış beş parfüm markası ve serisi.',
    url: 'https://pnparfume.com/kurumsal/markalarimiz',
    siteName: 'PN Parfüm',
    locale: 'tr_TR',
    type: 'website',
  },
}

const faqs = [
  {
    q: 'PN Parfüm hangi markaları ve ürün serilerini üretiyor?',
    a: 'Pien Serisi, Pien Intense, Aşık Parfüm, Pien Luxury ve PN olmak üzere beş marka ve ürün serisi üretiyoruz. Günlük kullanımdan davet ve özel günlere, ekonomik serilerden lüks koleksiyonlara kadar farklı ihtiyaçlara göre tasarlandılar.',
  },
  {
    q: 'Pien Serisi ile Pien Intense arasındaki fark nedir?',
    a: 'Pien Serisi, günlük kullanım için tasarlanmış ekonomik ve %20 esans oranına sahip bir seridir. Pien Intense ise %20 daha fazla esans oranına sahip, özel tasarlanmış kokulardan oluşan, yine ekonomik ve günlük kullanıma yönelik bir seridir.',
  },
  {
    q: 'Pien Luxury hangi hacimde ve nasıl bir seri?',
    a: 'Pien Luxury, çok yoğun esans ve çok özel esansiyel yağlarla üretilmiş, şık tasarımlı, 100 ml şişe hacmiyle sunulan lüks bir parfüm koleksiyonudur.',
  },
  {
    q: 'Aşık Parfüm ne zaman kullanılır?',
    a: 'Aşık Parfüm, özel kokular içeren, yüksek esans yoğunluklu ve şık tasarımlı özel bir seridir; davet ve özel günlerde kullanılması için tasarlanmıştır.',
  },
  {
    q: 'Kendi markamı kurmadan PN çatısı altında kendi serimi üretebilir miyim?',
    a: 'Evet. PN markasının çatısı altında size özel bir alt marka serisi (örneğin MIX veya AGORA gibi) üretebilirsiniz. Bu şekilde maliyetinizi kısabilir ve kendi markanızla üretimde karşılaşılan yüksek adet sınırlarından kaçınabilirsiniz. Kapsam, adet ve koşullar projeye göre birlikte belirlenir.',
  },
  {
    q: 'PN markasının özelliği nedir?',
    a: 'PN, günlük kullanım için tasarlanmış, 1. sınıf esansa sahip bir koleksiyondur ve kendi içinde özel serileri ile özel tasarım serileri bulunur.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'PN Parfüm markaları ve ürün serileri',
    inLanguage: 'tr',
    itemListElement: BRANDS.tr.items.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Brand',
        name: b.name,
        description: b.text,
        url: 'https://pnparfume.com/kurumsal/markalarimiz',
      },
    })),
  },
]

export default function MarkalarimizPage() {
  return (
    <div className="space-y-12">
      {jsonLd.map((d) => (
        <script
          key={d['@type']}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}

      <BrandsShowcase locale="tr" />

      <UmbrellaSeries locale="tr" />

      <section aria-labelledby="sss-markalar" className="space-y-3">
        <h2 id="sss-markalar" className="text-2xl font-light">
          Sıkça Sorulan Sorular
        </h2>
        {faqs.map((f) => (
          <details key={f.q} className="rounded-2xl border border-foreground/10 p-5">
            <summary className="cursor-pointer font-medium">{f.q}</summary>
            <p className="mt-3 text-sm leading-relaxed text-foreground/65">{f.a}</p>
          </details>
        ))}
      </section>
    </div>
  )
}
