'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'

const FILTERS = {
  seasons: ['Yaz', 'Kış / Sonbahar', 'Dört Mevsim'],
  occasions: ['Günlük Kullanım', 'Toplantı / Ofis', 'Davet / Gece Etkinliği', 'Spor / Dinamik'],
  genders: ['Erkek', 'Kadın', 'Unisex'],
  personas: ['Modern ve Dinamik', 'Zarif / Sofistike', 'İddialı / Romantik', 'Lider / Otoriter', 'Samimi / Dostane'],
  families: ['Odunsu', 'Çiçeksi', 'Baharatlı', 'Ferah', 'Oryantal', 'Tatlı', 'Meyvemsi']
}

export default function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      const current = params.get(name)
      
      if (current === value) {
        params.delete(name) // Toggle off if already selected
      } else {
        params.set(name, value)
      }
      
      return params.toString()
    },
    [searchParams]
  )

  const clearFilters = () => {
    router.push('?')
  }

  const renderFilterGroup = (title: string, paramName: string, options: string[]) => {
    const currentValue = searchParams.get(paramName)

    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium tracking-widest text-foreground/50 uppercase mb-3">{title}</h3>
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
                {option}
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
        <h2 className="text-lg font-medium">Filtreler</h2>
        {searchParams.toString() !== '' && (
          <button onClick={clearFilters} className="text-xs text-accent-rose hover:underline">
            Temizle
          </button>
        )}
      </div>

      {renderFilterGroup('Cinsiyet', 'gender', FILTERS.genders)}
      {renderFilterGroup('Mevsim', 'season', FILTERS.seasons)}
      {renderFilterGroup('Koku Ailesi', 'family', FILTERS.families)}
      {renderFilterGroup('Karakter', 'persona', FILTERS.personas)}
      {renderFilterGroup('Etkinlik Mekan', 'occasion', FILTERS.occasions)}
      
    </div>
  )
}
