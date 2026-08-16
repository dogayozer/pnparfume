'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, User, Sparkles, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import SearchModal from '@/components/SearchModal'
import { useCart } from '@/contexts/CartContext'

const KURUMSAL_TEXTS = ['Kurumsal', 'İş Ortaklığı', 'Dijital Bayilik']

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { items, setIsCartOpen } = useCart()
  const [kurumsalIndex, setKurumsalIndex] = useState(0)
  
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  useEffect(() => {
    const interval = setInterval(() => {
      setKurumsalIndex((prev) => (prev + 1) % KURUMSAL_TEXTS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 bg-background/50 backdrop-blur-md border-b border-foreground/5"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-light tracking-widest hover:text-accent-gold transition-colors">
          PN.
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/katalog" className="text-sm tracking-wide text-foreground hover:text-accent-gold transition-colors">
            Parfüm Koleksiyonu
          </Link>
          <Link href="/koleksiyonlar/kolonya-ve-kitler" className="text-sm tracking-wide text-foreground hover:text-accent-gold transition-colors">
            Mix Parfüm Tasarımı
          </Link>
          <Link href="/kesfet" className="text-sm tracking-wide text-foreground hover:text-accent-gold transition-colors flex items-center gap-1">
            <Sparkles size={14} className="text-accent-gold" />
            Koku Rehberi
          </Link>
          <Link href="/kurumsal/girisimcilere-ozel" className="text-sm tracking-wide text-foreground hover:text-accent-gold transition-colors relative flex items-center justify-center w-[110px] h-6 overflow-hidden">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={kurumsalIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute whitespace-nowrap"
              >
                {KURUMSAL_TEXTS[kurumsalIndex]}
              </motion.span>
            </AnimatePresence>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/asistan"
            className="flex items-center gap-2 text-xs md:text-sm font-medium bg-foreground text-background pl-2 pr-4 py-1.5 rounded-full hover:bg-accent-rose transition-colors duration-300"
          >
            <img src="/aura-avatar.jpg" alt="Aura AI" className="w-6 h-6 rounded-full object-cover border border-background/20" />
            <span className="hidden sm:inline">Yapay Zeka Asistanı</span>
          </Link>
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-foreground/80 hover:text-accent-gold transition-colors"
          >
            <Search size={20} />
          </button>
          <Link href="/hesap" className="p-2 text-foreground/80 hover:text-accent-gold transition-colors">
            <User size={20} />
          </Link>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="p-2 text-foreground/80 hover:text-accent-gold transition-colors relative"
          >
            <ShoppingBag size={20} />
            {cartItemCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-accent-rose text-background text-[10px] flex items-center justify-center rounded-full font-bold">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </motion.header>
    <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
