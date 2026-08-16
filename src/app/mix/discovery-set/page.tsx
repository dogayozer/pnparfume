'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, Gift, Check, ArrowRight } from 'lucide-react'

export default function DiscoverySetPage() {
  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#4A3527] font-sans pt-24 pb-20 selection:bg-[#B48A3F] selection:text-white">
      
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-[#B48A3F] text-xs font-bold tracking-[0.3em] uppercase mb-4 flex items-center justify-center gap-2">
            <Sparkles size={14} /> Risksiz Deneyim
          </h2>
          <h1 className="text-5xl md:text-6xl font-serif font-light mb-6">Keşif Seti (Discovery Set)</h1>
          <p className="text-[#4A3527]/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Kendi oluşturduğunuz 3 farklı harmanı evinizde deneyin. Keşif setine ödediğiniz tutarın tamamı, tam boy parfüm siparişinizde <span className="text-[#B48A3F] font-medium">%100 Cashback</span> olarak iade edilecek.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24">
          
          {/* Card 1 */}
          <div className="bg-white rounded-[40px] p-10 border border-[#4A3527]/10 flex flex-col hover:border-[#B48A3F]/30 transition-colors">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-serif mb-2">4'lü Keşif Seti</h3>
                <p className="text-[#4A3527]/50 text-sm">3x Kendi Harmanın + 1x Sürpriz</p>
              </div>
              <div className="text-3xl font-light">₺450</div>
            </div>
            
            <div className="flex-grow flex items-center justify-center mb-8 relative aspect-[16/9]">
               <Image src="/images/products/pnkutulu3luseri.png" alt="4'lü Set" fill className="object-contain" />
            </div>
            
            <ul className="space-y-4 mb-8">
              {['4 adet 2ml deneme boy şişe', 'Tasarım formülleri kartları', '₺450 Hediye Çeki (Cashback)'].map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-[#4A3527]/80">
                  <Check size={16} className="text-[#B48A3F]" /> {feat}
                </li>
              ))}
            </ul>
            
            <button className="w-full py-4 rounded-full border border-[#4A3527] text-[#4A3527] hover:bg-[#4A3527] hover:text-[#F5F0E6] transition-colors uppercase tracking-widest text-sm font-medium">
              Sepete Ekle
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-[#4A3527] text-[#F5F0E6] rounded-[40px] p-10 border border-[#B48A3F]/20 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#B48A3F]/10 rounded-bl-[100px]" />
            <div className="absolute top-4 right-4 bg-[#B48A3F] text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-medium">
              En Çok Tercih Edilen
            </div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <h3 className="text-2xl font-serif mb-2 text-white">8'li Tam Set</h3>
                <p className="text-[#F5F0E6]/50 text-sm">6x Kendi Harmanın + 2x Sürpriz</p>
              </div>
              <div className="text-3xl font-light text-[#B48A3F]">₺750</div>
            </div>
            
            <div className="flex-grow flex items-center justify-center mb-8 relative aspect-[16/9] z-10">
               <Image src="/images/products/pnbayankutu.png" alt="8'li Set" fill className="object-contain drop-shadow-2xl" />
            </div>
            
            <ul className="space-y-4 mb-8 relative z-10">
              {['8 adet 2ml deneme boy şişe', 'Özel deri kılıf ve harman defteri', '₺750 Hediye Çeki (Cashback)'].map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-[#F5F0E6]/80">
                  <Check size={16} className="text-[#B48A3F]" /> {feat}
                </li>
              ))}
            </ul>
            
            <button className="w-full py-4 rounded-full bg-[#B48A3F] text-white hover:bg-white hover:text-[#4A3527] transition-colors uppercase tracking-widest text-sm font-medium relative z-10">
              Sepete Ekle
            </button>
          </div>

        </div>
        
        {/* Cashback Banner */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl p-8 border border-[#4A3527]/5 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#B48A3F]/10 flex items-center justify-center flex-shrink-0">
            <Gift size={24} className="text-[#B48A3F]" />
          </div>
          <div>
            <h4 className="text-xl font-serif mb-2">Nasıl Çalışır? (Cashback)</h4>
            <p className="text-[#4A3527]/60 text-sm leading-relaxed">
              Keşif seti siparişiniz teslim edildiğinde e-posta adresinize sipariş tutarınız kadar bir "Hediye Kodu" gönderilir. 
              Beğendiğiniz kokunun 50ml'lik tam boyunu sipariş verirken bu kodu kullanarak ödediğiniz tutarı fiyattan düşebilirsiniz. 
              Aslında keşif setini <b>bedavaya</b> getirmiş olursunuz.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
