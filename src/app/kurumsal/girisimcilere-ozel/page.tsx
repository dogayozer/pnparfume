export const metadata = {
  title: 'Girişimcilere Özel | PN Parfüm',
  description: 'PN Parfüm iş ortağı olun, kârlı iş modelimizle gücümüze katılın.',
}

export default function GirisimcilereOzelPage() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-light mb-4 text-accent-gold">Girişimcilere Özel</h2>
        <p className="text-foreground/70 leading-relaxed mb-6">
          Nöropazarlama destekli koku tasarımında öncü olan PN Parfüm, vizyonunu paylaşacak ve bu eşsiz deneyimi kendi müşterilerine ulaştıracak dijital iş ortakları arıyor. 
        </p>
        <p className="text-foreground/70 leading-relaxed">
          Geleneksel bayiliğin yüksek yatırım maliyetleri ve ağır operasyonel yükleri yerine; risksiz, stoksuz veya düşük stoklu e-ticaret modelleriyle yüksek kâr marjları sunuyoruz. 
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="p-6 border border-foreground/10 rounded-2xl bg-background">
          <h3 className="font-medium text-lg mb-2">Yüksek Kâr Marjı</h3>
          <p className="text-sm text-foreground/60">Doğrudan üreticiden avantajlı alım yaparak dijital ortamda rekabetçi kârlılık oranlarına ulaşın.</p>
        </div>
        <div className="p-6 border border-foreground/10 rounded-2xl bg-background">
          <h3 className="font-medium text-lg mb-2">Pazarlama Desteği</h3>
          <p className="text-sm text-foreground/60">Yüksek dönüşümlü nöropazarlama metinleri, profesyonel ürün görselleri ve kampanya materyalleri desteği.</p>
        </div>
        <div className="p-6 border border-foreground/10 rounded-2xl bg-background">
          <h3 className="font-medium text-lg mb-2">Lüks Marka İmajı</h3>
          <p className="text-sm text-foreground/60">Klasik parfümlerin ötesinde; duyguları hedefleyen premium bir ürünü temsil etme ayrıcalığı.</p>
        </div>
        <div className="p-6 border border-foreground/10 rounded-2xl bg-background">
          <h3 className="font-medium text-lg mb-2">API ve Dropshipping</h3>
          <p className="text-sm text-foreground/60">Gelişmiş teknik altyapımızla kolay ürün aktarımı ve dilerseniz stok tutmadan (dropshipping) satış imkanı.</p>
        </div>
      </div>

      <div className="border-t border-foreground/10 pt-10">
        <h3 className="text-2xl font-light mb-6">Ön Başvuru Formu</h3>
        <form className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-foreground/50 mb-2">Ad Soyad / Firma Adı</label>
              <input type="text" className="w-full bg-background border border-foreground/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold transition-colors" placeholder="Firma veya Yetkili Adı" />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-foreground/50 mb-2">E-posta Adresi</label>
              <input type="email" className="w-full bg-background border border-foreground/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold transition-colors" placeholder="iletisim@sirket.com" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-foreground/50 mb-2">Telefon Numarası</label>
              <input type="tel" className="w-full bg-background border border-foreground/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold transition-colors" placeholder="05XX XXX XX XX" />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-foreground/50 mb-2">Web Siteniz / Sosyal Medya</label>
              <input type="url" className="w-full bg-background border border-foreground/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold transition-colors" placeholder="https://www..." />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-foreground/50 mb-2">Satış Stratejiniz & Mesajınız</label>
            <textarea rows={4} className="w-full bg-background border border-foreground/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold transition-colors resize-none" placeholder="Bize kısaca kendinizden ve nasıl bir iş modeli kurguladığınızdan bahsedin..."></textarea>
          </div>

          <button type="button" className="bg-foreground text-background px-8 py-3 rounded-full text-sm font-medium hover:bg-accent-gold transition-colors">
            Başvuruyu Gönder
          </button>
          <p className="text-xs text-foreground/40 mt-3">Başvurunuz incelendikten sonra ekibimiz sizinle iletişime geçecektir.</p>
        </form>
      </div>
    </div>
  )
}
