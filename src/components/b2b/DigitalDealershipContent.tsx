import Link from 'next/link'
import DigitalDealerFilm from './DigitalDealerFilm'
import DealershipForm from './DealershipForm'

// Dijital bayilik (e-ticaret yapan girişimciler için bayilik modeli) — yalnız Türkçe.
// Fiyat/MOQ/kâr/münhasırlık vaadi YOK; kapsam başvuru sonrası netleşir.
const WHY: [string, string][] = [
  ['E-ticaret girişimcilerine özel bayilik sistemi', 'Kendi web siteniz, mobil uygulamanız veya pazaryeri mağazanız varsa, ürünlerimizi satış kanalınıza ekleyen ayrı bir bayilik modeliyle çalışırsınız.'],
  ['API desteği', 'Ürün ve stok bilgilerini kendi sisteminize aktarmanız için teknik entegrasyon desteği sunmayı hedefliyoruz; kapsam başvuru sonrasında birlikte belirlenir.'],
  ['Ürün katalog desteği', 'Ürün görselleri, açıklamalar ve katalog içeriği ile mağazanızı hızlıca doldurmanıza yardımcı oluruz.'],
  ['Depo derdi yok', 'Sipariş geldiğinde bize iletirsiniz; ürünü fabrikamızdaki depoda sizin adınıza hazırlayıp kargolarız. Büyük stok tutmanız gerekmez.'],
]

const STEPS: [string, string][] = [
  ['Başvurun', 'Aşağıdaki formu işletmeniz ve satış kanalınızla doldurun.'],
  ['Ekibimiz inceler', 'Başvurunuz satış kanalınıza ve iş modelinize göre değerlendirilir.'],
  ['Birlikte netleştirelim', 'Uygun başvurularda katalog, entegrasyon ve sipariş akışı ayrıntıları görüşülür.'],
]

const FAQS: [string, string][] = [
  ['Dijital bayilik nedir?', 'E-ticaret yapan girişimcilerin PN Parfüm ürünlerini kendi web sitesi, uygulaması veya pazaryeri mağazasında satabildiği, siparişi bize ilettiği ve ürünün fabrikamızdaki depodan sizin adınıza kargolandığı bayilik modelidir.'],
  ['Dijital bayilik ile normal bayilik arasındaki fark nedir?', 'Normal bayilikte ürünler toptan alınıp kendi mağazanızda veya kanalınızda satılır. Dijital bayilik ise e-ticaret odaklıdır; katalog ve entegrasyon desteği ile depo ve stok yükü olmadan satış yapmaya odaklanır.'],
  ['Fiyat, minimum adet veya kâr oranı nedir?', 'Kapsam ve koşullar başvuru sonrasında birlikte netleştirilir; bu sayfada fiyat, adet veya kazanç taahhüdü verilmez.'],
  ['Franchise veya mağaza açma desteği var mı?', 'Hayır. Bayilik ürünleri kendi işletmenizde satmaya dayanır; franchise veya mağaza açma desteği sunulmaz.'],
]

export const digitalDealershipJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'tr',
    mainEntity: FAQS.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Dijital Bayilik: E-ticaret Girişimcilerine Özel Bayilik',
    url: 'https://pnparfume.com/kurumsal/bayilik/dijital',
    inLanguage: 'tr',
    about: { '@type': 'Service', serviceType: 'Digital perfume dealership for e-commerce entrepreneurs' },
    isPartOf: { '@type': 'WebSite', name: 'PN Parfüm', url: 'https://pnparfume.com' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'PN Parfüm dijital bayilik tanıtım filmi',
    description: 'Sen sat, biz gönderelim: e-ticaret girişimcileri için dijital bayilik modeli.',
    inLanguage: 'tr',
    thumbnailUrl: 'https://pnparfume.com/kurumsal/pien-dijital-bayilik-poster.jpg',
    contentUrl: 'https://pnparfume.com/kurumsal/pien-dijital-bayilik-tr.mp4',
    uploadDate: '2026-11-19',
    duration: 'PT43S',
  },
]

