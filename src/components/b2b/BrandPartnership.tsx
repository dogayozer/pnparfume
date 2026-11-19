import Image from 'next/image'

type Locale = 'tr' | 'en' | 'ar'

const IMAGES = [
  { src: '/kurumsal/koku-tasarimi.jpg' },
  { src: '/kurumsal/marka-tescil.jpg' },
  { src: '/kurumsal/logo-tasarimi.jpg' },
  { src: '/kurumsal/sise-cesitleri.jpg' },
  { src: '/kurumsal/kutu-tasarimi.jpg' },
  { src: '/kurumsal/etiket-tasarimi.jpg' },
] as const

const CONTENT = {
  tr: {
    eyebrow: "2002'den beri üretimdeyiz",
    heading: 'Markanızı Birlikte Kuruyoruz',
    intro:
      '24 yıllık tecrübemiz ve var olan markalarımızla birçok kayıt sürecini sizin için kolaylaştırıyor, kendi markanız altında koleksiyon oluşturmanız için koku, marka tescili, logo, şişe, kutu ve etiket adımlarının hepsinde yanınızda oluyoruz.',
    stepsLabel: 'Marka kurma süreci',
    steps: [
      { title: 'Koku ve Kişilik', sub: 'Size özgü koku karakteri' },
      { title: 'Marka ve Logo', sub: 'Tescil ve görsel kimlik' },
      { title: 'Şişe Seçimi', sub: 'Model ve hacim' },
      { title: 'Kutu ve Etiket', sub: 'Tasarım ve baskı' },
      { title: 'Kayıt ve Belgeler', sub: 'Süreçlerde kolaylık' },
      { title: 'Markanızın Koleksiyonu', sub: 'Kendi adınız altında' },
    ],
    lab: {
      kicker: 'LABORATUVAR',
      title: '400 Farklı Koku Seçeneği',
      text: 'Laboratuvarımızda aralarından seçim yapabileceğiniz 400 farklı koku seçeneğiyle çalışıyoruz. Koku konseptinizi bu zengin yelpazeden birlikte belirliyor, markanıza özgü karakteri koku tasarımı ekibimizle şekillendiriyoruz.',
      alt: 'Parfüm laboratuvarında yüzlerce amber koku şişesinden oluşan koku kütüphanesi',
    },
    pillars: [
      {
        title: 'Koku ve Kişilik',
        alt: 'Parfümör laboratuvarda esans karışımı hazırlıyor: gül, vanilya, odun ve amber hammaddeleri',
        text: 'Sıradan koku ailelerinin yanı sıra, sektörde sevilen koku karakterlerini temel alıp onlara farklı kişilikler kazandırarak rekabetçi, size özgü ürünler tasarlamanıza yardımcı oluyoruz.',
      },
      {
        title: 'Marka Tescili',
        alt: 'Marka tescil dosyası, mühür ve büyüteç',
        text: 'Marka isminizin tescil (patent) sürecinde başvurudan takibe adım adım yönlendiriyor, isim ve sınıf seçimi gibi kritik kararlarda yanınızda oluyoruz.',
      },
      {
        title: 'Logo Tasarımı',
        alt: 'Logo çizim çalışması: eskizler, renk ve folyo örnekleri',
        text: 'Markanızın karakterini yansıtan logo ve renk kimliğini eskizden son hâline kadar birlikte tasarlıyoruz.',
      },
      {
        title: 'Şişe Seçimi',
        alt: 'Farklı şekil ve hacimlerde boş parfüm şişeleri',
        text: 'Çalıştığımız şişe üreticileriyle zengin model çeşitleri sunuyor, sektörün nabzına göre hacim seçimi konusunda danışmanlık veriyoruz.',
      },
      {
        title: 'Kutu Tasarımı',
        alt: 'Parfüm kutusu tasarım çalışması: renk ve kâğıt örnekleri',
        text: 'Anlaşmalı matbaalarımızla, kutu tasarımınız için en uygun fiyatı almanıza aracılık ediyoruz.',
      },
      {
        title: 'Etiket Tasarımı',
        alt: 'Parfüm şişeleri için etiket tasarımı ve folyo detayları',
        text: 'Şişenize uygun etiket formu, malzeme ve baskı detaylarını yasal etiket gerekliliklerini de gözeterek birlikte tasarlıyoruz.',
      },
    ],
    note: 'Kapsam, süre ve koşullar projeye göre birlikte belirlenir. Ayrıntılar için aşağıdaki formu doldurabilirsiniz.',
  },
  en: {
    eyebrow: 'Producing since 2002',
    heading: 'We Build Your Brand With You',
    intro:
      'With 24 years of experience and our own established brands, we simplify many registration steps and support you at every stage of building your own collection: fragrance, trademark registration, logo, bottle, box and label design.',
    stepsLabel: 'Brand building process',
    steps: [
      { title: 'Fragrance & Character', sub: 'A scent that is yours' },
      { title: 'Brand & Logo', sub: 'Registration and identity' },
      { title: 'Bottle Selection', sub: 'Models and volumes' },
      { title: 'Box & Label', sub: 'Design and print' },
      { title: 'Registration & Documents', sub: 'A smoother process' },
      { title: 'Your Collection', sub: 'Under your own name' },
    ],
    lab: {
      kicker: 'LABORATORY',
      title: '400 Different Fragrance Options',
      text: 'In our laboratory you can choose from 400 different fragrance options. We define your fragrance concept together from this wide range and shape a character unique to your brand with our fragrance design team.',
      alt: 'A perfume laboratory scent library with hundreds of amber fragrance bottles',
    },
    pillars: [
      {
        title: 'Fragrance & Character',
        alt: 'A perfumer blending an essence in the laboratory with rose, vanilla, wood and amber raw materials',
        text: 'Beyond classic fragrance families, we take well-loved scent profiles as a starting point and give them a distinct personality, helping you design competitive products that are truly yours.',
      },
      {
        title: 'Trademark Registration',
        alt: 'Trademark registration folder, seal and magnifying glass',
        text: 'We guide you step by step through the trademark registration process, from application to follow-up, and support critical decisions such as name and class selection.',
      },
      {
        title: 'Logo Design',
        alt: 'Logo design work: sketches, colour and foil samples',
        text: 'We design your logo and colour identity together with you, from first sketch to final artwork.',
      },
      {
        title: 'Bottle Selection',
        alt: 'Empty perfume bottles in different shapes and volumes',
        text: 'Through our bottle manufacturer partners we offer a wide range of models and advise on volumes that match market trends.',
      },
      {
        title: 'Box Design',
        alt: 'Perfume box design work with colour and paper samples',
        text: 'Through our partner printers, we help you get the most competitive price for your box design.',
      },
      {
        title: 'Label Design',
        alt: 'Label design and foil details for perfume bottles',
        text: 'We design label shape, material and print details to fit your bottle, taking legal labelling requirements into account.',
      },
    ],
    note: 'Scope, timing and terms are agreed per project. Use the form below to get in touch.',
  },
  ar: {
    eyebrow: 'ننتج منذ عام 2002',
    heading: 'نبني علامتك معك',
    intro:
      'بخبرة 24 عامًا وعلاماتنا القائمة، نُسهّل العديد من خطوات التسجيل وندعمك في كل مرحلة من بناء مجموعتك الخاصة: العطر، تسجيل العلامة التجارية، الشعار، الزجاجة، العلبة والملصق.',
    stepsLabel: 'مراحل بناء العلامة',
    steps: [
      { title: 'العطر والشخصية', sub: 'عطر يخصّك' },
      { title: 'العلامة والشعار', sub: 'التسجيل والهوية' },
      { title: 'اختيار الزجاجة', sub: 'الطرازات والأحجام' },
      { title: 'العلبة والملصق', sub: 'التصميم والطباعة' },
      { title: 'التسجيل والوثائق', sub: 'عملية أسهل' },
      { title: 'مجموعتك الخاصة', sub: 'تحت اسمك' },
    ],
    lab: {
      kicker: 'المختبر',
      title: '400 خيار عطري مختلف',
      text: 'في مختبرنا يمكنك الاختيار من بين 400 خيار عطري مختلف. نحدد مفهوم عطرك معًا من هذه المجموعة الواسعة، ونصوغ طابعًا فريدًا لعلامتك مع فريق تصميم العطور لدينا.',
      alt: 'مكتبة عطور في مختبر العطور تضم مئات زجاجات العطر الكهرمانية',
    },
    pillars: [
      {
        title: 'العطر والشخصية',
        alt: 'خبير عطور يمزج خلاصة عطرية في المختبر بين الورد والفانيلا والخشب والعنبر',
        text: 'إلى جانب عائلات العطور التقليدية، ننطلق من طابع عطري محبوب في السوق ونمنحه شخصية مميزة، لنساعدك في تصميم منتجات تنافسية خاصة بك فعلًا.',
      },
      {
        title: 'تسجيل العلامة التجارية',
        alt: 'ملف تسجيل علامة تجارية وختم وعدسة مكبرة',
        text: 'نرشدك خطوة بخطوة في مسار تسجيل العلامة التجارية، من التقديم إلى المتابعة، وندعمك في قرارات مهمة مثل اختيار الاسم والفئة.',
      },
      {
        title: 'تصميم الشعار',
        alt: 'عمل تصميم شعار: رسومات أولية وعينات ألوان ورقائق',
        text: 'نصمم شعارك وهويتك اللونية معك، من أول رسم أولي حتى الشكل النهائي.',
      },
      {
        title: 'اختيار الزجاجة',
        alt: 'زجاجات عطر فارغة بأشكال وأحجام مختلفة',
        text: 'عبر شركائنا من مصنّعي الزجاجات نقدم تشكيلة واسعة من الطرازات، ونستشيرك في الأحجام التي تناسب اتجاهات السوق.',
      },
      {
        title: 'تصميم العلبة',
        alt: 'عمل تصميم علبة عطر بعينات ألوان وورق',
        text: 'عبر مطابعنا المتعاقد معها، نساعدك في الحصول على أنسب سعر لتصميم علبتك.',
      },
      {
        title: 'تصميم الملصق',
        alt: 'تصميم ملصق وتفاصيل رقائق لزجاجات العطر',
        text: 'نصمم شكل الملصق وخامته وتفاصيل طباعته بما يناسب زجاجتك، مع مراعاة متطلبات الملصقات القانونية.',
      },
    ],
    note: 'يتم الاتفاق على النطاق والمدة والشروط حسب المشروع. يمكنك استخدام النموذج أدناه للتواصل معنا.',
  },
} as const

