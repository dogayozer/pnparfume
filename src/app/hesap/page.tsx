'use client'

import Link from 'next/link'
import { ArrowLeft, Eye } from 'lucide-react'
import { useState } from 'react'

export default function AccountPage() {
  // Signup State
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  
  // Profiling Fields
  const [birthYear, setBirthYear] = useState('')
  const [birthMonthDay, setBirthMonthDay] = useState('')
  const [profession, setProfession] = useState('')
  
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [termsConsent, setTermsConsent] = useState(false)
  const [emailConsent, setEmailConsent] = useState(false)
  const [smsConsent, setSmsConsent] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [couponCode, setCouponCode] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!firstName || !lastName || !email || !password || !passwordConfirm || !birthYear) {
      setError('Lütfen tüm zorunlu alanları (Doğum Yılı dahil) doldurun.')
      return
    }
    
    if (password !== passwordConfirm) {
      setError('Şifreler birbiriyle eşleşmiyor.')
      return
    }
    
    if (!termsConsent) {
      setError('Üyelik Koşulları ve Kişisel Verilerimin Korunması metinlerini onaylamanız gerekmektedir.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          birthYear: parseInt(birthYear),
          birthDate: birthMonthDay || null,
          profession: profession || null,
          password,
          emailConsent,
          smsConsent
        })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Kayıt sırasında bir hata oluştu.')
      }
      
      setSuccess(true)
      setCouponCode(data.coupon)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-[calc(100vh-80px)] bg-background pt-10 pb-20 relative">
      <div className="max-w-5xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-accent-gold hover:text-accent-rose transition-colors mb-12">
          <ArrowLeft size={16} className="mr-2" /> Ana Sayfaya Dön
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 relative">
          
          {/* Giriş Yap */}
          <div className="flex flex-col h-full">
            <h1 className="text-3xl font-light tracking-wide mb-10">Giriş Yap</h1>
            
            <form className="space-y-8 flex-1 flex flex-col">
              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-widest text-foreground/60 mb-2">E-posta adresi</label>
                <input 
                  type="email" 
                  className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent-gold transition-colors"
                  placeholder="isim@ornek.com"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-widest text-foreground/60 mb-2">Şifre</label>
                <div className="relative">
                  <input 
                    type="password" 
                    className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent-gold transition-colors pr-10"
                    placeholder="••••••••"
                  />
                  <button type="button" className="absolute right-0 top-2 text-foreground/40 hover:text-foreground transition-colors">
                    <Eye size={18} />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-start">
                <a href="#" className="text-xs underline text-foreground/60 hover:text-accent-rose transition-colors">Şifreni mi unuttun?</a>
              </div>
              
              <div className="pt-6 mt-auto">
                <button type="button" className="w-full bg-foreground text-background py-4 uppercase tracking-widest text-sm font-medium hover:bg-accent-gold transition-colors">
                  Giriş Yap
                </button>
              </div>
            </form>
          </div>
          
          {/* Divider on desktop */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-foreground/10 -translate-x-1/2"></div>
          
          {/* Üye Ol */}
          <div className="flex flex-col h-full">
            <h1 className="text-3xl font-light tracking-wide mb-10">Üye Ol</h1>
            
            {success ? (
              <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-accent-gold/20 flex items-center justify-center text-accent-gold mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-2xl font-light">Aramıza Hoş Geldiniz!</h2>
                <p className="text-foreground/70 leading-relaxed max-w-sm">
                  Üyeliğiniz başarıyla oluşturuldu. PN Parfüm ayrıcalıklarını keşfetmeye başlayabilirsiniz.
                </p>
                <div className="bg-foreground/5 p-6 rounded-2xl border border-foreground/10 w-full mt-4">
                  <p className="text-sm uppercase tracking-widest text-foreground/60 mb-2">İlk Üyeliğe Özel Kuponunuz</p>
                  <p className="text-3xl font-medium tracking-wider text-accent-gold">{couponCode}</p>
                </div>
                <button 
                  onClick={() => setSuccess(false)}
                  className="mt-8 border border-foreground text-foreground px-8 py-3 uppercase tracking-widest text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
                >
                  Giriş Yap
                </button>
              </div>
            ) : (
            <form onSubmit={handleRegister} className="space-y-8 flex-1 flex flex-col">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-xl text-sm">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-xs uppercase tracking-widest text-foreground/60 mb-2">Ad</label>
                  <input 
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent-gold transition-colors"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs uppercase tracking-widest text-foreground/60 mb-2">Soyad</label>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent-gold transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-widest text-foreground/60 mb-2">E-posta adresi</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent-gold transition-colors"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-widest text-foreground/60 mb-2">Telefon Numarası</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent-gold transition-colors"
                  placeholder="0 (5XX) XXX XX XX"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-xs uppercase tracking-widest text-foreground/60 mb-2">Doğum Yılı *</label>
                  <input 
                    type="number" 
                    min="1920" max="2015"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent-gold transition-colors"
                    placeholder="YYYY"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs uppercase tracking-widest text-foreground/60 mb-2 flex items-center justify-between">
                    Doğum Günü <span className="text-[10px] text-foreground/40 normal-case tracking-normal">Opsiyonel</span>
                  </label>
                  <input 
                    type="text" 
                    value={birthMonthDay}
                    onChange={(e) => setBirthMonthDay(e.target.value)}
                    className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent-gold transition-colors"
                    placeholder="GG/AA"
                  />
                  <p className="text-[10px] text-foreground/50 mt-1 leading-tight">Size özel sürpriz doğum günü ayrıcalıkları için.</p>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-widest text-foreground/60 mb-2 flex items-center justify-between">
                  Meslek <span className="text-[10px] text-foreground/40 normal-case tracking-normal">Opsiyonel</span>
                </label>
                <input 
                  type="text" 
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent-gold transition-colors"
                  placeholder="Mimar, Avukat, Tasarımcı vb."
                />
                <p className="text-[10px] text-foreground/50 mt-1 leading-tight">Yaşam tarzınıza ve mesleğinize en uygun koku profillerini size önerebilmemiz için.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-xs uppercase tracking-widest text-foreground/60 mb-2">Şifre</label>
                  <div className="relative">
                     <input 
                       type="password" 
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent-gold transition-colors"
                     />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs uppercase tracking-widest text-foreground/60 mb-2">Şifre Tekrar</label>
                   <div className="relative">
                     <input 
                       type="password" 
                       value={passwordConfirm}
                       onChange={(e) => setPasswordConfirm(e.target.value)}
                       className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent-gold transition-colors"
                     />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={termsConsent} onChange={(e) => setTermsConsent(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-foreground/30 text-accent-gold focus:ring-accent-gold bg-transparent cursor-pointer" />
                  <span className="text-xs text-foreground/80 group-hover:text-foreground transition-colors leading-relaxed">
                    <a href="#" className="underline hover:text-accent-gold transition-colors">Üyelik Koşulları</a>'nı ve <a href="#" className="underline hover:text-accent-gold transition-colors">Kişisel Verilerimin Korunması</a>'nı kabul ediyorum.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={emailConsent} onChange={(e) => setEmailConsent(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-foreground/30 text-accent-gold focus:ring-accent-gold bg-transparent cursor-pointer" />
                  <span className="text-xs text-foreground/80 group-hover:text-foreground transition-colors leading-relaxed">
                    Kampanya, duyuru, bilgilendirmelerden <strong>e-posta</strong> ile haberdar olmak istiyorum.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={smsConsent} onChange={(e) => setSmsConsent(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-foreground/30 text-accent-gold focus:ring-accent-gold bg-transparent cursor-pointer" />
                  <span className="text-xs text-foreground/80 group-hover:text-foreground transition-colors leading-relaxed">
                    Kampanya, duyuru, bilgilendirmelerden <strong>sms</strong> ile haberdar olmak istiyorum.
                  </span>
                </label>
              </div>
              
              <div className="pt-6 mt-auto">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full border border-foreground text-foreground py-4 uppercase tracking-widest text-sm font-medium hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'İşleniyor...' : 'Üye Ol'}
                </button>
                <p className="text-center text-xs text-foreground/60 mt-4 leading-relaxed">
                  İlk Üyelerimize Özel <span className="uppercase underline font-bold text-foreground">İNDİRİM KUPONU</span> kodunuz kayıt sonrası ekranda verilecektir.
                </p>
              </div>
            </form>
            )}
          </div>
          
        </div>
      </div>
    </div>
  )
}
