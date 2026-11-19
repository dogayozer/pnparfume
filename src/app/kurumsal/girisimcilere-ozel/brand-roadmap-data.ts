export interface MindMapBranch {
  id: string
  number: string
  title: string
  shortSummary: string
  subtopics: string[]
  criticalRule: string
  pienSupport: string
}

export interface AlgorithmStep {
  step: string
  title: string
  question: string
  noAction: string
  yesAction: string
  pienRole: string
}

export const PIEN_SUPPORT_PILLARS = [
  {
    title: 'Konsept ve Koku Stratejisi',
    description:
      'Hedef kitlenize, mevsime ve bütçenize uygun koku ailelerinin belirlenmesi; EDT, EDP veya Extrait de Parfum konsantrasyonlarının planlanması.',
  },
  {
    title: 'Numune ve Maserasyon',
    description:
      'İstediğiniz koku profili ve esans oranında test numunelerinin hazırlanması, %96 saflıkta bitkisel bioetanol ile harmanlama ve dinlendirme yönetimi.',
  },
  {
    title: 'Şişe, Valf ve Ambalaj Rehberliği',
    description:
      'Ana satış şişelerinden çanta boy ve tester flakonlara kadar cam şişe seçimi; FEA 15 (krimp) veya vidalı (15-415) valf sistemlerinin kurgulanması.',
  },
  {
    title: 'GMP & Etil Alkol Mevzuatı',
    description:
      'TADB Alkol Transfer Belgesi, K tipi denatürasyon ve bandrol süreçlerinin yasal zeminde yürütülmesi; TS EN ISO 22716 (GMP) ilkelerine uygun dolum.',
  },
  {
    title: 'IFRA, 82 Alerjen ve Etiket Kontrolü',
    description:
      'IFRA 51. Değişiklik Kategori 4 limit hesapları, 31 Temmuz 2026 itibarıyla zorunlu 82 alerjen listesi (%0,001 eşiği) ve Madde 22 etiket uygunluk kontrolü.',
  },
  {
    title: 'Test, ÜBD ve ÜTS Koordinasyonu',
    description:
      'Stabilite/ambalaj testleri, yüksek alkollü ürünler için ISO 29621 mikrobiyoloji muafiyet dosyası, CPSR/ÜBD teknik verileri ve ÜTS bildirim rehberliği.',
  },
]

