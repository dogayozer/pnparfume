// Dijital bayilik tanıtım filmi + kısa açıklama (Türkçe ve İngilizce; Arapça film yok).
// Video yalnızca oynatılınca iner (preload="none"); kapak ~100 KB, video ~3 MB.
const T = {
  tr: {
    label: 'Pien Parfüm dijital bayilik tanıtım filmi',
    cap: 'Dijital bayilik filmi (43 sn)',
    eyebrow: 'Dijital Bayilik',
    h: 'Sen sat, biz gönderelim',
    p: 'Online satış yapıyorsanız ürünlerimizi kendi mağazanızda ya da satış platformlarında satışa koyun. Sipariş geldiğinde bize iletin; ürünü fabrikamızdaki depoda sizin adınıza hazırlayıp kargolayalım. Depo ve büyük stok derdi olmadan, kendi ürünlerinizin yanında yeni bir gelir kapısı açın.',
    note: 'Kapsam ve koşullar başvuru sonrasında birlikte netleştirilir.',
  },
  en: {
    label: 'Pien Parfüm digital dealership film',
    cap: 'Digital dealership film (43 sec)',
    eyebrow: 'Digital Dealership',
    h: 'You sell, we ship',
    p: 'If you sell online, list our products in your own store or on marketplaces. When an order comes in, pass it to us; we prepare the product in our factory warehouse on your behalf and ship it. With no warehouse or large stock to worry about, open a new source of income alongside your own products.',
    note: 'Scope and terms are clarified together after your application.',
  },
} as const

export default function DigitalDealerFilm({ locale = 'tr' }: { locale?: 'tr' | 'en' }) {
  const c = T[locale]
  return (
    <section
      aria-labelledby={`dijital-bayilik-film-${locale}`}
      lang={locale}
      className="grid grid-cols-1 items-center gap-8 rounded-3xl border border-foreground/10 bg-foreground/[0.02] p-6 md:grid-cols-[300px_1fr] md:p-8"
    >
      <figure className="mx-auto w-full max-w-[300px]">
        <video
          aria-label={c.label}
          className="aspect-[9/16] w-full rounded-2xl border border-foreground/10 bg-black object-cover"
          controls
          playsInline
          preload="none"
          poster="/kurumsal/pien-dijital-bayilik-poster.jpg"
        >
          <source src={`/kurumsal/pien-dijital-bayilik-${locale}.mp4`} type="video/mp4" />
        </video>
        <figcaption className="mt-3 text-center text-xs text-foreground/50">{c.cap}</figcaption>
      </figure>
      <div className="space-y-4">
        <span className="text-xs font-medium uppercase tracking-widest text-accent-gold">{c.eyebrow}</span>
        <h3 id={`dijital-bayilik-film-${locale}`} className="text-2xl font-light">
          {c.h}
        </h3>
        <p className="leading-relaxed text-foreground/70">{c.p}</p>
        <p className="text-xs leading-relaxed text-foreground/45">{c.note}</p>
      </div>
    </section>
  )
}
