'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe } from 'lucide-react'
import Link from 'next/link'

// Sitenin ana kataloğu/sepeti/checkout'u sadece Türkçe — bu yüzden EN/AR seçimleri
// tüm mağazayı çevirmiyor, doğrudan o dildeki distribütörlük/private-label
// sayfalarına götürüyor (middleware.ts'in ülke bazlı yönlendirdiği aynı sayfalar).
const LANGUAGES = [
  { code: 'tr', label: 'Türkçe', href: '/' },
  { code: 'en', label: 'English', href: '/en/wholesale' },
  { code: 'ar', label: 'العربية', href: '/ar/wholesale' },
]

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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
            <Link
              key={l.code}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-foreground/80 hover:text-accent-gold hover:bg-foreground/5 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