export const MIND_MAP_BRANCHES: MindMapBranch[] = [
  {
    id: 'mevzuat',
    number: '01',
    title: 'Yasal Sorumluluklar ve Mevzuat',
    shortSummary: 'Şirket yapısı, Sorumlu Kişi ve Sorumlu Teknik Eleman',
    subtopics: [
      '5324 sayılı Kozmetik Kanunu ve 7223 sayılı Kanun kapsamında İmalatçı / Sorumlu Kişi statüsü',
      'Ticaret sicilinde (NACE) "kozmetik" faaliyet alanının yer alması (şahıs veya sermaye şirketi)',
      'Sorumlu Teknik Eleman (7 lisans unvanı: Eczacı, Kimyager, Kimya Müh., Biyokimyager, Biyolog, Mikrobiyolog, Biyomedikal Müh.)',
      '1 Ekim 2026 güncel TİTCK Sorumlu Teknik Eleman Kılavuzu (en fazla 30 firma sınırı ve SGK bildirim kuralları)',
    ],
    criticalRule:
      'MERSİS/VEDOP kaydı ve Sorumlu Teknik Elemanın e-imza onayı tamamlanmadan ÜTS üzerinden ürün bildirimi yapılamaz.',
    pienSupport:
      'Sorumlu Kişi ve Sorumlu Teknik Eleman görev sınırlarının doğru kurgulanmasında ve mevzuat takviminin planlanmasında yol gösteriyoruz.',
  },
  {
    id: 'tescil',
    number: '02',
    title: 'Marka Tescili ve Dijital Altyapı',
    shortSummary: 'TÜRKPATENT, GS1 barkod, TRABİS ve e-ticaret hukuku',
    subtopics: [
      'TÜRKPATENT EPATS üzerinden marka tescil başvurusu (koruma başvuru anında başlar, süreç ort. 6–8 ay)',
      'GS1 Türkiye üyeliği ile her hacim ve varyant için benzersiz GTIN barkod atanması',
      'TRABİS üzerinden .tr uzantılı alan adı tescili',
      'Kendi web sitenizden satışta ETBİS kaydı, SSL, 3D Secure, e-Arşiv, Mesafeli Satış, KVKK ve İYS uyumu',
    ],
    criticalRule:
      'Marka adı tescil sorgusu yapılmadan kutu/şişe yatırımı yapılmamalı; GS1 dışı barkodlar ÜTS sistemine girilmemelidir.',
    pienSupport:
      'Varyant ve hacim yapınızın GS1 barkod, ÜTS ürün bildirimi ve e-ticaret/pazaryeri entegrasyonlarıyla uyumlu kurulmasını sağlıyoruz.',
  },
  {
    id: 'fason',
    number: '03',
    title: 'Fason Üretici Seçimi ve Sözleşme',
    shortSummary: 'GMP tesis, MOQ planlaması, NDA ve alkol mevzuatı',
    subtopics: [
      'TS EN ISO 22716 (GMP) standartlarına uygun üretim tesisi, karıştırma tankları ve hijyen denetimi',
      'Minimum Sipariş Adedi (MOQ) gerçekçiliği: şişe hacmi, hammadde alt limiti ve tank çalışma hacmi dengesi',
      '%60+ etil alkol için Alkol Transfer Belgesi, bandrol ve K tipi denatürasyon izlenebilirliği',
      'Karşılıklı Gizlilik (NDA) ve Fason Üretim Sözleşmesi (termin, CoA, teknik eleman erişimi, belge teslimi)',
    ],
    criticalRule:
      'Yalnızca sertifika beyanına güvenilmemeli; etil alkol tedarik zinciri düzenli, lisanslı fason üretici ile sözleşmeli çalışılmalıdır.',
    pienSupport:
      'Lisanslı üretim altyapımız, şeffaf termin/MOQ planlamamız ve yasal etil alkol tedarik güvencemizle doğrudan üretim ortağınız oluyoruz.',
  },
  {
    id: 'arge',
    number: '04',
    title: 'Ar-Ge, Koku ve Ambalaj Stratejisi',
    shortSummary: 'Konsantrasyon, IFRA Kategori 4, maserasyon ve şişe/valf',
    subtopics: [
      'Koku ailesi ve konsantrasyon seçimi: EDC (%2–5), EDT (%5–15), EDP (%15–20), Extrait (%20–40)',
      'IFRA 51. Değişiklik Kategori 4 (bitmiş ürüne göre seyreltme hesabı) ve Ocak 2027 IFRA 52. Değişiklik takibi',
      'Bitkisel kökenli %96 bioetanol kullanımı, rakılaşma (bulanıklık) önleme ve serin/karanlık ortamda maserasyon',
      'Cam şişe (100 ml, 12–15 ml çanta boy, 1–2,5 ml tester) ve FEA 15 krimp vs. vidalı (15-415) valf seçimi',
    ],
    criticalRule:
      'Esans seçilirken IFRA Kategori 4 limitleri ve 82 alerjen deklarasyonu en baştan alınmalı; maserasyon tamamlanmadan dolum yapılmamalıdır.',
    pienSupport:
      'Hedef kitlenize uygun koku seçimi, 2 ml / 5 ml numune hazırlama, maserasyon ve şişe/valf tedarik sürecini bizzat yönetiyoruz.',
  },
  {
    id: 'etiket',
    number: '05',
    title: 'Etiket, Alerjen ve Yasaklı İddialar',
    shortSummary: 'Madde 22, 82 alerjen kuralı ve TİTCK İddialar Kılavuzu',
    subtopics: [
      'Madde 22 zorunlu Türkçe bilgiler: Sorumlu Kişi, nominal miktar, PAO/tarih, uyarılar, parti no, işlev, INCI listesi',
      '31 Temmuz 2026 itibarıyla zorunlu 82 parfüm alerjeni (%0,001 / 10 ppm eşiğini aşanlar etiketlenir; eski stok sonu 31 Tem 2028)',
      'Çevre mevzuatı ve GEKAP kapsamında cam/kâğıt/kompozit geri dönüşüm sembol ve kodları',
      'Yasaklı iddialar: "Sağlık Bakanlığı onaylı", "ÜTS bildirimlidir", "koruyucu içermez", "paraben içermez" ifadelerinin temizlenmesi',
    ],
    criticalRule:
      'CPSR imzalanıp uyarılar netleşmeden kutu ve etiket kesinlikle matbaaya gönderilmemelidir.',
    pienSupport:
      'Formülasyonun INCI dökümünü ve 82 alerjen oranlarını çıkarıyor, baskı öncesi kutu/etiket metinlerinizi mevzuata göre kontrol ediyoruz.',
  },
  {
    id: 'titck',
    number: '06',
    title: 'Sağlık Bakanlığı (TİTCK) ve Testler',
    shortSummary: 'Stabilite, ISO 29621 muafiyeti, CPSR, ÜBD ve ÜTS',
    subtopics: [
      'Raf ömrü/PAO için Stabilite Testi ve pompa/conta/şişe için Ambalaj Uyumluluk Testi',
      '%20+ alkol içeren parfümlerde TS EN ISO 29621 kapsamında mikrobiyoloji/challenge testinden bilimsel muafiyet dosyası',
      'Yetkin güvenlik değerlendiricisi imzalı CPSR (Bölüm A ve B) ile tam ÜBD (PIF) arşivinin oluşturulması',
      '3 aşamalı ÜTS süreci: Firma/EBS kaydı (Halkbank harç), Teknik Eleman e-imzası ve ürün/numune bildirimi',
    ],
    criticalRule:
      'Vegan gibi özel "içermez" iddiası kullanılacaksa TS EN ISO/IEC 17025 akredite laboratuvar raporu ÜTS sistemine yüklenmelidir.',
    pienSupport:
      'ÜBD ve CPSR için gereken tüm imalat, MSDS/SDS, IFRA ve CoA belgelerini hazırlıyor; ÜTS bildirim aşamasında teknik destek veriyoruz.',
  },
]

