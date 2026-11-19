import Image from 'next/image'

const PILLARS = [
  {
    no: '01',
    title: 'Koku ve Kişilik',
    image: '/kurumsal/koleksiyon.jpg',
    alt: 'Kendi markanız için tasarlanmış üç parfüm ve kutu koleksiyonu',
    text: 'Sıradan koku ailelerinin yanı sıra, sektörde sevilen koku karakterlerini temel alıp onlara farklı kişilikler kazandırarak rekabetçi, size özgü ürünler tasarlamanıza yardımcı oluyoruz.',
  },
  {
    no: '02',
    title: 'Marka Tescili',
    image: '/kurumsal/marka-tescil.jpg',
    alt: 'Marka tescil dosyası, mühür ve büyüteç',
    text: 'Marka isminizin tescil (patent) sürecinde başvurudan takibe adım adım yönlendiriyor, isim ve sınıf seçimi gibi kritik kararlarda yanınızda oluyoruz.',
  },
  {
    no: '03',
    title: 'Logo Tasarımı',
    image: '/kurumsal/logo-tasarimi.jpg',
    alt: 'Logo çizim çalışması: eskizler, renk ve folyo örnekleri',
    text: 'Markanızın karakterini yansıtan logo ve renk kimliğini eskizden son hâline kadar birlikte tasarlıyoruz.',
  },
  {
    no: '04',
    title: 'Şişe Seçimi',
    image: '/kurumsal/sise-cesitleri.jpg',
    alt: 'Farklı şekil ve hacimlerde boş parfüm şişeleri',
    text: 'Çalıştığımız şişe üreticileriyle zengin model çeşitleri sunuyor, sektörün nabzına göre hacim seçimi konusunda danışmanlık veriyoruz.',
  },
  {
    no: '05',
    title: 'Kutu Tasarımı',
    image: '/kurumsal/kutu-tasarimi.jpg',
    alt: 'Parfüm kutusu tasarım çalışması: renk ve kâğıt örnekleri',
    text: 'Anlaşmalı matbaalarımızla, kutu tasarımınız için en uygun fiyatı almanıza aracılık ediyoruz.',
  },
  {
    no: '06',
    title: 'Etiket Tasarımı',
    image: '/kurumsal/etiket-tasarimi.jpg',
    alt: 'Parfüm şişeleri için etiket tasarımı ve folyo detayları',
    text: 'Şişenize uygun etiket formu, malzeme ve baskı detaylarını yasal etiket gerekliliklerini de gözeterek birlikte tasarlıyoruz.',
  },
] as const

const STEPS = [
  { title: 'Koku ve Kişilik', sub: 'Size özgü koku karakteri' },
  { title: 'Marka ve Logo', sub: 'Tescil ve görsel kimlik' },
  { title: 'Şişe Seçimi', sub: 'Model ve hacim' },
  { title: 'Kutu ve Etiket', sub: 'Tasarım ve baskı' },
  { title: 'Kayıt ve Belgeler', sub: 'Süreçlerde kolaylık' },
  { title: 'Markanızın Koleksiyonu', sub: 'Kendi adınız altında' },
]

export default function BrandPartnership() {
  return (
    <section aria-labelledby="brand-partnership-heading" className="space-y-10">
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent-gold">
          2002&apos;den beri üretimdeyiz
        </p>
        <h3 id="brand-partnership-heading" className="text-3xl font-light text-foreground">
          Markanızı Birlikte Kuruyoruz
        </h3>
        <p className="max-w-3xl text-sm leading-relaxed text-foreground/70">
          24 yıllık tecrübemiz ve var olan markalarımızla birçok kayıt sürecini sizin için
          kolaylaştırıyor, kendi markanız altında koleksiyon oluşturmanız için koku, marka tescili,
          logo, şişe, kutu ve etiket adımlarının hepsinde yanınızda oluyoruz.
        </p>
      </div>

      {/* Görsel şema: süreç akışı */}
      <ol
        aria-label="Marka kurma süreci"
        className="grid grid-cols-1 gap-3 md:grid-cols-6 md:gap-0"
      >
        {STEPS.map((step, i) => (
          <li key={step.title} className="relative flex items-start gap-4 md:flex-col md:items-center md:text-center">
            <div className="relative flex items-center md:w-full md:justify-center">
              <span className="z-10 flex h-12 w-12 items-center justify-center rounded-full border border-accent-gold/60 bg-background font-light text-accent-gold">
                {i + 1}
              </span>
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 hidden h-px w-full bg-gradient-to-r from-accent-gold/60 to-accent-gold/10 md:block"
                />
              )}
            </div>
            <div className="md:mt-3 md:px-2">
              <p className="text-sm font-medium text-foreground">{step.title}</p>
              <p className="text-xs text-foreground/55">{step.sub}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* Üç ana destek alanı */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {PILLARS.map((p) => (
          <article
            key={p.title}
            className="overflow-hidden rounded-2xl border border-foreground/10 bg-background"
          >
            <div className="relative aspect-[3/2] w-full">
              <Image
                src={p.image}
                alt={p.alt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-2 p-5">
              <p className="text-xs tracking-[0.2em] text-accent-gold">{p.no}</p>
              <h4 className="text-lg font-medium text-foreground">{p.title}</h4>
              <p className="text-sm leading-relaxed text-foreground/65">{p.text}</p>
            </div>
          </article>
        ))}
      </div>

      <p className="text-xs text-foreground/50">
        Kapsam, süre ve koşullar projeye göre birlikte belirlenir. Ayrıntılar için aşağıdaki
        formu doldurabilirsiniz.
      </p>
    </section>
  )
}
