import Link from 'next/link'
import BrandsShowcase, { BRANDS } from '@/components/brands/BrandsShowcase'
import UmbrellaSeries from '@/components/brands/UmbrellaSeries'

export const metadata = {
  title: 'علاماتنا العطرية: Pien وPien Intense وAşık وPien Luxury وPN | PN Parfüm',
  description:
    'ننتج منذ عام 2002. Pien Series وPien Intense وAşık Parfüm وPien Luxury وPN وPN Special Series: علامات عطور وسلاسل منتجات من الاستخدام اليومي إلى المناسبات الخاصة والمجموعات الفاخرة.',
  keywords: [
    'علامات عطور تركية', 'مصنع عطور تركيا', 'عطور اقتصادية', 'عطور فاخرة 100 مل', 'PN Parfüm', 'Pien',
  ],
  alternates: {
    canonical: 'https://pnparfume.com/ar/brands',
    languages: {
      ar: 'https://pnparfume.com/ar/brands',
      en: 'https://pnparfume.com/en/brands',
      tr: 'https://pnparfume.com/kurumsal/markalarimiz',
      'x-default': 'https://pnparfume.com/en/brands',
    },
  },
  openGraph: {
    title: 'علاماتنا العطرية وسلاسل منتجاتنا | PN Parfüm',
    description:
      'ست علامات وسلاسل عطور مصممة لكل احتياج: Pien Series وPien Intense وAşık Parfüm وPien Luxury وPN وPN Special Series.',
    url: 'https://pnparfume.com/ar/brands',
    siteName: 'PN Parfüm',
    locale: 'ar',
    type: 'website',
  },
}

const faqs = [
  {
    q: 'ما العلامات وسلاسل العطور التي تنتجها PN Parfüm؟',
    a: 'ننتج ست علامات وسلاسل: Pien Series وPien Intense وAşık Parfüm وPien Luxury وPN وPN Special Series. صُممت لاحتياجات مختلفة، من الاستخدام اليومي إلى الأمسيات والمناسبات الخاصة، ومن السلاسل الاقتصادية إلى المجموعات الفاخرة.',
  },
  {
    q: 'ما الفرق بين Pien Series وPien Intense؟',
    a: 'Pien Series سلسلة اقتصادية للاستخدام اليومي بتركيز عطري 20%. أما Pien Intense فهي سلسلة اقتصادية يومية أيضًا، تضم عطورًا مصممة خصيصًا بتركيز عطري أعلى بنسبة 20%.',
  },
  {
    q: 'ما حجم Pien Luxury وما الذي يميزها؟',
    a: 'Pien Luxury مجموعة عطور فاخرة بتصميم أنيق في زجاجة 100 مل، مصنوعة بتركيز عطري عالٍ جدًا وزيوت عطرية خاصة جدًا.',
  },
  {
    q: 'متى يُستخدم Aşık Parfüm؟',
    a: 'Aşık Parfüm سلسلة خاصة تضم عطورًا مميزة بتركيز عطري عالٍ وتصميم أنيق، صُممت للدعوات والمناسبات الخاصة.',
  },
  {
    q: 'هل يمكنني إنشاء سلسلتي الخاصة تحت علامة PN دون بناء علامة خاصة بي؟',
    a: 'نعم. تحت مظلة علامة PN يمكنكم إطلاق سلسلة علامة فرعية خاصة بكم (مثل MIX أو AGORA)، مما يقلل تكاليفكم ويجنّبكم حدود الكميات العالية للإنتاج المستقل. يتم الاتفاق على النطاق والكميات والشروط حسب المشروع.',
  },
  {
    q: 'ما الذي يميز علامة PN؟',
    a: 'PN مجموعة مصممة للاستخدام اليومي بخلاصة عطرية من الدرجة الأولى، وتضم سلاسل خاصة وسلاسل بتصميم خاص.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'علامات PN Parfüm وسلاسل منتجاتها',
    inLanguage: 'ar',
    itemListElement: BRANDS.ar.items.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Brand',
        name: b.name,
        description: b.text,
        url: 'https://pnparfume.com/ar/brands',
      },
    })),
  },
]

export default function ArBrandsPage() {
  return (
    <div lang="ar" dir="rtl">
      {jsonLd.map((d) => (
        <script
          key={d['@type']}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}

      <h1 className="sr-only">علاماتنا العطرية وسلاسل منتجاتنا</h1>

      <div className="mb-16">
        <BrandsShowcase locale="ar" />
      </div>

      <div className="mb-16">
        <UmbrellaSeries locale="ar" />
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-light mb-8">الأسئلة الشائعة</h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group border border-foreground/10 rounded-2xl p-5">
              <summary className="cursor-pointer list-none font-medium">{f.q}</summary>
              <p className="text-sm text-foreground/60 leading-relaxed mt-3">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      <p className="text-center mt-10 text-sm text-foreground/40">
        تبحثون عن متجرنا التركي؟ <Link href="/" className="text-accent-gold hover:underline">زوروا pnparfume.com</Link>
      </p>
    </div>
  )
}
