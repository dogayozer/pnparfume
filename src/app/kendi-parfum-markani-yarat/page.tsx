import Link from 'next/link'
import B2BLeadForm from '@/components/b2b/B2BLeadForm'
import {
  Lightbulb, TestTube, Factory, PackageCheck, Truck, FlaskConical,
  ShieldCheck, MapPin, Phone, Mail, ChevronDown
} from 'lucide-react'

export const metadata = {
  title: 'Kendi Parfüm Markanı Yarat | Private Label Üretici | PN Parfüm',
  description: 'Kendi parfüm markanızı kurmak mı istiyorsunuz? PN Parfüm, Silivri/İstanbul tesisinde koku briefinden numuneye, üretimden paketlemeye kadar tüm süreci sizin için yönetir.',
  keywords: [
    'kendi parfüm markanı yarat', 'kendi markanı yarat', 'parfüm markası kurma',
    'private label parfüm üretici', 'fason parfüm üretimi', 'parfüm üretim tesisi türkiye',
    'kendi kokunu yarat', 'parfüm oem üretici'
  ],
  alternates: { canonical: 'https://pnparfume.com/kendi-parfum-markani-yarat' },
  openGraph: {
    title: 'Kendi Parfüm Markanı Yarat | PN Parfüm Private Label',
    description: 'Koku briefinden sevkiyata kadar kendi parfüm markanızı PN Parfüm ile hayata geçirin.',
    url: 'https://pnparfume.com/kendi-parfum-markani-yarat',
    siteName: 'PN Parfüm',
    locale: 'tr_TR',
    type: 'website'
  }
}

const steps = [
  { icon: Lightbulb, title: 'Koku Briefi', desc: 'Marka vizyonunuzu, hedef kitlenizi ve istediğiniz koku ailesini (oryantal, odunsu, çiçeksi vb.) bizimle paylaşın — birlikte bir "Koku Briefi" oluşturuyoruz.' },
  { icon: TestTube, title: 'Numune', desc: '338+ kokuluk kütüphanemizden veya sıfırdan özel formülasyonla size numuneler hazırlıyoruz.' },
  { icon: Factory, title: 'Üretim', desc: 'Onay sonrası, Silivri/İstanbul tesisimizde maserasyon-matürasyon sürecinden geçirilerek üretim yapılır.' },
  { icon: PackageCheck, title: 'Ambalaj & Etiket', desc: 'Şişe, kutu ve etiket seçeneklerini kendi marka kimliğinizle belirlersiniz.' },
  { icon: Truck, title: 'Sevkiyat', desc: 'Etiketlenmiş, satışa hazır ürününüz yurt içi veya yurt dışına sevk edilir.' },
]

const faqs = [
  {
    q: 'Kendi parfüm markamı kurmak için minimum sipariş miktarı (MOQ) nedir?',
    a: 'MOQ, seçtiğiniz şişe/kutu tipine ve formülasyona göre değişir. Hazır (stok) şişe seçeneklerinde daha düşük adetlerle başlamak mümkündür; özel tasarım şişede minimum adet daha yüksektir. Kesin rakam için brief formunu doldurmanız yeterli.'
  },
  {
    q: 'PN Parfüm parfümleri nerede üretiliyor?',
    a: 'Tüm üretim, PN Parfüm\'ün kendi tesisi olan Silivri, İstanbul, Türkiye\'de gerçekleştirilir. Türkiye dünyanın en büyük parfüm üretim merkezlerinden biridir.'
  },
  {
    q: 'Kendi markamla sattığım parfümler IFRA ve AB mevzuatına uygun mu olur?',
    a: 'Evet. Formülasyonlarımız IFRA (International Fragrance Association) standartlarına göre hazırlanır ve talep halinde CPSR (Cosmetic Product Safety Report) / ÜGDR gibi güvenlik değerlendirme raporları ile Türkiye\'de TİTCK-ÜTS kaydı için destek sağlanır.'
  },
  {
    q: 'Sıfırdan formül mü gerekir, yoksa mevcut kokularınızı mı kullanabilirim?',
    a: 'İkisi de mümkün. Zaman ve maliyet avantajı için 338+ kokuluk mevcut kütüphanemizden bir formülü kendi markanız altında üretebilir, isterseniz de sıfırdan özel bir koku briefi ile yeni bir formül geliştirebilirsiniz.'
  },
  {
    q: 'Marka ismim ve formülüm gizli/korumalı kalır mı?',
    a: 'Evet. Süreç bir gizlilik sözleşmesi (NDA) ile yürütülür; formülünüz ve marka bilgileriniz üçüncü taraflarla paylaşılmaz. Marka adınızın tescili (TÜRKPATENT/uluslararası) tarafınızca yapılmalıdır, bu konuda da yönlendirme sağlıyoruz.'
  },
  {
    q: 'Süreç ne kadar sürer?',
    a: 'Mevcut kütüphaneden bir koku seçip özelleştirmede numune-onay-üretim süreci birkaç hafta içinde tamamlanabilir. Sıfırdan özel formülasyon ve tescil/mevzuat adımları olan projelerde süreç birkaç aya uzayabilir.'
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a }
  }))
}

