'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, User, Sparkles, ShoppingBag, Menu, X, Gift } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SearchModal from '@/components/SearchModal'
import { useCart } from '@/contexts/CartContext'

const KURUMSAL_TEXTS = ['Kurumsal', 'İş Ortaklığı', 'Dijital Bayilik']

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  const { items, setIsCartOpen } = useCart()
  const [kurumsalIndex, setKurumsalIndex] = useState(0)
  const pathname = usePathname()
  
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  useEffect(() => {
    const interval = setInterval(() => {
      setKurumsalIndex((prev) => (prev + 1) % KURUMSAL_TEXTS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])


  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {}
    }
  }, [])

  // Capture referral code from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const ref = params.get('ref') || params.get('elci')
      if (ref) {
        localStorage.setItem('pn_referral_code', ref.trim().toUpperCase())
      }
    }
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

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
          <Link href="/mix/discovery-set" className="text-sm tracking-wide text-amber-500 font-medium hover:text-amber-400 transition-colors flex items-center gap-1.5 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <Gift size={14} />
            5'li Keşif Kutusu
          </Link>
          <Link href="/mix" className="text-sm tracking-wide text-foreground hover:text-accent-gold transition-colors">
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
          <Link href="/kurumsal/iletisim" className="text-sm tracking-wide text-foreground hover:text-accent-gold transition-colors">
            İletişim
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">

          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-1.5 md:p-2 text-foreground/80 hover:text-accent-gold transition-colors"
          >
            <Search size={20} />
          </button>
          {user ? (
            <Link href="/profil" className="hidden sm:flex items-center gap-2 p-1.5 md:p-2 text-foreground/80 hover:text-accent-gold transition-colors text-xs font-medium uppercase tracking-widest">
              <User size={18} />
              <span className="hidden lg:inline">{user.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link href="/hesap" className="hidden sm:block p-1.5 md:p-2 text-foreground/80 hover:text-accent-gold transition-colors">
              <User size={20} />
            </Link>
          )}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="p-1.5 md:p-2 text-foreground/80 hover:text-accent-gold transition-colors relative"
          >
            <ShoppingBag size={20} />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 md:top-1 md:right-1 w-4 h-4 bg-accent-rose text-background text-[10px] flex items-center justify-center rounded-full font-bold">
                {cartItemCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-1.5 text-foreground/80 hover:text-accent-gold transition-colors ml-1"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </motion.header>

    {/* Mobile Menu Overlay */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-[85vw] max-w-sm h-full bg-background border-r border-foreground/10 shadow-2xl flex flex-col pt-20 px-6 pb-6 overflow-y-auto"
          >
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-2 text-foreground/50 hover:text-foreground transition-colors"
            >
              <X size={28} />
            </button>

          <nav className="flex flex-col gap-6 text-2xl font-light mt-8">
            <Link href="/katalog" className="border-b border-foreground/10 pb-4">
              Parfüm Koleksiyonu
            </Link>
            <Link href="/mix/discovery-set" className="border-b border-foreground/10 pb-4 text-amber-500 font-normal flex items-center justify-between">
              <span>5'li Keşif Kutusu</span>
              <span className="text-xs bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Özel Set</span>
            </Link>
            <Link href="/mix" className="border-b border-foreground/10 pb-4">
              Mix Parfüm Tasarımı <span className="text-xs ml-2 text-accent-gold uppercase tracking-widest">(Yakında)</span>
            </Link>
            <Link href="/kesfet" className="border-b border-foreground/10 pb-4 flex items-center gap-3">
              <Sparkles size={24} className="text-accent-gold" />
              Koku Rehberi
            </Link>
            <Link href="/kurumsal/girisimcilere-ozel" className="border-b border-foreground/10 pb-4">
              Kurumsal & Bayilik
            </Link>
            {user ? (
              <Link href="/profil" className="border-b border-foreground/10 pb-4 flex items-center gap-3">
                <User size={24} />
                {user.name} (Profil)
              </Link>
            ) : (
              <Link href="/hesap" className="border-b border-foreground/10 pb-4 flex items-center gap-3">
                <User size={24} />
                Hesabım
              </Link>
            )}
          </nav>

          <div className="mt-auto pt-12 flex flex-col gap-4">
            <div className="p-6 bg-foreground/5 rounded-2xl">
              <h3 className="text-sm font-medium mb-2">WhatsApp Sipariş Hattı</h3>
              <p className="text-2xl font-light">+90 532 391 31 41</p>
            </div>
          </div>
        </motion.div>
      </div>
    )}
    </AnimatePresence>

    <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
