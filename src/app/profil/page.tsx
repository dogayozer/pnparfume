'use client'

import { useState, useEffect } from 'react'
import { useT } from '@/lib/i18n'
import Link from 'next/link'
import { 
  ArrowLeft, Wallet, Gift, Users, Copy, Check, Package, Clock, 
  ShieldCheck, Info, Lock, AlertCircle, Eye, EyeOff, Share2, 
  MessageCircle, TrendingUp, Sparkles, Award, DollarSign, 
  RefreshCw, Send, CheckCircle2, ChevronRight, ExternalLink, Tag, LogOut
} from 'lucide-react'

export default function ProfilePage() {
  const t = useT()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'ozet' | 'kuponlar' | 'siparisler' | 'b2b' | 'ayarlar'>('ozet')
  const [orderSubTab, setOrderSubTab] = useState<'aktif' | 'gecmis'>('aktif')
  
  // Address Update State
  const [addressData, setAddressData] = useState({ phone: '', address: '' })
  const [addressMsg, setAddressMsg] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [addressLoading, setAddressLoading] = useState(false)

  // Password Change State
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' })
  const [pwdMsg, setPwdMsg] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [pwdLoading, setPwdLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  // State for order address update
  const [orders, setOrders] = useState<any[]>([])
  const [referredOrders, setReferredOrders] = useState<any[]>([])
  const [editingOrderAddr, setEditingOrderAddr] = useState<string | null>(null)
  const [newOrderAddr, setNewOrderAddr] = useState('')
  const [orderAddrMsg, setOrderAddrMsg] = useState<{type: 'success' | 'error', text: string} | null>(null)

  // Ambassador (Affiliate) States
  const [copiedRefCode, setCopiedRefCode] = useState(false)
  const [copiedRefLink, setCopiedRefLink] = useState(false)
  const [applyInstagram, setApplyInstagram] = useState('')
  const [applyType, setApplyType] = useState<'influencer' | 'b2b_sampler'>('influencer')
  const [applyLoading, setApplyLoading] = useState(false)
  const [applyMsg, setApplyMsg] = useState<{type: 'success' | 'error', text: string} | null>(null)

  // Wallet to Coupon State
  const [convertAmount, setConvertAmount] = useState('')
  const [convertLoading, setConvertLoading] = useState(false)
  const [convertMsg, setConvertMsg] = useState<{type: 'success' | 'error', text: string} | null>(null)

  // Tüm /api/user/* ve ilgili çağrılar artık kimlik doğrulaması istiyor (bkz.
  // src/lib/customerAuth.ts) — bu yardımcı, kayıtlı oturum token'ını okuyup
  // Authorization header'ı olarak ekler.
  const authHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('pn_session') : null
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  }

  const fetchUserData = async (userId: string) => {
    try {
      const res = await fetch('/api/user/me', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ userId })
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data)
        if (data.orders) setOrders(data.orders)
        if (data.referredOrders) setReferredOrders(data.referredOrders)
        setAddressData({
          phone: data.phone || '',
          address: data.address || ''
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const parsed = JSON.parse(savedUser)
      setUser(parsed)
      setAddressData({
        phone: parsed.phone || '',
        address: parsed.address || ''
      })
      fetchUserData(parsed.id)
    }
  }, [])

  const handleOrderAddrUpdate = async (orderId: string) => {
    if (!newOrderAddr.trim()) return
    try {
      const res = await fetch('/api/orders/update-address', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ orderId, customerAddress: newOrderAddr })
      })
      const data = await res.json()
      if (res.ok) {
        setOrderAddrMsg({ type: 'success', text: t("Sipariş teslimat adresi güncellendi.", "Order delivery address updated.", "تم تحديث عنوان تسليم الطلب.") })
        setOrders(orders.map((o: any) => o.id === orderId ? { ...o, customerAddress: newOrderAddr } : o))
        setEditingOrderAddr(null)
      } else {
        setOrderAddrMsg({ type: 'error', text: data.error || t("Adres güncellenemedi.", "The address could not be updated.", "تعذّر تحديث العنوان.") })
      }
    } catch (e) {
      setOrderAddrMsg({ type: 'error', text: t("Bağlantı hatası", "Connection error", "خطأ في الاتصال") })
    }
    setTimeout(() => setOrderAddrMsg(null), 4000)
  }

  const handleAddressUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddressLoading(true)
    setAddressMsg(null)

    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          userId: user.id,
          phone: addressData.phone,
          address: addressData.address
        })
      })

      const data = await res.json()
      if (res.ok) {
        setAddressMsg({ type: 'success', text: t("Teslimat bilgileriniz başarıyla kaydedildi.", "Your delivery details were saved successfully.", "تم حفظ بيانات التسليم بنجاح.") })
        const updated = { ...user, phone: addressData.phone, address: addressData.address }
        setUser(updated)
        localStorage.setItem('user', JSON.stringify(updated))
      } else {
        setAddressMsg({ type: 'error', text: data.error || t("Güncelleme yapılamadı.", "The update could not be made.", "تعذّر إجراء التحديث.") })
      }
    } catch {
      setAddressMsg({ type: 'error', text: t("Bir hata oluştu, lütfen tekrar deneyin.", "An error occurred, please try again.", "حدث خطأ، يرجى المحاولة مرة أخرى.") })
    } finally {
      setAddressLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.new !== passwordData.confirm) {
      setPwdMsg({ type: 'error', text: t("Yeni şifreler eşleşmiyor.", "The new passwords do not match.", "كلمتا المرور الجديدتان غير متطابقتين.") })
      return
    }
    setPwdLoading(true)
    setPwdMsg(null)

    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          userId: user.id,
          currentPassword: passwordData.current,
          newPassword: passwordData.new
        })
      })

      const data = await res.json()
      if (res.ok) {
        setPwdMsg({ type: 'success', text: t("Şifreniz başarıyla değiştirildi.", "Your password was changed successfully.", "تم تغيير كلمة المرور بنجاح.") })
        setPasswordData({ current: '', new: '', confirm: '' })
      } else {
        setPwdMsg({ type: 'error', text: data.error || t("Şifre güncellenemedi.", "The password could not be updated.", "تعذّر تحديث كلمة المرور.") })
      }
    } catch {
      setPwdMsg({ type: 'error', text: t("Sunucu hatası oluştu.", "A server error occurred.", "حدث خطأ في الخادم.") })
    } finally {
      setPwdLoading(false)
    }
  }

  const handleAmbassadorApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setApplyLoading(true)
    setApplyMsg(null)

    try {
      const res = await fetch('/api/affiliate/apply', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          userId: user.id,
          instagramHandle: applyInstagram,
          partnerType: applyType
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setApplyMsg({ type: 'success', text: data.message })
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
        fetchUserData(user.id)
      } else {
        setApplyMsg({ type: 'error', text: data.error || t("Başvuru yapılamadı.", "The application could not be submitted.", "تعذّر تقديم الطلب.") })
      }
    } catch {
      setApplyMsg({ type: 'error', text: t("Bağlantı hatası oluştu.", "A connection error occurred.", "حدث خطأ في الاتصال.") })
    } finally {
      setApplyLoading(false)
    }
  }

  const handleConvertToCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    const amountNum = parseFloat(convertAmount)
    if (!user || !amountNum || amountNum <= 0) return

    setConvertLoading(true)
    setConvertMsg(null)

    try {
      const res = await fetch('/api/affiliate/wallet-to-coupon', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          userId: user.id,
          amount: amountNum
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setConvertMsg({ type: 'success', text: `${data.message} Kodunuz: ${data.coupon}` })
        setConvertAmount('')
        setUser({ ...user, wallet_balance: data.newBalance })
        fetchUserData(user.id)
      } else {
        setConvertMsg({ type: 'error', text: data.error || t("Kupon oluşturulamadı.", "The coupon could not be created.", "تعذّر إنشاء القسيمة.") })
      }
    } catch {
      setConvertMsg({ type: 'error', text: t("Bağlantı hatası oluştu.", "A connection error occurred.", "حدث خطأ في الاتصال.") })
    } finally {
      setConvertLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'pending': return t("Ödeme Bekliyor", "Awaiting Payment", "بانتظار الدفع")
      case 'paid': return t("Hazırlanıyor / İşlemde", "Preparing / Processing", "قيد التحضير / المعالجة")
      case 'shipped': return t("Kargoya Verildi", "Shipped", "تم الشحن")
      case 'delivered': return t("Teslim Edildi", "Delivered", "تم التسليم")
      case 'cancelled': return t("İptal Edildi", "Cancelled", "أُلغي")
      case 'awaiting_transfer': return t("Havale Bekleniyor", "Awaiting Bank Transfer", "بانتظار التحويل البنكي")
      default: return status
    }
  }

  const displayUser = user || {
    name: t("Değerli Üyemiz", "Valued Member", "عضونا العزيز"),
    email: '',
    partner_type: 'retail',
    referral_code: 'PN-VIP-001',
    wallet_balance: 0,
    earned_samples: 0
  }

  const activeOrders = orders.filter((o: any) => o.status === 'pending' || o.status === 'awaiting_transfer' || o.status === 'paid' || o.status === 'shipped')
  const pastOrders = orders.filter((o: any) => o.status === 'delivered' || o.status === 'cancelled')
  const referralLink = `https://pnparfume.com/?ref=${displayUser.referral_code || ''}`
  const totalReferredCommission = referredOrders.reduce((sum: number, o: any) => sum + (o.affiliateEarned || 0), 0)

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        
        <Link href="/" className="inline-flex items-center text-sm font-medium text-accent-gold hover:text-accent-rose transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" /> {t("Ana Sayfaya Dön", "Back to Home", "العودة إلى الصفحة الرئيسية")}
        </Link>

        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-light tracking-wide mb-2 text-foreground">{t("Hesabım", "My Account", "حسابي")}</h1>
            <p className="text-foreground/60 font-light">{t('Hoş geldin,', 'Welcome,', 'أهلًا بك،')} {displayUser.name}</p>
          </div>

          <div className="flex items-center gap-3">
            {displayUser.partner_type === 'influencer' && (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 px-4 py-2 rounded-2xl text-accent-gold text-xs font-semibold">
                <Award size={16} /> {t("Resmi Marka Elçisi", "Official Brand Ambassador", "سفير العلامة الرسمي")}
              </div>
            )}

            <button 
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium transition-colors"
              title={t("Hesaptan Güvenli Çıkış Yap", "Sign out securely", "تسجيل الخروج بأمان")}
            >
              <LogOut size={16} /> {t("Çıkış Yap", "Sign Out", "تسجيل الخروج")}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sol Menü (Tabs) */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0">
              <button 
                onClick={() => setActiveTab('ozet')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left text-sm ${activeTab === 'ozet' ? 'bg-foreground/5 text-foreground font-medium' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'}`}
              >
                <Users size={18} /> {t("Hesap Özeti", "Account Summary", "ملخص الحساب")}
              </button>
              <button 
                onClick={() => setActiveTab('siparisler')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left text-sm ${activeTab === 'siparisler' ? 'bg-foreground/5 text-foreground font-medium' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'}`}
              >
                <Package size={18} /> {t("Sipariş Yönetimi", "Order Management", "إدارة الطلبات")}
              </button>
              <button 
                onClick={() => setActiveTab('b2b')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left text-sm ${activeTab === 'b2b' ? 'bg-accent-gold/15 text-accent-gold font-medium border border-accent-gold/20' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'}`}
              >
                <Award size={18} className="text-accent-gold" /> {t("Marka Elçiliği & Kazanç", "Ambassador Program & Earnings", "برنامج السفراء والأرباح")}
              </button>
              <button 
                onClick={() => setActiveTab('kuponlar')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left text-sm ${activeTab === 'kuponlar' ? 'bg-foreground/5 text-foreground font-medium' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'}`}
              >
                <Gift size={18} /> {t("Ayrıcalık & Kuponlar", "Privileges & Coupons", "المزايا والقسائم")}
              </button>
              <button 
                onClick={() => setActiveTab('ayarlar')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left text-sm ${activeTab === 'ayarlar' ? 'bg-foreground/5 text-foreground font-medium' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'}`}
              >
                <Lock size={18} /> {t("Ayarlar ve Güvenlik", "Settings & Security", "الإعدادات والأمان")}
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left text-sm text-rose-400 hover:bg-rose-500/10 mt-2 border border-rose-500/20"
              >
                <LogOut size={18} /> {t("Çıkış Yap", "Sign Out", "تسجيل الخروج")}
              </button>
            </div>
          </div>

          {/* Sağ İçerik Alanı */}
          <div className="flex-1">
            
            {/* ==================== HESAP OZETI ==================== */}
            {activeTab === 'ozet' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cüzdan — pazarlama açısından öne çıkarılsın diye dönen çerçeve */}
                  <div className="rotating-frame rounded-3xl p-[2px]">
                    <div className="bg-background border border-foreground/10 rounded-3xl p-8 relative overflow-hidden h-full">
                      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Wallet size={120} />
                      </div>
                      <p className="text-xs uppercase tracking-widest text-foreground/60 mb-2">{t("Cüzdan Bakiyesi", "Wallet Balance", "رصيد المحفظة")}</p>
                      <h2 className="text-4xl font-light text-accent-gold mb-3">{displayUser.wallet_balance} TL</h2>
                      <p className="text-xs text-foreground/70 leading-relaxed font-light mb-4">
                        {t("Tavsiye ve elçilik kazançlarınızı sonraki alışverişlerinizde harcayabilir veya kupona dönüştürebilirsiniz.", "You can spend your referral and ambassador earnings on your next purchases or convert them into coupons.", "يمكنك إنفاق أرباح الإحالة والسفارة في مشترياتك القادمة أو تحويلها إلى قسائم.")}
                      </p>
                      <button
                        onClick={() => setActiveTab('b2b')}
                        className="inline-flex items-center gap-1.5 text-xs text-accent-gold hover:underline font-medium"
                      >
                        {t("Kazanç Paneline Git", "Go to Earnings Panel", "انتقل إلى لوحة الأرباح")} <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Son Siparişler Özeti */}
                  <div className="bg-foreground/5 border border-foreground/10 rounded-3xl p-8">
                    <p className="text-xs uppercase tracking-widest text-foreground/60 mb-2">{t("Toplam Siparişiniz", "Your Total Orders", "إجمالي طلباتك")}</p>
                    <h2 className="text-4xl font-light text-foreground mb-3">{orders.length} Adet</h2>
                    <p className="text-xs text-foreground/70 leading-relaxed font-light mb-4">
                      {t("Aktif ve geçmiş tüm parfüm siparişlerinizi ve kargo durumunu anlık takip edin.", "Track all your active and past perfume orders and shipping status in real time.", "تابع جميع طلبات العطور النشطة والسابقة وحالة الشحن لحظة بلحظة.")}
                    </p>
                    <button 
                      onClick={() => setActiveTab('siparisler')}
                      className="inline-flex items-center gap-1.5 text-xs text-foreground hover:text-accent-gold transition-colors font-medium"
                    >
                      {t("Siparişleri İncele", "View Orders", "عرض الطلبات")} <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Hızlı Davet & Paylaşım Kartı — pazarlama açısından en önemlisi, dönen çerçeve */}
                <div className="rotating-frame rounded-3xl p-[2px]">
                <div className="bg-gradient-to-br from-amber-500/10 via-background to-accent-gold/5 border border-accent-gold/20 rounded-3xl p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-accent-gold font-bold block mb-1">Tavsiye Et & Kazan</span>
                      <h3 className="text-xl font-light text-foreground mb-1.5">{t("Satın Al &rarr; Memnun Ol &rarr; Tavsiye Et &rarr; Kazan", "Buy &rarr; Enjoy &rarr; Recommend &rarr; Earn", "اشترِ &rarr; استمتع &rarr; رشّح &rarr; اربح")}</h3>
                      <p className="text-xs text-foreground/70 font-light max-w-lg mb-2">
                        {t("Sana özel referans kodunla alışveriş yapan her arkadaşın için sipariş tutarının %15'i anında cüzdanına yansır.", "For every friend who shops with your personal referral code, 15% of the order amount is instantly added to your wallet.", "عن كل صديق يتسوق برمز الإحالة الخاص بك، تُضاف 15% من قيمة الطلب فورًا إلى محفظتك.")}
                      </p>
                      <p className="text-xs text-foreground/70 font-light max-w-lg">
                        {t("Kazandığın kuponları ürüne dönüştürebilir, yeni gelen kokularımızı satışa çıkmadan önce test etme şansını yakalayabilirsin.", "You can turn your earned coupons into products and get the chance to test our new scents before they go on sale.", "يمكنك تحويل القسائم التي ربحتها إلى منتجات والحصول على فرصة تجربة عطورنا الجديدة قبل طرحها للبيع.")}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(referralLink)
                          setCopiedRefLink(true)
                          setTimeout(() => setCopiedRefLink(false), 2000)
                        }}
                        className="bg-foreground text-background px-5 py-3 rounded-xl text-xs font-medium hover:bg-accent-gold transition-colors flex items-center justify-center gap-2"
                      >
                        {copiedRefLink ? <Check size={14} /> : <Copy size={14} />}
                        {copiedRefLink ? t("Link Kopyalandı", "Link Copied", "تم نسخ الرابط") : t("Referans Linkini Kopyala", "Copy Referral Link", "انسخ رابط الإحالة")}
                      </button>

                      <a 
                        href={`https://wa.me/?text=${encodeURIComponent(`PN Parfüm'de sana özel %10 indirim hediyem var! Özel koku koleksiyonunu keşfetmek için linke tıkla: ${referralLink}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={14} /> {t("WhatsApp'ta Paylaş", "Share on WhatsApp", "شارك عبر واتساب")}
                      </a>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            )}

            {/* ==================== MARKA ELCILIGI & KAZANC PANELI ==================== */}
            {activeTab === 'b2b' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs uppercase tracking-widest text-accent-gold font-bold">{t("PN Marka Elçiliği", "PN Brand Ambassador", "سفير علامة PN")}</span>
                    <span className="bg-accent-gold/20 text-accent-gold text-[10px] font-bold px-2 py-0.5 rounded-full">%15 Komisyon</span>
                  </div>
                  <h2 className="text-3xl font-light text-foreground mb-2">{t("Elçi & Ortaklık Kazanç Paneli", "Ambassador & Partnership Earnings Panel", "لوحة أرباح السفراء والشراكة")}</h2>
                  <p className="text-foreground/60 text-sm font-light">{t("Referans kodunuzla yönlendirdiğiniz siparişleri ve hakedişlerinizi buradan yönetin.", "Manage the orders you referred with your referral code and your earnings here.", "أدر هنا الطلبات التي أحلتها برمز الإحالة الخاص بك ومستحقاتك.")}</p>
                </div>

                {/* Elçilik Metrikleri */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6">
                    <span className="text-xs text-foreground/50 uppercase tracking-widest block mb-1">{t("Kullanılabilir Bakiye", "Available Balance", "الرصيد المتاح")}</span>
                    <div className="text-3xl font-light text-accent-gold">{displayUser.wallet_balance} TL</div>
                    <span className="text-[11px] text-foreground/40 mt-1 block">{t("Alışverişte veya kuponda kullanılabilir", "Usable for shopping or coupons", "يمكن استخدامه في التسوق أو القسائم")}</span>
                  </div>

                  <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6">
                    <span className="text-xs text-foreground/50 uppercase tracking-widest block mb-1">{t("Yönlendirilen Sipariş", "Referred Orders", "الطلبات المُحالة")}</span>
                    <div className="text-3xl font-light text-foreground">{referredOrders.length} Adet</div>
                    <span className="text-[11px] text-foreground/40 mt-1 block">{t("Referansınızla tamamlanan", "Completed with your referral", "المكتملة عبر إحالتك")}</span>
                  </div>

                  <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6">
                    <span className="text-xs text-foreground/50 uppercase tracking-widest block mb-1">{t("Toplam Hakediş Kazancı", "Total Commission Earned", "إجمالي العمولة المكتسبة")}</span>
                    <div className="text-3xl font-light text-emerald-600">{totalReferredCommission} TL</div>
                    <span className="text-[11px] text-foreground/40 mt-1 block">{t("Bugüne kadar üretilen komisyon", "Commission generated to date", "العمولة المتولدة حتى الآن")}</span>
                  </div>
                </div>

                {/* Özel Paylaşım Araçları */}
                <div className="bg-foreground/5 border border-foreground/10 rounded-3xl p-8 space-y-6">
                  <h3 className="text-lg font-light text-foreground flex items-center gap-2">
                    <Share2 size={18} className="text-accent-gold" /> {t("Paylaşım & Davet Araçlarınız", "Your Sharing & Invitation Tools", "أدوات المشاركة والدعوة")}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Referans Kodu */}
                    <div className="bg-background p-5 rounded-2xl border border-foreground/10 space-y-2">
                      <span className="text-xs text-foreground/50 font-medium block">{t("Özel İndirim Kodunuz (%10 İndirim):", "Your Discount Code (10% off):", "رمز الخصم الخاص بك (خصم 10%):")}</span>
                      <div className="flex items-center justify-between bg-foreground/5 p-3 rounded-xl">
                        <span className="font-mono font-bold text-accent-gold text-base">{displayUser.referral_code}</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(displayUser.referral_code)
                            setCopiedRefCode(true)
                            setTimeout(() => setCopiedRefCode(false), 2000)
                          }}
                          className="text-xs text-foreground hover:text-accent-gold flex items-center gap-1"
                        >
                          {copiedRefCode ? <Check size={13} /> : <Copy size={13} />}
                          {copiedRefCode ? t("Kopyalandı", "Copied", "تم النسخ") : t("Kodu Kopyala", "Copy Code", "انسخ الرمز")}
                        </button>
                      </div>
                      <p className="text-[11px] text-foreground/50">{t("Arkadaşlarınız sepet ekranında bu kodu girerek %10 indirim kazanır.", "Your friends get 10% off by entering this code at checkout.", "يحصل أصدقاؤك على خصم 10% بإدخال هذا الرمز في السلة.")}</p>
                    </div>

                    {/* Referans Linki */}
                    <div className="bg-background p-5 rounded-2xl border border-foreground/10 space-y-2">
                      <span className="text-xs text-foreground/50 font-medium block">Direkt Davet Linkiniz:</span>
                      <div className="flex items-center justify-between bg-foreground/5 p-3 rounded-xl">
                        <span className="font-mono text-xs text-foreground/80 truncate max-w-[180px]">{referralLink}</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(referralLink)
                            setCopiedRefLink(true)
                            setTimeout(() => setCopiedRefLink(false), 2000)
                          }}
                          className="text-xs text-foreground hover:text-accent-gold flex items-center gap-1"
                        >
                          {copiedRefLink ? <Check size={13} /> : <Copy size={13} />}
                          {copiedRefLink ? t("Kopyalandı", "Copied", "تم النسخ") : t("Linki Kopyala", "Copy Link", "انسخ الرابط")}
                        </button>
                      </div>
                      <p className="text-[11px] text-foreground/50">{t("Bu linke tıklayarak gelen ziyaretçiler 30 gün boyunca sizinle eşleşir.", "Visitors who arrive through this link are matched with you for 30 days.", "يرتبط بك الزوار القادمون عبر هذا الرابط لمدة 30 يومًا.")}</p>
                    </div>
                  </div>
                </div>

                {/* Bakiye Kullanımı / Kupona Dönüştürme */}
                <div className="bg-foreground/5 border border-foreground/10 rounded-3xl p-8">
                  <h3 className="text-lg font-light text-foreground mb-4 flex items-center gap-2">
                    <Gift size={18} className="text-accent-gold" /> {t("Bakiyeyi Hediye Kuponuna Dönüştür", "Convert Balance to a Gift Coupon", "حوّل الرصيد إلى قسيمة هدية")}
                  </h3>
                  <p className="text-xs text-foreground/60 font-light mb-6">
                    {t("Cüzdanınızdaki bakiyeyi dilediğiniz tutarda PN Parfüm alışveriş çekine (%100 geçerli kupona) anında dönüştürebilirsiniz.", "You can instantly convert your wallet balance, in any amount you like, into a PN Parfüm shopping voucher (a 100% valid coupon).", "يمكنك تحويل رصيد محفظتك فورًا بأي مبلغ تريده إلى قسيمة تسوق من PN Parfüm (قسيمة صالحة 100%).")}
                  </p>

                  {convertMsg && (
                    <div className={`mb-6 p-4 rounded-xl text-xs flex items-center gap-2 border ${convertMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' : 'bg-rose-500/10 text-rose-700 border-rose-500/20'}`}>
                      <AlertCircle size={15} /> {convertMsg.text}
                    </div>
                  )}

                  <form onSubmit={handleConvertToCoupon} className="flex flex-col sm:flex-row gap-3 max-w-md">
                    <input 
                      type="number"
                      placeholder={`Tutar girin (Maks: ${displayUser.wallet_balance} TL)`}
                      value={convertAmount}
                      onChange={e => setConvertAmount(e.target.value)}
                      max={displayUser.wallet_balance}
                      min="10"
                      className="flex-1 bg-background border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:border-accent-gold outline-none"
                    />
                    <button 
                      type="submit"
                      disabled={convertLoading || !displayUser.wallet_balance || displayUser.wallet_balance <= 0}
                      className="bg-foreground text-background px-6 py-3 rounded-xl text-xs font-medium hover:bg-accent-gold transition-colors disabled:opacity-40 whitespace-nowrap"
                    >
                      {convertLoading ? t("Oluşturuluyor...", "Creating...", "جارٍ الإنشاء...") : t("Kupona Dönüştür", "Convert to Coupon", "حوّل إلى قسيمة")}
                    </button>
                  </form>
                </div>

                {/* Yönlendirilen Siparişler Tablosu */}
                <div>
                  <h3 className="text-lg font-light text-foreground mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-accent-gold" /> Yönlendirilen Siparişler ({referredOrders.length})
                  </h3>

                  <div className="bg-background border border-foreground/10 rounded-3xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-foreground/5 border-b border-foreground/10 text-foreground/50 font-semibold">
                          <th className="px-6 py-4">{t("Sipariş No", "Order No", "رقم الطلب")}</th>
                          <th className="px-6 py-4">{t("Tarih", "Date", "التاريخ")}</th>
                          <th className="px-6 py-4">{t("Sipariş Tutarı", "Order Amount", "قيمة الطلب")}</th>
                          <th className="px-6 py-4">{t("Durum", "Status", "الحالة")}</th>
                          <th className="px-6 py-4 text-right">{t("Kazanılan Komisyon (%15)", "Commission Earned (15%)", "العمولة المكتسبة (15%)")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-foreground/5">
                        {referredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-foreground/40">
                              {t("Henüz referans kodunuzla verilmiş bir sipariş bulunmuyor. Linkinizi paylaşarak kazanmaya başlayabilirsiniz!", "There are no orders placed with your referral code yet. Start earning by sharing your link!", "لا توجد طلبات بعد برمز الإحالة الخاص بك. ابدأ الربح بمشاركة رابطك!")}
                            </td>
                          </tr>
                        ) : (
                          referredOrders.map((ro: any) => (
                            <tr key={ro.id} className="hover:bg-foreground/[0.02]">
                              <td className="px-6 py-4 font-mono font-medium text-foreground/80">
                                PN-***{ro.orderNumber?.slice(-4)}
                              </td>
                              <td className="px-6 py-4 text-foreground/60">
                                {new Date(ro.createdAt).toLocaleDateString('tr-TR')}
                              </td>
                              <td className="px-6 py-4 font-medium text-foreground">
                                {ro.totalAmount} TL
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                                  ro.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-600' :
                                  ro.status === 'paid' ? 'bg-blue-500/10 text-blue-600' : 'bg-foreground/5 text-foreground/60'
                                }`}>
                                  {getOrderStatusText(ro.status)}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right font-bold text-accent-gold text-sm">
                                +{ro.affiliateEarned || Math.round(ro.totalAmount * 0.15)} TL
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Marka Elçiliği Başvuru / Aktivasyon Alanı (Eğer henüz influencer değilse) */}
                {displayUser.partner_type === 'retail' && (
                  <div className="bg-gradient-to-br from-accent-gold/10 via-background to-foreground/5 border border-accent-gold/30 rounded-3xl p-8">
                    <div className="max-w-xl">
                      <span className="text-xs uppercase tracking-widest text-accent-gold font-bold block mb-1">{t("Ayrıcalıklı Elçi Programı", "Exclusive Ambassador Program", "برنامج السفراء الحصري")}</span>
                      <h3 className="text-2xl font-light text-foreground mb-2">{t("PN Parfüm Marka Elçisi Olun", "Become a PN Parfüm Brand Ambassador", "كن سفيرًا لعلامة PN Parfüm")}</h3>
                      <p className="text-xs text-foreground/70 font-light leading-relaxed mb-6">
                        {t("Sosyal medya takipçilerinize veya çevrenize imza kokularımızı tavsiye ederek her başarılı siparişten anında %15 net komisyon kazanın.", "Recommend our signature scents to your social media followers or circle and earn an instant 15% net commission on every successful order.", "رشّح عطورنا المميزة لمتابعيك أو لمحيطك واربح عمولة صافية 15% فورًا عن كل طلب ناجح.")}
                      </p>

                      {applyMsg && (
                        <div className={`mb-6 p-4 rounded-xl text-xs flex items-center gap-2 border ${applyMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' : 'bg-rose-500/10 text-rose-700 border-rose-500/20'}`}>
                          <AlertCircle size={15} /> {applyMsg.text}
                        </div>
                      )}

                      <form onSubmit={handleAmbassadorApply} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input 
                            type="text" 
                            placeholder={t("Instagram / TikTok @kullanıcıadınız", "Instagram / TikTok @yourusername", "Instagram / TikTok @اسم_المستخدم")}
                            value={applyInstagram}
                            onChange={e => setApplyInstagram(e.target.value)}
                            className="bg-background border border-foreground/10 rounded-xl px-4 py-3 text-xs focus:border-accent-gold outline-none"
                          />
                          <select 
                            value={applyType}
                            onChange={e => setApplyType(e.target.value as any)}
                            className="bg-background border border-foreground/10 rounded-xl px-4 py-3 text-xs focus:border-accent-gold outline-none"
                          >
                            <option value="influencer">{t("Influencer / Bireysel Elçi", "Influencer / Individual Ambassador", "مؤثر / سفير فردي")}</option>
                            <option value="b2b_sampler">Kurumsal / B2B Sampler</option>
                          </select>
                        </div>
                        <button 
                          type="submit"
                          disabled={applyLoading}
                          className="bg-foreground text-background px-8 py-3 rounded-xl text-xs font-semibold hover:bg-accent-gold transition-colors shadow-lg"
                        >
                          {applyLoading ? t("Aktif Ediliyor...", "Activating...", "جارٍ التفعيل...") : t("Marka Elçisi Olarak Başla", "Start as a Brand Ambassador", "ابدأ كسفير للعلامة")}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==================== SIPARISLER ==================== */}
            {activeTab === 'siparisler' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-light text-foreground">{t("Sipariş Yönetimi", "Order Management", "إدارة الطلبات")}</h2>
                  <div className="flex gap-2 bg-foreground/5 p-1 rounded-xl w-fit">
                    <button 
                      onClick={() => setOrderSubTab('aktif')}
                      className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${orderSubTab === 'aktif' ? 'bg-background text-foreground shadow-sm' : 'text-foreground/60 hover:text-foreground'}`}
                    >
                      {t("Aktif Siparişler (", "Active Orders (", "الطلبات النشطة (")}{activeOrders.length})
                    </button>
                    <button 
                      onClick={() => setOrderSubTab('gecmis')}
                      className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${orderSubTab === 'gecmis' ? 'bg-background text-foreground shadow-sm' : 'text-foreground/60 hover:text-foreground'}`}
                    >
                      {t("Geçmiş Siparişler (", "Past Orders (", "الطلبات السابقة (")}{pastOrders.length})
                    </button>
                  </div>
                </div>

                {orderAddrMsg && (
                  <div className={`p-4 rounded-xl text-sm flex items-center gap-3 border ${orderAddrMsg.type === 'success' ? 'bg-green-500/10 text-green-700 border-green-500/20' : 'bg-red-500/10 text-red-700 border-red-500/20'}`}>
                    <AlertCircle size={18} /> {orderAddrMsg.text}
                  </div>
                )}

                <div className="space-y-4">
                  {(orderSubTab === 'aktif' ? activeOrders : pastOrders).map((order: any) => (
                    <div key={order.id} className="bg-background border border-foreground/10 rounded-3xl p-6 lg:p-8">
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-foreground/10 mb-6">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-foreground/50 mb-1">{t("Sipariş No", "Order No", "رقم الطلب")}</p>
                          <p className="font-mono text-sm text-foreground font-semibold">{order.orderNumber || order.id}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest text-foreground/50 mb-1">{t("Tarih", "Date", "التاريخ")}</p>
                          <p className="text-sm text-foreground font-light">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest text-foreground/50 mb-1">{t("Toplam Tutar", "Total Amount", "المبلغ الإجمالي")}</p>
                          <p className="text-sm font-medium text-accent-gold">{order.totalAmount} TL</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest text-foreground/50 mb-1">{t("Durum", "Status", "الحالة")}</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-500/10 text-green-700' :
                            order.status === 'shipped' ? 'bg-purple-500/10 text-purple-700' :
                            order.status === 'paid' ? 'bg-blue-500/10 text-blue-700' : 'bg-amber-500/10 text-amber-700'
                          }`}>
                            {getOrderStatusText(order.status)}
                          </span>
                        </div>
                      </div>

                      {/* Kargo Takip Bilgisi */}
                      {(order.status === 'shipped' || order.status === 'delivered') && order.trackingCode && (
                        <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl mb-4 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-semibold text-purple-600">{order.cargoCompany || 'Kargo'}: </span>
                            <span className="font-mono text-foreground font-medium ml-1">{order.trackingCode}</span>
                          </div>
                          <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{t("Kargoda", "In Transit", "قيد الشحن")}</span>
                        </div>
                      )}

                      {/* Sipariş İçeriği */}
                      <div className="w-full">
                        <p className="text-xs uppercase tracking-widest text-foreground/50 mb-3">{t("Sipariş İçeriği", "Order Contents", "محتويات الطلب")}</p>
                        <ul className="space-y-2 mb-4">
                          {(order.items as any[])?.map((item: any, idx: number) => (
                            <li key={idx} className="flex justify-between items-center text-sm">
                              <span className="text-foreground/80 font-light">{item.quantity}x {item.name}</span>
                              <span className="font-mono text-xs text-foreground/40">{item.price} TL</span>
                            </li>
                          ))}
                        </ul>
                        
                        <div className="bg-foreground/5 p-4 rounded-xl mt-4">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-xs uppercase tracking-widest text-foreground/50">Teslimat Adresi</p>
                            {(order.status === 'pending' || order.status === 'paid') && (
                              <button 
                                onClick={() => {
                                  setEditingOrderAddr(order.id)
                                  setNewOrderAddr(order.customerAddress || '')
                                }}
                                className="text-xs text-accent-gold hover:underline"
                              >
                                {t("Adresi Değiştir", "Change Address", "تغيير العنوان")}
                              </button>
                            )}
                          </div>
                          
                          {editingOrderAddr === order.id ? (
                            <div className="mt-2 space-y-3">
                              <textarea 
                                value={newOrderAddr}
                                onChange={e => setNewOrderAddr(e.target.value)}
                                className="w-full bg-background border border-foreground/10 rounded-lg p-3 text-sm focus:border-accent-gold outline-none"
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <button onClick={() => handleOrderAddrUpdate(order.id)} className="bg-foreground text-background px-4 py-2 rounded-lg text-xs hover:bg-accent-gold transition-colors">Kaydet</button>
                                <button onClick={() => setEditingOrderAddr(null)} className="px-4 py-2 rounded-lg text-xs hover:bg-foreground/5">{t("İptal", "Cancel", "إلغاء")}</button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-foreground/80">{order.customerAddress || t("Adres bilgisi bulunamadı", "No address information found", "لم يتم العثور على معلومات العنوان")}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {(orderSubTab === 'aktif' ? activeOrders : pastOrders).length === 0 && (
                    <div className="text-center py-12 text-foreground/40 font-light bg-foreground/5 rounded-3xl">
                      {t("Bu kategoride siparişiniz bulunmamaktadır.", "You have no orders in this category.", "ليس لديك طلبات في هذه الفئة.")}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ==================== AYRICALIKLAR & KUPONLAR ==================== */}
            {activeTab === 'kuponlar' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-2xl font-light mb-2 text-foreground">{t("Kupon ve Ayrıcalık Kasası", "Coupon & Privilege Vault", "خزنة القسائم والمزايا")}</h2>
                  <p className="text-foreground/60 text-sm font-light">{t("Hesabınıza tanımlanmış indirim kuponları ve hediye hakları.", "Discount coupons and gift entitlements assigned to your account.", "قسائم الخصم والهدايا المخصصة لحسابك.")}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayUser.coupons?.map((coupon: any, idx: number) => (
                    <div key={idx} className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6 relative flex flex-col justify-between">
                      <div>
                        <span className="text-xs uppercase tracking-widest text-accent-gold block mb-1">
                          {coupon.discount_type === 'bogo' ? '1 Alana 1 Bedava' : coupon.discount_type === 'percentage' ? `%${coupon.value} İndirim` : `${coupon.value} TL İndirim`}
                        </span>
                        <h4 className="text-lg font-light text-foreground mb-4">{t("Özel Kupon", "Special Coupon", "قسيمة خاصة")}</h4>
                      </div>
                      <div className="bg-background p-3 rounded-xl flex items-center justify-between border border-foreground/10">
                        <span className="font-mono text-sm font-bold text-foreground">{coupon.code}</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(coupon.code)
                            alert(t("Kupon kodu kopyalandı!", "Coupon code copied!", "تم نسخ رمز القسيمة!"))
                          }}
                          className="text-xs text-accent-gold hover:underline"
                        >
                          Kopyala
                        </button>
                      </div>
                    </div>
                  ))}

                  {(!displayUser.coupons || displayUser.coupons.length === 0) && (
                    <div className="col-span-2 text-center py-12 text-foreground/40 font-light bg-foreground/5 rounded-3xl">
                      {t("Tanımlı kuponunuz bulunmuyor.", "You have no coupons.", "ليس لديك قسائم.")}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ==================== AYARLAR & GUVENLIK ==================== */}
            {activeTab === 'ayarlar' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl">
                <div>
                  <h2 className="text-2xl font-light mb-2 text-foreground">{t("Ayarlar ve Güvenlik", "Settings & Security", "الإعدادات والأمان")}</h2>
                  <p className="text-foreground/60 text-sm font-light">{t("İletişim ve teslimat bilgilerinizi buradan yönetebilirsiniz.", "You can manage your contact and delivery details here.", "يمكنك إدارة بيانات الاتصال والتسليم هنا.")}</p>
                </div>

                <div className="bg-background border border-foreground/10 rounded-3xl p-8">
                  <h3 className="text-lg font-medium mb-6 text-foreground">{t("İletişim ve Teslimat Bilgileri", "Contact & Delivery Details", "بيانات الاتصال والتسليم")}</h3>
                  
                  {addressMsg && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm border ${addressMsg.type === 'success' ? 'bg-green-500/10 text-green-700 border-green-500/20' : 'bg-red-500/10 text-red-700 border-red-500/20'}`}>
                      <AlertCircle size={18} /> <span>{addressMsg.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleAddressUpdate} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground/80">{t("Telefon Numarası", "Phone Number", "رقم الهاتف")}</label>
                      <input 
                        type="tel"
                        required
                        value={addressData.phone}
                        onChange={e => setAddressData({...addressData, phone: e.target.value})}
                        className="w-full bg-foreground/5 border border-transparent focus:border-accent-gold focus:bg-background rounded-xl px-4 py-3 text-foreground transition-colors outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground/80">{t("Açık Adres (Siparişler için)", "Full Address (for orders)", "العنوان الكامل (للطلبات)")}</label>
                      <textarea 
                        required
                        rows={3}
                        value={addressData.address}
                        onChange={e => setAddressData({...addressData, address: e.target.value})}
                        className="w-full bg-foreground/5 border border-transparent focus:border-accent-gold focus:bg-background rounded-xl px-4 py-3 text-foreground transition-colors outline-none resize-none"
                        placeholder={t("Mahalle, Sokak, No, Daire, İlçe/İl", "Street, Number, Apartment, District/City, Country", "الشارع، الرقم، الشقة، الحي/المدينة، الدولة")}
                      />
                    </div>
                    <div className="pt-2">
                      <button disabled={addressLoading} type="submit" className="w-full bg-foreground text-background py-3 rounded-xl font-medium hover:bg-accent-gold transition-colors disabled:opacity-50">
                        {addressLoading ? t("Güncelleniyor...", "Updating...", "جارٍ التحديث...") : t("Bilgilerimi Kaydet", "Save My Details", "احفظ بياناتي")}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-background border border-foreground/10 rounded-3xl p-8">
                  <h3 className="text-lg font-medium mb-6 text-foreground">{t("Şifre Değiştirme", "Change Password", "تغيير كلمة المرور")}</h3>
                  
                  {pwdMsg && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm border ${pwdMsg.type === 'success' ? 'bg-green-500/10 text-green-700 border-green-500/20' : 'bg-red-500/10 text-red-700 border-red-500/20'}`}>
                      <AlertCircle size={18} /> <span>{pwdMsg.text}</span>
                    </div>
                  )}

                  <form onSubmit={handlePasswordChange} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground/80">{t("Mevcut Şifre", "Current Password", "كلمة المرور الحالية")}</label>
                      <input 
                        type={showPwd ? 'text' : 'password'}
                        required
                        value={passwordData.current}
                        onChange={e => setPasswordData({...passwordData, current: e.target.value})}
                        className="w-full bg-foreground/5 border border-transparent focus:border-accent-gold focus:bg-background rounded-xl px-4 py-3 text-foreground transition-colors outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground/80">{t("Yeni Şifre", "New Password", "كلمة المرور الجديدة")}</label>
                        <input 
                          type={showPwd ? 'text' : 'password'}
                          required
                          value={passwordData.new}
                          onChange={e => setPasswordData({...passwordData, new: e.target.value})}
                          className="w-full bg-foreground/5 border border-transparent focus:border-accent-gold focus:bg-background rounded-xl px-4 py-3 text-foreground transition-colors outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground/80">{t("Yeni Şifre (Tekrar)", "New Password (Repeat)", "كلمة المرور الجديدة (تكرار)")}</label>
                        <input 
                          type={showPwd ? 'text' : 'password'}
                          required
                          value={passwordData.confirm}
                          onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                          className="w-full bg-foreground/5 border border-transparent focus:border-accent-gold focus:bg-background rounded-xl px-4 py-3 text-foreground transition-colors outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <button 
                        type="button"
                        onClick={() => setShowPwd(!showPwd)}
                        className="text-sm text-foreground/60 hover:text-foreground flex items-center gap-2 transition-colors"
                      >
                        {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                        {t("Şifreyi Göster", "Show Password", "إظهار كلمة المرور")}
                      </button>

                      <button 
                        type="submit"
                        disabled={pwdLoading}
                        className="bg-foreground text-background px-8 py-3 rounded-xl text-sm font-medium hover:bg-accent-gold transition-colors disabled:opacity-50"
                      >
                        {pwdLoading ? t("Kaydediliyor...", "Saving...", "جارٍ الحفظ...") : t("Şifreyi Güncelle", "Update Password", "تحديث كلمة المرور")}
                      </button>
                    </div>
                  </form>
                </div>
              
                <div className="mt-8 pt-8 border-t border-foreground/10 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-red-600">Oturumu Kapat</h3>
                    <p className="text-sm text-foreground/60 mt-1">{t("Geçerli cihazdan güvenle çıkış yapın.", "Sign out securely from this device.", "سجّل الخروج بأمان من هذا الجهاز.")}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-500/10 text-red-600 px-6 py-3 rounded-xl font-medium hover:bg-red-500 hover:text-white transition-colors"
                  >
                    {t("Çıkış Yap", "Sign Out", "تسجيل الخروج")}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
