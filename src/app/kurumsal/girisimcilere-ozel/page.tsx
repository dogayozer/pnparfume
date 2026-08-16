export const metadata = {
  title: 'Girişimcilere Özel | PN Parfüm',
  description: 'PN Parfüm iş ortağı olun, kârlı iş modelimizle gücümüze katılın.',
}

import CorporateForm from './CorporateForm'

export default function GirisimcilereOzelPage() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-light mb-4 text-accent-gold">Girişimcilere Özel</h2>
        <p className="text-foreground/70 leading-relaxed mb-6">
          yapay zeka analiz destekli koku tasarımında öncü olan PN Parfüm, vizyonunu paylaşacak ve bu eşsiz deneyimi kendi müşterilerine ulaştıracak dijital iş ortakları arıyor. 
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
          <p className="text-sm text-foreground/60">Yüksek dönüşümlü ikna edici pazarlama metinleri, profesyonel ürün görselleri ve kampanya materyalleri desteği.</p>
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

      <CorporateForm />
    </div>
  )
}
