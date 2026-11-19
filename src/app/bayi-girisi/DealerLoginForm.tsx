'use client'

import { useState } from 'react'
import { useT } from '@/lib/i18n'
import Link from 'next/link'
import { Loader2, AlertCircle } from 'lucide-react'

export default function DealerLoginForm() {
  const t = useT()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notDealer, setNotDealer] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setNotDealer(false)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || t("Giriş yapılamadı.", "Could not sign in.", "تعذّر تسجيل الدخول."))

      localStorage.setItem('user', JSON.stringify(data.user))
      if (data.token) localStorage.setItem('pn_session', data.token)

      // Bayi statüsünü sunucuya soruyoruz; onaylıysa bayi fiyatlarıyla kataloğa geçiyoruz.
      const check = await fetch('/api/dealer/prices', { headers: { Authorization: `Bearer ${data.token}` } })
      if (check.ok) {
        window.location.href = '/katalog'
      } else {
        setNotDealer(true)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full bg-foreground/5 border border-transparent rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent-gold focus:bg-background transition-colors'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 rounded-xl flex items-start gap-3 border bg-red-50 border-red-200 text-red-800 text-sm">
          <AlertCircle className="shrink-0 mt-0.5" size={18} />
          <span>{error}</span>
        </div>
      )}

      {notDealer && (
        <div className="p-4 rounded-xl border border-accent-gold/40 bg-accent-gold/10 text-sm text-foreground/80 leading-relaxed">
          {t("Giriş yaptınız, ancak hesabınız henüz bayi olarak onaylanmamış. Bayilik için", "You are signed in, but your account has not yet been approved as a dealer. For dealership, you can fill in the", "لقد سجلت الدخول، لكن حسابك لم يُعتمد كوكيل بعد. للوكالة يمكنك ملء")}{' '}
          <Link href="/kurumsal/bayilik" className="text-accent-gold font-medium hover:underline">{t("başvuru formunu", "application form", "نموذج الطلب")}</Link>{' '}
          {t("doldurabilirsiniz; onaylandığında bayi fiyatları otomatik olarak açılır.", "; once approved, dealer prices open automatically.", "؛ وعند الموافقة تُفعَّل أسعار الوكلاء تلقائيًا.")}
        </div>
      )}

      <div>
        <label htmlFor="dealerEmail" className="block text-xs font-medium uppercase tracking-widest text-foreground/50 mb-2">{t("E-posta", "Email", "البريد الإلكتروني")}</label>
        <input id="dealerEmail" type="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
      </div>
      <div>
        <label htmlFor="dealerPassword" className="block text-xs font-medium uppercase tracking-widest text-foreground/50 mb-2">{t("Şifre", "Password", "كلمة المرور")}</label>
        <input id="dealerPassword" type="password" required value={password} onChange={e => setPassword(e.target.value)} className={inputClass} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-foreground text-background py-3 rounded-full text-sm font-medium hover:bg-accent-gold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : t("Bayi Olarak Giriş Yap", "Sign In as Dealer", "تسجيل الدخول كوكيل")}
      </button>

      <p className="text-center text-xs text-foreground/50 pt-2">
        {t("Hesabınız yok mu? Önce", "Don't have an account? First", "ليس لديك حساب؟ أولًا")} <Link href="/hesap" className="text-accent-gold hover:underline">{t("üye olun", "sign up", "سجّل")}</Link>{t(", ardından bayilik başvurusu yapın.", ", then apply for dealership.", "، ثم قدّم طلب الوكالة.")}
      </p>
    </form>
  )
}
