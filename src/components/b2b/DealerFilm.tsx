type Locale = 'tr' | 'en' | 'ar'

const TEXT = {
  tr: {
    title: 'Küçük bir dükkandan büyük bir hikâyeye',
    caption: 'Nilay’ın Pien Parfüm bayilik hikâyesi (40 sn)',
    label: 'Pien Parfüm bayilik tanıtım filmi',
  },
  en: {
    title: 'From a small shop to a big story',
    caption: 'Nilay’s Pien Parfume dealer story (40 sec)',
    label: 'Pien Parfume dealer promo film',
  },
  ar: {
    title: 'من متجر صغير إلى قصة كبيرة',
    caption: 'قصة نيلاي مع وكالة بيان بارفيوم (40 ثانية)',
    label: 'فيلم ترويجي لوكلاء بيان بارفيوم',
  },
} as const

// Video yalnızca oynatılınca iner (preload="none"); kapak görseli ~160 KB, video ~2,8 MB.
export default function DealerFilm({ locale = 'tr' }: { locale?: Locale }) {
  const t = TEXT[locale]
  return (
    <figure lang={locale} className="mx-auto w-full max-w-[300px] space-y-3">
      <figcaption className="text-center text-sm font-medium text-foreground/80">{t.title}</figcaption>
      <video
        aria-label={t.label}
        className="aspect-[9/16] w-full rounded-2xl border border-foreground/10 bg-black object-cover"
        controls
        playsInline
        preload="none"
        poster="/kurumsal/pien-bayilik-poster.jpg"
      >
        <source src={`/kurumsal/pien-bayilik-${locale}.mp4`} type="video/mp4" />
      </video>
      <p className="text-center text-xs text-foreground/50">{t.caption}</p>
    </figure>
  )
}
