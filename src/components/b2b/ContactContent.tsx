'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react'

type Locale = 'en' | 'ar'

const T = {
  en: {
    h: 'Contact',
    intro: 'For questions about fragrances, orders, distribution or private label, our team is happy to help.',
    addrT: 'Head Office & Laboratory',
    addr: ['PİEN PARFUME / SİLİVRİ / İSTANBUL', 'Yeni Sanayi Sit. E-Blok 9. Cad. No:8', 'Silivri / İstanbul, Türkiye'],
    phoneT: 'Customer Service & Switchboard',
    emailT: 'Email',
    hoursT: 'Working Hours',
    hours: ['Monday – Friday: 09:00 – 18:00 (Türkiye time, GMT+3)', 'Saturday – Sunday: Closed'],
    formT: 'Write to Us',
    formIntro: 'All requests are sent directly to our team.',
    name: 'Full Name', email: 'Email', phone: 'Phone', subject: 'Subject', message: 'Your Message',
    messagePh: 'How can we help you?',
    subjects: ['Order Status', 'Product & Fragrance Advice', 'Return & Exchange Request', 'Distributor, Wholesale & Corporate Quote', 'General Feedback'],
    send: 'Send Message', sending: 'Sending...',
    ok: 'Your message has been received. We will get back to you as soon as possible.',
    errNet: 'A connection error occurred. Please contact us by email or phone.',
    err: 'There was a problem sending your message. Please contact us by email or phone.',
  },
  ar: {
    h: 'اتصل بنا',
    intro: 'لأسئلتكم حول العطور أو الطلبات أو التوزيع أو العلامة الخاصة، فريقنا سعيد بمساعدتكم.',
    addrT: 'المقر الرئيسي والمختبر',
    addr: ['PİEN PARFUME / SİLİVRİ / İSTANBUL', 'Yeni Sanayi Sit. E-Blok 9. Cad. No:8', 'Silivri / İstanbul, Türkiye'],
    phoneT: 'خدمة العملاء والسنترال',
    emailT: 'البريد الإلكتروني',
    hoursT: 'ساعات العمل',
    hours: ['من الاثنين إلى الجمعة: 09:00 – 18:00 (بتوقيت تركيا GMT+3)', 'السبت والأحد: مغلق'],
    formT: 'راسلونا',
    formIntro: 'تصل جميع الطلبات مباشرة إلى فريقنا.',
    name: 'الاسم الكامل', email: 'البريد الإلكتروني', phone: 'الهاتف', subject: 'الموضوع', message: 'رسالتكم',
    messagePh: 'كيف يمكننا مساعدتكم؟',
    subjects: ['حالة الطلب', 'استشارة منتجات وعطور', 'طلب إرجاع أو استبدال', 'توزيع وجملة وعرض سعر للشركات', 'ملاحظات عامة'],
    send: 'إرسال الرسالة', sending: 'جارٍ الإرسال...',
    ok: 'تم استلام رسالتكم. سنعاود التواصل معكم في أقرب وقت.',
    errNet: 'حدث خطأ في الاتصال. يرجى التواصل معنا عبر البريد الإلكتروني أو الهاتف.',
    err: 'حدثت مشكلة أثناء إرسال رسالتكم. يرجى التواصل معنا عبر البريد الإلكتروني أو الهاتف.',
  },
} as const

const field =
  'w-full bg-foreground/5 border border-transparent rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent-gold focus:bg-background transition-colors'
const lab = 'block text-xs font-medium uppercase tracking-widest rtl:tracking-normal rtl:normal-case text-foreground/50 mb-2'

export default function ContactContent({ locale }: { locale: Locale }) {
  const t = T[locale]
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: t.subjects[0] as string, message: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, subject: `[${locale.toUpperCase()}] ${form.subject}` }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setMsg({ type: 'success', text: t.ok })
        setForm({ name: '', email: '', phone: '', subject: t.subjects[0], message: '' })
      } else {
        setMsg({ type: 'error', text: t.err })
      }
    } catch {
      setMsg({ type: 'error', text: t.errNet })
    } finally {
      setLoading(false)
    }
  }

  const items = [
    { icon: MapPin, title: t.addrT, body: <>{t.addr.map((l) => <span key={l} className="block">{l}</span>)}</> },
    { icon: Phone, title: t.phoneT, body: <a dir="ltr" href="tel:+902127360990" className="hover:text-accent-gold">(+90) 212 736 09 90</a> },
    { icon: Mail, title: t.emailT, body: <a href="mailto:info@pnparfume.com" className="hover:text-accent-gold">info@pnparfume.com</a> },
    { icon: Clock, title: t.hoursT, body: <>{t.hours.map((l) => <span key={l} className="block">{l}</span>)}</> },
  ]

  return (
    <div lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="space-y-10">
      <div>
        <h2 className="mb-4 text-3xl font-light text-accent-gold">{t.h}</h2>
        <p className="max-w-2xl leading-relaxed text-foreground/70">{t.intro}</p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          {items.map((it) => (
            <div key={it.title} className="flex items-start gap-4 rounded-xl p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-accent-gold">
                <it.icon size={20} />
              </div>
              <div>
                <h3 className="mb-1 font-medium">{it.title}</h3>
                <p className="text-sm leading-relaxed text-foreground/60">{it.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-foreground/10 bg-background p-6 md:p-8">
          <h3 className="mb-2 text-xl font-medium">{t.formT}</h3>
          <p className="mb-6 text-xs text-foreground/60">{t.formIntro}</p>

          {msg && (
            <div
              role="status"
              className={`mb-6 flex items-center gap-3 rounded-2xl border p-4 text-xs ${
                msg.type === 'success'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700'
                  : 'border-rose-500/30 bg-rose-500/10 text-rose-700'
              }`}
            >
              {msg.type === 'success' ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
              <span>{msg.text}</span>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className={lab} htmlFor={`c-${locale}-name`}>{t.name} *</label>
              <input id={`c-${locale}-name`} required className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={lab} htmlFor={`c-${locale}-email`}>{t.email} *</label>
                <input id={`c-${locale}-email`} dir="ltr" type="email" required className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className={lab} htmlFor={`c-${locale}-phone`}>{t.phone}</label>
                <input id={`c-${locale}-phone`} dir="ltr" type="tel" className={field} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div>
              <label className={lab} htmlFor={`c-${locale}-subject`}>{t.subject}</label>
              <select id={`c-${locale}-subject`} className={field} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                {t.subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={lab} htmlFor={`c-${locale}-message`}>{t.message} *</label>
              <textarea id={`c-${locale}-message`} required rows={4} className={`${field} resize-none`} placeholder={t.messagePh} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            <button type="submit" disabled={loading} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-4 text-sm font-medium text-background transition-colors hover:bg-accent-gold disabled:opacity-50">
              <Send size={16} />
              {loading ? t.sending : t.send}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
