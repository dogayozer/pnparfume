'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const subMessages = [
  "Girdiğiniz odada bırakacağınız iz, sadece bir koku değil; karakterinizin, otoritenizin ve çekiciliğinizin sessiz bir manifestosudur.",
  "Bir koku, bir cümle söylemeden konuşur. Siz odadan çıktıktan sonra bile geride kalan şey; adınız değil, bıraktığınız duygudur.",
  "Parfüm bir aksesuar değildir, bir duruştur. Her sıkışta, kim olduğunuzu değil, kim olmaya karar verdiğinizi ilan edersiniz.",
  "Bazı şeyler görünmeden fark edilir. Kokunuz, sizi tanımadan önce insanların sizinle ilgili hissettiği ilk şeydir — sessiz ama unutulmaz."
]

export default function HomeHero() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % subMessages.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <section className="relative pb-4 pt-8 md:pt-24 flex items-center justify-center overflow-hidden px-6 border-b border-foreground/5">
      
      {/* Background Video */}
      <div className="absolute inset-0 z-0 pointer-events-none w-full h-full">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="auto"
          className="w-full h-full object-cover grayscale opacity-20 dark:opacity-30"
          src="/smoke.mp4"
        />
        {/* Fallback gradient overlay if video fails or is loading */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.2 }}
          className="space-y-4"
        >
          <motion.h1 
            variants={fadeUp}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-light tracking-tight text-foreground"
          >
            Kokunuz <span className="font-medium text-accent-rose">imzanızdır.</span>
          </motion.h1>
          
          <div className="min-h-[100px] sm:min-h-[80px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p 
                key={messageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="text-sm md:text-base text-foreground/70 font-light max-w-2xl mx-auto leading-relaxed"
              >
                {subMessages[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
