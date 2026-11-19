import Image from 'next/image'
import DistributorForm from './DistributorForm'

type Locale = 'tr' | 'en' | 'ar'

export const DISTRIBUTOR = {
  tr: {
    eyebrow: "2002'den beri üretimdeyiz",
    h: 'PN Parfüm ile Bölgenizde Distribütör Olun',
    lead: 'Ülkenizde veya şehrinizde PN Parfüm ürünlerini temsil edin. Bölgenizi, alt bayi ağınızı ve sektör deneyiminizi paylaşın; ekibimiz değerlendirip sizinle iletişime geçsin.',
    cta: 'Talep Formuna Git',
    heroAlt: 'PN Parfüm üretim tesisinde parfüm şişelerinin dolum hattı',
    stats: [['2002', "den beri üretimde"], ['24', 'yıllık tecrübe'], ['400', 'farklı koku seçeneği'], ['6', 'marka ve ürün serisi']],
    whyTitle: 'Neden PN Parfüm ile çalışmalı?',
    why: [
      ['Üreticiyle doğrudan çalışın', 'Silivri/İstanbul’daki merkez ofis ve laboratuvarımızda üretim yapan bir markayla çalışırsınız.'],
      ['Geniş ürün gamı', 'Günlük kullanımdan lüks koleksiyonlara kadar altı farklı marka ve seri, her bütçeye ve beklentiye hitap eder.'],
      ['Köklü tecrübe', '24 yıllık üretim tecrübesi ve var olan markalarımızla güvenli bir iş ortaklığı zemini.'],
      ['Görsel ve içerik desteği', 'Ürünlerinizi tanıtmanız için hazır görsel ve metin desteği için ekibimizle görüşebilirsiniz.'],
    ],
    processTitle: 'Başvuru süreci',
    steps: [
      ['Talebinizi gönderin', 'Formu ülke, şehir, alt bayi ağı ve deneyim bilgilerinizle doldurun.'],
      ['Ekibimiz değerlendirsin', 'Başvurunuz bölge ve iş modeli açısından incelenir.'],
      ['Sizinle iletişime geçelim', 'Uygun görülen başvurularda e-posta ile görüşme planlanır.'],
    ],
    processNote:
      'Başvuru bir ön taleptir; bölge ayrıcalığı veya sözleşme garantisi içermez. Koşullar değerlendirmeden sonra birlikte görüşülür.',
    meetAlt: 'İş ortaklığı toplantısında el sıkışma, parfüm kutuları ve dünya haritası',
    formTitle: 'Distribütörlük Talep Formu',
    formIntro: 'Ülke, şehir, alt bayi ağı ve sektör deneyiminizi paylaşın.',
    faqTitle: 'Sıkça Sorulan Sorular',
    faqs: [
      ['PN Parfüm distribütörü nasıl olunur?', 'Bu sayfadaki formu doldurarak ülkenizi, şehrinizi, alt bayi ağınızı ve sektör deneyiminizi paylaşmanız yeterli. Talebiniz ekibimizce değerlendirilir ve sizinle e-posta ile iletişime geçilir.'],
      ['Formda hangi bilgiler isteniyor?', 'Firma ve yetkili bilgileri, iletişim bilgileri, ülke ve şehir/bölge, alt bayi ağınızın olup olmadığı, bu sektörde daha önce deneyiminiz ve satış kanallarınız.'],
      ['Distribütörlük başvurusu bölge ayrıcalığı veya sözleşme garantisi verir mi?', 'Hayır. Başvuru bir ön taleptir. Bölgesel çalışma şekli, koşullar ve olası sözleşme ayrıntıları başvuru değerlendirildikten sonra birlikte görüşülür.'],
      ['PN Parfüm ne zamandan beri üretim yapıyor?', 'PN Parfüm (Pien Parfum) 2002 yılından beri parfüm üretimi yapıyor; 24 yıllık tecrübe ve kendi markalarımızla çalışıyoruz.'],
    ],
  },
  en: {
    eyebrow: 'Producing since 2002',
    h: 'Become a PN Parfüm Distributor in Your Region',
    lead: 'Represent PN Parfüm products in your country or city. Share your region, sub-dealer network and industry experience, and our team will review your request and get in touch.',
    cta: 'Go to the Request Form',
    heroAlt: 'Perfume bottle filling line at the PN Parfüm production facility',
    stats: [['2002', 'producing since'], ['24', 'years of experience'], ['400', 'fragrance options'], ['6', 'brands and product lines']],
    whyTitle: 'Why work with PN Parfüm?',
    why: [
      ['Work directly with the manufacturer', 'You work with a brand that produces at its own head office and laboratory in Silivri, İstanbul.'],
      ['A wide product range', 'Six brands and lines, from everyday wear to luxury collections, for every budget and expectation.'],
      ['Established experience', '24 years of production experience and our existing brands give you a solid base for a partnership.'],
      ['Visual and content support', 'Talk to our team about ready-made visuals and copy to help you promote the products.'],
    ],
    processTitle: 'How the application works',
    steps: [
      ['Send your request', 'Fill in the form with your country, city, sub-dealer network and experience.'],
      ['Our team reviews it', 'Your application is reviewed for region and business model.'],
      ['We get in touch', 'For suitable applications, a conversation is arranged by email.'],
    ],
    processNote:
      'The application is a preliminary request and does not include regional exclusivity or a contract guarantee. Terms are discussed together after the review.',
    meetAlt: 'A handshake at a partnership meeting with perfume boxes and a world map',
    formTitle: 'Distributor Request Form',
    formIntro: 'Share your country, city, sub-dealer network and industry experience.',
    faqTitle: 'Frequently Asked Questions',
    faqs: [
      ['How do I become a PN Parfüm distributor?', 'Fill in the form on this page with your country, city, sub-dealer network and industry experience. Our team reviews your request and contacts you by email.'],
      ['What information does the form ask for?', 'Company and contact details, country and city/region, whether you have a sub-dealer network, your previous experience in this industry and your sales channels.'],
      ['Does a distributor application give regional exclusivity or a contract guarantee?', 'No. The application is a preliminary request. The regional arrangement, terms and any contract details are discussed together once the application has been reviewed.'],
      ['How long has PN Parfüm been manufacturing perfume?', 'PN Parfüm (Pien Parfum) has been producing perfume since 2002, with 24 years of experience and its own brands.'],
    ],
  },
  ar: {
    eyebrow: 'ننتج منذ عام 2002',
    h: 'كن موزّع PN Parfüm في منطقتك',
    lead: 'مثّل منتجات PN Parfüm في بلدك أو مدينتك. شاركنا منطقتك وشبكة وكلائك الفرعيين وخبرتك في القطاع، وسيراجع فريقنا طلبك ويتواصل معك.',
    cta: 'انتقل إلى نموذج الطلب',
    heroAlt: 'خط تعبئة زجاجات العطور في مصنع PN Parfüm',
    stats: [['2002', 'ننتج منذ'], ['24', 'عامًا من الخبرة'], ['400', 'خيار عطري'], ['6', 'علامات وسلاسل منتجات']],
    whyTitle: 'لماذا تعمل مع PN Parfüm؟',
    why: [
      ['اعمل مباشرة مع المصنّع', 'تتعامل مع علامة تنتج في مقرها الرئيسي ومختبرها في سيليفري بإسطنبول.'],
      ['تشكيلة منتجات واسعة', 'ست علامات وسلاسل، من الاستخدام اليومي إلى المجموعات الفاخرة، تناسب كل ميزانية وتوقع.'],
      ['خبرة راسخة', 'خبرة إنتاج تمتد 24 عامًا وعلاماتنا القائمة تمنحك أساسًا متينًا للشراكة.'],
      ['دعم بصري ومحتوى', 'تحدث مع فريقنا حول الصور والنصوص الجاهزة التي تساعدك في الترويج للمنتجات.'],
    ],
    processTitle: 'مراحل تقديم الطلب',
    steps: [
      ['أرسل طلبك', 'املأ النموذج ببيانات بلدك ومدينتك وشبكة وكلائك الفرعيين وخبرتك.'],
      ['يراجعه فريقنا', 'تتم مراجعة طلبك من حيث المنطقة ونموذج العمل.'],
      ['نتواصل معك', 'في الطلبات المناسبة، يتم ترتيب محادثة عبر البريد الإلكتروني.'],
    ],
    processNote:
      'الطلب هو طلب أولي ولا يتضمن حصرية إقليمية أو ضمانًا تعاقديًا. تُناقش الشروط معًا بعد المراجعة.',
    meetAlt: 'مصافحة في اجتماع شراكة مع علب عطور وخريطة العالم',
    formTitle: 'نموذج طلب التوزيع',
    formIntro: 'شاركنا بلدك ومدينتك وشبكة وكلائك الفرعيين وخبرتك في القطاع.',
    faqTitle: 'الأسئلة الشائعة',
    faqs: [
      ['كيف أصبح موزّعًا لـ PN Parfüm؟', 'املأ النموذج في هذه الصفحة ببلدك ومدينتك وشبكة وكلائك الفرعيين وخبرتك في القطاع. يراجع فريقنا طلبك ويتواصل معك عبر البريد الإلكتروني.'],
      ['ما المعلومات المطلوبة في النموذج؟', 'بيانات الشركة والشخص المسؤول، والدولة والمدينة/المنطقة، وهل لديك شبكة وكلاء فرعيين، وخبرتك السابقة في هذا القطاع وقنوات البيع.'],
      ['هل يمنح طلب التوزيع حصرية إقليمية أو ضمانًا تعاقديًا؟', 'لا. الطلب هو طلب أولي. تُناقش آلية العمل في المنطقة والشروط وأي تفاصيل تعاقدية معًا بعد مراجعة الطلب.'],
      ['منذ متى تُنتج PN Parfüm العطور؟', 'تُنتج PN Parfüm (Pien Parfum) العطور منذ عام 2002، بخبرة 24 عامًا وعلامات خاصة بها.'],
    ],
  },
} as const

