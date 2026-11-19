'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

type Locale = 'tr' | 'en' | 'ar'

const input =
  'w-full bg-background border border-foreground/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent-gold transition-colors'
const label = 'block text-xs font-medium uppercase tracking-widest rtl:tracking-normal rtl:normal-case text-foreground/50 mb-2'

// Seçenek DEĞERLERİ her dilde aynı (Türkçe) gider; e-posta alıcısı tutarlı okusun.
// Yalnızca görünen etiketler dile göre değişir.
const T = {
  tr: {
    aria: 'Distribütörlük talep formu',
    company: 'Firma Adı', contact: 'Yetkili Kişi', email: 'E-posta', phone: 'Telefon / WhatsApp',
    country: 'Ülke', city: 'Şehir / Bölge',
    sub: 'Alt bayi ağınız var mı?', select: 'Seçiniz',
    subOpts: ['Evet', 'Hayır', 'Kurmayı planlıyorum'],
    subCount: 'Yaklaşık alt bayi sayısı', subCountPh: 'Örn. 12',
    exp: 'Bu sektörde daha önce deneyiminiz oldu mu?', expOpts: ['Evet', 'Hayır'],
    channels: 'Satış kanallarınız', channelsPh: 'Mağaza, e-ticaret, toptan, pazaryeri…',
    expDetail: 'Deneyiminizi kısaca anlatın', expDetailPh: 'Hangi ürün gruplarında, kaç yıldır, hangi markalarla çalıştınız?',
    web: 'Web Siteniz / Sosyal Medya', msg: 'Mesajınız', msgPh: 'Çalışmak istediğiniz bölge ve beklentilerinizi kısaca yazın.',
    honey: 'Bu alanı boş bırakın',
    consent: 'İletişim bilgilerimin, talebimin değerlendirilmesi amacıyla PN Parfüm tarafından kullanılmasını kabul ediyorum. *',
    submit: 'Talebi Gönder', note: 'Talebiniz incelendikten sonra ekibimiz sizinle e-posta ile iletişime geçecektir.',
    ok: 'Talebiniz alındı. Ekibimiz değerlendirip e-posta ile sizinle iletişime geçecek.',
    err: 'Bir hata oluştu.', net: 'Bağlantı hatası oluştu. Lütfen tekrar deneyin.',
  },
  en: {
    aria: 'Distributor request form',
    company: 'Company Name', contact: 'Contact Person', email: 'Email', phone: 'Phone / WhatsApp',
    country: 'Country', city: 'City / Region',
    sub: 'Do you have a sub-dealer network?', select: 'Select',
    subOpts: ['Yes', 'No', 'Planning to build one'],
    subCount: 'Approximate number of sub-dealers', subCountPh: 'e.g. 12',
    exp: 'Do you have previous experience in this industry?', expOpts: ['Yes', 'No'],
    channels: 'Your sales channels', channelsPh: 'Stores, e-commerce, wholesale, marketplaces…',
    expDetail: 'Briefly describe your experience', expDetailPh: 'Which product categories, for how many years, and with which brands have you worked?',
    web: 'Website / Social Media', msg: 'Your Message', msgPh: 'Tell us briefly about the region you want to work in and your expectations.',
    honey: 'Leave this field empty',
    consent: 'I agree that my contact details may be used by PN Parfüm to evaluate my request. *',
    submit: 'Submit Request', note: 'After reviewing your request, our team will contact you by email.',
    ok: 'Your request has been received. Our team will review it and contact you by email.',
    err: 'Something went wrong.', net: 'A connection error occurred. Please try again.',
  },
  ar: {
    aria: 'نموذج طلب التوزيع',
    company: 'اسم الشركة', contact: 'الشخص المسؤول', email: 'البريد الإلكتروني', phone: 'الهاتف / واتساب',
    country: 'الدولة', city: 'المدينة / المنطقة',
    sub: 'هل لديكم شبكة وكلاء فرعيين؟', select: 'اختر',
    subOpts: ['نعم', 'لا', 'أخطط لإنشائها'],
    subCount: 'العدد التقريبي للوكلاء الفرعيين', subCountPh: 'مثال: 12',
    exp: 'هل لديكم خبرة سابقة في هذا القطاع؟', expOpts: ['نعم', 'لا'],
    channels: 'قنوات البيع لديكم', channelsPh: 'متاجر، تجارة إلكترونية، جملة، أسواق إلكترونية…',
    expDetail: 'صِفوا خبرتكم باختصار', expDetailPh: 'في أي فئات منتجات، ولكم سنة، ومع أي علامات عملتم؟',
    web: 'الموقع الإلكتروني / وسائل التواصل', msg: 'رسالتكم', msgPh: 'اكتبوا باختصار المنطقة التي ترغبون بالعمل فيها وتوقعاتكم.',
    honey: 'اترك هذا الحقل فارغًا',
    consent: 'أوافق على استخدام بيانات التواصل الخاصة بي من قِبل PN Parfüm لغرض تقييم طلبي. *',
    submit: 'إرسال الطلب', note: 'بعد مراجعة طلبكم، سيتواصل معكم فريقنا عبر البريد الإلكتروني.',
    ok: 'تم استلام طلبكم. سيراجعه فريقنا ويتواصل معكم عبر البريد الإلكتروني.',
    err: 'حدث خطأ ما.', net: 'حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
  },
} as const