export const ALGORITHM_STEPS: AlgorithmStep[] = [
  {
    step: 'Adım 0',
    title: 'Konsept ve Konumlandırma',
    question: 'Hedef kitle, koku profili, konsantrasyon (EDT/EDP/Extrait), hacim ve hedef birim maliyet belirlendi mi?',
    noAction: 'Koku ailesini ve bütçeyi netleştir; fiyat hedefi formülasyonu doğrudan belirler.',
    yesAction: 'Ürün özet dosyası (Brief) oluşturulur → Adım 1.',
    pienRole: 'PN Parfüm ile hedef bütçe ve koku konsepti brifi oluşturulur.',
  },
  {
    step: 'Adım 1',
    title: 'Marka Tescili ve Alan Adı',
    question: 'Seçilen marka adı TÜRKPATENT sınıflarında müsait ve .tr alan adı boşta mı?',
    noAction: 'Benzerlik riski varsa isim değiştir; aksi halde ret veya 2 aylık yayım itirazı riski doğar.',
    yesAction: 'EPATS üzerinden marka başvurusu yapılır ve alan adı tescil edilir → Adım 2.',
    pienRole: 'Marka güvenliği ve ambalaj öncesi isim netleştirme uyarısı sağlanır.',
  },
  {
    step: 'Adım 2',
    title: 'Şirket ve Sorumlu Kişi',
    question: 'Türkiye’de yerleşik firma var mı, sicilde "kozmetik" faaliyeti yazıyor mu ve Sorumlu Kişi net mi?',
    noAction: 'Şahıs veya sermaye şirketi kur / ana sözleşmeye kozmetik ekle; teknik eleman atamasını planla.',
    yesAction: 'MERSİS/VEDOP kaydı ve yetkili e-imzası hazır hale getirilir → Adım 3.',
    pienRole: 'Sorumlu Kişi ve Sorumlu Teknik Eleman sorumluluk paylaşımı danışmanlığı verilir.',
  },
  {
    step: 'Adım 3',
    title: 'Fason Üretici ve Sözleşme',
    question: 'Tesis TS EN ISO 22716 (GMP) şartlarını yerinde sağlıyor, alkol lisansı tam ve MOQ bütçeye uygun mu?',
    noAction: 'Yalnızca sertifika beyanına güvenme; hijyen, tank kapasitesi ve MOQ şartını revize et.',
    yesAction: 'NDA ve Fason Üretim Sözleşmesi (formül, belge teslimi, termin) imzalanır → Adım 4.',
    pienRole: 'GMP uyumlu tesis, şeffaf MOQ ve gizlilik sözleşmesi ile üretim güvencesi sunulur.',
  },
  {
    step: 'Adım 4',
    title: 'Esans, Alkol ve Numune',
    question: 'Esansın IFRA 51 Kategori 4 sertifikası, 82 alerjen listesi ve maserasyon performansı onaylandı mı?',
    noAction: 'Koku veya alkol saflığını revize et, dinlendirme süresini tamamla ve yeni numune iste.',
    yesAction: 'Nihai formül ve tam alerjen deklarasyonu sabitlenir → Adım 5.',
    pienRole: '2 ml / 5 ml numune hazırlama, %96 bioetanol harmanlama ve maserasyon yapılır.',
  },
  {
    step: 'Adım 5',
    title: 'Şişe, Valf ve Barkod',
    question: 'Şişe hacmi, ağız standardı (FEA 15 krimp veya vidalı) ve her varyant için GS1 GTIN belirlendi mi?',
    noAction: 'Sızdırmazlık ve ambalaj tedarikini çöz; GS1 dışı barkod kullanma.',
    yesAction: 'Her hacim/varyant için benzersiz GS1 barkodu atanır → Adım 6.',
    pienRole: 'Şişe, pompa ve kapak uyumu test edilerek tedarik ve dolum planlanır.',
  },
  {
    step: 'Adım 6',
    title: 'Testler ve ISO 29621',
    question: 'Stabilite ve ambalaj uyumluluk testleri bitti mi; %20+ alkol için ISO 29621 muafiyet dosyası hazır mı?',
    noAction: 'Eksik laboratuvar analizlerini tamamla; "içermez" iddiası varsa ISO/IEC 17025 testi yaptır.',
    yesAction: 'Raf ömrü / PAO süresi ve test raporları kesinleşir → Adım 7.',
    pienRole: 'Yüksek alkollü formül verileri ve test numuneleri laboratuvar sürecine hazırlanır.',
  },
  {
    step: 'Adım 7',
    title: 'CPSR ve ÜBD (PIF)',
    question: 'Yetkin güvenlik değerlendiricisi CPSR Bölüm A ve B’yi imzalayıp ÜBD dosyasını tamamladı mı?',
    noAction: 'Değerlendiricinin tespit ettiği risklere göre formülü veya uyarı metnini güncelle.',
    yesAction: 'İmzalı CPSR ve tam ÜBD dosyası arşive alınır → Adım 8.',
    pienRole: 'INCI, MSDS/SDS, IFRA ve parti CoA belgeleri CPSR/ÜBD dosyası için teslim edilir.',
  },
  {
    step: 'Adım 8',
    title: 'Kutu ve Etiket Baskısı',
    question: 'Tasarım; CPSR uyarıları, Madde 22 Türkçe zorunlulukları ve 82 alerjen listesiyle birebir uyumlu mu?',
    noAction: 'Baskıyı durdur ve mevzuat kontrolünden geçir; yasaklı iddiaları temizle.',
    yesAction: 'Etiket/kutu basılır ve ÜTS’ye yüklenecek okunaklı görseller hazırlanır → Adım 9.',
    pienRole: 'Baskı öncesi 82 alerjen eşik kontrolü ve yasaklı beyan taraması yapılır.',
  },
  {
    step: 'Adım 9',
    title: 'TİTCK / ÜTS Süreci',
    question: 'ÜTS firma kaydı, EBS kaydı ve Sorumlu Teknik Eleman e-imza onayı tamamlandı mı?',
    noAction: 'Eksik şirket/teknik eleman evrakını yükle ve Halkbank kurumsal tahsilat ile harcı yatır.',
    yesAction: 'ÜTS’de formül ve ürün bildirimi (numuneler dahil) tamamlanır → Adım 10.',
    pienRole: 'ÜTS girişi için formülasyon aralıkları, etiket görselleri ve teknik veriler sağlanır.',
  },
  {
    step: 'Adım 10',
    title: 'Dijital Kurulum ve Satış',
    question: 'Kendi sitenden satacaksan ETBİS, KVKK, Mesafeli Satış ve SSL hazır mı; parti serbest bırakıldı mı?',
    noAction: 'Yayın öncesi ETBİS kaydını ve yasal metinleri tamamla; onaysız partiyi sevk etme.',
    yesAction: 'Yasal satış başlar; 30 günlük ETBİS güncellemeleri ve yan etki takibi sürdürülür.',
    pienRole: 'Kalite kontrolü tamamlanan seri üretim partisi sevk edilir ve satışa hazır teslim edilir.',
  },
]

