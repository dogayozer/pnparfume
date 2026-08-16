'use client'

import { motion } from 'framer-motion'
import { Droplets } from 'lucide-react'

export default function HomeHighlights() {
  return (
    <section className="py-24 px-6 md:px-12 bg-foreground/[0.02]">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-light mb-4">Neden <span className="font-medium text-accent-gold">PN Parfüm?</span></h2>
          <p className="text-foreground/60 max-w-xl mx-auto">Sıradan bir katalog değil; duygularınızı, bütçenizi ve karakterinizi anlayan yapay zeka destekli bir koku mimarisi.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Nöroetki Odaklı", desc: "Sadece kokuları değil, o kokunun insan beyninde bıraktığı etkiyi analiz ederek öneri sunarız." },
            { title: "3000+ Nota Analizi", desc: "400'den fazla koku molekülündeki binlerce hammadde ağırlığını hesaplayan Mix Engine ile teninize, mekanınıza, duygu durumunuza, iş ve özel hayatınıza en uygun alt notaları buluruz." },
            { title: "Kişisel Bütçe Esnekliği", desc: "Yapay zeka asistanımız, bütçenize anında uyum sağlayarak size en uygun ebat, şişe, kutu seçimi veya anlık indirim kodunu sunar." }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="p-8 rounded-3xl bg-background border border-foreground/5 hover:border-accent-gold/30 transition-colors duration-500 group"
            >
              <div className="w-12 h-12 rounded-full bg-accent-gold/10 flex items-center justify-center text-accent-gold mb-6 group-hover:scale-110 transition-transform duration-500">
                <Droplets size={24} />
              </div>
              <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
              <p className="text-foreground/70 leading-relaxed text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