export default function DigitalDealershipContent() {
  return (
    <div className="space-y-16" lang="tr">
      <section aria-labelledby="dd-hero" className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent-gold">Bayilik / Dijital Bayilik</p>
        <h2 id="dd-hero" className="text-3xl font-light leading-tight sm:text-4xl">E-ticaret Yapan Girişimcilere Özel Dijital Bayilik</h2>
        <p className="max-w-3xl leading-relaxed text-foreground/70">
          Online satış yapıyorsanız PN Parfüm ürünlerini kendi mağazanıza ekleyin: size özel bayilik sistemi, API ve ürün katalog desteği ile depo ve stok derdi olmadan satış yapın.
        </p>
        <a href="#dd-form" className="inline-block rounded-full bg-[#d9b98a] px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-white">Başvuru Formuna Git</a>
      </section>

      <DigitalDealerFilm />

      <section aria-labelledby="dd-why" className="space-y-6">
        <h3 id="dd-why" className="text-2xl font-light">Dijital bayilikte neler sunuyoruz?</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {WHY.map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-foreground/10 bg-background p-6">
              <h4 className="mb-2 font-medium text-foreground">{t}</h4>
              <p className="text-sm leading-relaxed text-foreground/65">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="dd-steps" className="space-y-6">
        <h3 id="dd-steps" className="text-2xl font-light">Nasıl işler?</h3>
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="flex items-start gap-4 rounded-2xl border border-foreground/10 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent-gold/60 font-light text-accent-gold">{i + 1}</span>
              <div>
                <p className="font-medium text-foreground">{t}</p>
                <p className="text-sm text-foreground/60">{d}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="rounded-2xl border border-accent-gold/30 bg-accent-gold/5 p-5">
          <p className="mb-1 text-sm font-medium text-foreground">Önemli bilgi</p>
          <p className="text-xs leading-relaxed text-foreground/65">
            Başvuru ön taleptir. Fiyat, adet, entegrasyon kapsamı ve sözleşme koşulları başvuru sonrasında birlikte netleştirilir. Bayilik, ürünleri kendi işletmenizde satmaya dayanır; franchise veya mağaza açma desteği içermez.
          </p>
        </div>
      </section>

      <section id="dd-form" aria-labelledby="dd-formh" className="rounded-3xl border border-foreground/10 bg-background p-6 md:p-10">
        <h3 id="dd-formh" className="mb-2 text-2xl font-light">Dijital Bayilik Başvuru Formu</h3>
        <p className="mb-8 text-sm text-foreground/60">E-ticaret kanalınızı (web sitesi, uygulama veya pazaryeri) ve ilgilendiğiniz serileri belirtin.</p>
        <DealershipForm locale="tr" />
      </section>

      <section aria-labelledby="dd-faq" className="space-y-3">
        <h3 id="dd-faq" className="text-2xl font-light">Sıkça Sorulan Sorular</h3>
        {FAQS.map(([q, a]) => (
          <details key={q} className="rounded-2xl border border-foreground/10 p-5">
            <summary className="cursor-pointer font-medium">{q}</summary>
            <p className="mt-3 text-sm leading-relaxed text-foreground/65">{a}</p>
          </details>
        ))}
      </section>

      <section className="rounded-2xl border border-foreground/10 p-6">
        <h3 className="mb-2 text-lg font-medium">Mağazanızda veya kanalınızda toptan satmak mı istiyorsunuz?</h3>
        <p className="mb-4 text-sm text-foreground/65">Fiziksel mağaza veya klasik online kanal için genel bayilik sayfamıza göz atın.</p>
        <Link href="/kurumsal/bayilik" className="inline-block rounded-full border border-accent-gold px-5 py-2 text-sm text-accent-gold transition-colors hover:bg-accent-gold hover:text-background">Bayilik Sayfası</Link>
      </section>
    </div>
  )
}
