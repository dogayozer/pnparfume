'use client'

// Girişimcilere Özel hero bölümü: mixparfum.com ana sayfa hero'su ile aynı düzen
// (arkada sessiz, yavaşlatılmış, gri tonlu video döngüsü + ortalı başlık + iki buton).
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const VIDEOS = [
  '/kurumsal/hero/terzi.mp4',
  '/kurumsal/hero/tasarim.mp4',
  '/kurumsal/hero/parfumor.mp4',
]

function HeroBackgroundVideo() {
  const [index, setIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Videoyu %30 yavaşlatarak daha sakin bir his verir
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.7
  }, [index])

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <video
        ref={videoRef}
        key={VIDEOS[index]}
        autoPlay
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        onEnded={() => setIndex((i) => (i + 1) % VIDEOS.length)}
        className="h-full w-full object-cover grayscale"
      >
        <source src={VIDEOS[index]} type="video/mp4" />
      </video>
      {/* Metnin okunabilirliği için videonun üstüne yarı saydam katman */}
      <div className="absolute inset-0 bg-background/45" />
    </div>
  )
}

type Locale = 'tr' | 'en' | 'ar'

// Videolarda yazı yok; yalnızca üstteki metin dile göre değişir.
const TEXT = {
  tr: {
    label: 'Kendi parfüm markanı tasarla',
    eyebrow: 'Girişimcilere Özel',
    before: 'Tam sana göre ',
    em: 'markanı',
    after: 'sen tasarla.',
    primary: 'Kendi Markanı Yarat',
    secondary: 'Süreci Keşfet',
    applyId: '#basvuru',
    processId: '#surec',
  },
  en: {
    label: 'Design your own perfume brand',
    eyebrow: 'For Entrepreneurs',
    before: 'Design your own ',
    em: 'brand',
    after: 'made just for you.',
    primary: 'Create Your Brand',
    secondary: 'Explore the Process',
    applyId: '#apply',
    processId: '#process',
  },
  ar: {
    label: 'صمّم علامتك التجارية للعطور',
    eyebrow: 'لرواد الأعمال',
    before: 'صمّم ',
    em: '',
    after: 'علامتك التجارية بنفسك، على مقاسك تمامًا.',
    primary: 'أنشئ علامتك',
    secondary: 'اكتشف المراحل',
    applyId: '#apply',
    processId: '#process',
  },
} as const

export default function BrandHero({ locale = 'tr' }: { locale?: Locale }) {
  const t = TEXT[locale]
  return (
    <section
      aria-label={t.label}
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-background"
    >
      <HeroBackgroundVideo />
      <div className="relative z-10 mx-auto max-w-2xl px-5 py-7 text-center md:px-10 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <p className="text-xs uppercase tracking-[0.18em] text-accent-rose">{t.eyebrow}</p>
          <h2
            className={`mt-4 text-2xl leading-[1.15] text-foreground sm:text-3xl md:text-5xl ${
              locale === 'ar' ? 'font-medium leading-[1.4]' : 'font-light'
            }`}
          >
            {t.before}
            {t.em && <em className="italic text-accent-gold">{t.em}</em>}
            {locale === 'ar' ? ' ' : <br />}
            {t.after}
          </h2>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <div className="relative inline-block">
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full border-2 border-accent-gold"
                animate={{ scale: [1, 1.18, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <a
                href={t.applyId}
                className="relative block rounded-full border border-accent-gold px-7 py-3.5 text-sm font-medium text-accent-gold transition-colors hover:bg-accent-gold hover:text-background"
              >
                {t.primary}
              </a>
            </div>
            <a
              href={t.processId}
              className="rounded-full bg-accent-gold px-7 py-3.5 text-sm font-medium text-background transition-colors hover:bg-accent-rose"
            >
              {t.secondary}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
