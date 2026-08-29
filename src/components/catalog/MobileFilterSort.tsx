'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import FilterSidebar from './FilterSidebar'

const SORT_OPTIONS = [
  { label: 'Çok Satanlar', value: 'best_sellers' },
  { label: 'Artan Fiyatlar', value: 'price_asc' },
  { label: 'Yeni Gelenler', value: 'newest' },
  { label: 'İndirime Göre', value: 'discount' }
]

export default function MobileFilterSort() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentSort = searchParams.get('sort') || 'best_sellers'
  const currentSortLabel = SORT_OPTIONS.find(o => o.value === currentSort)?.label || 'Çok Satanlar'

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'best_sellers') {
      params.delete('sort')
    } else {
      params.set('sort', value)
    }
    router.push(`?${params.toString()}`)
    setIsSortOpen(false)
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-6 md:hidden relative z-30">
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="flex-1 flex items-center justify-between border border-foreground/20 rounded px-4 py-2.5 text-[13px] font-bold bg-background"
        >
          Filtrele
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </button>
        
        <div className="flex-1 relative">
          <button 
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="w-full flex items-center justify-between border border-foreground/20 rounded px-4 py-2.5 text-[13px] font-bold bg-background"
          >
            <span className="truncate mr-2">{currentSortLabel}</span>
            <ChevronDown size={16} />
          </button>
          
          <AnimatePresence>
            {isSortOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 mt-2 w-full bg-background border border-foreground/10 rounded-lg shadow-xl overflow-hidden z-40"
              >
                {SORT_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleSort(option.value)}
                    className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-foreground/5 transition-colors ${currentSort === option.value ? 'text-accent-gold bg-foreground/[0.02]' : 'text-foreground/80'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-[85vw] max-w-sm h-full bg-background border-r border-foreground/10 shadow-2xl flex flex-col pt-20 pb-6"
            >
              <button
                onClick={() => setIsFilterOpen(false)}
                className="absolute top-6 right-6 p-2 text-foreground/50 hover:text-foreground transition-colors"
              >
                <X size={28} />
              </button>

              {/* Seçim yapınca panel önceden hiç kapanmıyordu — filtreler URL'e doğru
                  uygulanıyordu ama sonuç listesi bu panelin altında tamamen gizli
                  kalıyordu, kullanıcıya "sonuç getirmiyor" gibi görünüyordu. */}
              <div className="flex-1 overflow-y-auto px-6">
                <div className="mt-4">
                  <FilterSidebar />
                </div>
              </div>

              <div className="px-6 pt-4 mt-2 border-t border-foreground/10">
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-foreground text-background py-3 rounded-full text-sm font-bold hover:bg-accent-gold transition-colors"
                >
                  Sonuçları Göster
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
