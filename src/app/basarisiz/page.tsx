'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertCircle, ShoppingBag, RefreshCw, MessageSquare, ArrowLeft } from 'lucide-react'

export default function BasarisizPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden flex items-center justify-center">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full mx-auto text-center relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-8 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shadow-2xl"
        >
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-rose-400" />
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xs uppercase tracking-[0.3em] text-rose-400 font-semibold block mb-3"
        >
          Ödeme Tamamlanamadı
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl sm:text-4xl font-extralight tracking-wide text-foreground mb-4"
        >
          İşlem <span className="font-serif italic font-normal text-rose-400">Onaylanmadı</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-foreground/70 font-light max-w-md mx-auto leading-relaxed mb-8"
        >
          Kart limitiniz, 3D Secure onay süresi veya bankanızın güvenlik politikası nedeniyle işlem tamamlanamadı. Kartınızdan herhangi bir çekim yapılmamıştır.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5"
        >
          <Link
            href="/sepet"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-foreground text-background font-medium text-xs tracking-wider uppercase hover:bg-accent-gold transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} /> Sepete Dön ve Tekrar Dene
          </Link>

          <a
            href="https://wa.me/905447360990?text=Merhaba,%20sitenizden%20sipari%C5%9F%20verirken%20%C3%B6deme%20a%C5%9Famas%C4%B1nda%20yard%C4%B1m%20almak%20istiyorum."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 font-medium text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare size={16} /> WhatsApp Destek
          </a>
        </motion.div>
      </div>
    </main>
  )
}
