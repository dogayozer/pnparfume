import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'

export const metadata = {
  title: 'İletişim | PN Parfüm',
  description: 'PN Parfüm ile iletişime geçin. Görüş ve önerilerinizi bekliyoruz.',
}

export default function IletisimPage() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-light mb-4 text-accent-gold">İletişim</h2>
        <p className="text-foreground/70 leading-relaxed">
          Koku seçimi veya siparişleriniz hakkında her türlü sorunuz için uzman ekibimize ulaşabilirsiniz. Size yardımcı olmaktan mutluluk duyarız.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* İletişim Bilgileri */}
        <div className="space-y-6">
          {/* WhatsApp Destek Hattı - Öne Çıkan Kart */}
          <a
            href="https://wa.me/905447360990?text=Merhaba,%20PN%20Parfüm%20hakkında%20bilgi%20ve%20destek%20almak%20istiyorum."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start space-x-4 p-5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/15 hover:border-[#25D366]/50 transition-all duration-300 group shadow-sm block"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform">
              <MessageCircle size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  WhatsApp Destek Hattı
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#25D366] text-white">Canlı</span>
                </h4>
              </div>
              <p className="text-sm font-mono text-[#25D366] font-bold mt-1">
                +90 544 736 09 90
              </p>
              <p className="text-xs text-foreground/60 mt-1">
                Sipariş, koku danışmanlığı ve hızlı destek için WhatsApp üzerinden anında yazabilirsiniz.
              </p>
            </div>
          </a>

          <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-background border border-transparent hover:border-foreground/5 transition-colors">
            <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center flex-shrink-0 text-accent-gold">
              <MapPin size={20} />
            </div>
            <div>
              <h4 className="font-medium mb-1">Merkez Ofis & Laboratuvar</h4>
              <p className="text-sm text-foreground/60 leading-relaxed">
                PİEN PARFUME / SİLİVRİ / İSTANBUL<br />
                Yeni Sanayi Sit. E-Blok 9.Cad. No:8<br />
                Silivri / İST.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-background border border-transparent hover:border-foreground/5 transition-colors">
            <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center flex-shrink-0 text-accent-gold">
              <Phone size={20} />
            </div>
            <div>
              <h4 className="font-medium mb-1">Müşteri Hizmetleri & Santral</h4>
              <p className="text-sm text-foreground/60">
                Telefon: (+90) 212 736 09 90<br />
                WhatsApp: (+90) 544 736 09 90<br />
                Fax: (+90) 212 736 09 91
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-background border border-transparent hover:border-foreground/5 transition-colors">
            <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center flex-shrink-0 text-accent-gold">
              <Mail size={20} />
            </div>
            <div>
              <h4 className="font-medium mb-1">E-posta</h4>
              <p className="text-sm text-foreground/60">
                info@pnparfume.com
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-background border border-transparent hover:border-foreground/5 transition-colors">
            <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center flex-shrink-0 text-accent-gold">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="font-medium mb-1">Çalışma Saatleri</h4>
              <p className="text-sm text-foreground/60">
                Pazartesi - Cuma: 09:00 - 18:00<br />
                Cumartesi - Pazar: Kapalı
              </p>
            </div>
          </div>
        </div>

        {/* İletişim Formu */}
        <div className="bg-background border border-foreground/10 rounded-3xl p-6 md:p-8">
          <h3 className="text-xl font-medium mb-6">Bize Yazın</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-foreground/50 mb-2">Ad Soyad</label>
              <input type="text" className="w-full bg-foreground/5 border border-transparent rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold focus:bg-background transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-foreground/50 mb-2">E-posta</label>
              <input type="email" className="w-full bg-foreground/5 border border-transparent rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold focus:bg-background transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-foreground/50 mb-2">Konu</label>
              <select className="w-full bg-foreground/5 border border-transparent rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold focus:bg-background transition-colors text-sm">
                <option>Sipariş Durumu</option>
                <option>Ürün Bilgisi</option>
                <option>İade / Değişim</option>
                <option>Bayilik / Kurumsal</option>
                <option>Diğer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-foreground/50 mb-2">Mesajınız</label>
              <textarea rows={4} className="w-full bg-foreground/5 border border-transparent rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold focus:bg-background transition-colors resize-none"></textarea>
            </div>
            <button type="button" className="w-full bg-foreground text-background py-4 rounded-xl text-sm font-medium hover:bg-accent-gold transition-colors mt-2">
              Mesajı Gönder
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
