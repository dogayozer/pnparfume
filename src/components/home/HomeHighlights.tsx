'use client'

import { motion } from 'framer-motion'
import { Droplets } from 'lucide-react'
import { useT } from '@/lib/i18n'

export default function HomeHighlights() {
  const t = useT()
  return (
    <section className="py-6 md:py-24 px-4 md:px-12 bg-foreground/[0.02]">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6 md:mb-16"
        >
          <h2 className="text-xl md:text-4xl font-light mb-2 md:mb-4">{t('Neden', 'Why', 'لماذا')} <span className="font-medium text-accent-gold">PN Parfüm?</span></h2>
          <p className="text-foreground/60 text-xs md:text-base max-w-xl mx-auto">{t('Sıradan bir katalog değil; duygularınızı, bütçenizi ve karakterinizi anlayan yapay zeka destekli bir koku mimarisi.', 'Not an ordinary catalog; an AI-powered fragrance architecture that understands your emotions, budget and character.', 'ليس كتالوجًا عاديًا؛ بل هندسة عطرية مدعومة بالذكاء الاصطناعي تفهم مشاعرك وميزانيتك وشخصيتك.')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8">
          {[
            { title: t("Duygu Odaklı", "Emotion-Driven", "يركّز على المشاعر"), desc: t("Sadece kokuları değil, o kokunun insan beyninde bıraktığı etkiyi analiz ederek öneri sunarız.", "We recommend by analyzing not just scents but the effect a scent leaves on the human brain.", "لا نحلل الروائح فحسب، بل أثرها في الدماغ البشري لنقدّم توصياتنا.") },
            { title: t("3000+ Nota Analizi", "3000+ Note Analysis", "تحليل أكثر من 3000 نوتة"), desc: t("400'den fazla koku molekülündeki binlerce hammadde ağırlığını hesaplayan Mix Engine ile teninize, mekanınıza, duygu durumunuza, iş ve özel hayatınıza en uygun alt notaları buluruz.", "With the Mix Engine, which calculates thousands of raw-material weights across 400+ fragrance molecules, we find the base notes that best suit your skin, space, mood, work and private life.", "بفضل محرك Mix الذي يحسب أوزان آلاف المواد الخام في أكثر من 400 جزيء عطري، نجد النوتات الأنسب لبشرتك ومكانك ومزاجك وعملك وحياتك الخاصة.") },
            { title: t("Kişisel Bütçe Esnekliği", "Personal Budget Flexibility", "مرونة الميزانية الشخصية"), desc: t("Yapay zeka asistanımız, bütçenize anında uyum sağlayarak size en uygun ebat, şişe, kutu seçimi veya anlık indirim kodunu sunar.", "Our AI assistant instantly adapts to your budget and offers the most suitable size, bottle, box choice or an instant discount code.", "يتكيّف مساعدنا الذكي مع ميزانيتك فورًا ويقدّم لك الحجم والزجاجة والعلبة الأنسب أو رمز خصم فوريًا.") }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="p-5 md:p-8 rounded-2xl md:rounded-3xl bg-background border border-foreground/5 hover:border-accent-gold/30 transition-colors duration-500 group"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent-gold/10 flex items-center justify-center text-accent-gold mb-3 md:mb-6 group-hover:scale-110 transition-transform duration-500">
                <Droplets size={20} className="md:w-6 md:h-6" />
              </div>
              <h3 className="text-base md:text-xl font-medium mb-1 md:mb-3">{feature.title}</h3>
              <p className="text-foreground/70 leading-relaxed text-xs md:text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