export function distributorJsonLd(locale: Locale, url: string) {
  const c = DISTRIBUTOR[locale]
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: locale,
      mainEntity: c.faqs.map(([q, a]) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: c.h,
      url,
      inLanguage: locale,
      about: { '@type': 'Service', serviceType: 'Perfume distribution partnership' },
      isPartOf: { '@type': 'WebSite', name: 'PN Parfüm', url: 'https://pnparfume.com' },
    },
  ]
}

export default function DistributorContent({ locale = 'tr' }: { locale?: Locale }) {
  const c = DISTRIBUTOR[locale]
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  const p = `dist-${locale}`
  const rtl = 'rtl:tracking-normal rtl:normal-case'

  return (
    <div className="space-y-16" lang={locale} dir={dir}>
      <section aria-labelledby={`${p}-hero`} className="relative overflow-hidden rounded-3xl">
        <div className="relative min-h-[480px] w-full sm:min-h-[400px]">
          <Image src="/kurumsal/dist-hero.jpg" alt={c.heroAlt} fill priority sizes="(min-width: 1024px) 900px, 100vw" className="object-cover" />
          <div
            className={`absolute inset-0 ${locale === 'ar' ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-black/80 via-black/55 to-black/10`}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/35 sm:hidden" aria-hidden="true" />
          <div className="relative flex min-h-[480px] flex-col justify-center gap-4 p-6 sm:min-h-[400px] sm:p-10 md:max-w-[70%]">
            <p className={`text-xs font-medium uppercase tracking-[0.25em] text-[#d9b98a] ${rtl}`}>{c.eyebrow}</p>
            <h2 id={`${p}-hero`} className="text-3xl font-light leading-tight text-white sm:text-4xl">{c.h}</h2>
            <p className="text-sm leading-relaxed text-white/85 sm:text-base">{c.lead}</p>
            <div>
              <a href={`#${p}-form`} className="inline-block rounded-full bg-[#d9b98a] px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-white">
                {c.cta}
              </a>
            </div>
          </div>
        </div>
      </section>

      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {c.stats.map(([n, l]) => (
          <div key={n + l} className="rounded-2xl border border-foreground/10 bg-background p-5 text-center">
            <dt className="font-serif text-3xl font-light text-accent-gold">{n}</dt>
            <dd className="mt-1 text-xs text-foreground/60">{l}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby={`${p}-why`} className="space-y-6">
        <h3 id={`${p}-why`} className="text-2xl font-light">{c.whyTitle}</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {c.why.map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-foreground/10 bg-background p-6">
              <h4 className="mb-2 font-medium text-foreground">{t}</h4>
              <p className="text-sm leading-relaxed text-foreground/65">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby={`${p}-process`} className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-foreground/10">
          <Image src="/kurumsal/dist-toplanti.jpg" alt={c.meetAlt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="space-y-6">
          <h3 id={`${p}-process`} className="text-2xl font-light">{c.processTitle}</h3>
          <ol className="space-y-5">
            {c.steps.map(([t, d], i) => (
              <li key={t} className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent-gold/60 font-light text-accent-gold">{i + 1}</span>
                <div>
                  <p className="font-medium text-foreground">{t}</p>
                  <p className="text-sm text-foreground/60">{d}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-xs text-foreground/50">{c.processNote}</p>
        </div>
      </section>

      <section id={`${p}-form`} aria-labelledby={`${p}-formh`} className="rounded-3xl border border-foreground/10 bg-background p-6 md:p-10">
        <h3 id={`${p}-formh`} className="mb-2 text-2xl font-light">{c.formTitle}</h3>
        <p className="mb-8 text-sm text-foreground/60">{c.formIntro}</p>
        <DistributorForm locale={locale} />
      </section>

      <section aria-labelledby={`${p}-faq`} className="space-y-3">
        <h3 id={`${p}-faq`} className="text-2xl font-light">{c.faqTitle}</h3>
        {c.faqs.map(([q, a]) => (
          <details key={q} className="rounded-2xl border border-foreground/10 p-5">
            <summary className="cursor-pointer font-medium">{q}</summary>
            <p className="mt-3 text-sm leading-relaxed text-foreground/65">{a}</p>
          </details>
        ))}
      </section>
    </div>
  )
}
