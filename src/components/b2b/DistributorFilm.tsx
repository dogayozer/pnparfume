// Distribütörlük tanıtım filmi + kısa açıklama (İngilizce ve Arapça sayfalar).
// Video yalnızca oynatılınca iner (preload="none"); kapak ~125 KB, video ~2,5 MB.
const T = {
  en: {
    label: 'PN Parfüm distributor film',
    cap: 'Distributor film (40 sec)',
    eyebrow: 'Distributor',
    h: 'Build your own network',
    p: 'Distribute PN Parfüm to gas stations, markets, beauty salons and your own stores in your country. Watch how a distribution network can start.',
    note: 'Scope and terms are clarified together after your application.',
  },
  ar: {
    label: 'فيلم الموزّعين لدى PN Parfüm',
    cap: 'فيلم التوزيع (40 ثانية)',
    eyebrow: 'التوزيع',
    h: 'ابنِ شبكتك الخاصة',
    p: 'وزّع عطور PN Parfüm على محطات الوقود والأسواق وصالونات التجميل ومتاجرك الخاصة في بلدك. شاهد كيف يمكن أن تبدأ شبكة التوزيع.',
    note: 'يتم توضيح النطاق والشروط معًا بعد تقديم طلبك.',
  },
} as const

export default function DistributorFilm({ locale = 'en' }: { locale?: 'en' | 'ar' }) {
  const c = T[locale]
  const id = `distributor-film-${locale}`
  return (
    <section
      aria-labelledby={id}
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className="grid grid-cols-1 items-center gap-8 rounded-3xl border border-foreground/10 bg-foreground/[0.02] p-6 md:grid-cols-[300px_1fr] md:p-8"
    >
      <figure className="mx-auto w-full max-w-[300px]">
        <video
          aria-label={c.label}
          className="aspect-[9/16] w-full rounded-2xl border border-foreground/10 bg-black object-cover"
          controls
          playsInline
          preload="none"
          poster="/kurumsal/pien-distributor-poster.jpg"
        >
          <source src={`/kurumsal/pien-distributor-${locale}.mp4`} type="video/mp4" />
        </video>
        <figcaption className="mt-3 text-center text-xs text-foreground/50">{c.cap}</figcaption>
      </figure>
      <div className="space-y-4">
        <span className="text-xs font-medium uppercase tracking-widest rtl:tracking-normal rtl:normal-case text-accent-gold">{c.eyebrow}</span>
        <h3 id={id} className="text-2xl font-light">
          {c.h}
        </h3>
        <p className="leading-relaxed text-foreground/70">{c.p}</p>
        <p className="text-xs leading-relaxed text-foreground/45">{c.note}</p>
      </div>
    </section>
  )
}