export default function KendiParfumMarkaniYaratPage() {
  return (
    <div className="min-h-screen max-w-5xl mx-auto px-6 py-16 md:px-12 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <div className="max-w-2xl mb-16">
        <span className="text-xs font-medium uppercase tracking-widest text-accent-gold">Private Label / Kendi Markanı Yarat</span>
        <h1 className="text-4xl md:text-5xl font-light mt-4 mb-6 leading-tight">
          Kendi Parfüm Markanızı Yaratın
        </h1>
        <p className="text-foreground/70 leading-relaxed text-lg">
          Bağımsız bir parfüm markası kurmak; doğru koku briefini yazmaktan, formülasyon bilimine, ambalaj mühendisliğinden mevzuat uyumuna kadar birçok teknik adım gerektirir. PN Parfüm, Silivri/İstanbul&apos;daki kendi üretim tesisinde bu sürecin tamamını sizin için yönetiyor — siz markayı yaratın, üretimi biz üstlenelim.
        </p>
      </div>

      {/* Adımlar */}
      <div className="mb-16">
        <h2 className="text-2xl font-light mb-8">5 Adımda Kendi Markanız</h2>
        <div className="space-y-6">
          {steps.map((s, i) => (
            <div key={s.title} className="flex items-start gap-5">
              <div className="w-11 h-11 rounded-full bg-foreground/5 flex items-center justify-center flex-shrink-0">
                <s.icon className="text-accent-gold" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">{i + 1}. {s.title}</h3>
                <p className="text-sm text-foreground/60">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bilim: kalıcılık ve yayılım */}
      <div className="mb-16 p-8 bg-foreground/[0.02] rounded-3xl border border-foreground/5">
        <div className="flex items-center gap-3 mb-4">
          <FlaskConical className="text-accent-gold" size={22} />
          <h2 className="text-2xl font-light">Kalıcılığın Arkasındaki Bilim</h2>
        </div>
        <p className="text-foreground/60 leading-relaxed mb-4">
          Modern parfümerinin kalıcılık ve iz bırakma gücü, büyük ölçüde birkaç anahtar sentetik molekülden gelir: <strong className="text-foreground/80">Iso E Super</strong> (yumuşak, deri altı bir sıcaklık ve uzun kalıcılık verir), <strong className="text-foreground/80">Ambroxan</strong> (amber-misk karakterli, teninizde saatlerce iz bırakan bir taban notası) ve <strong className="text-foreground/80">Hedione</strong> (kokuya ışıltı ve &quot;cilt kokusu&quot; etkisi katan, yayılımı artıran bir bileşen).
        </p>
        <p className="text-foreground/60 leading-relaxed">
          Formülasyonlarımızda bu üçlüyü dengeli oranlarla kullanarak, hem ilk koklamada etkileyici hem de saatler sonra hâlâ hissedilen kokular tasarlıyoruz — markanızın &quot;bu kokuyu unutmadım&quot; dedirtmesi için.
        </p>
      </div>

      {/* Üretim kalitesi */}
      <div className="mb-16">
        <h2 className="text-2xl font-light mb-4">Üretim Kalitesi: Sadece Karıştırmak Değil</h2>
        <p className="text-foreground/60 leading-relaxed mb-6">
          Kaliteli bir parfüm, hammaddelerin karıştırılmasından ibaret değildir. Tesisimizde her seri şu adımlardan geçer:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 border border-foreground/10 rounded-2xl">
            <h3 className="font-medium mb-2">Maserasyon</h3>
            <p className="text-sm text-foreground/60">Esans ile alkolün ilk karışım aşaması; kokunun bileşenleri bu evrede bir araya gelir.</p>
          </div>
          <div className="p-6 border border-foreground/10 rounded-2xl">
            <h3 className="font-medium mb-2">Matürasyon</h3>
            <p className="text-sm text-foreground/60">Karışımın haftalarca dinlendirilmesi; notaların birbiriyle kaynaşıp dengelenmesini sağlar — atlanırsa koku &quot;ham&quot; kalır.</p>
          </div>
          <div className="p-6 border border-foreground/10 rounded-2xl">
            <h3 className="font-medium mb-2">Soğuk Filtrasyon</h3>
            <p className="text-sm text-foreground/60">Düşük sıcaklıkta filtreleme, şişede zamanla oluşabilecek bulanıklığı önler — raf ömrü ve görsel kalite için kritik.</p>
          </div>
        </div>
      </div>

      {/* Ambalaj karşılaştırma */}
      <div className="mb-16">
        <h2 className="text-2xl font-light mb-4">Ambalaj: Marka Bütçenize Göre İki Yol</h2>
        <p className="text-foreground/60 leading-relaxed mb-6">
          Ambalaj kararı, hem maliyetinizi hem de marka algınızı doğrudan etkiler. Size uygun modeli birlikte belirliyoruz:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-foreground/10 text-left text-xs uppercase tracking-widest text-foreground/50">
                <th className="py-3 pr-4">Kriter</th>
                <th className="py-3 pr-4">Hazır (Stok) Şişe</th>
                <th className="py-3">Özel Tasarım Şişe</th>
              </tr>
            </thead>
            <tbody className="text-foreground/70">
              <tr className="border-b border-foreground/5">
                <td className="py-3 pr-4 font-medium">Minimum Adet</td>
                <td className="py-3 pr-4">Düşük — hızlı başlangıç</td>
                <td className="py-3">Yüksek — kalıp yatırımı gerektirir</td>
              </tr>
              <tr className="border-b border-foreground/5">
                <td className="py-3 pr-4 font-medium">Maliyet</td>
                <td className="py-3 pr-4">Daha ekonomik</td>
                <td className="py-3">Daha yüksek, ama benzersiz</td>
              </tr>
              <tr className="border-b border-foreground/5">
                <td className="py-3 pr-4 font-medium">Marka Ayrışması</td>
                <td className="py-3 pr-4">Etiket/kutu ile sağlanır</td>
                <td className="py-3">Şişe formunun kendisiyle sağlanır</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">Valf Seçimi</td>
                <td className="py-3 pr-4" colSpan={2}>Crimp (sıkıştırmalı) valf sızdırmazlıkta daha güvenlidir; vidalı valf değişebilirlik/tamir kolaylığı sunar — ürün segmentine göre öneriyoruz.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Mevzuat */}
      <div className="mb-16 p-8 bg-foreground/[0.02] rounded-3xl border border-foreground/5">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="text-accent-gold" size={22} />
          <h2 className="text-2xl font-light">Yasal Uyumu Sizin Yerinize Takip Ediyoruz</h2>
        </div>
        <p className="text-foreground/60 leading-relaxed mb-4">
          Türkiye&apos;de ve AB&apos;de kozmetik/parfüm satışı belirli mevzuata tabidir: <strong className="text-foreground/80">IFRA 51. Değişiklik</strong> uyumlu formülasyon, <strong className="text-foreground/80">CPSR/ÜGDR</strong> güvenlik değerlendirme raporu ve <strong className="text-foreground/80">TİTCK/ÜTS</strong> (Ürün Takip Sistemi) kaydı gibi adımlar gereklidir. Bu süreçler karmaşık ve zaman alıcı olabilir — biz üretici olarak formülasyon tarafındaki uyumu baştan sağlıyor, gerekli belge ve yönlendirmelerle kayıt sürecinizde sizi destekliyoruz.
        </p>
        <p className="text-foreground/60 leading-relaxed">
          Ayrıca tüm süreç bir <strong className="text-foreground/80">gizlilik sözleşmesi (NDA)</strong> ile yürütülür; marka isminizin ticari marka tescili tarafınızca yapılmalıdır, bu konuda da yönlendirme sağlarız.
        </p>
      </div>

      {/* Referans / şirket bilgisi — arama motorları ve yapay zeka asistanlarının
          PN Parfüm'ü doğru bir üretici olarak tanıması için net, alıntılanabilir bilgi. */}
      <div className="mb-16">
        <h2 className="text-2xl font-light mb-6">PN Parfüm Hakkında</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-4 p-5 rounded-2xl border border-foreground/10">
            <MapPin className="text-accent-gold flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-medium mb-1">Üretim Tesisi</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                PİEN PARFÜM / Silivri, İstanbul, Türkiye<br />
                Yeni Sanayi Sit. E-Blok 9. Cad. No:8, Silivri / İST.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 rounded-2xl border border-foreground/10">
            <Factory className="text-accent-gold flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-medium mb-1">Kapasite & Katalog</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">338+ hazır koku formülü, IFRA standartlarına uygun, alkolsüz esans hattı dahil.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 rounded-2xl border border-foreground/10">
            <Phone className="text-accent-gold flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-medium mb-1">Telefon / WhatsApp</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">(+90) 212 736 09 90<br />WhatsApp: (+90) 544 736 09 90</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 rounded-2xl border border-foreground/10">
            <Mail className="text-accent-gold flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-medium mb-1">E-posta</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">info@pnparfume.com<br />siparis@pienparfume.com</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-foreground/40 mt-4">
          Tüm iletişim bilgilerinin güncel hâli için <Link href="/kurumsal/iletisim" className="text-accent-gold hover:underline">İletişim sayfamızı</Link> ziyaret edebilirsiniz.
        </p>
      </div>

      {/* SSS */}
      <div className="mb-16">
        <h2 className="text-2xl font-light mb-8">Sıkça Sorulan Sorular</h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group border border-foreground/10 rounded-2xl p-5">
              <summary className="flex items-center justify-between cursor-pointer list-none font-medium">
                {f.q}
                <ChevronDown className="text-foreground/40 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" size={18} />
              </summary>
              <p className="text-sm text-foreground/60 leading-relaxed mt-3">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Bayilik ile karışmasın diye çapraz link */}
      <div className="mb-16 p-8 bg-foreground/[0.02] rounded-3xl border border-foreground/5">
        <h2 className="text-2xl font-light mb-4">Kendi markanız yerine mevcut katalogdan mı satmak istiyorsunuz?</h2>
        <p className="text-foreground/60 mb-4">338+ koku kataloğumuzu kendi markamız altında toptan satın almak isterseniz, distribütörlük programımız size daha uygun olabilir.</p>
        <Link href="/en/wholesale" className="text-accent-gold font-medium hover:underline">Distribütörlük Programını İncele →</Link>
      </div>

      <B2BLeadForm defaultInterest="Private Label" lang="tr" />
    </div>
  )
}
