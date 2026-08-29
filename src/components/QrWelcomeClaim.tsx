'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, ArrowRight, ShieldCheck } from 'lucide-react'

export default function QrWelcomeClaim({ spotsLeft }: { spotsLeft: number | null }) {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ code: string; discountPercentage: number } | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (phone.replace(/[^0-9]/g, '').length < 10) {
      setError('Geçerli bir telefon numarası girin.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/qr/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Bir hata oluştu.')
      setResult({ code: data.code, discountPercentage: data.discountPercentage })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05XX XXX XX XX"
              autoComplete="tel"
              className="w-full bg-background/80 backdrop-blur-sm border border-foreground/20 rounded-full px-6 py-4 text-center text-lg tracking-wide focus:outline-none focus:border-accent-gold transition-colors"
            />
            {error && <p className="text-accent-rose text-xs text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-background py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-accent-gold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? 'Hazırlanıyor...' : 'Sürprizimi Gör'}
              {!loading && <ArrowRight size={16} />}
            </button>
            <p className="text-[11px] text-foreground/40 text-center leading-relaxed">
              Numaranı sadece bu kodu göndermek için kullanırız, spam yapmayız.
            </p>
          </motion.form>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="text-center space-y-4 p-6 rounded-3xl border border-accent-gold/30 bg-gradient-to-br from-amber-500/10 to-accent-rose/10 backdrop-blur-sm"
          >
            <p className="text-xs uppercase tracking-widest text-accent-gold font-bold">
              İlk Siparişine Özel
            </p>
            <p className="text-4xl font-light">
              %{result.discountPercentage} <span className="text-lg font-normal text-foreground/60">İndirim</span>
            </p>
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-between gap-3 bg-background border border-foreground/10 rounded-2xl px-5 py-4 hover:border-accent-gold transition-colors"
            >
              <span className="font-mono font-bold text-lg tracking-wider">{result.code}</span>
              {copied ? <Check size={20} className="text-emerald-600" /> : <Copy size={20} className="text-foreground/40" />}
            </button>
            <p className="text-[11px] text-foreground/50">
              Bu kod telefonuna da gönderildi · 48 saat geçerli
            </p>

            <div className="pt-2 space-y-2">
              <Link
                href="/katalog"
                className="block w-full bg-foreground text-background py-3.5 rounded-full text-sm font-bold hover:bg-accent-gold transition-colors"
              >
                Şimdi Alışverişe Başla
              </Link>
              <Link
                href={`/hesap?phone=${encodeURIComponent(phone)}`}
                className="block w-full py-3.5 text-sm font-medium text-foreground/70 hover:text-accent-gold transition-colors underline underline-offset-4"
              >
                Kurucu Üyeliğimi Tamamla
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!result && spotsLeft !== null && spotsLeft > 0 && (
        <div className="flex items-center justify-center gap-2 mt-5 text-xs text-foreground/50">
          <ShieldCheck size={14} className="text-accent-gold" />
          <span>Kurucu Üyelik için sadece <strong className="text-foreground">{spotsLeft}</strong> yer kaldı</span>
        </div>
      )}
    </div>
  )
}
