export const metadata = {
  title: 'Girişimcilere Özel | PN Parfüm (Pien Parfum)',
  description:
    'Kendi parfüm markanızı kurun veya PN Parfüm dijital iş ortağı olun. Zihin haritası ve 11 adımlı algoritmik şema ile fason üretim, mevzuat ve markalaşma rehberi.',
}

import BrandRoadmapGuide from './BrandRoadmapGuide'
import CorporateForm from './CorporateForm'

export default function GirisimcilereOzelPage() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-light mb-4 text-accent-gold">
          Girişimcilere Özel: Kendi Parfüm Markanızı Kurun
        </h2>
        <p className="text-foreground/70 leading-relaxed mb-4">
          Yapay zeka analiz destekli koku tasarımında öncü olan <strong>PN Parfüm (Pien Parfum)</strong>, 2002'den beri parfüm üretimi yapan bir marka olarak,
          hem hazır ürün portföyümüzle kârlı dijital iş ortaklığı kurmak isteyenlere hem de{' '}
          <strong>kendi parfüm markasını sıfırdan hayata geçirmek isteyen girişimcilere</strong> uçtan uca
          fason üretim ve mevzuat rehberliği sunar.
        </p>
        <p className="text-foreground/70 leading-relaxed">
          Fikirden ilk satışa uzanan bu süreçte koku ve konsantrasyon seçiminden numune/maserasyona,
          şişe ve valf tedarikinden etil alkol mevzuatına, 82 alerjen ve etiket kontrolünden TİTCK (ÜTS)
          dosyalamasına kadar her aşamayı zihin haritası ve algoritmik karar akışıyla sizin için
          şeffaf hale getiriyoruz.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 border border-foreground/10 rounded-2xl bg-background">
          <h3 className="font-medium text-lg mb-2">Kendi Markanızla Fason Üretim</h3>
          <p className="text-sm text-foreground/60">
            Kendi tesisinizi kurmadan GMP ilkelerine uygun üretim, numune geliştirme, şişe/valf seçimi ve teknik dosya desteği.
          </p>
        </div>
        <div className="p-6 border border-foreground/10 rounded-2xl bg-background">
          <h3 className="font-medium text-lg mb-2">Mevzuat ve Etiket Güvencesi</h3>
          <p className="text-sm text-foreground/60">
            IFRA Kategori 4 limitleri, 82 parfüm alerjeni, Madde 22 Türkçe etiket kuralları ve ÜTS süreci için eksiksiz teknik veri.
          </p>
        </div>
        <div className="p-6 border border-foreground/10 rounded-2xl bg-background">
          <h3 className="font-medium text-lg mb-2">Yüksek Kâr Marjı ve Marka İmajı</h3>
          <p className="text-sm text-foreground/60">
            Doğrudan üreticiden avantajlı alım yaparak dijital ortamda ve perakendede rekabetçi kârlılık oranlarına ulaşın.
          </p>
        </div>
        <div className="p-6 border border-foreground/10 rounded-2xl bg-background">
          <h3 className="font-medium text-lg mb-2">API, Pazarlama ve Toptan</h3>
          <p className="text-sm text-foreground/60">
            Hazır ürünlerle hızlı başlamak isteyen iş ortakları için gelişmiş API altyapısı, görsel/metin desteği ve toptan tedarik.
          </p>
        </div>
      </div>

      <BrandRoadmapGuide />

      <CorporateForm />
    </div>
  )
}
