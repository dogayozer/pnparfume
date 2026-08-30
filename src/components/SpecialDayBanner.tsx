'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

// Özel gün (bayram vb.) tanıtım videoları — bugünün tarihine göre otomatik
// açılır, kapatılınca aynı gün içinde tekrar çıkmaz, ertesi gün tarih zaten
// eşleşmediği için hiç render edilmez. Yeni bir özel gün eklemek için bu
// diziye bir satır eklemek yeterli (ay 1-12, gün ayın günü).
const SPECIAL_DAYS: { month: number; day: number; video: string; label: string }[] = [
  { month: 8, day: 30, video: '/ozel-gun-30agustos.mp4', label: '30 Ağustos Zafer Bayramı' }
]

export default function SpecialDayBanner() {
  const [activeDay, setActiveDay] = useState<{ video: string; label: string; key: string } | null>(null)

  useEffect(() => {
    const now = new Date()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const match = SPECIAL_DAYS.find(d => d.month === month && d.day === day)
    if (!match) return

    const storageKey = `pn_special_day_dismissed_${now.getFullYear()}-${month}-${day}`
    try {
      if (localStorage.getItem(storageKey)) return
    } catch {}

    setActiveDay({ video: match.video, label: match.label, key: storageKey })
  }, [])

  const handleClose = () => {
    if (activeDay) {
      try { localStorage.setItem(activeDay.key, '1') } catch {}
    }
    setActiveDay(null)
  }

  if (!activeDay) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-xs sm:max-w-sm rounded-3xl overflow-hidden shadow-2xl">
        <button
          onClick={handleClose}
          aria-label="Kapat"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
        >
          <X size={18} />
        </button>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          src={activeDay.video}
          aria-label={activeDay.label}
        />
      </div>
    </div>
  )
}