export default function BrandPartnership({ locale = 'tr' }: { locale?: Locale }) {
  const c = CONTENT[locale]
  const headingId = `brand-partnership-heading-${locale}`

  return (
    <section aria-labelledby={headingId} className="space-y-10" lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.25em] rtl:normal-case rtl:tracking-normal text-accent-gold">
          {c.eyebrow}
        </p>
        <h2 id={headingId} className="text-3xl font-light text-foreground">
          {c.heading}
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-foreground/70">{c.intro}</p>
      </div>

      {/* Görsel şema: süreç akışı */}
      <ol aria-label={c.stepsLabel} className="grid grid-cols-1 gap-3 md:grid-cols-6 md:gap-0">
        {c.steps.map((step, i) => (
          <li
            key={step.title}
            className="relative flex items-start gap-4 md:flex-col md:items-center md:text-center"
          >
            <div className="relative flex items-center md:w-full md:justify-center">
              <span className="z-10 flex h-12 w-12 items-center justify-center rounded-full border border-accent-gold/60 bg-background font-light text-accent-gold">
                {i + 1}
              </span>
              {i < c.steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 hidden h-px w-full bg-gradient-to-r from-accent-gold/60 to-accent-gold/10 md:block"
                />
              )}
            </div>
            <div className="md:mt-3 md:px-2">
              <p className="text-sm font-medium text-foreground">{step.title}</p>
              <p className="text-xs text-foreground/55">{step.sub}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* Laboratuvar */}
      <article className="grid grid-cols-1 overflow-hidden rounded-2xl border border-foreground/10 bg-background md:grid-cols-2">
        <div className="relative aspect-[3/2] w-full md:aspect-auto md:min-h-[300px]">
          <Image
            src="/kurumsal/koku-kutuphane.jpg"
            alt={c.lab.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-3 p-6 md:p-8">
          <p className="text-xs tracking-[0.2em] rtl:tracking-normal text-accent-gold">{c.lab.kicker}</p>
          <h3 className="text-2xl font-light text-foreground">{c.lab.title}</h3>
          <p className="text-sm leading-relaxed text-foreground/65">{c.lab.text}</p>
        </div>
      </article>

      {/* Destek alanları */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {c.pillars.map((p, i) => (
          <article
            key={p.title}
            className="overflow-hidden rounded-2xl border border-foreground/10 bg-background"
          >
            <div className="relative aspect-[3/2] w-full">
              <Image
                src={IMAGES[i].src}
                alt={p.alt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-2 p-5">
              <p className="text-xs tracking-[0.2em] rtl:tracking-normal text-accent-gold">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="text-lg font-medium text-foreground">{p.title}</h3>
              <p className="text-sm leading-relaxed text-foreground/65">{p.text}</p>
            </div>
          </article>
        ))}
      </div>

      <p className="text-xs text-foreground/50">{c.note}</p>
    </section>
  )
}
