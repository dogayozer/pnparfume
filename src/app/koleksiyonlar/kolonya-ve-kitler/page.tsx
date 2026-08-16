'use client'

import { motion } from 'framer-motion'
import { Sparkles, Beaker, Droplets, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function KolonyaVeKitlerPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="flex flex-col min-h-screen pb-20">
      
      {/* HERO SECTION */}
      <section className="relative pb-2 pt-20 flex items-center justify-center overflow-hidden px-6 border-b border-foreground/5">
        
        {/* Subtle background abstract shapes */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 dark:opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-gold rounded-full mix-blend-multiply filter blur-[128px] animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent-rose rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.2 }}
            className="space-y-6"
          >
            <motion.span 
              variants={fadeUp}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-accent-gold text-xs font-medium uppercase tracking-[0.3em] block"
            >
              Yeni Nesil Koku Deneyimi
            </motion.span>

            <motion.h1 
              variants={fadeUp}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl md:text-5xl font-light tracking-tight text-foreground"
            >
              Kişiselleştirilmiş Lüks.
            </motion.h1>
            
            <motion.p 
              variants={fadeUp}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-lg md:text-xl text-foreground/70 font-light max-w-2xl mx-auto leading-relaxed"
            >
              Geleneksel kolonyanın çok ötesinde niş esanslar ve laboratuvarı evinize getiren özel yapım kitleriyle koku dünyasında ipleri elinize alın.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 space-y-32">
        
        {/* DIY Kits Section */}
        <section>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light mb-4">PN Alchemy: Kendi Kokunu Yarat</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              Sadece size ait, eşsiz bir koku formülü mü arıyorsunuz? PN Alchemy (Simya) Kitleri ile biyokimya prensiplerine uygun, profesyonel kalitede parfüm veya kolonyanızı evinizde kendiniz tasarlayın.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-3xl overflow-hidden bg-foreground/5 aspect-square relative border border-foreground/5 shadow-sm"
            >
              <img 
                src="https://images.unsplash.com/photo-1615397323675-578dff2a7e78?q=80&w=800&auto=format&fit=crop" 
                alt="PN Alchemy Kit" 
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90"
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center space-x-2 bg-accent-gold/10 text-accent-gold px-4 py-2 rounded-full text-sm font-medium">
                <Beaker size={16} />
                <span>Profesyonel Başlangıç Kiti</span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-light">PN Alchemy Masterclass Kiti</h3>
              <p className="text-foreground/70 leading-relaxed text-lg font-light">
                İçerisindeki üst, kalp ve dip nota esans damlalıkları, saf çözücü baz, oranlama pipetleri ve "Koku Piramidi Formül Kartı" ile kendi imzanızı laboratuvar hassasiyetiyle yaratın. 
              </p>

              <ul className="space-y-4">
                <li className="flex items-center space-x-3 text-foreground/80">
                  <div className="w-8 h-8 rounded-full bg-accent-gold/10 flex items-center justify-center text-accent-gold flex-shrink-0">
                    <Droplets size={16} />
                  </div>
                  <span className="font-medium">3 Adet Konsantre Esans</span>
                  <span className="text-foreground/50 text-sm hidden sm:inline">(Üst, Kalp, Dip Notalar)</span>
                </li>
                <li className="flex items-center space-x-3 text-foreground/80">
                  <div className="w-8 h-8 rounded-full bg-accent-gold/10 flex items-center justify-center text-accent-gold flex-shrink-0">
                    <Droplets size={16} />
                  </div>
                  <span className="font-medium">100ml Saf Çözücü Baz</span>
                  <span className="text-foreground/50 text-sm hidden sm:inline">(Alkol/Fiksatör Karışımı)</span>
                </li>
                <li className="flex items-center space-x-3 text-foreground/80">
                  <div className="w-8 h-8 rounded-full bg-accent-gold/10 flex items-center justify-center text-accent-gold flex-shrink-0">
                    <Droplets size={16} />
                  </div>
                  <span className="font-medium">Ekipmanlar</span>
                  <span className="text-foreground/50 text-sm hidden sm:inline">(Ölçüm Pipetleri, Kristal Şişe, Etiketler)</span>
                </li>
              </ul>

              <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between border-t border-foreground/10 gap-6">
                <div>
                  <span className="block text-sm text-foreground/50 line-through mb-1">1.250 TL</span>
                  <span className="text-4xl font-light text-accent-rose">850 TL</span>
                </div>
                <button className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background font-medium rounded-full overflow-hidden transition-transform hover:scale-105 duration-300 flex-shrink-0 w-full sm:w-auto">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-accent-gold via-accent-rose to-accent-gold opacity-0 group-hover:opacity-20 transition-opacity duration-500"></span>
                  <ShoppingBag size={18} className="text-accent-gold" />
                  <span>Sepete Ekle</span>
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* HIGHLIGHT DIVIDER */}
        <section className="py-20 px-6 bg-foreground/[0.02] rounded-3xl text-center border border-foreground/5">
          <Sparkles size={32} className="text-accent-gold mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-light mb-4">Özel Esanslı Kolonya Koleksiyonu</h2>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Limon ve tütünün ötesine geçin. Niche parfüm esanslarıyla harmanlanmış, misafirlerinize sunabileceğiniz veya anında ferahlamak için kullanabileceğiniz lüks kolonyalarımız.
          </p>
        </section>

        {/* Luxury Colognes Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            
            {/* Cologne 1 */}
            <Link href="/urun/smyrna-fig">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0 }}
                className="group cursor-pointer bg-background border border-foreground/5 p-4 rounded-3xl hover:border-accent-gold/30 transition-colors duration-500 flex flex-col h-full"
              >
                <div className="bg-foreground/5 rounded-2xl aspect-[4/5] mb-6 overflow-hidden relative">
                  <img 
                    src="/cologne_fig_incense_1786736624153.jpg" 
                    alt="Smyrna Fig & Incense" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 mix-blend-multiply opacity-90"
                  />
                </div>
                <div className="px-2 flex-1 flex flex-col">
                  <h3 className="text-xl font-medium mb-1 group-hover:text-accent-gold transition-colors">Smyrna Fig & Incense</h3>
                  <p className="text-sm text-foreground/50 mb-4 flex-1">Mistik Ege İnciri & Buhur</p>
                  <div className="flex items-center justify-between border-t border-foreground/5 pt-4">
                    <span className="font-light text-lg">600 TL</span>
                    <span className="text-sm font-medium text-accent-gold group-hover:text-accent-rose transition-colors">İncele</span>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Cologne 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group cursor-pointer bg-background border border-foreground/5 p-4 rounded-3xl hover:border-accent-gold/30 transition-colors duration-500 flex flex-col"
            >
              <div className="bg-foreground/5 rounded-2xl aspect-[4/5] mb-6 overflow-hidden relative">
                <img 
                  src="/col_leather.jpg" 
                  alt="Pera Leather & Amber" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 mix-blend-multiply opacity-90"
                />
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                  250 ml
                </div>
              </div>
              <div className="px-2 flex-1 flex flex-col">
                <h3 className="text-xl font-medium mb-1">Pera Leather & Amber</h3>
                <p className="text-sm text-foreground/50 mb-4 flex-1">Pera Deri & Amber</p>
                <div className="flex items-center justify-between border-t border-foreground/5 pt-4">
                  <span className="font-light text-lg">480 TL</span>
                  <button className="text-sm font-medium text-accent-gold group-hover:text-accent-rose transition-colors">Sepete Ekle</button>
                </div>
              </div>
            </motion.div>

            {/* Cologne 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group cursor-pointer bg-background border border-foreground/5 p-4 rounded-3xl hover:border-accent-gold/30 transition-colors duration-500 flex flex-col"
            >
              <div className="bg-foreground/5 rounded-2xl aspect-[4/5] mb-6 overflow-hidden relative">
                <img 
                  src="/col_neroli.jpg" 
                  alt="Neroli & Oud Blanc" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 mix-blend-multiply opacity-90"
                />
                <div className="absolute top-4 right-4 bg-accent-gold text-background text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                  Yeni
                </div>
              </div>
              <div className="px-2 flex-1 flex flex-col">
                <h3 className="text-xl font-medium mb-1">Neroli & Oud Blanc</h3>
                <p className="text-sm text-foreground/50 mb-4 flex-1">Beyaz Ud & Portakal Çiçeği</p>
                <div className="flex items-center justify-between border-t border-foreground/5 pt-4">
                  <span className="font-light text-lg">520 TL</span>
                  <button className="text-sm font-medium text-accent-gold group-hover:text-accent-rose transition-colors">Sepete Ekle</button>
                </div>
              </div>
            </motion.div>

            {/* Cologne 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group cursor-pointer bg-background border border-foreground/5 p-4 rounded-3xl hover:border-accent-gold/30 transition-colors duration-500 flex flex-col"
            >
              <div className="bg-foreground/5 rounded-2xl aspect-[4/5] mb-6 overflow-hidden relative">
                <img 
                  src="/col_tobacco.jpg" 
                  alt="Anatolian Tobacco & Honey" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 mix-blend-multiply opacity-90"
                />
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                  250 ml
                </div>
              </div>
              <div className="px-2 flex-1 flex flex-col">
                <h3 className="text-xl font-medium mb-1">Anatolian Tobacco & Honey</h3>
                <p className="text-sm text-foreground/50 mb-4 flex-1">Anadolu Tütünü & Yabani Bal</p>
                <div className="flex items-center justify-between border-t border-foreground/5 pt-4">
                  <span className="font-light text-lg">450 TL</span>
                  <button className="text-sm font-medium text-accent-gold group-hover:text-accent-rose transition-colors">Sepete Ekle</button>
                </div>
              </div>
            </motion.div>

          </div>
        </section>
      </div>
    </div>
  )
}