export const CONCENTRATION_ROWS = [
  { type: 'Eau de Cologne (EDC)', ratio: '%2 – %5', ml: '2 – 5 ml', longevity: '1 – 3 saat', character: 'Yüksek alkollü, narenciye/bitkisel; yaz ve anlık ferahlama' },
  { type: 'Eau de Toilette (EDT)', ratio: '%5 – %15', ml: '5 – 15 ml', longevity: '3 – 5 saat', character: 'Üst notalar hızlı yayılır; gündüz, ofis ve ilkbahar/yaz' },
  { type: 'Eau de Parfum (EDP)', ratio: '%15 – %20', ml: '15 – 20 ml', longevity: '6 – 8 saat', character: 'Kalp notaları belirgin; tüm yıl ve dengeli kalıcılık-fiyat' },
  { type: 'Extrait de Parfum', ratio: '%20 – %40', ml: '20 – 40 ml', longevity: '8 – 12+ saat', character: 'En yoğun ve düşük alkollü form; akşam, kış ve özel günler' },
]

export const BOTTLE_NECK_ROWS = [
  { feature: 'Boyun Ölçüsü', fea15: '15,0 ± 0,1 mm boğaz çapı, dişsiz düz flanş', screw: 'Vida dişli boyun (ör. 15-415)' },
  { feature: 'Kapama Mekanizması', fea15: 'Krimp makinesiyle metal halka veya kolay kapama pres', screw: 'Elle veya makineyle vidalama' },
  { feature: 'Sızdırmazlık & Estetik', fea15: 'Çok yüksek sızdırmazlık; açılıp doldurulamaz, lüks görünüm', screw: 'Orta düzey sızdırmazlık; tekrar doldurulabilir' },
  { feature: 'Maliyet', fea15: 'Kalıp, valf ve kapama ekipmanı maliyeti daha yüksek', screw: 'Başlangıç bütçeleri ve küçük seriler için uygun' },
]

export const FEES_2026 = [
  { item: 'TÜRKPATENT Tek Sınıflı Marka Başvurusu', fee: '2.820 TL', note: 'Başvuru anında ödenir; koruma başlar' },
  { item: 'TÜRKPATENT Marka Tescil (Belge) Ücreti', fee: '7.010 TL', note: 'İtirazsız süreç sonrası 2 aylık sürede ödenir' },
  { item: 'TİTCK Kozmetik Firma Kayıt Ücreti', fee: '9.117 TL', note: 'Tek seferlik; Halkbank kurumsal tahsilat ile' },
  { item: 'TİTCK Türkiye’de Üretilen Ürün Kaydı', fee: '322 TL / barkod', note: 'İlk bildirim ve güncellemelerde' },
]
