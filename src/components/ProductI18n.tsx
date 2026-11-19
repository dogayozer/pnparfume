'use client'

import { useLang } from '@/lib/i18n'
import { translateVocab } from '@/lib/vocab'

// Ürün açıklaması: Türkçe'de Trendyol/özel açıklama HTML'i aynen gösterilir. İngilizce ve Arapça'da
// serbest metin çevrilemediği için etiket ve notalardan üretilen standart bir açıklama gösterilir.
export function LocalizedDescription({
  html,
  mood,
  top,
  heart,
  base,
  family,
}: {
  html: string
  mood?: string | null
  top?: string | null
  heart?: string | null
  base?: string | null
  family?: string | null
}) {
  const lang = useLang()
  if (lang === 'tr') {
    return <div className="text-foreground/80 leading-relaxed text-base md:text-lg font-light" dangerouslySetInnerHTML={{ __html: html }} />
  }
  const ar = lang === 'ar'
  const m = translateVocab(mood, lang)
  const fam = translateVocab(family, lang)
  const notes = (label: string, v?: string | null) => (
    <div>
      <h4 className="text-accent-gold font-medium text-sm mb-1 uppercase tracking-widest rtl:tracking-normal">{label}</h4>
      <p className="text-foreground/80 text-sm">{translateVocab((v || 'Gizli Formül').split(',').map((n) => n.trim()).join(' • '), lang)}</p>
    </div>
  )
  return (
    <div className="space-y-4 text-foreground/80 leading-relaxed text-base md:text-lg font-light">
      <p>
        {ar
          ? `عطر مصمَّم بعناية${fam ? ` من عائلة ${fam}` : ''}${m && m !== 'Karizmatik & Çekici' ? `، يمنحك حضورًا ${m}` : ''}، من إنتاج PN Parfüm في إسطنبول.`
          : `A carefully crafted fragrance${fam ? ` from the ${fam} family` : ''}${m ? `, designed to leave a ${m} impression` : ''}. Produced by PN Parfüm in Istanbul.`}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 p-4 bg-foreground/5 rounded-2xl border border-foreground/10">
        {notes(ar ? 'النوتات العليا' : 'Top Notes', top)}
        {notes(ar ? 'نوتات القلب' : 'Heart Notes', heart)}
        {notes(ar ? 'النوتات القاعدية' : 'Base Notes', base)}
      </div>
    </div>
  )
}
