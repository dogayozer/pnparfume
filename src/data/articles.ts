export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  content: string;
  date: string;
  readTime: string;
}

export const articles: Article[] = [
  {
    slug: 'imza-kokunuzu-nasil-secersiniz',
    title: 'İmza Kokunuzu Nasıl Seçersiniz? (Nöropazarlama Yaklaşımı)',
    excerpt: 'Parfüm seçimi sadece güzel kokmakla ilgili değildir; bilinçaltına gönderilen güçlü bir mesajdır. Kendi imza kokunuzu bulmanın bilimsel sırlarını keşfedin.',
    coverImage: '/blog-signature.jpg',
    date: '12 Ağustos 2026',
    readTime: '4 dk okuma',
    content: `
## Nöropazarlama ve Koku Bağlantısı
İnsan beyni kokuyu, doğrudan duyguları ve hafızayı yöneten limbik sistemde işler. Görme veya duyma duyularından farklı olarak koku, filtrelerden geçmeden bilinçaltımıza ulaşır. Bu yüzden bir parfüm, etrafınızdaki insanların sizin hakkınızdaki düşüncelerini saniyeler içinde değiştirebilir.

### Karakterinize Uygun Notaları Seçmek
**1. Lider ve Otoriter Bir Profil Çizmek İstiyorsanız:**
Odunsu notalar (Sedir, Vetiver, Sandal Ağacı) ve hafif deri dokunuşları, evrimsel olarak güvenilirlik ve sağlamlık hissi verir. İş toplantılarında veya resmi davetlerde bu notalara yönelmelisiniz.

**2. Dinamik ve Enerjik Bir İlk İzlenim:**
Turunçgiller (Bergamot, Limon, Greyfurt) beyni uyarır ve karşınızdaki kişiye enerjik, genç ve yenilikçi olduğunuz mesajını iletir. Sabahları veya spor sonrası için mükemmel bir tercihtir.

**3. Gizemli ve Çekici:**
Oryantal notalar (Vanilya, Kehribar, Baharatlar) sıcaklık ve gizem katar. Nöropazarlama araştırmalarına göre, hafif tatlı ve baharatlı kokular, karşı cinste merak uyandırır ve akılda kalıcılığı artırır. Gece dışarı çıkarken bu notaları tercih edin.

### İmza Koku Nedir?
İmza koku, bir odaya girdiğinizde veya odadan çıktığınızda insanların sizi hatırlamasını sağlayan koku profiline denir. Sadece tek bir parfüm kullanmak zorunda değilsiniz, ancak parfümlerinizin *ortak bir alt notası* olması (örneğin hep misk veya hep paçuli barındırması) beynin sizi tekil bir koku hafızasıyla eşleştirmesini sağlar.
    `
  },
  {
    slug: 'mekanlara-gore-parfum-kullanim-rehberi',
    title: 'Mekanlara Göre Parfüm Kullanım Rehberi',
    excerpt: 'Ofiste, ilk buluşmada veya gece kulübünde... Hangi ortamda hangi koku ailesini tercih etmelisiniz? İşte ortam psikolojisine göre parfüm seçimi.',
    coverImage: '/blog-locations.jpg',
    date: '14 Ağustos 2026',
    readTime: '5 dk okuma',
    content: `
## Her Ortamın Ayrı Bir Dili Vardır
Kıyafetinizi gideceğiniz yere göre nasıl seçiyorsanız, parfümünüzü de öyle seçmelisiniz. Yanlış ortamda yanlış parfüm kullanımı, "bağıran renklerde bir kıyafetle cenazeye gitmek" gibidir.

### 1. Ofis ve İş Ortamı
Çalışma ortamında kalabalık bir alanı paylaşıyorsunuz. Ağır oryantal, aşırı tatlı veya baskın çiçeksi kokular çalışma arkadaşlarınızı rahatsız edebilir.
- **Tavsiye Edilen:** Ferah, temiz ve minimal kokular. (Akuatik notalar, yeşil çay, hafif narenciye veya temiz odunsu notalar).
- **Verdiği Mesaj:** "Profesyonel, özenli ve saygılıyım."

### 2. İlk Buluşma (Romantik)
İlk buluşmada amaç karşı tarafı boğmadan, yaklaşmak istemesini sağlamaktır. Çok ağır bir koku (Silajı çok yüksek bir parfüm) aranıza görünmez bir duvar örebilir.
- **Tavsiye Edilen:** Tene yakın duran, sıcak ve davetkar kokular. (Hafif vanilya, zarif beyaz çiçekler, yumuşak misk).
- **Verdiği Mesaj:** "Sıcakkanlı, güvenilir ve etkileyiciyim."

### 3. Gece Kulübü / Parti
Burada rekabet yüksektir. Diğer parfümlerin, sigara dumanının ve yüksek enerjinin arasında fark edilmeniz gerekir.
- **Tavsiye Edilen:** Silajı yüksek, tatlı, baharatlı veya yoğun oryantal kokular. (Ud, yoğun amber, tonka fasulyesi, yoğun deri).
- **Verdiği Mesaj:** "Özgüvenli, iddialı ve buradayım!"

### 4. Spor Salonu
Spor yaparken vücut ısınız artar ve parfüm normalden çok daha hızlı buharlaşır. 
- **Tavsiye Edilen:** Sadece çok hafif deodorantlar veya narenciye bazlı, çok uçucu ve fresh kokular. Asla ağır parfüm sıkmayın!
    `
  },
  {
    slug: 'koku-piramidi-nedir',
    title: 'Koku Piramidi Nedir? Üst, Kalp ve Dip Notaların Sırrı',
    excerpt: 'Bir parfümü sıktığınız andaki kokusuyla, saatler sonraki kokusu neden aynı değildir? Parfüm tasarımının temeli olan Koku Piramidini inceliyoruz.',
    coverImage: '/blog-pyramid.jpg',
    date: '10 Ağustos 2026',
    readTime: '3 dk okuma',
    content: `
## Parfüm Yaşayan Bir Kimyadır
Parfüm sıktığınızda zamanla değişir, gelişir ve teninizde bir yolculuğa çıkar. Bunun sebebi parfümlerin farklı uçuculuk seviyelerine sahip aromaların birleşiminden oluşmasıdır. Buna koku dünyasında **Koku Piramidi** denir.

### 1. Üst (Tepe) Notalar (0 - 15 Dakika)
Parfümü sıktığınız an burnunuza gelen ilk kokudur. Molekülleri en hafif ve en hızlı uçan notalardır.
- **Görevi:** İlk izlenimi yaratmak ve parfümü satmak.
- **Karakteri:** Genellikle narenciyeler (limon, bergamot), meyveler ve hafif yeşil notalar bu gruptadır. Çok canlıdır ama çabuk kaybolur.

### 2. Kalp (Orta) Notalar (15 Dakika - 4 Saat)
Üst notalar uçtuktan sonra ortaya çıkan, parfümün asıl "karakterini" belirleyen bölümdür. Parfümün imzasıdır.
- **Görevi:** Parfümün ana temasını oluşturmak ve alt notalara geçişi yumuşatmak.
- **Karakteri:** Çiçekler (gül, yasemin, lavanta), baharatlar (tarçın, kakule) ve bazı yeşil notalar bu katta yer alır.

### 3. Dip Notalar (4 Saat - 24+ Saat)
Parfümün kalıcılığını sağlayan, en ağır ve teninizde en uzun süre kalan moleküllerdir. Genellikle parfümü sıktıktan saatler sonra kıyafetinizde kalan o hafif ve sıcak kokudur.
- **Görevi:** Parfümün kalıcılığını artırmak ve kokuyu cilde sabitlemek (Fiksatör).
- **Karakteri:** Odunsu notalar (sedir, sandal), amber, vanilya, misk ve deri notaları bu gruptadır.

*Parfüm denerken, üst notaların cazibesine hemen kapılmayın. Parfümün teninizde en az 30 dakika kalmasına izin verin ve kalp notalarının sizin ten kimyanızla nasıl uyum sağladığına bakın.*
    `
  },
  {
    slug: 'pahali-parfum-daha-mi-kalicidir',
    title: 'Pahalı Parfüm Her Zaman Daha Mı Kalıcıdır? (Kalıcılık Paradoksu)',
    excerpt: 'Tüketicilerdeki "fiyat arttıkça kalıcılık artar" inancı büyük ölçüde bir algı yanılmasıdır. Parfüm kimyasının ekonomik sırlarını çözüyoruz.',
    coverImage: '/blog-longevity.jpg',
    date: '15 Ağustos 2026',
    readTime: '4 dk okuma',
    content: `
## Kalıcılık Paradoksunun Ekonomi Politiği
Tüketiciler, yüksek perakende satış fiyatına sahip parfümlerin ciltte doğrusal olarak daha uzun süre kalmasını beklese de, koku endüstrisinde fiyatlandırma stratejileri ile fiziksel molekül uçuculuğu arasında doğrudan bir korelasyon bulunmamaktadır. 

**"Pahalı eşittir kalıcı" denklemi büyük ölçüde bir algı yanılmasıdır.** Bir parfümün raf fiyatını belirleyen dinamikler formülün termodinamik yapısıyla değil; marka konumlandırması, yaratıcı emeğin değer biçilmesi ve nadir bulunan botanik ekstraktların kullanılmasıyla ilgilidir.

## Lüks ve Uçuculuk
Örneğin, tamamen doğal ve binlerce dolar değerindeki saf bir narenciye (bergamot veya saf limon) yağı düşünelim. Bu yağların molekülleri fiziksel olarak çok hafiftir. Termodinamik kurallarına boyun eğmek zorundadırlar; vücut ısısı ve gaz difüzyonu ile sadece 2 saat içinde buharlaşıp yok olurlar.

Buna karşılık laboratuvar ortamında sentetik olarak üretilen devasa karbon zincirlerine sahip moleküller (Galaxolide, Ambroxan gibi sentetik miskler), doğal hammaddelere kıyasla inanılmaz derecede ucuzdurlar. Mililitresi kuruşlarla ifade edilen bu maddeler kumaşta veya ciltte haftalarca kalabilir.

**Özetle:** Kalıcılık parfümün fiyat etiketine veya markanın prestijine bağlı olan bir lüks göstergesi değil, formüle eklenen sentetik polimerlerin ve ağır moleküllerin kütlesel ağırlığına dayanan basit bir fizikokimya meselesidir.
    `
  },
  {
    slug: 'ten-uyumu-ve-sebum-etkilesimi',
    title: 'Ten Uyumu Dedikleri Şeyin Bilimsel Temeli: Sebum ve Cilt Lipitleri',
    excerpt: 'Aynı parfüm iki farklı kişide neden tamamen farklı kokar ve farklı sürelerde kalıcı olur? Cilt biyokimyası ve difüzyonun sırrı.',
    coverImage: '/blog-skin-chemistry.jpg',
    date: '16 Ağustos 2026',
    readTime: '5 dk okuma',
    content: `
## İnsan Cildi ve Buharlaşma Kinetiği
Parfüm moleküllerinin buharlaşma profili yalnızca molekülün kendi kütlesine bağlı statik bir değer değildir. Difüzyon hızını (kokunun etrafa yayılmasını ve tükenmesini) dikte eden en kritik faktör, parfümün temas ettiği insan cildinin kendine özgü biyokimyasal yapısıdır.

Bireyler arasında **"ten uyumu"** olarak adlandırılan popüler kavramın arkasındaki bilimsel gerçeklik; cildin hidrolipidik asit mantosu, yüzey sıcaklığı ve sebum (yağ) üretimine dayanmaktadır.

## Kuru Cilt vs. Yağlı Cilt
Koku formülasyonlarında yer alan aromatik moleküllerin ezici bir çoğunluğu lipofilik (yağda çözünmeyi seven) yapıdadır. Bu kimyasal afinite, moleküllerin cilt yüzeyinde ne kadar süre tutunacağını doğrudan belirler.

- **Kuru Cilt:** Kuru bir cilde parfüm sıkıldığında, koku molekülleri ciltte tutunabilecekleri yeterli yağ veya nem bariyeri (lipid film) bulamadıkları için hızla atmosfere buharlaşırlar.
- **Yağlı Cilt:** İyi nemlendirilmiş veya sebum üretimi yüksek bir cilt yapısında ise, koku molekülleri cilt yüzeyindeki karbon zincirli lipitlerle güçlü bağlar (van der Waals etkileşimleri) kurarlar. Yağlı cilt substratı, adeta **doğal bir fiksatif (sabitleyici)** gibi davranarak koku salınımının zamanla çok daha kademeli ve dengeli gerçekleşmesini sağlar.

Eğer cildiniz kuruysa, parfümünüzü sıkmadan önce kokusuz bir vücut losyonu kullanmak parfümünüzün ömrünü inanılmaz ölçüde uzatacaktır.
    `
  },
  {
    slug: 'parfum-yayilimini-silaji-artirmak',
    title: 'Parfümün Yayılımını (Silaj) Maksimuma Çıkarmak',
    excerpt: 'Neden parfümü nabız noktalarına sıkıyoruz? Çevresel faktörler, ısı transferi ve kokunun fark edilebilirliğini artıran sırlar.',
    coverImage: '/blog-sillage.jpg',
    date: '17 Ağustos 2026',
    readTime: '3 dk okuma',
    content: `
## Isı Transferi ve Hazırlık Kinetiği
Moleküllerin buhar basıncı, sistemin sıcaklığıyla eksponansiyel olarak artar. Tüketicilere parfümü boyun, bilek veya kulak arkası gibi **"nabız noktalarına" (pulse points)** uygulamalarının tavsiye edilmesinin temel nedeni budur. 

Vücudun bu bölgelerinde atardamarlar cilt yüzeyine çok yakındır ve yayılan vücut ısısı koku moleküllerine yüksek bir termal (kinetik) enerji transfer ederek çevreye yayılımını (sillage/silaj) anında maksimize eder.

## Termodinamiğin Bedeli
Ancak termodinamiğin bir bedeli vardır: Yüksek sıcaklık, parfümün çok daha geniş bir alana yayılmasını sağlasa da, buharlaşma hızını olağanüstü derecede artırdığı için **parfümün ömrünü (kalıcılığını) kısaltır** ve notaların hızla yorulmasına yol açar.

Bu hızlı tükenişin önüne geçmek için parfüm profesyonelleri şu yöntemleri uygular:
- **Oklüzif Ajanlar:** Cilt yüzeyinde nem buharlaşmasını önleyen ince bir film bariyeri oluşturmak (vazelin veya mineral yağ tabanlı kokusuz kremler sürmek).
- **Nemlendirici Ajanlar:** Gliserin, üre veya laktik asit (AHA) barındıran losyonlar sürerek, ciltte koku moleküllerinin hapsolabileceği kalın bir depo yaratmak.

Böylece, parfüm moleküllerinin kuru cildin mikroskobik çatlaklarından hızla kaçması engellenmiş, hem yüksek yayılım hem de uzun süreli kalıcılık elde edilmiş olur.
    `
  }
];
