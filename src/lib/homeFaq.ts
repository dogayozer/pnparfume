// Ana sayfa SSS (AEO): hem görünen bölümde hem FAQPage JSON-LD'de aynı metin kullanılır.
// Yalnızca sitede doğrulanmış bilgiler yazılır; fiyat/kargo/iade vaadi eklenmez.
export interface FaqItem {
  tr: { q: string; a: string }
  en: { q: string; a: string }
  ar: { q: string; a: string }
}

export const HOME_FAQ: FaqItem[] = [
  {
    tr: {
      q: 'PN Parfüm kimdir, parfümleri nerede üretiliyor?',
      a: "PN Parfüm (Pien Parfum), 2002'den beri İstanbul Silivri'deki merkez ofis ve laboratuvarında parfüm üreten 24 yıllık tecrübeli bir Türk parfüm üreticisidir. Laboratuvarımızda 400 farklı koku seçeneği bulunur.",
    },
    en: {
      q: 'Who is PN Parfüm and where are the perfumes made?',
      a: 'PN Parfüm (Pien Parfum) is a Turkish perfume manufacturer with 24 years of experience, producing since 2002 at its head office and laboratory in Silivri, Istanbul. Our laboratory offers 400 different fragrance options.',
    },
    ar: {
      q: 'من هي PN Parfüm وأين تُصنع العطور؟',
      a: 'PN Parfüm (Pien Parfum) شركة تركية لتصنيع العطور بخبرة 24 عامًا، تنتج منذ عام 2002 في مقرها ومختبرها في سيليفري بإسطنبول. يضم مختبرنا 400 خيار عطري مختلف.',
    },
  },
  {
    tr: {
      q: 'Hangi parfüm koleksiyonlarınız var?',
      a: "Sitede üç koleksiyon bulunur: PN (ana koleksiyon), Pien (275 koku) ve Pien Creative (25 özel koku). Her koleksiyonda cinsiyet, mevsim ve koku ailesine göre filtreleme yapabilirsiniz.",
    },
    en: {
      q: 'Which perfume collections do you offer?',
      a: 'There are three collections: PN (main collection), Pien (275 fragrances) and Pien Creative (25 special fragrances). In each collection you can filter by gender, season and fragrance family.',
    },
    ar: {
      q: 'ما هي مجموعات العطور المتوفرة لديكم؟',
      a: 'تتوفر ثلاث مجموعات: PN (المجموعة الرئيسية) وPien (275 عطرًا) وPien Creative (25 عطرًا خاصًا). يمكنك التصفية في كل مجموعة حسب الجنس والموسم وعائلة العطر.',
    },
  },
  {
    tr: {
      q: 'Bana uygun parfümü nasıl seçebilirim?',
      a: "Koku testimizi çözebilir, yapay zeka koku danışmanımız Aura'ya ruh halinizi, ortamınızı ve sevdiğiniz notaları anlatabilir veya 5'li Keşif Kutusu ile beş kokuyu 10 ml şişelerde deneyebilirsiniz.",
    },
    en: {
      q: 'How can I choose the right perfume for me?',
      a: 'Take our fragrance quiz, tell Aura (our AI fragrance advisor) about your mood, setting and favourite notes, or try five fragrances in 10 ml bottles with the 5-piece Discovery Box.',
    },
    ar: {
      q: 'كيف أختار العطر المناسب لي؟',
      a: 'يمكنك إجراء اختبار العطر، أو إخبار Aura مستشارنا الذكي بمزاجك وأجوائك ونوتاتك المفضلة، أو تجربة خمسة عطور في زجاجات 10 مل مع صندوق الاكتشاف الخماسي.',
    },
  },
  {
    tr: {
      q: 'Kendi parfüm markamı kurabilir miyim?',
      a: 'Evet. Koku seçimi, marka tescili yönlendirmesi, logo, şişe, kutu ve etiket tasarımı ile fason (private label) parfüm üretiminde destek veriyoruz. Kapsam, adet ve koşullar projeye göre görüşülür; ayrıntılar Girişimcilere Özel sayfasındadır.',
    },
    en: {
      q: 'Can I launch my own perfume brand?',
      a: 'Yes. We support fragrance selection, trademark registration guidance, logo, bottle, box and label design, and private-label contract manufacturing. Scope, quantities and terms are agreed per project; details are on our entrepreneurs page.',
    },
    ar: {
      q: 'هل يمكنني إطلاق علامتي العطرية الخاصة؟',
      a: 'نعم. نقدم الدعم في اختيار العطر وتوجيه تسجيل العلامة وتصميم الشعار والزجاجة والعلبة والملصق والتصنيع الخاص. يتم الاتفاق على النطاق والكميات والشروط حسب المشروع.',
    },
  },
  {
    tr: {
      q: 'Toptan alım, bayilik veya distribütörlük mümkün mü?',
      a: "Evet. Bayilik ve distribütörlük için sitemizde ayrı başvuru formları vardır. Başvurular ön taleptir; fiyat, minimum adet ve koşullar değerlendirme sonrası görüşülür. Franchise veya mağaza açma desteği sunulmaz.",
    },
    en: {
      q: 'Are wholesale, dealership or distributorship available?',
      a: 'Yes. There are separate application forms for dealership and distributorship. Applications are preliminary requests; pricing, minimum quantities and terms are discussed after review. Franchise or store-opening support is not offered.',
    },
    ar: {
      q: 'هل البيع بالجملة أو الوكالة أو التوزيع متاح؟',
      a: 'نعم. توجد نماذج طلب منفصلة للوكالة والتوزيع. الطلبات أولية، وتتم مناقشة الأسعار والحد الأدنى للكمية والشروط بعد المراجعة. لا نقدم دعمًا للامتياز التجاري أو فتح المتاجر.',
    },
  },
]
