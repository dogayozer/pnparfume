'use client'

import { Building2, PackageCheck, Truck, Percent, Sparkles, Send } from 'lucide-react'
import Image from 'next/image'

export default function B2BSamplerPage() {
  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#4A3527] font-sans pt-24 pb-20 selection:bg-[#B48A3F] selection:text-white">
      
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-[#B48A3F] text-xs font-bold tracking-[0.3em] uppercase mb-4 flex items-center justify-center gap-2">
            <Building2 size={14} /> B2B Kurumsal İş Ortaklığı
          </h2>
          <h1 className="text-4xl md:text-5xl font-serif font-light mb-6">Müşterilerinize İmzanızı Bırakın.</h1>
          <p className="text-[#4A3527]/70 text-lg max-w-2xl mx-auto leading-relaxed">
            E-ticaret siparişlerinizde kargo hediyesi olarak kullanabileceğiniz 2ml Mixparfum Sampler (Numune) setleri.
            Müşteri sadakatini artırmanın en elegan yolu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <div className="order-2 md:order-1 space-y-8">
             <div className="flex gap-4">
               <div className="w-12 h-12 rounded-full bg-[#B48A3F]/10 flex items-center justify-center flex-shrink-0">
                 <PackageCheck className="text-[#B48A3F]" size={24} />
               </div>
               <div>
                 <h3 className="font-serif text-xl mb-2">Premium Algı</h3>
                 <p className="text-[#4A3527]/70 text-sm">Standart promosyon ürünleri yerine, markanızın paketlerinden çıkan butik niş kokular müşterilerinizin kargo açılış (unboxing) deneyimini zirveye taşır.</p>
               </div>
             </div>
             <div className="flex gap-4">
               <div className="w-12 h-12 rounded-full bg-[#B48A3F]/10 flex items-center justify-center flex-shrink-0">
                 <Percent className="text-[#B48A3F]" size={24} />
               </div>
               <div>
                 <h3 className="font-serif text-xl mb-2">Kurumsal İskonto Modeli</h3>
                 <p className="text-[#4A3527]/70 text-sm">Aylık düzenli gönderim (abonelik) veya toplu alımlarda hacime bağlı kademeli iskonto fırsatları.</p>
               </div>
             </div>
             <div className="flex gap-4">
               <div className="w-12 h-12 rounded-full bg-[#B48A3F]/10 flex items-center justify-center flex-shrink-0">
                 <Sparkles className="text-[#B48A3F]" size={24} />
               </div>
               <div>
                 <h3 className="font-serif text-xl mb-2">Özelleştirilebilir Harfler</h3>
                 <p className="text-[#4A3527]/70 text-sm">Firmanıza özel koku profilleri tasarlayıp, şişelerin üzerine kurum logolu etiketler çalışabiliriz (Private Label seçeneği).</p>
               </div>
             </div>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="aspect-[4/3] rounded-3xl bg-white border border-[#4A3527]/10 p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
               <Image src="/images/products/pnbayankutu.png" alt="Kurumsal Numune" fill className="object-contain p-12 drop-shadow-2xl" />
            </div>
          </div>
        </div>

        {/* Kurumsal Form */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-10 border border-[#4A3527]/5 shadow-sm">
          <h3 className="text-2xl font-serif text-center mb-2">Kurumsal Talep Formu</h3>
          <p className="text-center text-[#4A3527]/60 mb-8 text-sm">B2B satış ekibimiz en kısa sürede size özel teklifimizle dönüş yapacaktır.</p>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-[#4A3527]/60 mb-2">Firma Adı</label>
                <input type="text" className="w-full bg-[#F5F0E6]/50 border border-[#4A3527]/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B48A3F]" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-[#4A3527]/60 mb-2">Aylık Paket Hacmi</label>
                <select className="w-full bg-[#F5F0E6]/50 border border-[#4A3527]/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B48A3F]">
                  <option>100 - 500 adet</option>
                  <option>500 - 1000 adet</option>
                  <option>1000 - 5000 adet</option>
                  <option>5000+ adet</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-[#4A3527]/60 mb-2">Yetkili Ad Soyad</label>
                <input type="text" className="w-full bg-[#F5F0E6]/50 border border-[#4A3527]/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B48A3F]" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-[#4A3527]/60 mb-2">Kurumsal E-posta</label>
                <input type="email" className="w-full bg-[#F5F0E6]/50 border border-[#4A3527]/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B48A3F]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-[#4A3527]/60 mb-2">Ek Talepler (Opsiyonel)</label>
              <textarea rows={4} className="w-full bg-[#F5F0E6]/50 border border-[#4A3527]/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B48A3F]"></textarea>
            </div>

            <button type="button" className="w-full flex items-center justify-center gap-2 py-4 bg-[#4A3527] text-white rounded-full uppercase tracking-widest text-sm font-medium hover:bg-[#B48A3F] transition-colors">
              <Send size={16} /> Teklif İste
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
