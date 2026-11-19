'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import { useSwitchLang } from '@/lib/useSwitchLang'

const LANGUAGES = [
  { code: 'tr', label: 'Türkçe' },
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
] as const

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const lang = useLang()
  const switchLang = useSwitchLang()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="p-1.5 md:p-2 text-foreground/80 hover:text-accent-gold transition-colors"
        aria-label="Dil seçin / Select language"
      >
        <Globe size={20} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-background border border-foreground/10 rounded-xl shadow-lg py-2 z-50">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => { switchLang(l.code); setOpen(false) }}
              className={`block w-full text-left rtl:text-right px-4 py-2 text-sm hover:text-accent-gold hover:bg-foreground/5 transition-colors ${lang === l.code ? 'text-accent-gold' : 'text-foreground/80'}`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
