'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, ArrowRight, Droplets, Sparkles, Wand2, ShieldCheck, CheckCircle2 } from 'lucide-react'

export default function MixparfumHome() {
  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#4A3527] font-sans selection:bg-[#B48A3F] selection:text-white">
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 pt-24">
        {/* Abstract animated background lines mimicking the logo */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full border-[1px] border-[#B48A3F]"
          />
          <motion.div 
            animate={{ 
              rotate: -360,
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full border-[1px] border-[#B48A3F]"
          />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-24">
          
          <div className="flex-1 text-center md:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-[#B48A3F] text-sm font-bold tracking-[0.3em] uppercase mb-6 flex items-center justify-center md:justify-start gap-3">
                <span className="w-8 h-px bg-[#B48A3F]"></span>
                Mixparfum Studio
              </h2>
              <h1 className="text-5xl md:text-7xl font-light leading-[1.1] mb-8 font-serif">
                Kendi İmza <br className="hidden md:block"/> 
                <i className="font-serif italic text-[#B48A3F]">Kokunu</i> Yarat.
              </h1>
              <p className="text-lg md:text-xl text-[#4A3527]/70 font-light mb-12 max-w-xl mx-auto md:mx-0 leading-relaxed">
                Niş parfüm estetiği ve mühendislik hassasiyetiyle, sadece sana özel, eşsiz bir kompozisyon harmanla. 338 koku kütüphanesinden senin formülüne.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start">
                <Link
                  href="/mix/engine"
                  className="group relative flex items-center justify-center gap-4 px-10 py-5 bg-[#4A3527] text-[#F5F0E6] rounded-full overflow-hidden w-full sm:w-auto hover:bg-[#3a2a1e] transition-colors"
                >
                  <span className="relative z-10 font-medium tracking-wide uppercase text-sm">Blend Engine'i Dene</span>
                  <div className="relative z-10 w-8 h-8 rounded-full bg-[#B48A3F] flex items-center justify-center">
                    <Wand2 size={14} className="text-white" />
                  </div>
                </Link>
                <Link
                  href="/mix/discovery-set"
                  className="flex items-center gap-2 text-sm font-medium tracking-widest uppercase text-[#4A3527]/70 hover:text-[#B48A3F] transition-colors"
                >
                  Keşif Seti Al
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex-1 w-full max-w-md relative"
          >
            <div className="relative aspect-[3/4] w-full rounded-t-[150px] rounded-b-3xl bg-[#4A3527]/5 border border-[#B48A3F]/20 overflow-hidden flex items-center justify-center shadow-2xl backdrop-blur-sm">
              {/* Fallback geometric representation if image is missing */}
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-60">
                 <Image src="/images/products/pnunisexsise.png" alt="Mixparfum Bottle" fill className="object-contain p-12 drop-shadow-2xl" />
              </div>
            </div>
            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 -right-8 w-24 h-24 rounded-full bg-[#F5F0E6] border border-[#B48A3F]/30 shadow-xl flex flex-col items-center justify-center"
            >
               <span className="text-xs text-[#4A3527]/50 uppercase tracking-widest mb-1">Kod</span>
               <span className="font-serif font-medium text-[#B48A3F]">MY-7A</span>
            </motion.div>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-1/4 -left-8 w-20 h-20 rounded-full bg-[#4A3527] border border-[#B48A3F]/30 shadow-xl flex flex-col items-center justify-center text-[#F5F0E6]"
            >
               <Droplets size={20} className="text-[#B48A3F] mb-1" />
               <span className="text-[10px] uppercase tracking-widest">3 Esans</span>
            </motion.div>
          </motion.div>
          
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h3 className="text-[#B48A3F] text-xs font-bold tracking-[0.3em] uppercase mb-4">Mekanizma</h3>
            <h2 className="text-4xl md:text-5xl font-light font-serif">Nasıl Çalışır?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {[
              { num: '01', title: 'Anı Seç', desc: 'Kokunun sana nerede eşlik edeceğini (Davet, İş, Romantik) seç. Biz ideal aileleri filtreleyelim.', icon: <Sparkles className="text-[#B48A3F]" size={32} /> },
              { num: '02', title: 'Esansları Harmanla', desc: 'Önerilen 338 koku kütüphanesinden en fazla 3 kompozit esans seç ve uyumluluğunu test et.', icon: <Droplets className="text-[#B48A3F]" size={32} /> },
              { num: '03', title: 'Tasarla & Sipariş Et', desc: 'Slider ile oranları belirle. Benzersiz Design Code (Tasarım Kodu) ile imza kokunu sipariş ver.', icon: <CheckCircle2 className="text-[#B48A3F]" size={32} /> }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="group relative p-10 bg-[#F5F0E6]/30 rounded-3xl border border-[#4A3527]/5 hover:bg-[#F5F0E6] transition-colors"
              >
                <div className="absolute -top-6 -left-6 text-8xl font-serif font-black text-[#4A3527]/5 z-0 group-hover:text-[#B48A3F]/10 transition-colors">
                  {step.num}
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-8 shadow-sm">
                    {step.icon}
                  </div>
                  <h4 className="text-2xl font-serif mb-4">{step.title}</h4>
                  <p className="text-[#4A3527]/60 font-light leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Discovery Set CTA */}
      <section className="py-24 px-6 bg-[#4A3527] text-[#F5F0E6]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h3 className="text-[#B48A3F] text-xs font-bold tracking-[0.3em] uppercase mb-4">Kör Alım Riskine Son</h3>
            <h2 className="text-4xl md:text-5xl font-light font-serif mb-6">Önce Keşfet.</h2>
            <p className="text-white/60 font-light mb-8 text-lg leading-relaxed">
              Kendi tasarımından emin olmak mı istiyorsun? 4'lü veya 8'li Keşif Seti sipariş ver. 
              Keşif setine ödediğin tutarın tamamı, tam boy siparişinde <span className="text-[#B48A3F] font-medium">%100 Cashback</span> olarak sana iade edilsin.
            </p>
            <Link
              href="/mix/discovery-set"
              className="group inline-flex items-center gap-4 px-8 py-4 bg-[#B48A3F] text-white rounded-full hover:bg-[#a17c38] transition-colors font-medium tracking-wide text-sm uppercase"
            >
              Keşif Seti Oluştur
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="flex-1 w-full relative">
            <div className="aspect-[4/3] w-full rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-8 overflow-hidden relative">
               <Image src="/images/products/pnkutulu3luseri.png" alt="Discovery Set" fill className="object-contain p-8 drop-shadow-2xl opacity-90" />
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
