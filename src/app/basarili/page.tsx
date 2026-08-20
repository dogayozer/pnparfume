'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, PackageCheck, Sparkles, ArrowRight, ShoppingBag, ShieldCheck, Truck, MessageCircle } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

export default function BasariliPage() {
  const { clearCart } = useCart()

  useEffect(() => {
    // Clear cart in local storage and state upon successful payment confirmation
    clearCart()
  }, [])

  return (
    <main className="min-h-screen bg-background text-foreground pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden flex items-center justify-center">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full mx-auto text-center relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-tr from-emerald-500/20 to-accent-gold/20 border border-emerald-500/30 flex items-center justify-center shadow-2xl"
        >
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400" />
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xs uppercase tracking-[0.3em] text-accent-gold font-semibold block mb-3"
        >
          Ödeme Onaylandı & Sipariş Alındı
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl sm:text-4xl font-extralight tracking-wide text-foreground mb-4"
        >
          İmza Kokunuz <span className="font-serif italic font-normal text-accent-gold">Hazırlanıyor</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-foreground/70 font-light max-w-lg mx-auto leading-relaxed mb-10"
        >
          Siparişiniz başarıyla oluşturuldu. Özel PN Parfüm kutunuz özenle paketlenip 24 saat içerisinde kargoya teslim edilecektir.
        </motion.p>

        {/* Info Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left"
        >
          <div className="bg-foreground/[0.03] border border-foreground/10 rounded-2xl p-4">
            <div className="w-8 h-8 rounded-xl bg-accent-gold/10 text-accent-gold flex items-center justify-center mb-3">
              <Truck size={18} />
            </div>
            <h4 className="text-xs font-semibold text-foreground mb-1">Hızlı & Sigortalı Kargo</h4>
            <p className="text-[11px] text-foreground/60 leading-relaxed font-light">Özel korumalı ambalajında güvenle kapınıza gelir.</p>
          </div>

          <div className="bg-foreground/[0.03] border border-foreground/10 rounded-2xl p-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <MessageCircle size={18} />
            </div>
            <h4 className="text-xs font-semibold text-foreground mb-1">SMS & Takip Bildirimi</h4>
            <p className="text-[11px] text-foreground/60 leading-relaxed font-light">Kargo takip numaranız SMS ve WhatsApp ile iletilir.</p>
          </div>

          <div className="bg-foreground/[0.03] border border-foreground/10 rounded-2xl p-4">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
              <ShieldCheck size={18} />
            </div>
            <h4 className="text-xs font-semibold text-foreground mb-1">%100 Memnuniyet</h4>
            <p className="text-[11px] text-foreground/60 leading-relaxed font-light">Koku kalıcılığı ve yayılım garantisiyle üretilmiştir.</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5"
        >
          <Link
            href="/profil"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-foreground text-background font-medium text-xs tracking-wider uppercase hover:bg-accent-gold transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
          >
            <PackageCheck size={16} /> Siparişlerimi İncele
          </Link>

          <Link
            href="/katalog"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground border border-foreground/15 font-medium text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag size={16} /> Koleksiyona Göz At
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
