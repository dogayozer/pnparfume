'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useT, useLang } from '@/lib/i18n'
import { translateVocab } from '@/lib/vocab'
import Link from 'next/link'
import { COLLECTIONS } from '@/lib/collections'

const FILTERS = {
  seasons: ['Yaz', 'Kış / Sonbahar', 'Dört Mevsim'],
  occasions: ['Günlük Kullanım', 'Toplantı / Ofis', 'Davet / Gece Etkinliği', 'Spor / Dinamik'],
  genders: ['Erkek', 'Kadın', 'Unisex'],
  personas: ['Modern ve Dinamik', 'Zarif / Sofistike', 'İddialı / Romantik', 'Lider / Otoriter', 'Samimi / Dostane'],
  families: ['Odunsu', 'Çiçeksi', 'Baharatlı', 'Ferah', 'Oryantal', 'Tatlı', 'Meyveli']
}

export default function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const t = useT()
  const lang = useLang()

  // Bu sayfa server component olduğu için her filtre değişimi gerçek bir sunucu
  // round-trip'i gerektiriyor (Prisma sorgusu). O round-trip tamamlanana kadar hem
  // `searchParams` hook'u hem `window.location.search` ESKİ değeri gösteriyor. İki
  // filtre art arda hızlıca tıklanırsa (örn. mobilde "Erkek" + "Odunsu"), ikinci
  // tıklama bu eski/bayat kaynaktan yeni URL kurup ilk seçilen filtreyi tamamen
  // siliyordu (63 sonuç yerine sadece tek filtreyle sınırlı bir sonuç, ya da hiç
  // filtre uygulanmamış hali kalıyordu). Bunun yerine, en son GÖNDERİLEN (henüz
  // sunucudan dönmemiş olsa bile) parametre durumunu senkron bir ref'te tutup bir
  // sonraki tıklamayı onun üzerine inşa ediyoruz. Gerçek navigasyon sonunda
  // `searchParams` güncellenince ref de onunla yeniden senkronlanıyor.
  const pendingParamsRef = useRef(searchParams.toString())
  useEffect(() => {
    pendingParamsRef.current = searchParams.toString()
  }, [searchParams])

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(pendingParamsRef.current)
      const current = params.get(name)

      if (current === value) {
        params.delete(name) // Toggle off if already selected
      } else {
        params.set(name, value)
      }

      const next = params.toString()
      pendingParamsRef.current = next
      return next
    },
    []
  )

  const clearFilters = () => {
    pendingParamsRef.current = ''
    router.push('?')
  }

  const renderFilterGroup = (title: string, paramName: string, options: string[]) => {
    const currentValue = searchParams.get(paramName)

    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium tracking-widest rtl:tracking-normal text-foreground/50 uppercase mb-3">{title}</h3>
        <div className="space-y-2">
          {options.map((option) => (
            <label key={option} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={currentValue === option}
                onChange={() => router.push(`?${createQueryString(paramName, option)}`)}
                className="w-4 h-4 rounded border-foreground/20 text-accent-gold focus:ring-accent-gold focus:ring-offset-background bg-transparent"
              />
              <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                {translateVocab(option, lang)}
              </span>
            </label>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium">{t('Filtreler', 'Filters', 'التصفية')}</h2>
        {searchParams.toString() !== '' && (
          <button onClick={clearFilters} className="text-xs text-accent-rose hover:underline">
            {t('Temizle', 'Clear', 'مسح')}
          </button>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium tracking-widest rtl:tracking-normal text-foreground/50 uppercase mb-3">{t('Koleksiyonlar', 'Collections', 'المجموعات')}</h3>
        <div className="space-y-2">
          <Link href="/katalog" className={`block text-sm transition-colors ${pathname === '/katalog' ? 'text-accent-gold font-medium' : 'text-foreground/80 hover:text-accent-gold'}`}>
            {t('Tümü', 'All', 'الكل')}
          </Link>
          {COLLECTIONS.map((c) => (
            <Link key={c.slug} href={`/koleksiyonlar/${c.slug}`} className={`block text-sm transition-colors ${pathname === `/koleksiyonlar/${c.slug}` ? 'text-accent-gold font-medium' : 'text-foreground/80 hover:text-accent-gold'}`}>
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {renderFilterGroup(t('Cinsiyet', 'Gender', 'الجنس'), 'gender', FILTERS.genders)}
      {renderFilterGroup(t('Mevsim', 'Season', 'الموسم'), 'season', FILTERS.seasons)}
      {renderFilterGroup(t('Koku Ailesi', 'Fragrance Family', 'عائلة العطر'), 'family', FILTERS.families)}
      {renderFilterGroup(t('Karakter', 'Character', 'الشخصية'), 'persona', FILTERS.personas)}
      {renderFilterGroup(t('Etkinlik Mekan', 'Occasion', 'المناسبة'), 'occasion', FILTERS.occasions)}
      
    </div>
  )
}
