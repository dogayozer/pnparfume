import Link from 'next/link'
import { ShoppingBag, Users, Share2 } from 'lucide-react'

// Ana sayfada ve sepette görünen, göze batmayan ama fark edilir "3 adım" şeridi.
// Üçü de mevcut kupon/referans altyapısını tanıtıyor — yeni bir sistem değil,
// var olanı görünür kılıyor. /profil'e yönlendiriyor (Kuponlarım + Marka Elçisi).
const PERKS = [
  { icon: ShoppingBag, title: 'Al, Kazan', text: 'Her siparişte sonraki alışverişine özel indirim kuponu' },
  { icon: Users, title: 'Öner, Kazan', text: 'Arkadaşın alışveriş yapsın, cüzdanına komisyon eklensin' },
  { icon: Share2, title: 'Paylaş, Kazan', text: 'Kendi kodunu paylaş, her kullanımda kazanmaya devam et' }
]

export default function PerksBanner({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/profil"
      className={`block group ${compact ? '' : 'max-w-7xl mx-auto px-4 md:px-12'}`}
    >
      <div className={`flex items-center justify-between gap-2 md:gap-6 border border-foreground/10 rounded-2xl bg-foreground/[0.02] hover:border-accent-gold/40 transition-colors ${compact ? 'px-3 py-2.5' : 'px-4 py-3 md:px-8 md:py-4'}`}>
        {PERKS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            <Icon size={compact ? 14 : 16} className="text-accent-gold flex-shrink-0" />
            <div className="min-w-0">
              <p className={`font-bold text-foreground truncate ${compact ? 'text-[10px]' : 'text-[11px] md:text-xs'}`}>{title}</p>
              {!compact && (
                <p className="text-[10px] md:text-[11px] text-foreground/50 truncate hidden sm:block">{text}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Link>
  )
}
