// Fason üretim / mevzuat makaleleri (kaynak: C:\pnio\fasonüretim\sıkçasorulansorular\*.docx).
// Genel bilgilendirme amaçlıdır; tarih, ücret ve eşik değerleri teyit edilmelidir.
export type SssBolum = { h: string; items: string[] }
export type MevzuatSss = { q: string; intro: string; bolumler: SssBolum[] }

export const MEVZUAT_NOTU =
  'Bu içerik genel bilgilendirme amacıyla hazırlanmıştır; hukuki veya resmi danışmanlık yerine geçmez. Tarihler, ücretler ve eşik değerleri güncel mevzuat ile yetkili kurumlardan veya Sorumlu Teknik Elemanınızdan teyit edilmelidir.'

export const MEVZUAT_SSS: MevzuatSss[] = [
  {
    q: 'Fason üretim ve tedarik sürecinde dikkat etmem gereken temel kriterler nelerdir?',
    intro: 'Fason parfüm üretimi ve tedarik sürecinde dikkat edilmesi gereken temel kriterler dört ana başlıkta toplanır.',
    bolumler: [
      {
        h: '1. Fason üretici ve tesis seçimi',
        items: [
          'GMP uygunluğu: Üretimin TS EN ISO 22716 standardına uygun yapılması esastır. Yalnızca sertifika beyanına güvenmeyin; tesis adresi, tank kapasiteleri, hijyen ve temizlik kayıtları, çapraz bulaşma önlemleri ve parti serbest bırakma süreçleri yerinde doğrulanmalıdır.',
          'Ar-Ge ve formülasyon: Üreticinin yalnızca hazır koku kütüphanesinden mi dolum yaptığı, yoksa markaya özel formül ve laboratuvar test desteği sunup sunmadığı sorgulanmalıdır.',
          'Gerçekçi minimum sipariş adedi (MOQ): MOQ; şişe hacmi, özel hammadde alt limitleri ve tankların asgari çalışma hacmine göre belirlenir. Bütçenizi ve nakit akışınızı kilitlemeyecek adetlerle çalışan üreticiler tercih edilmelidir.',
          'Teknik evrak yetkinliği: Üretici, görüşme aşamasında GMP beyanı, önerilen formülün INCI dökümü, MSDS/SDS belgeleri, mevcut test raporları ve fason sözleşme taslağını sunabilmelidir.',
        ],
      },
      {
        h: '2. Hammadde ve alkol tedarik güvenilirliği',
        items: [
          'Yasal etil alkol ve izlenebilirlik: Parfümler yüksek alkollü olduğundan özel mevzuata tabidir. Alkol, dağıtım yetkisi olan yerlerden alınmalı; sevkiyatlar Alkol Transfer Belgesi ile yapılmalı, bandrollü ve mevzuata uygun denatüre edilmiş olmalıdır.',
          'Alkol saflığı ve maserasyon: Keskin solvent kokusu kalmaması için yüksek saflıkta kozmetik alkol kullanılmalı, formüle gereğinden fazla su katılmamalıdır (aksi halde sütümsü bulanıklık oluşur). Koku ile alkolün bütünleşmesi için serin ve karanlık ortamda maserasyon (dinlendirme) süresi gözetilmelidir.',
          'Esans, IFRA ve alerjen belgeleri: Esansın IFRA Kategori 4 (Fine Fragrance) limitlerine uygun sertifikası bulunmalı; etiket ve güvenlik dosyası için esans tedarikçisinden 82 parfüm alerjeni dökümü temin edilmelidir.',
        ],
      },
      {
        h: '3. Ambalaj ve şişe tedariki',
        items: [
          'Şişe gövdesi, esans ve alkolle reaksiyona girmemesi için cam olmalıdır.',
          'FEA 15 krimp / kolay kapama: Yüksek sızdırmazlık ve tek parça lüks görünüm sunar; kalıp ve kapama aparatı maliyeti vidalıya göre yüksektir.',
          'Vidalı ağız (ör. 15-415): Küçük seriler ve başlangıç bütçeleri için daha ekonomiktir; sızdırmazlığı orta düzeydedir ve kapak ek yeri dışarıdan görünür.',
          'Seçilen ambalaj ve pompa mekanizmasının formülle reaksiyona girmediğini ve sızıntı yapmadığını göstermek için ambalaj uyumluluk ve stabilite testleri tamamlanmalıdır.',
        ],
      },
      {
        h: '4. Sözleşme ve hukuki güvenceler',
        items: [
          'Formül fikirleri ve ticari hedefler paylaşılmadan önce karşılıklı gizlilik sözleşmesi (NDA) imzalanmalıdır.',
          'Fason üretim sözleşmesinde formülün mülkiyeti (üretici değiştirirseniz formülü başka tesise taşıma hakkınız), ÜBD/PIF ve CPSR için gereken teknik veriler, hammadde evrakları ve her parti için Analiz Sertifikası (CoA) teslim şartı açıkça yer almalıdır.',
          'Sorumlu Teknik Elemanınızın fason tesisi ve üretim kayıtlarını denetleme hakkı sözleşmeyle güvence altına alınmalı; TİTCK nezdinde "Sorumlu Kişi" rolünün hangi tarafta kalacağı netleştirilmelidir.',
        ],
      },
    ],
  },
  {
    q: 'Fason üreticide hangi teknik evraklar olmalıdır?',
    intro: 'Fason üreticide bulunması, düzenli tutulması ve marka sahibine veya Sorumlu Teknik Elemana sunulması gereken teknik evraklar beş ana başlıkta toplanır.',
    bolumler: [
      {
        h: '1. Tesis ve kalite yönetim belgeleri (GMP)',
        items: [
          'GMP uygunluk beyanı veya sertifikası: Tesisin TS EN ISO 22716 standardına uygun üretim yaptığını gösteren belge.',
          'Tesis altyapı ve hijyen kayıtları: Tank kapasite ve kalibrasyon dökümleri, ekipman temizlik ve sanitasyon formları, çapraz bulaşmayı önleme prosedürleri, parti serbest bırakma kontrol kayıtları.',
          'Sorumlu Teknik Eleman denetim kayıtları: Teknik elemanınızın fason tesisi ve süreçleri denetleyebilmesi için güncel üretim ve kontrol kayıtlarının hazır bulundurulması.',
        ],
      },
      {
        h: '2. Hammadde ve formülasyon belgeleri',
        items: [
          'Tam INCI ve formül dökümü: Tüm bileşenlerin INCI adları, CAS ve EC numaraları ile konsantrasyon aralıkları.',
          'Güvenlik Bilgi Formları (MSDS/SDS): Etil alkol, esans, solvent gibi zararlı sınıfındaki hammaddeler için güncel formlar.',
          'Esans IFRA sertifikası: Koku konsantresinin yürürlükteki IFRA standartlarına ve Kategori 4 limitlerine uygunluğunu gösteren belge.',
          '82 parfüm alerjeni deklarasyonu: Durulanmayan üründe %0,001 (10 ppm) eşiğini aşan maddeleri belirlemek ve etikette kullanmak için esans tedarikçisinden alınan güncel döküm.',
        ],
      },
      {
        h: '3. Etil alkol mevzuat ve izlenebilirlik evrakları',
        items: [
          'Alkol Transfer Belgesi: Girdi alkolün dağıtım yetkisine sahip yerlerden sevk edildiğini gösteren yasal belgeler.',
          'Bandrol ve denatürasyon kayıtları: Alkol ambalajlarının bandrol kayıtları ve kozmetik kullanımına uygun denatürasyon işleminden geçtiğini teyit eden belgeler.',
        ],
      },
      {
        h: '4. Üretim, parti kontrol ve kalite belgeleri',
        items: [
          'Analiz Sertifikaları (CoA): Üretilen her parti için görünüm, koku, renk, yoğunluk gibi kriterlerin kontrol edildiğini gösteren parti bazlı sertifika.',
          'İmalat yöntemi ve proses dökümanları: Karışım oranları, maserasyon süresi, filtreleme ve dolum adımlarını tanımlayan standart üretim akış kayıtları.',
        ],
      },
      {
        h: '5. ÜBD ve ruhsatlandırma için test dosyaları',
        items: [
          'Stabilite ve ambalaj uyumluluk test raporları: Raf ömrü, açıldıktan sonra kullanım süresi (PAO) ile şişe, conta ve pompa uyumunu gösteren sızdırmazlık raporları.',
          'ISO 29621 mikrobiyolojik muafiyet dosyası: Alkol oranı %20 ve üzeri parfümlerde challenge ve mikrobiyoloji testlerinden muafiyet için formüle, ambalaja ve GMP koşullarına dayalı yazılı bilimsel risk gerekçelendirmesi.',
          'CPSR ve ÜBD hazırlık verileri: Yetkin güvenlik değerlendiricisine teslim edilecek, CPSR (Bölüm A ve B) ve Ürün Bilgi Dosyası (ÜBD/PIF) için üreticiden alınacak teknik imalat verileri.',
        ],
      },
    ],
  },
  {
    q: 'Sorumlu teknik eleman kim olabilir?',
    intro: 'Kozmetik Ürünler Yönetmeliği\'nin 7. maddesi uyarınca istihdamı zorunlu olan Sorumlu Teknik Eleman (Mesul Müdür), yalnızca mevzuatta sayılan yedi lisans unvanından birine sahip kişiler arasından seçilebilir: eczacı, kimyager, kimya mühendisi, biyokimyager, biyolog, mikrobiyolog ve biyomedikal mühendisi. Tıp doktorları bu listede yer almaz.',
    bolumler: [
      {
        h: 'Görevlendirme ve çalışma koşulları',
        items: [
          'Bizzat üstlenme: Şirket sahibi veya Sorumlu Kişi bu yedi unvandan birine sahipse görevi harici birini istihdam etmeden kendisi üstlenebilir.',
          'Firma sayısı sınırı: Güncel TİTCK Sorumlu Teknik Eleman Kılavuzu uyarınca bir teknik eleman en fazla 30 firmayla çalışabilir.',
          'İstihdam süresi: Düzenli günlük üretim yapan üreticiler teknik elemanı tam zamanlı; her gün üretim yapmayanlar üretim yapılan gün sayısı kadar; ithalatçı firmalar ayda en az bir tam gün SGK bildirimiyle çalıştırmak zorundadır.',
          'Fiili denetim sorumluluğu: Görev yalnızca evrak imzalamak değildir. Fason üretim dâhil üretim tesisini ve süreçlerini GMP (ISO 22716) ilkelerine uygunluk açısından yerinde veya kayıtlar üzerinden denetlemek, etiketleri, ÜTS bildirimlerini ve ÜBD\'yi incelemek ve mevzuat güncellemelerini takip etmek gerekir.',
          'Fesih ve yenileme: Görevden ayrılma ÜTS üzerinden yürür; tek taraflı fesih 14 gün sonra kendiliğinden tamamlanır. Fesih başladıktan sonra Sorumlu Kişi 15 gün içinde yeni teknik eleman atamazsa firma faaliyet yürütemez.',
        ],
      },
    ],
  },
  {
    q: 'ÜTS bildirim süreci nasıl işler?',
    intro: 'Türkiye\'de kozmetik ürünler Sağlık Bakanlığı veya TİTCK tarafından önceden onaylanıp ruhsatlandırılmaz; piyasaya arz öncesi bir bildirim ve sorumluluk rejimi uygulanır. Bu nedenle kutuda, etikette veya tanıtımlarda "Sağlık Bakanlığı Onaylı", "TİTCK Onaylı" ya da "ÜTS Bildirimlidir" gibi ifadeler kullanılamaz. Süreç üç ana aşamadan oluşur.',
    bolumler: [
      {
        h: '1. Aşama: ÜTS firma kaydı ve EBS başvurusu',
        items: [
          'Şirket yetkilisi e-imzası ile ÜTS başvuru ekranına girer. Ticaret sicilinde (şahıs şirketlerinde Esnaf Odası kaydında) faaliyet alanları arasında "kozmetik" ibaresi bulunmalıdır.',
          'MERSİS kaydı olan şirketler MERSİS\'i, şahıs işletmeleri gerekirse VEDOP\'u seçer; imza yetkilileri MERNİS üzerinden çekilip e-imza ile onaylanır.',
          'TİTCK Elektronik Başvuru Sistemi (EBS) firma kaydı tamamlanır. Başvuru ücreti havale/EFT ile değil, başvuru referans numarasıyla kurumun belirlediği tahsilat kanalından yatırılır. Ücret tutarı yıllık tarifeye göre değişir; güncel tutar için resmi tarife kontrol edilmelidir.',
        ],
      },
      {
        h: '2. Aşama: Sorumlu Teknik Eleman ataması',
        items: [
          'Her marka bir Sorumlu Teknik Eleman istihdam etmek zorundadır (yetkili unvanlar için yukarıdaki soruya bakın).',
          'Teknik elemanın diploması, SGK işe giriş bildirgesi ve güncel sözleşmesi sisteme yüklenir; teknik eleman kendi e-imzası ile onay verir.',
          'Sorumlu Teknik Eleman en fazla 30 firmayla çalışabilir; etiketleri, ÜTS bildirimlerini, üretim yeri kayıtlarını ve ÜBD\'yi tek tek incelemekle yükümlüdür.',
        ],
      },
      {
        h: '3. Aşama: ÜTS ürün bildirimi',
        items: [
          'Formülasyon girişi: Tam INCI formülasyonu, CAS ve EC numaraları girilir; Ulusal Zehir Danışma Merkezi (UZEM) için bileşen oran aralıkları tanımlanır (tek bildirim oturumunda en fazla 5 formülasyon).',
          'Barkod ve kategori: Ürünün hacmi ve koku varyantına ait GS1 Türkiye onaylı benzersiz GTIN barkodu tanımlanır ve kategori seçilir. Ürün kayıt ücreti tarifeye göre barkod başınadır.',
          'Etiket ve ambalaj görselleri: Nihai kutu ve şişe etiketinin yüksek çözünürlüklü, okunaklı orijinal ve Türkçe görselleri yüklenir.',
          'Teknik beyanlar: Numune/tester olup olmadığı, CMR veya AHA maddeleri içerip içermediği ve formülün pH değeri beyan edilir. Nanomateryal içeren ürünlerde (boyar madde, koruyucu ve UV filtreleri hariç) piyasaya arzdan 6 ay önce bildirim zorunludur.',
        ],
      },
      {
        h: 'Bildirimden önce hazır olması gerekenler',
        items: [
          'Laboratuvar testleri: Sıcaklık/ışık stabilitesi ve şişe-valf sızdırmazlık (ambalaj uyumluluk) testleri tamamlanmış olmalıdır. Alkol oranı %20 ve üzeri parfümlerde mikrobiyoloji ve koruyucu etkinlik testinden muafiyet için TS EN ISO 29621 yazılı risk gerekçelendirme dosyası hazır edilmelidir.',
          'CPSR ve ÜBD (PIF): Yetkin bir güvenlik değerlendiricisi tarafından onaylanmış CPSR (Bölüm A ve B) ve tam Ürün Bilgi Dosyası arşive alınmalıdır.',
          'Etiket uyumluluğu: Bileşen listesi 82 parfüm alerjeni kuralına (%0,001 / 10 ppm eşiği) ve Yönetmeliğin 22. maddesindeki Türkçe zorunlu bilgilere uymalıdır.',
        ],
      },
      {
        h: 'En sık karşılaşılan hatalar',
        items: [
          'GS1 dışı geçici barkod kullanmak veya sisteme girilmiş barkodu sonradan değiştirmeye çalışmak.',
          'Şirket ana sözleşmesinde "kozmetik" ibaresinin bulunmaması ya da MERSİS kaydı olan işletmenin VEDOP seçmesi.',
          'Adres veya unvan değişikliğini doğrudan ÜTS ekranında yapmaya çalışmak: Bu değişiklikler önce ticaret sicilinde tescil edilmeli, ardından ÜTS\'deki "Dış Sistem İşlemleri" menüsünden aktarılmalıdır.',
        ],
      },
    ],
  },
  {
    q: 'Alerjen kuralı etiket tasarımını nasıl etkiler?',
    intro: 'Parfüm alerjen kuralı, kutu ve etiket tasarımını doğrudan etkileyen en kritik teknik ve görsel zorunluluklardan biridir. AB\'nin (EU) 2023/1545 düzenlemesi ve TİTCK\'nın ilgili kılavuzu doğrultusunda etiketlenmesi zorunlu alerjen sayısı 24/26\'dan 82\'ye çıkarılmıştır.',
    bolumler: [
      {
        h: 'Tasarıma etkileri',
        items: [
          'Bileşen (INCI) listesi uzar: Formüldeki doğal uçucu yağlar, esans bileşenleri veya safsızlıklardan gelen çok sayıda madde eşiği aşabilir; bu, kutudaki İçindekiler alanını ciddi biçimde büyütür.',
          'Okunabilirlik şartı: Kozmetik Yönetmeliği\'nin 22. maddesi gereği zorunlu bilgiler silinmez, kolay okunur ve görünür olmalıdır. Listeyi sığdırmak için puntoyu aşırı küçültmek denetimde ihlal sayılabilir.',
          '%0,001 (10 ppm) eşiği: Durulanmayan ürünlerde bitmiş üründe bu eşiği aşan her alerjen "Parfum" ibaresinin yanında tek tek beyan edilmelidir.',
          'Seyreltme oranı: Eşik saf esansa değil, alkolle seyreltilmiş bitmiş ürüne uygulanır. Örneğin %20 esans içeren bir EDP\'de hesap %0,001 / 0,20 = %0,005\'tir; yani saf esansta %0,005\'ten fazla bulunan tüm alerjenler etikete eklenmelidir.',
          'İsimlendirme: Alerjenler Türkçe adlarıyla değil, uluslararası INCI adlarıyla yazılır (ör. Linalool, Limonene); benzer yapıdaki bileşenler kılavuzdaki ortak grup adıyla yazılabilir (ör. Pinene).',
          'Ambalaja sığmama: Bilgiler ambalaja sığmıyorsa ürünle birlikte verilen kartela, etiket veya prospektüste sunulur ve ambalaja Yönetmelik Ek VII\'deki "el ve kitap" sembolü basılır.',
        ],
      },
      {
        h: 'Baskı zamanlaması ve geçiş takvimi',
        items: [
          'CPSR onayı olmadan baskı yapılmaz: Koku formülü kesinleşip yetkin güvenlik değerlendiricisi CPSR\'ı onaylamadan tasarımlar matbaaya gönderilmemelidir. Hesaplanan kesin alerjen listesi tasarım dosyasına birebir yansıtılmalıdır.',
          'Kritik tarihler: 31 Temmuz 2026\'dan itibaren piyasaya arz edilen yeni ürünlerin etiketlerinde 82 alerjen kuralına tam uyum aranır. Bu tarihten önce piyasaya sunulmuş stoklar en geç 31 Temmuz 2028\'e kadar satılabilir.',
        ],
      },
      {
        h: 'Etiketteki iddia sınırları',
        items: [
          'Alerjenler listelense bile "alerjik madde içermez" gibi tüketiciye yanıltıcı garanti veren veya alerji riskini yok sayan iddialar kutu ve şişe tasarımında kullanılamaz.',
        ],
      },
    ],
  },
  {
    q: 'ETBİS kaydı ve e-ticaret zorunlulukları nelerdir?',
    intro: 'Kendi parfüm markanızın ürünlerini internetten satarken uymanız gereken yasal ve dijital zorunluluklar satış kanalınıza ve tüketici hukukuna göre belirlenir.',
    bolumler: [
      {
        h: '1. ETBİS (Elektronik Ticaret Bilgi Sistemi) kaydı',
        items: [
          'Kimler için zorunlu: Yalnızca yurt içi pazaryerlerinde (Trendyol, Hepsiburada vb.) mağaza açarak satış yapıyorsanız ETBİS kaydı aranmaz. Kendi web siteniz veya mobil uygulamanız üzerinden doğrudan satış yapacaksanız, faaliyete başlamadan önce e-Devlet üzerinden Ticaret Bakanlığı ETBİS\'e kaydolmanız gerekir.',
          'Kayıt ve güncelleme: Kayıt ücretsizdir (zorunlu KEP adresi maliyeti hariç). Alan adı, anlaşmalı kargo firması, ödeme kuruluşu veya şirket adresi değişiklikleri en geç 30 gün içinde güncellenmelidir.',
          'Yaptırım: Bildirim ve güncelleme yükümlülüğüne uyulmaması halinde idari para cezası uygulanır, tekrarında ceza iki katı olur. Güncel ceza tutarları her yıl yeniden belirlenir.',
        ],
      },
      {
        h: '2. Web sitesinde bulunması zorunlu bilgiler',
        items: [
          'Şirket tanıtıcı bilgileri: Ana sayfada veya altbilgide ticaret unvanı, MERSİS (veya vergi kimlik) numarası, açık tebligat adresi, telefon ve e-posta yer almalıdır.',
          'Güvenlik ve ödeme: Tüm trafik SSL ile şifrelenmeli; kart tahsilatlarında 3D Secure ve e-Arşiv fatura entegrasyonu hazır olmalıdır.',
          'Alan adı ve barkod: .tr uzantılı alan adı BTK bünyesindeki TRABİS üzerinden tescil edilmeli; ürünlerin e-ticarette taranabilmesi için GS1 Türkiye onaylı benzersiz GTIN barkodları tanımlanmalıdır.',
        ],
      },
      {
        h: '3. Ön bilgilendirme, mesafeli satış ve iade şartları',
        items: [
          'Onay kutusu kuralı: Ödemeden hemen önce Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi onaylatılmalı; "Okudum, onaylıyorum" kutusu önceden işaretli olamaz.',
          'Kalıcı veri saklayıcısı: Sipariş tamamlandığında sözleşme ve sipariş özeti tüketiciye e-posta ile iletilmelidir.',
          '14 gün cayma hakkı: Tüketici teslimden itibaren 14 gün içinde gerekçe göstermeden cayabilir; satıcı bildirimden sonra 14 gün içinde tahsil edilen bedeli iade eder.',
          'İade kargo masrafı: 1 Ocak 2026 itibarıyla, ön bilgilendirmede belirtilen anlaşmalı kargo firmasıyla yapılan iadelerde kargo masrafı tüketiciye yansıtılamaz.',
        ],
      },
      {
        h: '4. KVKK, çerez politikası ve İYS',
        items: [
          'Üyelik ve sipariş sayfalarında KVKK Aydınlatma Metni bağımsız olarak sunulmalı; pazarlama ve analitik çerezler için çerez yönetim paneli bulunmalı ve açık rıza alınmalıdır.',
          'Promosyon, kampanya veya duyuru amaçlı ticari SMS ve e-posta için önceden izin alınmalı ve onaylar İleti Yönetim Sistemi\'ne (İYS) işlenmelidir.',
        ],
      },
      {
        h: '5. Sitedeki ürün tanıtımı ve iddia yasakları',
        items: [
          'Ürün sayfalarında, açıklamalarda veya bannerlarda "Sağlık Bakanlığı Onaylı", "TİTCK Onaylı" veya "ÜTS Bildirimlidir" gibi resmi onay ima eden ifadeler kullanılamaz.',
          'Yüksek alkollü parfüm sınıfında koruyucuya ihtiyaç olmasa bile sitede "koruyucu içermez" iddiasına yer verilemez; "alerjik madde içermez" gibi mutlak beyanlar da yasaktır.',
        ],
      },
    ],
  },
]
