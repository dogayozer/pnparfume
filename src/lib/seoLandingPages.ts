// SEO anahtar kelime sayfaları — her biri kendi temiz URL'sinde (/erkek-parfum gibi,
// /katalog?gender=Erkek değil), benzersiz başlık/açıklama/giriş metniyle. Query-param'lı
// URL'ler arama motorları için düşük değerlidir ve "aynı sayfa" gibi algılanır; ayrı,
// anlamlı yollar Google'ın her aramayı doğru sayfaya eşlemesini sağlar.
//
// Yeni bir trend kelime eklemek için: bu diziye yeni bir obje ekleyin — kod tarafında
// başka hiçbir şey değiştirmenize gerek yok, /[keyword]/page.tsx ve sitemap.ts bu
// listeyi otomatik okur.

export type SeoFilters = {
  gender?: string
  family?: string
  occasion?: string
  season?: string
  persona?: string
  discountOnly?: boolean
  sortBy?: 'price_asc' | 'longevity_desc' | 'newest'
}

export type SeoLandingPage = {
  slug: string
  title: string
  h1: string
  metaDescription: string
  intro: string
  filters: SeoFilters
  // Sayfanın altında "tüm sonuçları filtreleyerek incele" linkinin gideceği /katalog
  // query-string karşılığı — kullanıcı burada bulduğu ürünleri interaktif filtrelerle
  // genişletebilsin diye.
  katalogQuery?: string
}

