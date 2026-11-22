'use client'

import { useLang, useT } from '@/lib/i18n'
import { HOME_FAQ } from '@/lib/homeFaq'

// Ana sayfa SSS (AEO). Metin, FAQPage JSON-LD (page.tsx) ile aynı kaynaktan gelir.
export default function HomeFaq() {
  const lang = useLang() as 'tr' | 'en' | 'ar'
  const t = useT()
  return (
    <section className="pb-16 px-4 md:px-12 max-w-4xl mx-auto w-full">
      <h2 className="text-lg md:text-4xl font-medium md:font-light mb-4 md:mb-8">
        {t('Sıkça Sorulan Sorular', 'Frequently Asked Questions', 'الأسئلة الشائعة')}
      </h2>
      <div className="divide-y divide-foreground/10 border-y border-foreground/10">
        {HOME_FAQ.map((item, i) => {
          const c = item[lang] || item.tr
          return (
            <details key={i} className="group py-4">
              <summary className="cursor-pointer list-none flex justify-between items-center gap-4 text-sm md:text-base font-medium">
                {c.q}
                <span className="text-accent-gold transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm md:text-base text-foreground/70 leading-relaxed">{c.a}</p>
            </details>
          )
        })}
      </div>
    </section>
  )
}
