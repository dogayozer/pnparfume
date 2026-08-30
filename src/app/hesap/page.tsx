'use client'

import Link from 'next/link'
import { ArrowLeft, Eye, EyeOff, Copy, Check } from 'lucide-react'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

// useSearchParams() bir Suspense sınırı içinde olmadan build'i kırıyordu ("Error
// occurred prerendering page /hesap") — Next.js bunu statik olarak önceden
// oluşturamıyor. Asıl sayfayı ayrı bir bileşene taşıyıp dışarıdan Suspense'e sarıyoruz.
export default function AccountPage() {
  return (
    <Suspense fallback={null}>
      <AccountPageInner />
    </Suspense>
  )
}

function AccountPageInner() {
  // Login State
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPwd, setShowLoginPwd] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Signup State
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // QR kutu sayfasından (/hosgeldin) "Kurucu Üyeliğimi Tamamla" ile gelen müşterinin
  // az önce bıraktığı telefon numarasını burada tekrar yazdırmıyoruz — form baştan
  // dolu geliyor, "üyelik formunu doldurmaktan üşenme" sürtünmesini azaltıyor.
  const searchParams = useSearchParams()
  useEffect(() => {
    const qrPhone = searchParams.get('phone')
    if (qrPhone) setPhone(qrPhone)
  }, [searchParams])

  const [birthYear, setBirthYear] = useState('')
  const [birthMonthDay, setBirthMonthDay] = useState('')
  const [profession, setProfession] = useState('')
  const [referralCodeInput, setReferralCodeInput] = useState('')

  // Navbar zaten ?ref= veya ?elci= linkiyle gelenlerin kodunu localStorage'a
  // yazıyor (pn_referral_code) — üyelik formunda varsa otomatik dolduruyoruz,
  // kullanıcı isterse elle de değiştirebilir/silebilir.
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pn_referral_code')
      if (saved) setReferralCodeInput(saved)
    } catch {}
  }, [])
  
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showRegPwd, setShowRegPwd] = useState(false)
  const [showRegPwdConfirm, setShowRegPwdConfirm] = useState(false)
  
  const [termsConsent, setTermsConsent] = useState(false)
  const [emailConsent, setEmailConsent] = useState(false)
  const [smsConsent, setSmsConsent] = useState(false)
  const [wantsSalesRep, setWantsSalesRep] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [ownReferralCode, setOwnReferralCode] = useState('')
  const [referralBonusApplied, setReferralBonusApplied] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    
    if (!loginEmail || !loginPassword) {
      setLoginError('Lütfen e-posta ve şifrenizi girin.')
      return
    }

    setLoginLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Giriş yapılamadı.')
      }
      
      localStorage.setItem('user', JSON.stringify(data.user))
      // Bu token olmadan /api/user/* ve ilişkili uçlar artık isteği reddediyor —
      // hesap sahipliği artık gerçekten doğrulanıyor (bkz. src/lib/customerAuth.ts).
      if (data.token) localStorage.setItem('pn_session', data.token)
      window.location.href = '/profil'
    } catch (err: any) {
      setLoginError(err.message)
    } finally {
      setLoginLoading(false)
    }
  }

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

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.')
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
          firstName, lastName, email, phone,
          birthYear: parseInt(birthYear),
          birthDate: birthMonthDay || null,
          profession: profession || null,
          password, emailConsent, smsConsent,
          referralCode: referralCodeInput.trim() || null,
          wantsSalesRep
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Kayıt sırasında bir hata oluştu.')
      }

      // Auto login after register
      localStorage.setItem('user', JSON.stringify(data.user))
      if (data.token) localStorage.setItem('pn_session', data.token)
      // Referans kodu kullanıldıysa artık gereksiz — bir sonraki siparişte tekrar
      // uygulanıp mükerrer bonusa yol açmasın diye temizliyoruz.
      if (data.referralBonusApplied) localStorage.removeItem('pn_referral_code')
      setSuccess(true)
      setCouponCode(data.coupon)
      setOwnReferralCode(data.user?.referral_code || '')
      setReferralBonusApplied(Boolean(data.referralBonusApplied))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(couponCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
            
            <form onSubmit={handleLogin} className="space-y-8 flex-1 flex flex-col">
              {loginError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-xl text-sm">
                  {loginError}
                </div>
              )}
              <div className="flex flex-col">
                <label htmlFor="loginEmail" className="text-xs uppercase tracking-widest text-foreground/60 mb-2">E-posta adresi</label>
                <input 
                  id="loginEmail"
                  name="email"
                  type="email" 
                  autoComplete="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent-gold transition-colors"
                  placeholder="isim@ornek.com"
                />
              </div>
              
              <div className="flex flex-col">
                <label htmlFor="loginPassword" className="text-xs uppercase tracking-widest text-foreground/60 mb-2">Şifre</label>
                <div className="relative">
                  <input 
                    id="loginPassword"
                    name="password"
                    type={showLoginPwd ? "text" : "password"}
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent-gold transition-colors pr-10"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowLoginPwd(!showLoginPwd)} className="absolute right-0 top-2 text-foreground/40 hover:text-foreground transition-colors">
                    {showLoginPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-start">
                <a href="#" className="text-xs underline text-foreground/60 hover:text-accent-rose transition-colors">Şifreni mi unuttun?</a>
              </div>
              
              <div className="pt-6 mt-auto">
                <button type="submit" disabled={loginLoading} className="w-full bg-foreground text-background py-4 uppercase tracking-widest text-sm font-medium hover:bg-accent-gold transition-colors disabled:opacity-50">
                  {loginLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
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
                  <Check size={32} />
                </div>
                <h2 className="text-2xl font-light">Aramıza Hoş Geldiniz!</h2>
                <p className="text-foreground/70 leading-relaxed max-w-sm">
                  Üyeliğiniz başarıyla oluşturuldu ve sisteme giriş yapıldı. PN Parfüm ayrıcalıklarını keşfetmeye başlayabilirsiniz.
                </p>
                <div className="bg-foreground/5 p-6 rounded-2xl border border-foreground/10 w-full mt-4">
                  <p className="text-sm uppercase tracking-widest text-foreground/60 mb-2">İlk Üyeliğe Özel Kuponunuz</p>
                  
                  <div className="flex items-center justify-center gap-4 mt-2">
                    <p className="text-3xl font-medium tracking-wider text-accent-gold">{couponCode}</p>
                    <button 
                      onClick={copyCode}
                      className="w-10 h-10 bg-foreground/10 text-foreground rounded-lg flex items-center justify-center hover:bg-accent-gold hover:text-white transition-colors"
                      title="Kodu Kopyala"
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                  {copied && <p className="text-xs text-accent-gold mt-2">Kopyalandı!</p>}
                </div>

                {referralBonusApplied && (
                  <div className="bg-accent-gold/10 border border-accent-gold/20 p-4 rounded-2xl w-full text-sm text-foreground/80">
                    🎁 Referans kodu kullanıldı — sizi davet eden üye de bir indirim kuponu kazandı, size özel ek bir kupon da hesabınıza tanımlandı. İkisini de <Link href="/profil" className="underline underline-offset-4 text-accent-gold">Profilim</Link> sayfasından görebilirsiniz.
                  </div>
                )}

                {ownReferralCode && (
                  <div className="bg-foreground/5 p-5 rounded-2xl border border-foreground/10 w-full">
                    <p className="text-xs uppercase tracking-widest text-foreground/60 mb-1">Kendi Referans Kodunuz</p>
                    <p className="text-lg font-medium tracking-wider text-accent-gold font-mono">{ownReferralCode}</p>
                    <p className="text-[11px] text-foreground/50 mt-1">Arkadaşlarınıza bu kodu verin, ikiniz de kazanın.</p>
                  </div>
                )}

                <Link href="/profil" className="mt-8 border border-foreground text-foreground px-8 py-3 uppercase tracking-widest text-sm font-medium hover:bg-foreground hover:text-background transition-colors inline-block">
                  Profilime Git
                </Link>
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
                  <label htmlFor="firstName" className="text-xs uppercase tracking-widest text-foreground/60 mb-2">Ad</label>
                  <input 
                    id="firstName"
                    name="firstName"
                    autoComplete="given-name"
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent-gold transition-colors"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="lastName" className="text-xs uppercase tracking-widest text-foreground/60 mb-2">Soyad</label>
                  <input 
                    id="lastName"
                    name="lastName"
                    autoComplete="family-name"
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent-gold transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex flex-col">
                <label htmlFor="registerEmail" className="text-xs uppercase tracking-widest text-foreground/60 mb-2">E-posta adresi</label>
                <input 
                  id="registerEmail"
                  name="registerEmail"
                  autoComplete="email"
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent-gold transition-colors"
                />
              </div>
              
              <div className="flex flex-col">
                <label htmlFor="registerPhone" className="text-xs uppercase tracking-widest text-foreground/60 mb-2">Telefon Numarası</label>
                <input 
                  id="registerPhone"
                  name="registerPhone"
                  autoComplete="tel"
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent-gold transition-colors"
                  placeholder="0 (5XX) XXX XX XX"
                />
              </div>

              <div className="bg-accent-gold/5 border border-accent-gold/15 rounded-2xl px-4 py-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-accent-gold mb-1.5">
                  Satın Al &rarr; Memnun Ol &rarr; Tavsiye Et &rarr; Kazan
                </p>
                <p className="text-[11px] text-foreground/60 leading-relaxed">
                  Kazandığınız kuponları ürüne dönüştürebilir, yeni gelen kokularımızı satışa çıkmadan önce test etme şansını yakalayabilirsiniz.
                </p>
              </div>

              <div className="flex flex-col">
                <label htmlFor="referralCode" className="text-xs uppercase tracking-widest text-foreground/60 mb-2 flex items-center justify-between">
                  Referans Kodu veya Telefon Numarası <span className="text-[10px] text-foreground/40 normal-case tracking-normal">Opsiyonel</span>
                </label>
                <input
                  id="referralCode"
                  name="referralCode"
                  type="text"
                  value={referralCodeInput}
                  onChange={(e) => setReferralCodeInput(e.target.value.toUpperCase())}
                  className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent-gold transition-colors font-mono tracking-wider"
                  placeholder="Örn: 0532 123 45 67 veya PN-AYSE123"
                />
                <p className="text-[10px] text-foreground/50 mt-1 leading-tight">Sizi tavsiye eden bir arkadaşınızın telefon numarasını ya da bir elçimizin kodunu girin — ikiniz de hediye kazanır.</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label htmlFor="birthYear" className="text-xs uppercase tracking-widest text-foreground/60 mb-2">Doğum Yılı *</label>
                  <input 
                    id="birthYear"
                    name="bday-year"
                    type="number" 
                    min="1920" max="2015"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent-gold transition-colors"
                    placeholder="YYYY"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="birthMonthDay" className="text-xs uppercase tracking-widest text-foreground/60 mb-2 flex items-center justify-between">
                    Doğum Günü <span className="text-[10px] text-foreground/40 normal-case tracking-normal">Opsiyonel</span>
                  </label>
                  <input 
                    id="birthMonthDay"
                    name="bday-day"
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
                <label htmlFor="profession" className="text-xs uppercase tracking-widest text-foreground/60 mb-2 flex items-center justify-between">
                  Meslek <span className="text-[10px] text-foreground/40 normal-case tracking-normal">Opsiyonel</span>
                </label>
                <input 
                  id="profession"
                  name="organization-title"
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
                  <label htmlFor="registerPassword" className="text-xs uppercase tracking-widest text-foreground/60 mb-2">Şifre</label>
                  <div className="relative">
                     <input 
                       id="registerPassword"
                       name="registerPassword"
                       autoComplete="new-password"
                       type={showRegPwd ? "text" : "password"}
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent-gold transition-colors pr-10"
                     />
                     <button type="button" onClick={() => setShowRegPwd(!showRegPwd)} className="absolute right-0 top-2 text-foreground/40 hover:text-foreground transition-colors">
                       {showRegPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                     </button>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="registerPasswordConfirm" className="text-xs uppercase tracking-widest text-foreground/60 mb-2">Şifre Tekrar</label>
                   <div className="relative">
                     <input 
                       id="registerPasswordConfirm"
                       name="registerPasswordConfirm"
                       autoComplete="new-password"
                       type={showRegPwdConfirm ? "text" : "password"}
                       value={passwordConfirm}
                       onChange={(e) => setPasswordConfirm(e.target.value)}
                       className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent-gold transition-colors pr-10"
                     />
                     <button type="button" onClick={() => setShowRegPwdConfirm(!showRegPwdConfirm)} className="absolute right-0 top-2 text-foreground/40 hover:text-foreground transition-colors">
                       {showRegPwdConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                     </button>
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
                <label className="flex items-start gap-3 cursor-pointer group bg-accent-gold/5 border border-accent-gold/15 rounded-xl px-3 py-2.5 -mx-3">
                  <input type="checkbox" checked={wantsSalesRep} onChange={(e) => setWantsSalesRep(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-foreground/30 text-accent-gold focus:ring-accent-gold bg-transparent cursor-pointer" />
                  <span className="text-xs text-foreground/80 group-hover:text-foreground transition-colors leading-relaxed">
                    <strong>Satış Temsilcisi olmak istiyorum</strong> — sizinle iletişime geçelim.
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
                  İlk üyelerimize özel <span className="uppercase underline font-bold text-foreground">İNDİRİM KUPONU</span> kodunuz kayıt sonrası ekranda verilecektir.
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
