export const metadata = {
  title: 'Kendi Parfüm Markanı Kur: Fason Üretim, Logo, Etiket | PN Parfüm (Pien Parfum)',
  description:
    '2002’den beri üretimdeyiz. Kendi parfüm markanızı kurun: 400 koku seçeneği, marka tescili yönlendirmesi, logo, şişe, kutu ve etiket tasarımı ile fason üretim ve mevzuat rehberi.',
  alternates: {
    canonical: 'https://pnparfume.com/kurumsal/girisimcilere-ozel',
    languages: {
      tr: 'https://pnparfume.com/kurumsal/girisimcilere-ozel',
      en: 'https://pnparfume.com/en/private-label',
      ar: 'https://pnparfume.com/ar/private-label',
    },
  },
  openGraph: {
    title: 'Kendi Parfüm Markanı Kur | PN Parfüm',
    description:
      'Koku, marka tescili yönlendirmesi, logo, şişe, kutu ve etiket tasarımı: kendi parfüm markanızı birlikte kuruyoruz.',
    url: 'https://pnparfume.com/kurumsal/girisimcilere-ozel',
    siteName: 'PN Parfüm',
    locale: 'tr_TR',
    type: 'website',
  },
}

const faqs = [
  {
    q: 'Kendi parfüm markamı kurarken hangi konularda destek veriyorsunuz?',
    a: 'Koku seçimi ve tasarımı, marka tescili sürecinde yönlendirme, logo ve renk kimliği, şişe seçimi, kutu ve etiket tasarımı ile fason üretim süreçlerinin tamamında destek veriyoruz. Kapsam ve koşullar projeye göre birlikte belirlenir.',
  },
  {
    q: 'Kaç farklı koku seçeneğiniz var?',
    a: 'Laboratuvarımızda aralarından seçim yapabileceğiniz 400 farklı koku seçeneği bulunuyor. Sevilen koku karakterlerini temel alıp onlara farklı kişilikler kazandırarak markanıza özgü ürünler tasarlayabilirsiniz.',
  },
  {
    q: 'Şişe ve kutu seçiminde nasıl yardımcı oluyorsunuz?',
    a: 'Çalıştığımız şişe üreticileriyle zengin model çeşitleri sunuyor ve sektörün nabzına göre hacim konusunda danışmanlık veriyoruz. Anlaşmalı matbaalarımızla kutu tasarımınız için en uygun fiyatı almanıza aracılık ediyoruz.',
  },
  {
    q: 'Marka tescili (patent) sürecinde ne yapıyorsunuz?',
    a: 'İsim ve sınıf seçimi gibi kritik kararlarda, başvurudan takibe kadar adım adım yönlendirme yapıyoruz. Başvurunun sonuçlanması ilgili kurumun kararına bağlıdır.',
  },
  {
    q: 'PN Parfüm ne zamandan beri üretim yapıyor?',
    a: 'PN Parfüm (Pien Parfum) 2002 yılından beri parfüm üretimi yapıyor; 24 yıllık tecrübe ve var olan markalarımızla birçok kayıt sürecini kolaylaştırıyoruz.',
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
    '@type': 'Service',
    serviceType: 'Private label perfume manufacturing and brand building',
    name: 'Kendi Parfüm Markanı Kur',
    inLanguage: 'tr',
    areaServed: 'TR',
    provider: {
      '@type': 'Organization',
      name: 'PN Parfüm',
      alternateName: 'Pien Parfum',
      url: 'https://pnparfume.com',
      foundingDate: '2002',
    },
  },
]

import BrandPartnership from '@/components/b2b/BrandPartnership'
import BrandRoadmapGuide from './BrandRoadmapGuide'
import CorporateForm from './CorporateForm'

export default function GirisimcilereOzelPage() {
  return (
    <div className="space-y-12">
      {jsonLd.map((d) => (
        <script
          key={d['@type']}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
      <div>
        <h2 className="text-3xl font-light mb-4 text-accent-gold">
          Girişimcilere Özel: Kendi Parfüm Markanızı Kurun
        </h2>
        <p className="text-foreground/70 leading-relaxed mb-4">
          Yapay zeka analiz destekli koku tasarımında öncü olan <strong>PN Parfüm (Pien Parfum)</strong>, 2002'den beri parfüm üretimi yapan bir marka olarak,
          hem hazır ürün portföyümüzle kârlı dijital iş ortaklığı kurmak isteyenlere hem de{' '}
          <strong>kendi parfüm markasını sıfırdan hayata geçirmek isteyen girişimcilere</strong> uçtan uca
          fason üretim ve mevzuat rehberliği sunar.
        </p>
        <p className="text-foreground/70 leading-relaxed">
          Fikirden ilk satışa uzanan bu süreçte koku ve konsantrasyon seçiminden numune/maserasyona,
          şişe ve valf tedarikinden etil alkol mevzuatına, 82 alerjen ve etiket kontrolünden TİTCK (ÜTS)
          dosyalamasına kadar her aşamayı zihin haritası ve algoritmik karar akışıyla sizin için
          şeffaf hale getiriyoruz.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 border border-foreground/10 rounded-2xl bg-background">
          <h3 className="font-medium text-lg mb-2">Kendi Markanızla Fason Üretim</h3>
          <p className="text-sm text-foreground/60">
            Kendi tesisinizi kurmadan GMP ilkelerine uygun üretim, numune geliştirme, şişe/valf seçimi ve teknik dosya desteği.
          </p>
        </div>
        <div className="p-6 border border-foreground/10 rounded-2xl bg-background">
          <h3 className="font-medium text-lg mb-2">Mevzuat ve Etiket Güvencesi</h3>
          <p className="text-sm text-foreground/60">
            IFRA Kategori 4 limitleri, 82 parfüm alerjeni, Madde 22 Türkçe etiket kuralları ve ÜTS süreci için eksiksiz teknik veri.
          </p>
        </div>
        <div className="p-6 border border-foreground/10 rounded-2xl bg-background">
          <h3 className="font-medium text-lg mb-2">Yüksek Kâr Marjı ve Marka İmajı</h3>
          <p className="text-sm text-foreground/60">
            Doğrudan üreticiden avantajlı alım yaparak dijital ortamda ve perakendede rekabetçi kârlılık oranlarına ulaşın.
          </p>
        </div>
        <div className="p-6 border border-foreground/10 rounded-2xl bg-background">
          <h3 className="font-medium text-lg mb-2">API, Pazarlama ve Toptan</h3>
          <p className="text-sm text-foreground/60">
            Hazır ürünlerle hızlı başlamak isteyen iş ortakları için gelişmiş API altyapısı, görsel/metin desteği ve toptan tedarik.
          </p>
        </div>
      </div>

      <BrandPartnership locale="tr" />

      <BrandRoadmapGuide />

      <section aria-labelledby="sss-baslik" className="space-y-3">
        <h2 id="sss-baslik" className="text-2xl font-light">
          Sıkça Sorulan Sorular
        </h2>
        {faqs.map((f) => (
          <details key={f.q} className="rounded-2xl border border-foreground/10 p-5">
            <summary className="cursor-pointer font-medium">{f.q}</summary>
            <p className="mt-3 text-sm leading-relaxed text-foreground/65">{f.a}</p>
          </details>
        ))}
      </section>

      <CorporateForm />
    </div>
  )
}
