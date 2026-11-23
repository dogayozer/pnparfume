'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Trash2, Tag, Truck, Info, Users, ShieldCheck, Check, Clock, X, CreditCard, LogIn, UserCheck, AlertCircle } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useDealer } from '@/contexts/DealerContext'
import { cartDiscounts } from '@/lib/pricingConstants'
import { productLabel } from '@/lib/collections'
import { FREE_SHIPPING_FOR_ALL } from '@/lib/shippingCampaign'
import { useT, useLang, useMoney, USD_RATE } from '@/lib/i18n'

export default function CartPage() {
  const { items, removeFromCart, totalAmount, clearCart, syncRetailPrices } = useCart()
  const { isDealer } = useDealer()
  const t = useT()
  const money = useMoney()
  const lang = useLang()
  // Havale siparişi tamamlandığında (Türkiye veya yurt dışı) gösterilen banka hesabı bilgisi
  const [transferInfo, setTransferInfo] = useState<{ orderNumber: string; totalAmount: number; accounts: any[]; intl: boolean } | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card')
  const [orderNote, setOrderNote] = useState('')
  const [foreignMode, setForeignMode] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, type: string, value: number} | null>(null)
  
  // Paydaş Ekonomisi State
  const [combinedShipping, setCombinedShipping] = useState(false)
  const [friendOrderCode, setFriendOrderCode] = useState('')
  const [shippingDiscountApplied, setShippingDiscountApplied] = useState(false)
  
  // VIP Urgency State
  const [timeLeft, setTimeLeft] = useState(600) // 10:00
  const [selectedTester, setSelectedTester] = useState<string | null>(null)

  // Kargo ücreti — önceden sabit bir TL barajına (2000 TL) göre belirleniyordu.
  // Artık sepetin GERÇEK ürün maliyetine ve hedef kâr marjına göre canlı hesaplanıyor
  // (bkz. /api/shipping-rules POST, src/lib/dynamicShipping.ts) — kargoyu işletme
  // üstlense bile marj korunuyorsa ücretsiz, korunmuyorsa normal ücret alınır. Hem
  // birikmiş kupon kullanan hem sıradan alışverişler için aynı kural işler.
  const [dynamicShipping, setDynamicShipping] = useState({ freeShippingEligible: FREE_SHIPPING_FOR_ALL, shippingFee: FREE_SHIPPING_FOR_ALL ? 0 : 120 })
  const [shippingLoading, setShippingLoading] = useState(false)

  // Auth & Checkout State
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [isLoginTabOpen, setIsLoginTabOpen] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginSuccessMsg, setLoginSuccessMsg] = useState<string | null>(null)

  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    country: 'Türkiye'
  })
  
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setCurrentUser(user)
        setCheckoutForm(prev => ({
          ...prev,
          name: user.name || prev.name,
          email: user.email || prev.email,
          phone: user.phone || prev.phone,
          address: user.address || prev.address
        }))
      } catch (e) {}
    }
  }, [])

  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      })
      const data = await res.json()
      if (res.ok && data.user) {
        setCurrentUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
        setCheckoutForm(prev => ({
          ...prev,
          name: data.user.name || '',
          email: data.user.email || loginEmail,
          phone: data.user.phone || '',
          address: data.user.address || ''
        }))
        setIsLoginTabOpen(false)
        setLoginSuccessMsg(lang === 'tr' ? `Hoş geldiniz ${data.user.name || ''}! Kayıtlı bilgileriniz yüklendi.` : lang === 'ar' ? `مرحبًا ${data.user.name || ''}! تم تحميل بياناتك المحفوظة.` : `Welcome ${data.user.name || ''}! Your saved details have been loaded.`)
        setTimeout(() => setLoginSuccessMsg(null), 5000)
      } else {
        setLoginError(data.error || t("Giriş yapılamadı. E-posta ve şifrenizi kontrol ediniz.", "Could not sign in. Please check your email and password.", "تعذّر تسجيل الدخول. تحقق من البريد وكلمة المرور."))
      }
    } catch (err) {
      setLoginError(t("Bağlantı hatası oluştu. Lütfen tekrar deneyin.", "A connection error occurred. Please try again.", "حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى."))
    } finally {
      setLoginLoading(false)
    }
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paytrToken, setPaytrToken] = useState<string | null>(null)

  // PayTR official iFrameResizer auto-height integration
  useEffect(() => {
    if (paytrToken) {
      const script = document.createElement('script')
      script.src = 'https://www.paytr.com/js/iframeResizer.min.js'
      script.async = true
      script.onload = () => {
        if ((window as any).iFrameResize) {
          ;(window as any).iFrameResize({}, '#paytriframe')
        }
      }
      document.body.appendChild(script)
      return () => {
        try { document.body.removeChild(script) } catch (e) {}
      }
    }
  }, [paytrToken])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  // Hesaplamalar
  const subtotal = totalAmount

  // 2. Ürün İndirimi — bayi fiyatı zaten toptan fiyat olduğu için bayilere uygulanmaz.
  // Kupon İndirimi — yüzdelik kupon her zaman GÜNCEL ara toplamdan hesaplanır
  // (önceden kupon uygulandığı andaki tutarda donuyordu; ödeme ucu da böyle hesaplıyor).
  // 'bogo' (1 alana 1 bedava) kuponu otomatik 2. ürün %50'nin YERİNE geçer. Ödeme ucuyla aynı fonksiyon.
  const { multiItemDiscount, couponDiscount } = cartDiscounts({
    lines: items.map((i) => ({ price: i.price, quantity: i.quantity })),
    isDealer,
    coupon: appliedCoupon,
  })

  // Kargo indirimleri/kuponlar sonrası kalan tutara göre yeniden hesaplanmalı —
  // sepet, indirim veya kupon her değiştiğinde sunucudan güncel karar isteniyor.
  const discountedSubtotal = subtotal - multiItemDiscount - couponDiscount
  useEffect(() => {
    if (items.length === 0) return
    setShippingLoading(true)
    fetch('/api/shipping-rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart: items, discountedSubtotal })
    })
      .then(res => res.json())
      .then(data => {
        if (typeof data.shippingFee === 'number') {
          setDynamicShipping({ freeShippingEligible: !!data.freeShippingEligible, shippingFee: data.shippingFee })
        }
      })
      .catch(() => {})
      .finally(() => setShippingLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, discountedSubtotal])

  // Kargo Ücreti — kâr marjı bazlı dinamik karar, "Paydaş Ekonomisi" (arkadaş
  // kargosu) her zaman öncelikli olarak ücretsiz yapar.
  let shippingFee = shippingDiscountApplied ? 0 : dynamicShipping.shippingFee

  // Yurt dışı adres: kart yerine havale; kargo ücreti talep üzerine belirlenir (toplam kargosuz, kupon yok).
  const isForeign = foreignMode && !['türkiye', 'turkiye', 'turkey', 'tr'].includes(checkoutForm.country.trim().toLocaleLowerCase('tr-TR'))
  const total = isForeign ? subtotal - multiItemDiscount : subtotal - multiItemDiscount - couponDiscount + shippingFee

  // WhatsApp Manuel Sipariş Hazırlığı (Yedek olarak durabilir)
  const whatsappNumber = "902127360990"
  const cartText = items.map(i => `- ${i.quantity}x ${productLabel(i.sku)} (${i.name}) : ${i.price * i.quantity} TL`).join('%0A')
  const whatsappMessage = `Merhaba, PN Parfüm'den sipariş vermek istiyorum.%0A%0ASepetim:%0A${cartText}%0A%0A🎁 İndirimler & Kargo: -${multiItemDiscount + couponDiscount - shippingFee} TL%0A💳 Toplam Tutar: ${total} TL`
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (isForeign) {
        const sessionTokenIntl = localStorage.getItem('pn_session')
        const resIntl = await fetch('/api/orders/international', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(sessionTokenIntl ? { Authorization: `Bearer ${sessionTokenIntl}` } : {})
          },
          body: JSON.stringify({ customer: checkoutForm, cart: items, totalAmount: total, locale: lang, note: orderNote })
        })
        const dataIntl = await resIntl.json()
        if (resIntl.ok && dataIntl.success) {
          setTransferInfo({ orderNumber: dataIntl.orderNumber, totalAmount: Number(dataIntl.totalAmount) || total, accounts: dataIntl.accounts || [], intl: true })
          setOrderNote('')
          clearCart()
        } else if (resIntl.status === 409) {
          if (dataIntl.code === 'PRICE_CHANGED' && dataIntl.prices) syncRetailPrices(dataIntl.prices)
          setIsCheckoutModalOpen(false)
          alert(dataIntl.error)
        } else {
          alert(dataIntl.error || t("Sipariş oluşturulamadı.", "The order could not be created.", "تعذّر إنشاء الطلب."))
        }
        return
      }
      // Oturum token'ı: sunucu bayi fiyatını ve siparişin sahibini bununla doğruluyor.
      const sessionToken = localStorage.getItem('pn_session')
      const res = await fetch('/api/paytr/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {})
        },
        body: JSON.stringify({
          customer: checkoutForm,
          userId: JSON.parse(localStorage.getItem('user') || '{}').id || null,
          cart: items,
          totalAmount: total,
          discountApplied: multiItemDiscount + couponDiscount,
          shippingFee: shippingFee,
          couponCode: appliedCoupon?.code,
          friendOrderCode: shippingDiscountApplied ? friendOrderCode : null,
          referralCode: localStorage.getItem('pn_referral_code') || appliedCoupon?.code || null,
          paymentMethod: paymentMethod === 'transfer' ? 'bank_transfer' : 'card',
          note: orderNote,
          locale: lang
        })
      })

      const data = await res.json()
      if (data.transfer) {
        setTransferInfo({ orderNumber: data.orderNumber, totalAmount: Number(data.totalAmount) || total, accounts: data.accounts || [], intl: false })
        setOrderNote('')
        clearCart()
      } else if (data.token) {
        setPaytrToken(data.token)
      } else if (res.status === 409) {
        // Sunucu sepeti farklı fiyatladı: sepeti güncelle, müşteri yeni tutarı görüp tekrar ödesin.
        if (data.code === 'PRICE_CHANGED' && data.prices) syncRetailPrices(data.prices)
        if (data.code === 'INVALID_COUPON') setAppliedCoupon(null)
        if (data.code === 'INVALID_FRIEND_ORDER') setShippingDiscountApplied(false)
        setIsCheckoutModalOpen(false)
        alert(data.error)
      } else {
        alert(t("Ödeme başlatılırken bir hata oluştu: ", "An error occurred while starting the payment: ", "حدث خطأ أثناء بدء الدفع: ") + (data.error || t("Bilinmeyen hata", "Unknown error", "خطأ غير معروف")))
      }
    } catch (err) {
      alert(t("Sistem hatası, lütfen daha sonra tekrar deneyin.", "System error, please try again later.", "خطأ في النظام، يرجى المحاولة لاحقًا."))
    } finally {
      setIsSubmitting(false)
    }
  }

  const applyCoupon = async () => {
    if (!couponCode) return;
    
    try {
      const res = await fetch('/api/checkout/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode })
      })
      const data = await res.json()
      
      if (res.ok && data.value) {
        setAppliedCoupon({ code: couponCode.toUpperCase(), type: data.type, value: data.value })
        setCouponCode('')
      } else {
        alert(data.error || t("Geçersiz kupon kodu", "Invalid coupon code", "رمز القسيمة غير صالح"))
      }
    } catch (err) {
      alert(t("Kupon kontrol edilirken bir hata oluştu.", "An error occurred while checking the coupon.", "حدث خطأ أثناء التحقق من القسيمة."))
    }
  }

  const applyFriendOrder = () => {
    if (friendOrderCode.length > 5) {
      setShippingDiscountApplied(true)
    }
  }

  if (items.length === 0 && !transferInfo) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20 px-6 text-center">
        <h1 className="text-3xl font-light mb-4 text-foreground">{t("Sepetiniz Boş", "Your Cart is Empty", "سلتك فارغة")}</h1>
        <p className="text-foreground/60 mb-8">{t("Koku imzanızı bulmak için koleksiyonlarımızı keşfedin.", "Explore our collections to find your signature scent.", "اكتشف مجموعاتنا لتجد عطرك المميز.")}</p>
        <Link href="/katalog" className="inline-block bg-foreground text-background px-8 py-4 uppercase tracking-widest text-sm hover:bg-accent-gold transition-colors">
          {t("Alışverişe Başla", "Start Shopping", "ابدأ التسوق")}
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* VIP Urgency Banner */}
        {timeLeft > 0 && (
          <div className="mb-8 bg-gradient-to-r from-accent-gold/20 via-accent-gold/10 to-transparent border border-accent-gold/30 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-700">
            <div>
              <h2 className="text-lg font-medium text-foreground mb-1 flex items-center gap-2">
                <Clock className="text-accent-gold" size={20} /> {t("Yeni Üyeliğinize Özel Ayrıcalık", "A Privilege for Your New Membership", "امتياز خاص لعضويتك الجديدة")}
              </h2>
              <p className="text-sm text-foreground/70 font-light">
                {t("PN Parfüm kulübüne hoş geldiniz. %15 İndirim ve 1 Adet Signature Koku Deneme Boyu (Tester) hediyenizi sepetinize eklemek için size ayrılan süre:", "Welcome to the PN Parfüm club. The time reserved for you to add a 15% discount and 1 Signature scent sample (tester) gift to your cart:", "مرحبًا بك في نادي PN Parfüm. الوقت المخصص لك لإضافة خصم 15% وهدية عينة عطر مميزة إلى سلتك:")}
              </p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-4 bg-background px-6 py-3 rounded-xl border border-accent-gold/20 shadow-sm">
              <span className="text-2xl font-light tracking-widest text-accent-gold font-mono">{formatTime(timeLeft)}</span>
            </div>
          </div>
        )}

        <div className="mb-12">
          <h1 className="text-4xl font-light tracking-wide text-foreground">{t("Sepetiniz", "Your Cart", "سلتك")}</h1>
          <p className="text-foreground/60 font-light mt-2">{t("", "", "")}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Sol Kolon: Ürünler */}
          <div className="flex-1 space-y-6">
            {items.map((item) => (
              <div key={item.sku} className="flex gap-6 border-b border-foreground/10 pb-6">
                <div className="w-24 h-32 relative bg-foreground/5 rounded-md flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-light text-foreground/30 px-2 text-center">{item.sku}</span>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-medium text-foreground">
                      {item.sku.startsWith('DISCOVERY') ? item.name : productLabel(item.sku)}
                    </h3>
                    <button onClick={() => removeFromCart(item.sku)} className="text-foreground/40 hover:text-accent-rose transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-foreground/50 mb-2">{item.name}</p>

                  {/* 5'li Discovery Set Alt Liste Gösterimi */}
                  {item.selectedScents && item.selectedScents.length > 0 && (
                    <div className="my-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
                      <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">{t("Kutu İçeriği (5x10ml):", "Box Contents (5x10ml):", "محتويات الصندوق (5×10 مل):")}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-foreground/80 font-mono">
                        {item.selectedScents.map((s, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <span className="text-amber-500 font-bold">•</span> {s} (10ml)
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-auto pt-2">
                    <span className="text-lg font-light text-foreground">{money(item.price * item.quantity)}</span>
                    <span className="text-xs text-foreground/40 ml-2">({item.quantity} {t("Adet", "pcs", "قطعة")})</span>
                  </div>
                </div>
              </div>
            ))}

            {/* VIP Tester Selection */}
            {timeLeft > 0 && (
              <div className="mt-8 border border-accent-gold/20 bg-accent-gold/5 rounded-2xl p-6">
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <Tag size={18} className="text-accent-gold" /> {t("Hediye Tester Seçiminiz", "Your Free Tester Choice", "اختيار عينتك المجانية")}
                </h3>
                <p className="text-sm text-foreground/60 font-light mb-4">{t("Ayrıcalıklı süreniz dolmadan siparişinize eklenecek hediye kokuyu seçin.", "Choose the free scent to be added to your order before your privileged time runs out.", "اختر العطر المجاني الذي سيُضاف إلى طلبك قبل انتهاء وقتك المميز.")}</p>
                <div className="flex flex-wrap gap-3">
                  {['Pera Leather', 'Smyrna Fig', 'Ephesus Rose'].map(tester => (
                    <button 
                      key={tester}
                      onClick={() => setSelectedTester(tester)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${selectedTester === tester ? 'bg-accent-gold text-background border-accent-gold' : 'bg-background text-foreground/70 border-foreground/10 hover:border-accent-gold/50'}`}
                    >
                      {tester} (2ml)
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sağ Kolon: Özet & Paydaş Ekonomisi */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="bg-foreground/[0.02] border border-foreground/10 rounded-2xl p-6 lg:p-8 sticky top-32">
              <h2 className="text-xl font-medium mb-6 text-foreground">{t("Sipariş Özeti", "Order Summary", "ملخص الطلب")}</h2>
              
              {/* Hesaplamalar */}
              <div className="space-y-4 text-sm font-light text-foreground/80 mb-6 border-b border-foreground/10 pb-6">
                <div className="flex justify-between">
                  <span>{t("Ara Toplam", "Subtotal", "المجموع الفرعي")}</span>
                  <span>{money(subtotal)}</span>
                </div>
                
                {multiItemDiscount > 0 && (
                  <div className="flex justify-between text-accent-rose font-medium animate-in fade-in">
                    <span className="flex items-center gap-2"><Tag size={14} /> {t("2. Ürün %50 İndirim", "2nd item 50% off", "خصم 50% على المنتج الثاني")}</span>
                    <span>-{money(multiItemDiscount)}</span>
                  </div>
                )}
                
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-accent-rose font-medium animate-in fade-in">
                    <span className="flex items-center gap-2"><Tag size={14} /> {appliedCoupon?.type === 'bogo' ? t("1 Alana 1 Bedava", "Buy 1 Get 1 Free", "اشترِ 1 واحصل على 1 مجانًا") : t("Kupon", "Coupon", "قسيمة")} ({appliedCoupon?.code})</span>
                    <span>-{money(couponDiscount)}</span>
                  </div>
                )}
                {appliedCoupon?.type === 'bogo' && couponDiscount === 0 && (
                  <p className="text-xs text-accent-gold font-medium">{t("1 alana 1 bedava kuponunuz hazır: sepetinize bir ürün daha ekleyin, ucuz olan ürün bedava olsun.", "Your buy 1 get 1 free coupon is ready: add one more item and the cheaper one is free.", "قسيمتك جاهزة: أضف منتجًا آخر ويصبح الأرخص مجانًا.")}</p>
                )}

                <div>
                  <div className="flex justify-between items-center">
                    <span>{t("Kargo Ücreti", "Shipping", "الشحن")}</span>
                    {isForeign ? (
                      <span className="text-xs text-foreground/60 text-right max-w-[60%]">{t("Talebiniz üzerine belirlenir", "Determined on request", "يُحدَّد بناءً على طلبك")}</span>
                    ) : shippingLoading ? (
                      <span className="text-foreground/40 text-xs">{t("hesaplanıyor...", "calculating...", "جارٍ الحساب...")}</span>
                    ) : shippingFee === 0 ? (
                      <span className="text-accent-gold font-medium flex items-center gap-1">
                        <Truck size={14} /> {t("ÜCRETSİZ", "FREE", "مجاني")}
                      </span>
                    ) : (
                      <span>{money(shippingFee)}</span>
                    )}
                  </div>
                  {shippingFee === 0 && dynamicShipping.freeShippingEligible && !shippingDiscountApplied && (
                    <p className="text-[11px] text-accent-gold/80 font-medium mt-1">{t("Size Özel: Kargonuz Bizden! 🎁", "Just for you: shipping is on us! 🎁", "خاص بك: الشحن علينا! 🎁")}</p>
                  )}
                </div>
              </div>

              {/* Paydaş Ekonomisi */}
              <div className="mb-6 border-b border-foreground/10 pb-6">
                <label className="flex items-start gap-3 cursor-pointer group mb-3">
                  <input 
                    type="checkbox"
                    checked={combinedShipping}
                    onChange={(e) => setCombinedShipping(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded-sm border-foreground/30 text-accent-gold focus:ring-accent-gold bg-transparent cursor-pointer"
                  />
                  <div>
                    <span className="block font-medium text-foreground group-hover:text-accent-gold transition-colors">{t("Paydaş Ekonomisi", "Shared Shipping", "الشحن المشترك")}</span>
                    <span className="text-xs text-foreground/60 leading-relaxed">{t("Arkadaşımın siparişi ile aynı kargo paketinde gelsin. (Kargo bedava)", "Ship together with my friend's order in the same package. (Free shipping)", "يُشحن مع طلب صديقي في نفس الطرد. (شحن مجاني)")}</span>
                  </div>
                </label>
                
                {combinedShipping && !shippingDiscountApplied && (
                  <div className="flex gap-2 mt-3 animate-in slide-in-from-top-2 duration-300">
                    <div className="relative flex-1">
                      <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                      <input 
                        type="text" 
                        value={friendOrderCode}
                        onChange={(e) => setFriendOrderCode(e.target.value)}
                        placeholder={t("Arkadaşının Sipariş No (Örn: PN-12345)", "Your friend's order no. (e.g. PN-12345)", "رقم طلب صديقك (مثال: PN-12345)")} 
                        className="w-full bg-background border border-foreground/20 rounded-md py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-accent-gold text-foreground placeholder:text-foreground/30"
                      />
                    </div>
                    <button 
                      onClick={applyFriendOrder}
                      className="bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium hover:bg-accent-gold transition-colors"
                    >
                      {t("Uygula", "Apply", "تطبيق")}
                    </button>
                  </div>
                )}

                {shippingDiscountApplied && (
                  <div className="mt-3 p-3 bg-accent-gold/10 border border-accent-gold/20 rounded-md flex items-start gap-2 text-sm text-accent-gold animate-in fade-in">
                    <Check size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{t("Harika! Siparişiniz", "Great! Your order will be combined with package", "رائع! سيُدمج طلبك مع الطرد")} <strong>{friendOrderCode}</strong> {t("numaralı paketle birleştirilecek ve kargo ücreti ödemeyeceksiniz.", "and you will not pay shipping.", "ولن تدفع رسوم الشحن.")}</span>
                  </div>
                )}
              </div>

              {/* Kupon Kodu */}
              <div className="mb-8">
                <p className="text-xs uppercase tracking-widest text-foreground/50 mb-3">{t("İndirim Kodu / Cüzdan Bakiyesi", "Discount Code / Wallet Balance", "رمز الخصم / رصيد المحفظة")}</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder={t("Kod giriniz", "Enter code", "أدخل الرمز")} 
                    className="flex-1 bg-background border border-foreground/20 rounded-md py-3 px-4 text-sm focus:outline-none focus:border-accent-gold text-foreground placeholder:text-foreground/30 uppercase"
                  />
                  <button 
                    onClick={applyCoupon}
                    className="bg-foreground/10 text-foreground px-6 py-3 rounded-md text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
                  >
                    {t("Ekle", "Add", "إضافة")}
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-end mb-8">
                <span className="text-lg font-medium text-foreground">{t("Toplam", "Total", "الإجمالي")}</span>
                <div className="text-right">
                  <span className="text-4xl font-light text-foreground">{money(total)}</span>
                </div>
              </div>

              <button 
                onClick={() => setIsCheckoutModalOpen(true)}
                className="w-full flex items-center justify-center gap-3 bg-foreground text-background py-5 uppercase tracking-widest text-sm font-medium hover:bg-accent-gold transition-colors rounded-xl shadow-lg"
              >
                {t("Kredi Kartı İle Güvenli Öde", "Secure Checkout", "الدفع الآمن")}
              </button>

              <div className="flex items-center justify-center gap-2 mt-6 text-xs text-foreground/40">
                <ShieldCheck size={14} /> {t("Manuel Onaylı Güvenli Sipariş", "Manually Verified Secure Order", "طلب آمن بمراجعة يدوية")}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-2 sm:p-4">
          <div className={`bg-background border border-foreground/10 rounded-2xl w-full ${paytrToken ? 'max-w-3xl h-[94vh] sm:h-[90vh]' : 'max-w-2xl max-h-[90vh]'} flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden`}>
            <div className="sticky top-0 bg-background border-b border-foreground/10 px-6 py-4 flex justify-between items-center z-10 flex-shrink-0">
              <h2 className="text-xl font-medium flex items-center gap-2">
                <CreditCard size={20} className="text-accent-gold" /> {t("Güvenli Ödeme", "Secure Payment", "دفع آمن")}
              </h2>
              <button 
                onClick={() => {
                  setIsCheckoutModalOpen(false)
                  setPaytrToken(null)
                  setTransferInfo(null)
                }}
                className="p-2 text-foreground/50 hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-3 sm:p-6 overflow-y-auto flex-1 flex flex-col">
              {paytrToken ? (
                <div className="w-full flex-1 min-h-[700px] sm:min-h-[780px] bg-background">
                  <iframe
                    src={`https://www.paytr.com/odeme/guvenli/${paytrToken}`}
                    id="paytriframe"
                    frameBorder="0"
                    scrolling="yes"
                    className="w-full rounded-xl"
                    style={{ width: '100%', minHeight: '750px', height: '100%', border: 'none' }}
                  ></iframe>
                </div>
              ) : (
                transferInfo ? (
                  <div className="py-8 px-2 sm:px-4 text-center space-y-4">
                    <div className="mx-auto w-14 h-14 rounded-full bg-accent-gold/15 flex items-center justify-center"><Check size={28} className="text-accent-gold" /></div>
                    <h3 className="text-2xl font-light">{t("Siparişiniz alındı", "Your order has been received", "تم استلام طلبك")}</h3>
                    <p className="text-sm text-foreground/70">{t("Sipariş no:", "Order no:", "رقم الطلب:")} <strong>{transferInfo.orderNumber}</strong></p>
                    <p className="text-sm text-foreground/70">
                      {transferInfo.intl
                        ? t("Ürün toplamı (kargo hariç):", "Products total (excluding shipping):", "إجمالي المنتجات (بدون الشحن):")
                        : t("Ödenecek tutar:", "Amount due:", "المبلغ المطلوب:")}{' '}
                      <strong>{transferInfo.intl ? money(transferInfo.totalAmount) : `${transferInfo.totalAmount} TL`}</strong>
                    </p>
                    <p className="text-sm text-foreground/70 max-w-md mx-auto leading-relaxed">
                      {transferInfo.intl
                        ? t("Ödeme havale ile yapılır. Yurt dışı gönderilerde kargo ücreti talebiniz üzerine belirlenir ve tarafınıza en kısa sürede e-posta gönderilir.", "Payment is made by bank transfer. For shipments abroad, the shipping cost is determined on request and we will email you as soon as possible.", "يتم الدفع بالتحويل البنكي. في الشحنات الدولية تُحدَّد تكلفة الشحن بناءً على طلبك وسنرسل لك بريدًا إلكترونيًا في أقرب وقت.")
                        : t("Aşağıdaki hesaba havale/EFT yapın. Ödemeniz hesabımıza ulaşınca siparişiniz hazırlanır ve kargoya verilir.", "Please make a bank transfer to the account below. Your order is prepared and shipped once the payment reaches our account.", "يرجى التحويل إلى الحساب أدناه. يتم تجهيز طلبك وشحنه عند وصول الدفعة إلى حسابنا.")}
                    </p>
                    {transferInfo.accounts.length > 0 ? (
                      <div className="space-y-3 text-left max-w-md mx-auto" dir="ltr">
                        {transferInfo.accounts.map((a: any, idx: number) => (
                          <div key={idx} className="border border-foreground/10 rounded-xl p-4 bg-foreground/[0.02] text-sm space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{a.bankName}</span>
                              <span className="text-xs bg-accent-gold/15 text-accent-gold px-2 py-0.5 rounded-full font-semibold">{a.currency}</span>
                            </div>
                            <div className="text-foreground/70"><span dir="auto">{t("Hesap sahibi", "Account holder", "اسم صاحب الحساب")}:</span> {a.accountHolder}</div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-[13px] break-all select-all">{String(a.iban).replace(/(.{4})/g, '$1 ').trim()}</span>
                              <button
                                type="button"
                                onClick={() => { try { navigator.clipboard.writeText(String(a.iban)) } catch {} }}
                                className="text-xs text-accent-gold hover:underline flex-shrink-0"
                              >
                                {t("Kopyala", "Copy", "نسخ")}
                              </button>
                            </div>
                            {a.swift && <div className="text-foreground/70">SWIFT/BIC: {a.swift}</div>}
                            {a.branch && <div className="text-foreground/70"><span dir="auto">{t("Şube", "Branch", "الفرع")}:</span> {a.branch}</div>}
                            {a.note && <div className="text-xs text-foreground/60">{a.note}</div>}
                          </div>
                        ))}
                        <p className="text-xs text-foreground/60 text-center">
                          {t("Havale açıklamasına sipariş numaranızı yazmayı unutmayın:", "Please include your order number in the transfer description:", "يرجى كتابة رقم طلبك في وصف التحويل:")} <strong>{transferInfo.orderNumber}</strong>
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-foreground/60 max-w-md mx-auto">
                        {t("Banka hesap bilgileri e-posta ile size iletilecektir.", "Our bank account details will be sent to you by email.", "سنرسل لك بيانات الحساب البنكي عبر البريد الإلكتروني.")}
                      </p>
                    )}
                    <p className="text-xs text-foreground/50">{t("Bu bilgiler e-posta adresinize de gönderildi.", "These details were also sent to your email address.", "تم إرسال هذه البيانات أيضًا إلى بريدك الإلكتروني.")}</p>
                    <Link href="/katalog" onClick={() => { setIsCheckoutModalOpen(false); setTransferInfo(null) }} className="inline-block bg-foreground text-background px-6 py-3 rounded-lg text-sm hover:bg-accent-gold transition-colors">{t("Alışverişe devam et", "Continue shopping", "متابعة التسوق")}</Link>
                  </div>
                ) : (
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  {/* Member Login Switch / Success Alert */}
                  {currentUser ? (
                    <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 text-emerald-400 font-medium">
                        <UserCheck size={16} />
                        <span><strong>{currentUser.name || currentUser.email}</strong> {t("hesabınızla işlem yapıyorsunuz.", "you are checking out with your account.", "أنت تُكمل الطلب بحسابك.")}</span>
                      </div>
                      <span className="text-[11px] text-foreground/50 hidden sm:inline">{t("Kayıtlı adresiniz yüklendi ✓", "Saved address loaded ✓", "تم تحميل عنوانك المحفوظ ✓")}</span>
                    </div>
                  ) : (
                    <div>
                      {loginSuccessMsg && (
                        <div className="mb-3 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                          <UserCheck size={14} /> {loginSuccessMsg}
                        </div>
                      )}

                      {!isLoginTabOpen ? (
                        <div className="bg-gradient-to-r from-accent-gold/15 via-accent-gold/5 to-transparent border border-accent-gold/30 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                              <LogIn size={15} className="text-accent-gold" /> {t("Zaten bir hesabınız var mı?", "Already have an account?", "هل لديك حساب بالفعل؟")}
                            </div>
                            <p className="text-[11px] text-foreground/60 font-light mt-0.5">
                              {t("Giriş yaparak kayıtlı adresinizi otomatik doldurabilir ve siparişinizi profilinizden takip edebilirsiniz.", "Sign in to fill in your saved address automatically and track your order from your profile.", "سجّل الدخول لملء عنوانك المحفوظ تلقائيًا وتتبع طلبك من ملفك الشخصي.")}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsLoginTabOpen(true)}
                            className="px-4 py-2 bg-foreground text-background text-xs font-semibold rounded-lg hover:bg-accent-gold transition-colors flex-shrink-0"
                          >
                            {t("Hızlı Üye Girişi Yap", "Quick Sign In", "تسجيل دخول سريع")}
                          </button>
                        </div>
                      ) : (
                        <div className="p-4 sm:p-5 bg-foreground/[0.03] border border-foreground/15 rounded-xl space-y-3 animate-in fade-in zoom-in-95 duration-200">
                          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
                            <LogIn size={15} className="text-accent-gold" /> {t("Hızlı Üye Girişi", "Quick Sign In", "تسجيل دخول سريع")}
                          </h3>

                          {loginError && (
                            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                              <AlertCircle size={14} /> {loginError}
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-medium text-foreground/70 block mb-1">{t("E-Posta Adresi", "Email Address", "البريد الإلكتروني")}</label>
                              <input
                                type="email"
                                value={loginEmail}
                                onChange={e => setLoginEmail(e.target.value)}
                                placeholder="ornek@mail.com"
                                className="w-full bg-background border border-foreground/15 rounded-lg p-2.5 text-xs text-foreground focus:border-accent-gold outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-foreground/70 block mb-1">{t("Şifre", "Password", "كلمة المرور")}</label>
                              <input
                                type="password"
                                value={loginPassword}
                                onChange={e => setLoginPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-background border border-foreground/15 rounded-lg p-2.5 text-xs text-foreground focus:border-accent-gold outline-none"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-3 pt-1">
                            <button
                              type="button"
                              onClick={() => setIsLoginTabOpen(false)}
                              className="text-xs text-foreground/50 hover:text-foreground underline"
                            >
                              {t("Misafir olarak devam et", "Continue as guest", "المتابعة كضيف")}
                            </button>

                            <button
                              type="button"
                              onClick={handleInlineLogin}
                              disabled={loginLoading || !loginEmail || !loginPassword}
                              className="px-4 py-2 bg-accent-gold text-background rounded-lg text-xs font-bold hover:bg-accent-gold/90 transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                            >
                              {loginLoading ? t("Giriş Yapılıyor...", "Signing in...", "جارٍ تسجيل الدخول...") : t("Giriş Yap ve Bilgilerimi Yükle", "Sign In & Load My Details", "تسجيل الدخول وتحميل بياناتي")}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-foreground/60">{isForeign ? t("Siparişinizi tamamlamak için teslimat bilgilerinizi kontrol ediniz.", "Please check your delivery details to complete your order.", "يرجى التحقق من بيانات التسليم لإتمام طلبك.") : t("Siparişinizi tamamlamak için teslimat ve fatura bilgilerinizi kontrol ediniz. (3D Secure ile güvenle korunmaktadır)", "Please check your delivery and billing details to complete your order. (Protected with 3D Secure)", "يرجى التحقق من بيانات التسليم والفوترة لإتمام طلبك. (محمي بتقنية 3D Secure)")}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t("Ad Soyad", "Full Name", "الاسم الكامل")}</label>
                      <input 
                        required 
                        type="text" 
                        value={checkoutForm.name}
                        onChange={e => setCheckoutForm({...checkoutForm, name: e.target.value})}
                        className="w-full bg-foreground/[0.02] border border-foreground/10 rounded-lg p-3 text-sm focus:border-accent-gold outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t("Telefon", "Phone", "الهاتف")}</label>
                      <input 
                        required 
                        type="tel" 
                        value={checkoutForm.phone}
                        onChange={e => setCheckoutForm({...checkoutForm, phone: e.target.value})}
                        className="w-full bg-foreground/[0.02] border border-foreground/10 rounded-lg p-3 text-sm focus:border-accent-gold outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("E-Posta Adresi", "Email Address", "البريد الإلكتروني")}</label>
                    <input 
                      required 
                      type="email" 
                      value={checkoutForm.email}
                      onChange={e => setCheckoutForm({...checkoutForm, email: e.target.value})}
                      className="w-full bg-foreground/[0.02] border border-foreground/10 rounded-lg p-3 text-sm focus:border-accent-gold outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("Ülke", "Country", "الدولة")}</label>
                    <select
                      value={foreignMode ? 'OTHER' : 'TR'}
                      onChange={e => { const other = e.target.value === 'OTHER'; setForeignMode(other); setCheckoutForm({...checkoutForm, country: other ? '' : 'Türkiye'}) }}
                      className="w-full bg-foreground/[0.02] border border-foreground/10 rounded-lg p-3 text-sm focus:border-accent-gold outline-none"
                    >
                      <option value="TR">Türkiye</option>
                      <option value="OTHER">{t("Diğer / Yurt dışı", "Other / International", "دولة أخرى / خارج تركيا")}</option>
                    </select>
                    {foreignMode && (
                      <input
                        required
                        type="text"
                        value={checkoutForm.country}
                        onChange={e => setCheckoutForm({...checkoutForm, country: e.target.value})}
                        placeholder={t("Ülke adı", "Country name", "اسم الدولة")}
                        className="w-full bg-foreground/[0.02] border border-foreground/10 rounded-lg p-3 text-sm focus:border-accent-gold outline-none"
                      />
                    )}
                  </div>

                  {isForeign && (
                    <div className="p-3.5 bg-accent-gold/10 border border-accent-gold/30 rounded-xl text-xs text-foreground/80 leading-relaxed space-y-1.5">
                      <p><strong>{t("Yurt dışı siparişi:", "International order:", "طلب دولي:")}</strong> {t("Ödeme havale ile yapılır.", "Payment is made by bank transfer.", "يتم الدفع بالتحويل البنكي.")}</p>
                      <p>{t("Yurt dışı gönderilerde kargo ücreti talebiniz üzerine belirlenir ve tarafınıza en kısa sürede e-posta gönderilir.", "For shipments abroad, the shipping cost is determined on request and we will email you as soon as possible.", "في الشحنات الدولية تُحدَّد تكلفة الشحن بناءً على طلبك وسنرسل لك بريدًا إلكترونيًا في أقرب وقت.")}</p>
                      <p className="text-foreground/50">{t("Bu siparişlerde kupon kodu uygulanmaz. Fiyatlar Türk Lirası (TRY) cinsindendir.", `Coupon codes do not apply to these orders. Prices are shown in US dollars (1 USD = ${USD_RATE} TL).`, `لا تُطبَّق رموز الخصم على هذه الطلبات. الأسعار بالدولار الأمريكي (1 دولار = ${USD_RATE} ليرة).`)}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("Teslimat Adresi", "Delivery Address", "عنوان التسليم")}</label>
                    <textarea 
                      required 
                      rows={3}
                      value={checkoutForm.address}
                      onChange={e => setCheckoutForm({...checkoutForm, address: e.target.value})}
                      className="w-full bg-foreground/[0.02] border border-foreground/10 rounded-lg p-3 text-sm focus:border-accent-gold outline-none resize-none"
                    />
                  </div>

                  {!isForeign && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t("Ödeme Yöntemi", "Payment Method", "طريقة الدفع")}</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {([
                          ['card', t("Kredi / Banka Kartı", "Credit / Debit Card", "بطاقة ائتمان / خصم")],
                          ['transfer', t("Banka Havalesi / EFT", "Bank Transfer / EFT", "تحويل بنكي / EFT")],
                        ] as const).map(([key, label]) => (
                          <label key={key} className={`flex items-center gap-2 border rounded-lg p-3 text-sm cursor-pointer transition-colors ${paymentMethod === key ? 'border-accent-gold bg-accent-gold/10' : 'border-foreground/10 hover:border-foreground/30'}`}>
                            <input type="radio" name="paymentMethod" checked={paymentMethod === key} onChange={() => setPaymentMethod(key)} className="accent-[var(--color-accent-gold,#c9a45c)]" />
                            {label}
                          </label>
                        ))}
                      </div>
                      {paymentMethod === 'transfer' && (
                        <p className="text-xs text-foreground/60 leading-relaxed">
                          {t("Siparişi tamamladıktan sonra banka hesap bilgileri ekranda gösterilir ve e-posta adresinize gönderilir. Ödemeniz hesabımıza ulaşınca siparişiniz hazırlanır.", "After placing the order, the bank account details are shown on screen and emailed to you. Your order is prepared once the payment reaches our account.", "بعد إتمام الطلب تظهر بيانات الحساب البنكي على الشاشة وتُرسل إلى بريدك الإلكتروني. يتم تجهيز طلبك عند وصول الدفعة إلى حسابنا.")}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("Sipariş Açıklaması (isteğe bağlı)", "Order Notes (optional)", "ملاحظات الطلب (اختياري)")}</label>
                    <textarea
                      rows={4}
                      maxLength={1000}
                      value={orderNote}
                      onChange={e => setOrderNote(e.target.value)}
                      placeholder={t("Teslimat, fatura veya özel isteklerinizi buraya yazabilirsiniz (ör. teslimat saati, fatura notu, hediye paketi).", "You can write your delivery, invoice or special requests here (e.g. delivery time, invoice note, gift wrapping).", "يمكنك كتابة طلبات التسليم أو الفاتورة أو أي طلبات خاصة هنا (مثل وقت التسليم أو ملاحظة الفاتورة أو تغليف الهدايا).")}
                      className="w-full bg-foreground/[0.02] border border-foreground/10 rounded-lg p-3 text-sm focus:border-accent-gold outline-none resize-none"
                    />
                    <div className="text-[11px] text-foreground/40 text-right">{orderNote.length}/1000</div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input 
                        required
                        type="checkbox" 
                        className="mt-1 w-4 h-4 rounded border-foreground/20 text-accent-gold focus:ring-accent-gold focus:ring-offset-background"
                      />
                      <span className="text-xs text-foreground/70 leading-relaxed">
                        {lang === 'tr' ? (<><a href="/sozlesmeler.html" target="_blank" className="text-accent-gold hover:underline">Mesafeli Satış Sözleşmesi</a> ve <a href="/sozlesmeler.html" target="_blank" className="text-accent-gold hover:underline">Ön Bilgilendirme Formu</a>'nu okudum, onaylıyorum. (Cayma hakkı istisnalarını kabul ediyorum).</>) : (<>{lang === 'ar' ? 'لقد قرأت ووافقت على' : 'I have read and agree to the'} <a href="/sozlesmeler.html" target="_blank" className="text-accent-gold hover:underline">{lang === 'ar' ? 'عقد البيع عن بُعد' : 'Distance Sales Agreement'}</a> {lang === 'ar' ? 'و' : 'and'} <a href="/sozlesmeler.html" target="_blank" className="text-accent-gold hover:underline">{lang === 'ar' ? 'نموذج المعلومات المسبقة' : 'Preliminary Information Form'}</a>.</>)}
                      </span>
                    </label>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-accent-gold text-background py-4 uppercase tracking-widest text-sm font-medium rounded-lg hover:bg-accent-gold/90 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? t("Hazırlanıyor...", "Processing...", "جارٍ التحضير...") : isForeign ? t(`Siparişi Tamamla (${total} TL)`, `Place Order (${money(total)})`, `إتمام الطلب (${money(total)})`) : paymentMethod === 'transfer' ? t(`Siparişi Tamamla (${total} TL)`, `Place Order (${total} TL)`, `إتمام الطلب (${total} ليرة)`) : t(`Ödemeye Geç (${total} TL)`, `Proceed to Payment (${money(total)})`, `المتابعة إلى الدفع (${money(total)})`)}
                    </button>
                  </div>
                </form>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