export const SEO_LANDING_PAGES: SeoLandingPage[] = [
  {
    slug: 'erkek-parfum',
    title: 'Erkek Parfüm Modelleri | Kalıcı Erkek Parfümleri | PN Parfüm',
    h1: 'Erkek Parfüm',
    metaDescription: 'Odunsu, baharatlı ve aromatik notalarla hazırlanmış erkek parfümü koleksiyonu. Yapay zeka destekli koku analiziyle sana en uygun erkek parfümünü keşfet.',
    intro: 'Ofiste, günlük hayatta veya gece davetinde fark yaratan erkek parfümü seçenekleri. Her biri üst-orta-dip nota piramidiyle tasarlanmış, kalıcılığı yüksek imza kokular.',
    filters: { gender: 'Erkek' },
    katalogQuery: 'gender=Erkek'
  },
  {
    slug: 'kadin-parfum',
    title: 'Kadın Parfüm Modelleri | Kalıcı Kadın Parfümleri | PN Parfüm',
    h1: 'Kadın Parfüm',
    metaDescription: 'Çiçeksi, tatlı ve oryantal notalarla hazırlanmış kadın parfümü koleksiyonu. Karakterini yansıtan, kalıcılığı yüksek imza koku seçenekleri.',
    intro: 'Zarafeti ve karakteri aynı anda taşıyan kadın parfümü koleksiyonumuz; çiçeksi ferahlıktan tatlı gurme notalara kadar geniş bir yelpazede, teninize özel öneriyle.',
    filters: { gender: 'Kadın' },
    katalogQuery: 'gender=Kadın'
  },
  {
    slug: 'unisex-parfum',
    title: 'Unisex Parfüm Modelleri | Herkese Uygun Kokular | PN Parfüm',
    h1: 'Unisex Parfüm',
    metaDescription: 'Cinsiyet fark etmeksizin herkesin taşıyabileceği unisex parfüm koleksiyonu. Odunsu ve amber ağırlıklı, dengeli koku profilleri.',
    intro: 'Kalıpları reddeden, sadece karaktere göre şekillenen unisex parfüm seçenekleri. Kimin taktığından değil, nasıl hissettirdiğinden ibaret bir koleksiyon.',
    filters: { gender: 'Unisex' },
    katalogQuery: 'gender=Unisex'
  },
  {
    slug: 'en-iyi-erkek-parfumleri',
    title: 'En İyi Erkek Parfümleri 2026 | Çok Satanlar | PN Parfüm',
    h1: 'En İyi Erkek Parfümleri',
    metaDescription: 'Müşterilerimizin en çok tercih ettiği erkek parfümleri. Kalıcılığı ve yayılımı en yüksek, en iyi erkek parfümü seçenekleri tek listede.',
    intro: 'Kalıcılık ve yayılım (sillaj) skoru en yüksek erkek parfümlerini bir araya getirdik — "en iyi erkek parfümü hangisi" sorusuna kendi kütüphanemizden verdiğimiz cevap.',
    filters: { gender: 'Erkek', sortBy: 'longevity_desc' },
    katalogQuery: 'gender=Erkek&sort=best_sellers'
  },
  {
    slug: 'nis-parfum',
    title: 'Niş Parfüm Koleksiyonu | Sıra Dışı Kokular | PN Parfüm',
    h1: 'Niş Parfüm',
    metaDescription: 'Kitlesel değil, karakterli kokular arayanlar için niş parfüm koleksiyonu. Yoğun konsantrasyonlu, ayırt edici koku profilleri.',
    intro: 'Herkeste aynı kokuyu duymaktan sıkıldıysanız buradasınız. Niş parfüm anlayışımız; yüksek esans oranı, sıra dışı nota kombinasyonları ve güçlü bir kimlik üzerine kurulu.',
    filters: {},
    katalogQuery: ''
  },
  {
    slug: 'imza-parfum',
    title: 'İmza Parfüm | Kendine Özel Koku Yarat | PN Parfüm',
    h1: 'İmza Parfümünü Bul',
    metaDescription: 'Sadece sana ait bir imza koku arıyorsan doğru yerdesin. Notalarını ayarla, iki kokuyu birleştir, kendi imza parfümünü tasarla.',
    intro: 'İmza koku, bir markanın değil senin taşıdığın kokudur. Mevcut esans kütüphanemizden iki parfümü harmanlayarak veya bir ürünün notalarını kendine göre ayarlayarak kendi imza parfümünü yaratabilirsin.',
    filters: {},
    katalogQuery: ''
  },
  {
    slug: 'pien-parfum',
    title: 'Pien Parfüm (PN Parfüm) | Resmi Koleksiyon Sayfası',
    h1: 'Pien Parfüm — PN Parfüm Koleksiyonu',
    metaDescription: 'Pien Parfüm, PN Parfüm markasının resmi üretici hesabıdır. Tüm koleksiyonu, kalıcı ve niş kokuları buradan inceleyebilirsiniz.',
    intro: 'Pazaryerlerinde "Pien Parfüm" adıyla da karşınıza çıkabiliriz — PN Parfüm ile aynı üreticiyiz. Tüm koleksiyonumuzu ve güncel kampanyalarımızı en doğru fiyatla burada bulabilirsiniz.',
    filters: {},
    katalogQuery: ''
  },
  {
    slug: 'indirimli-parfum',
    title: 'İndirimli Parfüm Fırsatları | Kampanyalı Kokular | PN Parfüm',
    h1: 'İndirimli Parfüm',
    metaDescription: 'Piyasa fiyatının altında, kampanyalı ve indirimli parfüm seçenekleri. Stoklarla sınırlı fırsatları kaçırma.',
    intro: 'Bütçe dostu ama kaliteden ödün vermeyen bir koleksiyon istiyorsan, indirimli parfüm seçeneklerimize göz at — piyasa fiyatının altında sunduğumuz kampanyalı ürünler burada.',
    filters: { discountOnly: true },
    katalogQuery: 'sort=price_asc'
  },
  {
    slug: 'ogrenci-parfum',
    title: 'Öğrenci Bütçesine Uygun Parfüm | Ekonomik Kokular | PN Parfüm',
    h1: 'Öğrenci Parfümleri',
    metaDescription: 'Öğrenci bütçesine uygun, uygun fiyatlı ama kalıcılığından ödün vermeyen parfüm seçenekleri. En ekonomik kokularımız tek listede.',
    intro: 'Cebini yakmadan iyi koksun istedik. En uygun fiyatlı ürünlerimizi bir araya getirdik — öğrenci bütçesine uygun, ama kalıcılığı ve kalitesi tam bir parfüm deneyimi.',
    filters: { sortBy: 'price_asc' },
    katalogQuery: 'sort=price_asc'
  },
  {
    slug: 'gece-parfumu',
    title: 'Gece Parfümü | Davet ve Özel Gün Kokuları | PN Parfüm',
    h1: 'Gece Parfümü',
    metaDescription: 'Davetlerde ve gece dışarı çıkışlarında iz bırakan, yoğun ve etkileyici gece parfümü koleksiyonu.',
    intro: 'Gece, kokunun en çok konuştuğu zamandır. Oryantal ve baharatlı ağırlıklı, yayılımı yüksek gece parfümü seçeneklerimizle özel günlerde fark yarat.',
    filters: { occasion: 'Davet / Gece Etkinliği' },
    katalogQuery: 'occasion=Davet%20%2F%20Gece%20Etkinliği'
  },
  {
    slug: 'date-parfumu',
    title: 'Date Parfümü | Çekici ve İddialı Kokular | PN Parfüm',
    h1: 'Date Parfümü',
    metaDescription: 'İlk buluşmadan özel akşam yemeklerine, çekiciliğini öne çıkaran iddialı ve romantik date parfümü seçenekleri.',
    intro: 'Bir kokunun en çok işe yaradığı an, karşındakinin seni hatırlamasını istediğin andır. İddialı ve romantik karakterli date parfümü seçeneklerimiz tam bunun için tasarlandı.',
    filters: { persona: 'İddialı / Romantik' },
    katalogQuery: 'persona=İddialı%20%2F%20Romantik'
  },
  {
    slug: 'spor-parfum',
    title: 'Spor Parfüm | Ferah ve Dinamik Kokular | PN Parfüm',
    h1: 'Spor Parfüm',
    metaDescription: 'Aktif yaşam tarzına uygun, ferah ve enerjik spor parfüm koleksiyonu. Gün boyu tazelik hissi veren hafif kokular.',
    intro: 'Spor salonundan sokağa, aktif bir güne eşlik edecek ferah ve dinamik kokular. Ağır değil, enerjik ve taze bir koku profili arayanlar için spor parfüm seçeneklerimiz.',
    filters: { occasion: 'Spor / Dinamik' },
    katalogQuery: 'occasion=Spor%20%2F%20Dinamik'
  },
  {
    slug: 'gunluk-parfum',
    title: 'Günlük Kullanım Parfümü | Her Güne Uygun Kokular | PN Parfüm',
    h1: 'Günlük Parfüm',
    metaDescription: 'Her gün rahatça kullanabileceğin, ne çok hafif ne çok ağır günlük parfüm koleksiyonu.',
    intro: 'Her gün taşıyabileceğin, yormayan ama unutulmayan kokular. Günlük kullanıma uygun, dengeli koku profiline sahip parfümlerimizle her gün kendinden emin hisset.',
    filters: { occasion: 'Günlük Kullanım' },
    katalogQuery: 'occasion=Günlük%20Kullanım'
  },
  {
    slug: 'ofis-parfumu',
    title: 'Ofis Parfümü | İş Yerine Uygun Hafif Kokular | PN Parfüm',
    h1: 'Ofis Parfümü',
    metaDescription: 'Kapalı ve paylaşımlı ortamlara uygun, ağır basmayan ofis parfümü seçenekleri. Profesyonel duruşunu tamamlayan hafif kokular.',
    intro: 'Ofiste koku, göze batmadan fark edilmelidir. Ağır basmayan, profesyonel duruşu destekleyen ofis parfümü seçeneklerimizle iş yerinde de imzanı bırak.',
    filters: { occasion: 'Toplantı / Ofis' },
    katalogQuery: 'occasion=Toplantı%20%2F%20Ofis'
  },
  {
    slug: 'yaz-parfumu',
    title: 'Yaz Parfümü | Ferah ve Narenciye Kokular | PN Parfüm',
    h1: 'Yaz Parfümü',
    metaDescription: 'Sıcak havalarda ağır basmayan, ferah ve narenciye ağırlıklı yaz parfümü koleksiyonu.',
    intro: 'Yazın sıcağında ağır bir koku taşımak istemezsin. Narenciye ve ferah notalarla hazırlanmış yaz parfümü seçeneklerimiz, sıcak günlerde bile hafif ve tazeleyici.',
    filters: { season: 'Yaz' },
    katalogQuery: 'season=Yaz'
  },
  {
    slug: 'kis-parfumu',
    title: 'Kış Parfümü | Yoğun ve Sıcak Kokular | PN Parfüm',
    h1: 'Kış Parfümü',
    metaDescription: 'Soğuk havalarda daha uzun süre kalıcı olan, yoğun ve sıcak tonlu kış parfümü koleksiyonu.',
    intro: 'Soğuk havada koku daha yavaş yayılır, bu yüzden kışlık parfümler daha yoğun formüle edilir. Amber ve baharatlı ağırlıklı kış parfümü seçeneklerimizle soğuk günlere sıcaklık kat.',
    filters: { season: 'Kış / Sonbahar' },
    katalogQuery: 'season=Kış%20%2F%20Sonbahar'
  },
  {
    slug: 'odunsu-parfum',
    title: 'Odunsu Parfüm | Sedir ve Vetiver Notaları | PN Parfüm',
    h1: 'Odunsu Parfüm',
    metaDescription: 'Sedir ağacı, vetiver ve paçuli notalarıyla hazırlanmış odunsu parfüm koleksiyonu. Karakterli ve sıcak koku profilleri.',
    intro: 'Odunsu koku ailesi, sıcaklığı ve karakteri bir arada taşır. Sedir, vetiver ve paçuli ağırlıklı odunsu parfüm seçeneklerimiz, güçlü ama yormayan bir imza bırakır.',
    filters: { family: 'Odunsu' },
    katalogQuery: 'family=Odunsu'
  },
  {
    slug: 'ciceksi-parfum',
    title: 'Çiçeksi Parfüm | Gül ve Yasemin Notaları | PN Parfüm',
    h1: 'Çiçeksi Parfüm',
    metaDescription: 'Gül, yasemin ve sardunya notalarıyla hazırlanmış çiçeksi parfüm koleksiyonu. Zarif ve feminen koku profilleri.',
    intro: 'Çiçeksi koku ailesi zarafetin klasik dilidir. Gül, yasemin ve beyaz çiçek notalarıyla hazırlanmış çiçeksi parfüm seçeneklerimiz, ince ve unutulmaz bir iz bırakır.',
    filters: { family: 'Çiçeksi' },
    katalogQuery: 'family=Çiçeksi'
  },
  {
    slug: 'tatli-parfum',
    title: 'Tatlı Parfüm | Gurme ve Vanilyalı Kokular | PN Parfüm',
    h1: 'Tatlı Parfüm',
    metaDescription: 'Vanilya, karamel ve tonka fasulyesi notalarıyla hazırlanmış tatlı (gurme) parfüm koleksiyonu.',
    intro: 'Gurme koku ailesi, tatlı ve davetkar bir karakter arayanlar için. Vanilya, karamel ve bal notalarıyla hazırlanmış tatlı parfüm seçeneklerimiz, sıcak ve akılda kalıcı.',
    filters: { family: 'Tatlı' },
    katalogQuery: 'family=Tatlı'
  },
  {
    slug: 'ferah-parfum',
    title: 'Ferah Parfüm | Narenciye ve Sitrus Notaları | PN Parfüm',
    h1: 'Ferah Parfüm',
    metaDescription: 'Limon, bergamot ve narenciye notalarıyla hazırlanmış ferah parfüm koleksiyonu. Hafif ve enerjik koku profilleri.',
    intro: 'Ferah koku ailesi, enerjiyi ve tazeliği temsil eder. Narenciye ağırlıklı ferah parfüm seçeneklerimiz her mevsim, her ana uyum sağlayan hafif bir imza sunar.',
    filters: { family: 'Ferah' },
    katalogQuery: 'family=Ferah'
  },
  {
    slug: 'kalici-parfum',
    title: 'En Kalıcı Parfümler | Uzun Süre Koku Yapan Parfümler | PN Parfüm',
    h1: 'En Kalıcı Parfümler',
    metaDescription: 'Kalıcılık skoru en yüksek parfümlerimiz. Gün boyu üzerinde kalan, sık sık tazelemeye gerek duymayacağın kalıcı parfüm seçenekleri.',
    intro: 'Kalıcılık skoruna göre sıraladığımız bu listede, tek sıkışta gün boyu yanında kalan en kalıcı parfümlerimizi bulacaksın.',
    filters: { sortBy: 'longevity_desc' },
    katalogQuery: ''
  },
  {
    slug: 'acik-parfum',
    title: 'Açık Parfüm | Şişe ve Esans Seçenekleriyle | PN Parfüm',
    h1: 'Açık Parfüm',
    metaDescription: 'Kendi şişeni ve konsantrasyonunu seçebildiğin açık parfüm anlayışı. Extrait parfüme yükseltme ve mix seçenekleriyle PN Parfüm.',
    intro: 'Açık parfüm, kalıptan çıkıp kendi tercihini yapabilmektir — şişe, kutu ve esans yoğunluğunu (EDP/Extrait) sen seçersin. PN Parfüm’de her ürün bu esneklikle geliyor.',
    filters: {},
    katalogQuery: ''
  }
]

export function getSeoLandingPage(slug: string): SeoLandingPage | undefined {
  return SEO_LANDING_PAGES.find(p => p.slug === slug)
}
