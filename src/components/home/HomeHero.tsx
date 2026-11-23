'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Truck, Percent } from 'lucide-react'
import { FREE_SHIPPING_FOR_ALL } from '@/lib/shippingCampaign'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLang } from '@/lib/i18n'

const subMessages = [
  "Girdiğiniz odada bırakacağınız iz, sadece bir koku değil; karakterinizin, otoritenizin ve çekiciliğinizin sessiz bir manifestosudur.",
  "Bir koku, bir cümle söylemeden konuşur. Siz odadan çıktıktan sonra bile geride kalan şey; adınız değil, bıraktığınız duygudur.",
  "Parfüm bir aksesuar değildir, bir duruştur. Her sıkışta, kim olduğunuzu değil, kim olmaya karar verdiğinizi ilan edersiniz.",
  "Bazı şeyler görünmeden fark edilir. Kokunuz, sizi tanımadan önce insanların sizinle ilgili hissettiği ilk şeydir — sessiz ama unutulmaz.",
  "Sen farklısın. Neden parfümün aynı olsun?"
]

const subMessagesEn = [
  "The mark you leave in the room you enter is not just a scent; it is the silent manifesto of your character, authority and charm.",
  "A fragrance speaks without saying a word. What remains after you leave the room is not your name, but the feeling you left behind.",
  "Perfume is not an accessory, it is a stance. With every spray you declare not who you are, but who you have decided to become.",
  "Some things are noticed without being seen. Your scent is the first thing people feel about you before they know you — quiet, yet unforgettable.",
  "You are different. Why should your perfume be the same?"
]
const subMessagesAr = [
  "الأثر الذي تتركه في الغرفة التي تدخلها ليس مجرد رائحة؛ بل هو بيان صامت عن شخصيتك وهيبتك وجاذبيتك.",
  "العطر يتكلم دون أن ينطق بكلمة. ما يبقى بعد أن تغادر الغرفة ليس اسمك، بل الشعور الذي تركته.",
  "العطر ليس إكسسوارًا، بل موقف. مع كل رشّة تعلن لا من أنت، بل من قررت أن تصبح.",
  "بعض الأشياء تُلاحَظ دون أن تُرى. عطرك هو أول ما يشعر به الناس تجاهك قبل أن يعرفوك — هادئ لكنه لا يُنسى.",
  "أنت مختلف. فلماذا يكون عطرك مثل غيره؟"
]

export default function HomeHero() {
  const lang = useLang()
  const messages = lang === 'en' ? subMessagesEn : lang === 'ar' ? subMessagesAr : subMessages
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
            {lang === 'en' ? <>Your scent is <span className="font-medium text-accent-rose">your signature.</span></> : lang === 'ar' ? <>عطرك هو <span className="font-medium text-accent-rose">توقيعك.</span></> : <>Kokunuz <span className="font-medium text-accent-rose">imzanızdır.</span></>}
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
                {messages[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Kampanya: 2. ürün %50 + ücretsiz kargo */}
          <motion.div variants={fadeUp} transition={{ duration: 0.8, ease: 'easeOut' }}>
            <Link
              href="/katalog"
              className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 rounded-2xl border border-accent-gold/50 bg-accent-gold/10 hover:bg-accent-gold/20 transition-colors px-5 py-3 md:px-8 md:py-4"
            >
              <span className="flex items-center gap-2 text-sm md:text-base font-semibold text-foreground">
                <Percent size={18} className="text-accent-gold" />
                {lang === 'en' ? '2nd perfume 50% OFF' : lang === 'ar' ? 'العطر الثاني بخصم 50%' : '2. ürün %50 İNDİRİMDE'}
              </span>
              {FREE_SHIPPING_FOR_ALL && (
                <span className="flex items-center gap-2 text-sm md:text-base font-semibold text-foreground">
                  <Truck size={18} className="text-accent-gold" />
                  {lang === 'en' ? 'Free shipping within Türkiye' : lang === 'ar' ? 'شحن مجاني داخل تركيا' : 'Türkiye içi ÜCRETSİZ KARGO'}
                </span>
              )}
              <span className="text-xs md:text-sm font-medium text-accent-gold underline underline-offset-4">
                {lang === 'en' ? 'Shop now →' : lang === 'ar' ? 'تسوّق الآن ←' : 'Alışverişe başla →'}
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