// Seçenek indeksi → sunucuya giden Türkçe sabit değer
const SUB_VALUES = ['Evet', 'Hayır', 'Kurmayı planlıyorum'] as const
const EXP_VALUES = ['Evet', 'Hayır'] as const

const EMPTY = {
  companyName: '', contactName: '', email: '', phone: '', country: '', city: '', website: '',
  hasSubDealers: '', subDealerCount: '', hasExperience: '', experienceDetail: '', channels: '',
  message: '', website2: '', consent: false,
}

export default function DistributorForm({ locale = 'tr' }: { locale?: Locale }) {
  const t = T[locale]
  const [f, setF] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const set =
    (k: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setF({ ...f, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch('/api/contact/distributor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, locale }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setStatus({ type: 'success', message: t.ok })
        setF(EMPTY)
      } else {
        setStatus({ type: 'error', message: data.error || t.err })
      }
    } catch {
      setStatus({ type: 'error', message: t.net })
    } finally {
      setLoading(false)
    }
  }

  const id = (s: string) => `d-${locale}-${s}`

  return (
    <form onSubmit={submit} className="space-y-6" aria-label={t.aria} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {status && (
        <div
          role="status"
          className={`flex items-start gap-3 rounded-xl border p-4 text-sm font-medium ${
            status.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="mt-0.5 shrink-0" size={20} />
          ) : (
            <AlertCircle className="mt-0.5 shrink-0" size={20} />
          )}
          <p>{status.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className={label} htmlFor={id('company')}>{t.company} *</label>
          <input id={id('company')} required className={input} value={f.companyName} onChange={set('companyName')} />
        </div>
        <div>
          <label className={label} htmlFor={id('contact')}>{t.contact} *</label>
          <input id={id('contact')} required className={input} value={f.contactName} onChange={set('contactName')} />
        </div>
        <div>
          <label className={label} htmlFor={id('email')}>{t.email} *</label>
          <input id={id('email')} type="email" dir="ltr" required className={input} value={f.email} onChange={set('email')} placeholder="name@company.com" />
        </div>
        <div>
          <label className={label} htmlFor={id('phone')}>{t.phone} *</label>
          <input id={id('phone')} type="tel" dir="ltr" required className={input} value={f.phone} onChange={set('phone')} placeholder="+90 5XX XXX XX XX" />
        </div>
        <div>
          <label className={label} htmlFor={id('country')}>{t.country} *</label>
          <input id={id('country')} required className={input} value={f.country} onChange={set('country')} />
        </div>
        <div>
          <label className={label} htmlFor={id('city')}>{t.city} *</label>
          <input id={id('city')} required className={input} value={f.city} onChange={set('city')} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className={label} htmlFor={id('sub')}>{t.sub} *</label>
          <select id={id('sub')} required className={input} value={f.hasSubDealers} onChange={set('hasSubDealers')}>
            <option value="">{t.select}</option>
            {t.subOpts.map((o, i) => (
              <option key={o} value={SUB_VALUES[i]}>{o}</option>
            ))}
          </select>
        </div>
        {f.hasSubDealers === 'Evet' && (
          <div>
            <label className={label} htmlFor={id('subcount')}>{t.subCount}</label>
            <input id={id('subcount')} className={input} value={f.subDealerCount} onChange={set('subDealerCount')} placeholder={t.subCountPh} />
          </div>
        )}
        <div>
          <label className={label} htmlFor={id('exp')}>{t.exp} *</label>
          <select id={id('exp')} required className={input} value={f.hasExperience} onChange={set('hasExperience')}>
            <option value="">{t.select}</option>
            {t.expOpts.map((o, i) => (
              <option key={o} value={EXP_VALUES[i]}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor={id('channels')}>{t.channels}</label>
          <input id={id('channels')} className={input} value={f.channels} onChange={set('channels')} placeholder={t.channelsPh} />
        </div>
      </div>

      {f.hasExperience === 'Evet' && (
        <div>
          <label className={label} htmlFor={id('expdetail')}>{t.expDetail}</label>
          <textarea id={id('expdetail')} rows={3} className={`${input} resize-none`} value={f.experienceDetail} onChange={set('experienceDetail')} placeholder={t.expDetailPh} />
        </div>
      )}

      <div>
        <label className={label} htmlFor={id('web')}>{t.web}</label>
        <input id={id('web')} dir="ltr" className={input} value={f.website} onChange={set('website')} placeholder="https://" />
      </div>

      <div>
        <label className={label} htmlFor={id('msg')}>{t.msg}</label>
        <textarea id={id('msg')} rows={4} className={`${input} resize-none`} value={f.message} onChange={set('message')} placeholder={t.msgPh} />
      </div>

      {/* Bot tuzağı: kullanıcıya görünmez */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={id('honey')}>{t.honey}</label>
        <input id={id('honey')} tabIndex={-1} autoComplete="off" value={f.website2} onChange={set('website2')} />
      </div>

      <label className="flex items-start gap-3 text-xs text-foreground/60">
        <input type="checkbox" required checked={f.consent} onChange={set('consent')} className="mt-0.5" />
        <span>{t.consent}</span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="flex min-w-[220px] items-center justify-center rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background transition-colors hover:bg-accent-gold disabled:opacity-50"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : t.submit}
      </button>
      <p className="text-xs text-foreground/40">{t.note}</p>
    </form>
  )
}
