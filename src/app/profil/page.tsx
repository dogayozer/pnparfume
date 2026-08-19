'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Wallet, Gift, Users, Copy, Check, Package, Clock, ShieldCheck, Info, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react'

// Mock User Data based on our new DB architecture
const mockUser = {
  name: 'Sera Yılmaz',
  email: 'sera.yilmaz@ornek.com',
  partner_type: 'influencer', // retail, influencer, b2b_sampler
  referral_code: 'SERA-VNTG-24',
  wallet_balance: 1450,
  earned_samples: 0,
  coupons: [
    { code: 'HOŞGELDİN15', type: 'Hoşgeldin İndirimi', discount: '150 TL', expiresAt: '2026-11-15' },
    { code: 'REF-8319', type: 'Tavsiye Ödülü', discount: '200 TL', expiresAt: '2026-09-01' }
  ],
  orders: [
    { 
      id: 'PN-49182', date: '12 Ağustos 2026', total: '1850 TL', status: 'Kargoya Verildi', combinedWith: null,
      items: [{ name: 'PN Parfüm - Midnight Oud', sku: 'PN-MND-01' }, { name: 'Gül Şehri Koleksiyonu', sku: 'PN-RS-02' }]
    },
    { 
      id: 'PN-49332', date: '14 Ağustos 2026', total: '850 TL', status: 'Hazırlanıyor', combinedWith: null,
      items: [{ name: 'PN Parfüm - Citrus Breeze', sku: 'PN-CB-01' }]
    },
    { 
      id: 'PN-38192', date: '01 Ağustos 2026', total: '600 TL', status: 'Teslim Edildi', combinedWith: 'PN-38191',
      items: [{ name: 'Klasik Beyaz Çiçekler', sku: 'PN-WHT-03' }]
    },
    { 
      id: 'PN-37111', date: '15 Temmuz 2026', total: '1200 TL', status: 'İptal Edildi', combinedWith: null,
      items: [{ name: 'Amber Geccesi Serisi', sku: 'PN-AMB-05' }]
    },
  ]
}

export default function ProfilePage() {

  const [user, setUser] = useState<any>(null)
  
  // Address Update State
  const [addressData, setAddressData] = useState({ phone: '', address: '' })
  const [addressMsg, setAddressMsg] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [addressLoading, setAddressLoading] = useState(false)


  // State for order address update
  const [orders, setOrders] = useState<any[]>([])
  const [editingOrderAddr, setEditingOrderAddr] = useState<string | null>(null)
  const [newOrderAddr, setNewOrderAddr] = useState('')
  const [orderAddrMsg, setOrderAddrMsg] = useState<{type: 'success' | 'error', text: string} | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const parsed = JSON.parse(savedUser)
      setUser(parsed)
      setAddressData({
        phone: parsed.phone || '',
        address: parsed.address || ''
      })
      
      // Fetch fresh orders and real data
      fetch('/api/user/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: parsed.id })
      })
      .then(r => r.json())
      .then(data => {
        if (!data.error) {
           setUser(data)
           setOrders(data.orders || [])
           localStorage.setItem('user', JSON.stringify(data))
        }
      })
      .catch(console.error)

    } else {
      window.location.href = '/hesap'
    }
  }, [])

  const handleOrderAddrUpdate = async (orderId: string) => {
    setOrderAddrMsg(null)
    try {
      const res = await fetch('/api/orders/update-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          newAddress: newOrderAddr,
          userId: user?.id
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      
      setOrders(orders.map(o => o.id === orderId ? { ...o, customerAddress: newOrderAddr } : o))
      setEditingOrderAddr(null)
      setOrderAddrMsg({ type: 'success', text: 'Sipariş adresi güncellendi' })
      setTimeout(() => setOrderAddrMsg(null), 3000)
    } catch (err: any) {
      setOrderAddrMsg({ type: 'error', text: err.message })
    }
  }



  const handleAddressUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setAddressLoading(true)
    setAddressMsg(null)
    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          phone: addressData.phone,
          address: addressData.address
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      
      // Update local storage
      const updatedUser = { ...user, ...data.user }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      
      setAddressMsg({ type: 'success', text: 'Bilgileriniz başarıyla güncellendi!' })
    } catch (err: any) {
      setAddressMsg({ type: 'error', text: err.message || 'Güncelleme hatası' })
    } finally {
      setAddressLoading(false)
    }
  }

  // Use user if available, fallback to mockUser for structure
  const displayUser = user ? { ...mockUser, name: user.name, email: user.email } : mockUser

  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'ozet' | 'kuponlar' | 'siparisler' | 'b2b' | 'ayarlar'>('ozet')
  
  // Sipariş alt sekmesi (Mevcut veya Geçmiş)
  const [orderSubTab, setOrderSubTab] = useState<'aktif' | 'gecmis'>('aktif')
  
  // Şifre değiştirme state
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdMsg, setPwdMsg] = useState<{type: 'success' | 'error', text: string} | null>(null)


  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  const copyCode = () => {
    navigator.clipboard.writeText(mockUser.referral_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    setPwdMsg(null)
    
    if (passwordData.new !== passwordData.confirm) {
      setPwdMsg({ type: 'error', text: 'Yeni şifreler eşleşmiyor!' })
      return
    }
    
    if (passwordData.new.length < 6) {
      setPwdMsg({ type: 'error', text: 'Şifreniz en az 6 karakter olmalıdır.' })
      return
    }

    setPwdLoading(true)
    // Gerçek bir API isteği simülasyonu
    setTimeout(() => {
      setPwdLoading(false)
      setPwdMsg({ type: 'success', text: 'Şifreniz başarıyla güncellendi!' })
      setPasswordData({ current: '', new: '', confirm: '' })
    }, 1500)
  }


  // Map Prisma statuses to UI
  const getStatusTr = (status: string) => {
    switch(status) {
      case 'pending': return 'Ödeme Bekliyor'
      case 'paid': return 'Hazırlanıyor'
      case 'shipped': return 'Kargoya Verildi'
      case 'delivered': return 'Teslim Edildi'
      case 'cancelled': return 'İptal Edildi'
      default: return status
    }
  }

  const activeOrders = orders.filter((o: any) => o.status === 'pending' || o.status === 'paid' || o.status === 'shipped')
  const pastOrders = orders.filter((o: any) => o.status === 'delivered' || o.status === 'cancelled')


  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        
        <Link href="/" className="inline-flex items-center text-sm font-medium text-accent-gold hover:text-accent-rose transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" /> Ana Sayfaya Dön
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-light tracking-wide mb-2 text-foreground">Hesabım</h1>
          <p className="text-foreground/60 font-light">Hoş geldin, {displayUser.name}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sol Menü (Tabs) */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0">
              <button 
                onClick={() => setActiveTab('ozet')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${activeTab === 'ozet' ? 'bg-foreground/5 text-foreground font-medium' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'}`}
              >
                <Users size={18} /> Hesap Özeti
              </button>
              <button 
                onClick={() => setActiveTab('kuponlar')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${activeTab === 'kuponlar' ? 'bg-foreground/5 text-foreground font-medium' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'}`}
              >
                <Gift size={18} /> Ayrıcalıklarım
              </button>
              <button 
                onClick={() => setActiveTab('siparisler')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${activeTab === 'siparisler' ? 'bg-foreground/5 text-foreground font-medium' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'}`}
              >
                <Package size={18} /> Sipariş Yönetimi
              </button>
              
              <button 
                onClick={() => setActiveTab('b2b')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${activeTab === 'b2b' ? 'bg-foreground/5 text-foreground font-medium' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'}`}
              >
                <ShieldCheck size={18} /> Özel Davet & Elçilik
              </button>
              
              <button 
                onClick={() => setActiveTab('ayarlar')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${activeTab === 'ayarlar' ? 'bg-foreground/5 text-foreground font-medium' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'}`}
              >
                <Lock size={18} /> Ayarlar ve Güvenlik
              </button>
            </div>
          </div>

          {/* Sağ İçerik Alanı */}
          <div className="flex-1">
            
            {activeTab === 'ozet' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Gelir / Cüzdan Özeti */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Cüzdan */}
                  <div className="bg-foreground/5 border border-foreground/10 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                      <Wallet size={120} />
                    </div>
                    <p className="text-sm uppercase tracking-widest text-foreground/60 mb-2">Cüzdan Bakiyesi</p>
                    <h2 className="text-5xl font-light text-accent-gold mb-4">{displayUser.wallet_balance} TL</h2>
                    <p className="text-sm text-foreground/70 leading-relaxed font-light max-w-[200px]">
                      Bu bakiyeyi sonraki alışverişlerinizde kargo hariç ürün bedelinden düşebilirsiniz.
                    </p>
                  </div>

                  {/* Referans Kodu */}
                  <div className="bg-background border border-foreground/10 rounded-3xl p-8 flex flex-col justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-widest text-foreground/60 mb-2">Özel Davet (Elçilik) Kodunuz</p>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="px-6 py-4 bg-foreground/5 border border-foreground/10 rounded-xl font-mono text-xl tracking-wider text-foreground">
                          {displayUser.referral_code}
                        </div>
                        <button 
                          onClick={copyCode}
                          className="w-14 h-14 bg-foreground text-background rounded-xl flex items-center justify-center hover:bg-accent-gold transition-colors"
                        >
                          {copied ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-foreground/10">
                      <p className="text-xs text-foreground/60 leading-relaxed font-light">
                        Sizin gibi seçkin zevklere sahip dostlarınızı PN Parfüm dünyasına davet edin. Onlar ayrıcalıklı bir karşılama hediyesi kazanırken, siz de PN Cüzdanınıza teşekkür hediyeleri biriktirin.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'kuponlar' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-light">Ayrıcalıklarım</h2>
                    <p className="text-foreground/60 text-sm mt-1 font-light">Size özel tanımlanan hediye kodları ve davetiyeler.</p>
                  </div>
                  <div className="bg-accent-gold/10 text-accent-gold px-4 py-2 rounded-full text-sm font-medium">
                    {displayUser.coupons.length} Aktif Kupon
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayUser.coupons.map((coupon, i) => (
                    <div key={i} className="border border-foreground/10 border-dashed rounded-2xl p-6 relative overflow-hidden bg-background">
                      <div className="absolute -right-4 -top-4 w-16 h-16 bg-accent-rose/10 rounded-full blur-xl"></div>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-foreground/50 mb-1">{coupon.type}</p>
                          <h3 className="text-2xl font-medium text-accent-rose">{coupon.discount}</h3>
                        </div>
                        <div className="flex items-center text-xs text-foreground/50 bg-foreground/5 px-3 py-1 rounded-full">
                          <Clock size={12} className="mr-1" /> {coupon.expiresAt}
                        </div>
                      </div>
                      <div className="bg-foreground/5 py-3 px-4 rounded-xl text-center font-mono tracking-widest text-foreground/80">
                        {coupon.code}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-4 mt-8">
                  <Info className="text-blue-500 flex-shrink-0" />
                  <p className="text-sm text-blue-700/80 dark:text-blue-300/80 leading-relaxed">
                    <strong>İpucu:</strong> Sepette kuponlarınızı birleştirebilirsiniz! Tek bir ürün için en fazla 3 adet referans kuponunu aynı anda kullanarak devasa indirimler elde edebilirsiniz.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'siparisler' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-2xl font-light mb-2">Sipariş Yönetimi</h2>
                  <p className="text-foreground/60 text-sm font-light">Mevcut kargolarınızı takip edebilir veya eski siparişlerinizi inceleyebilirsiniz.</p>
                </div>

                {/* Sub-tabs for Orders */}
                <div className="flex border-b border-foreground/10">
                  <button 
                    onClick={() => setOrderSubTab('aktif')}
                    className={`pb-4 px-4 text-sm font-medium transition-colors border-b-2 ${orderSubTab === 'aktif' ? 'border-accent-gold text-foreground' : 'border-transparent text-foreground/50 hover:text-foreground/80'}`}
                  >
                    Mevcut Siparişlerim ({activeOrders.length})
                  </button>
                  <button 
                    onClick={() => setOrderSubTab('gecmis')}
                    className={`pb-4 px-4 text-sm font-medium transition-colors border-b-2 ${orderSubTab === 'gecmis' ? 'border-accent-gold text-foreground' : 'border-transparent text-foreground/50 hover:text-foreground/80'}`}
                  >
                    Geçmiş Siparişlerim ({pastOrders.length})
                  </button>
                </div>
                
                <div className="space-y-4 pt-4">
                  {(orderSubTab === 'aktif' ? activeOrders : pastOrders).map((order, i) => (
                    <div key={i} className="border border-foreground/10 rounded-2xl p-6 flex flex-col justify-between items-start gap-4 hover:border-accent-gold/30 transition-colors">
                        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-foreground/5 pb-4 mb-2">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-mono text-sm tracking-wider font-medium">{order.orderNumber}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                order.status === 'delivered' ? 'bg-green-500/10 text-green-600' : 
                                order.status === 'cancelled' ? 'bg-red-500/10 text-red-600' :
                                'bg-accent-gold/10 text-accent-gold'
                              }`}>
                                {getStatusTr(order.status)}
                              </span>
                            </div>
                            <p className="text-sm text-foreground/60">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</p>
                          </div>
                          
                          <div className="text-left sm:text-right w-full sm:w-auto flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                            <span className="text-xl font-light text-accent-rose">{order.totalAmount} TL</span>
                          </div>
                        </div>
  
                        {/* Sipariş İçeriği */}
                        <div className="w-full">
                          <p className="text-xs uppercase tracking-widest text-foreground/50 mb-3">Sipariş İçeriği</p>
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
                                  Adresi Değiştir
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
                                  <button onClick={() => setEditingOrderAddr(null)} className="px-4 py-2 rounded-lg text-xs hover:bg-foreground/5">İptal</button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-foreground/80">{order.customerAddress}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                  {(orderSubTab === 'aktif' ? activeOrders : pastOrders).length === 0 && (
                    <div className="text-center py-12 text-foreground/40 font-light">
                      Bu kategoride siparişiniz bulunmamaktadır.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'ayarlar' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl">
                <div>
                  <h2 className="text-2xl font-light mb-2">Ayarlar ve Güvenlik</h2>
                  <p className="text-foreground/60 text-sm font-light">Şifrenizi ve hesap güvenliğinizi buradan yönetebilirsiniz.</p>
                </div>

                
                  <div className="bg-background border border-foreground/10 rounded-3xl p-8 mb-8">
                    <h3 className="text-lg font-medium mb-6">İletişim ve Teslimat Bilgileri</h3>
                    
                    {addressMsg && (
                      <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm border ${addressMsg.type === 'success' ? 'bg-green-500/10 text-green-700 border-green-500/20' : 'bg-red-500/10 text-red-700 border-red-500/20'}`}>
                        <AlertCircle size={18} /> <span>{addressMsg.text}</span>
                      </div>
                    )}

                    <form onSubmit={handleAddressUpdate} className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground/80">Telefon Numarası</label>
                        <input 
                          type="tel"
                          required
                          value={addressData.phone}
                          onChange={e => setAddressData({...addressData, phone: e.target.value})}
                          className="w-full bg-foreground/5 border border-transparent focus:border-accent-gold focus:bg-background rounded-xl px-4 py-3 text-foreground transition-colors outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground/80">Açık Adres (Siparişler için)</label>
                        <textarea 
                          required
                          rows={3}
                          value={addressData.address}
                          onChange={e => setAddressData({...addressData, address: e.target.value})}
                          className="w-full bg-foreground/5 border border-transparent focus:border-accent-gold focus:bg-background rounded-xl px-4 py-3 text-foreground transition-colors outline-none resize-none"
                          placeholder="Mahalle, Sokak, No, Daire, İlçe/İl"
                        />
                      </div>
                      <div className="pt-2">
                        <button disabled={addressLoading} type="submit" className="w-full bg-foreground text-background py-3 rounded-xl font-medium hover:bg-accent-gold transition-colors disabled:opacity-50">
                          {addressLoading ? 'Güncelleniyor...' : 'Bilgilerimi Kaydet'}
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="bg-background border border-foreground/10 rounded-3xl p-8">
                  <h3 className="text-lg font-medium mb-6">Şifre Değiştirme</h3>
                  
                  {pwdMsg && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm border ${pwdMsg.type === 'success' ? 'bg-green-500/10 text-green-700 border-green-500/20' : 'bg-red-500/10 text-red-700 border-red-500/20'}`}>
                      <AlertCircle size={18} /> <span>{pwdMsg.text}</span>
                    </div>
                  )}

                  <form onSubmit={handlePasswordChange} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground/80">Mevcut Şifre</label>
                      <div className="relative">
                        <input 
                          type={showPwd ? 'text' : 'password'}
                          required
                          value={passwordData.current}
                          onChange={e => setPasswordData({...passwordData, current: e.target.value})}
                          className="w-full bg-foreground/5 border border-transparent focus:border-accent-gold focus:bg-background rounded-xl px-4 py-3 text-foreground transition-colors outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground/80">Yeni Şifre</label>
                        <div className="relative">
                          <input 
                            type={showPwd ? 'text' : 'password'}
                            required
                            value={passwordData.new}
                            onChange={e => setPasswordData({...passwordData, new: e.target.value})}
                            className="w-full bg-foreground/5 border border-transparent focus:border-accent-gold focus:bg-background rounded-xl px-4 py-3 text-foreground transition-colors outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground/80">Yeni Şifre (Tekrar)</label>
                        <div className="relative">
                          <input 
                            type={showPwd ? 'text' : 'password'}
                            required
                            value={passwordData.confirm}
                            onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                            className="w-full bg-foreground/5 border border-transparent focus:border-accent-gold focus:bg-background rounded-xl px-4 py-3 text-foreground transition-colors outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <button 
                        type="button"
                        onClick={() => setShowPwd(!showPwd)}
                        className="text-sm text-foreground/60 hover:text-foreground flex items-center gap-2 transition-colors"
                      >
                        {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                        Şifreyi Göster
                      </button>

                      <button 
                        type="submit"
                        disabled={pwdLoading}
                        className="bg-foreground text-background px-8 py-3 rounded-xl text-sm font-medium hover:bg-accent-gold transition-colors disabled:opacity-50"
                      >
                        {pwdLoading ? 'Kaydediliyor...' : 'Şifreyi Güncelle'}
                      </button>
                    </div>
                  </form>
                </div>
              
                    <div className="mt-8 pt-8 border-t border-foreground/10 flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-red-600">Oturumu Kapat</h3>
                        <p className="text-sm text-foreground/60 mt-1">Geçerli cihazdan güvenle çıkış yapın.</p>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="bg-red-500/10 text-red-600 px-6 py-3 rounded-xl font-medium hover:bg-red-500 hover:text-white transition-colors"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  </div>

            )}

            {activeTab === 'b2b' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-light mb-8">Marka Elçiliği ve Kurumsal İş Ortaklığı</h2>
                
                <div className="bg-foreground/5 border border-foreground/10 rounded-3xl p-8 mb-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-accent-gold/20 rounded-full flex items-center justify-center text-accent-gold">
                      <Package size={24} />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-widest text-foreground/60">Tedarik ve Eşantiyon Kotası (B2B)</p>
                      <h3 className="text-3xl font-light text-foreground">{mockUser.earned_samples} Adet <span className="text-sm text-foreground/50">Hediye Tester Seçimi</span></h3>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/70 leading-relaxed font-light mb-8">
                    Profesyonel iş ortaklarımız, müşterilerine gönderdikleri her paketin içine PN Parfüm ayrıcalık davetiyelerini ekleyerek, karşılığında kendi mağazaları için ücretsiz koku koleksiyonları (tester'lar) kazanır.
                  </p>
                  <div className="flex gap-4">
                    <button className="bg-foreground text-background px-6 py-3 rounded-full text-sm font-medium hover:bg-accent-gold transition-colors opacity-50 cursor-not-allowed">
                      Ayrıcalığı Talep Et (Kota Yetersiz)
                    </button>
                  </div>
                </div>

                <div className="bg-background border border-foreground/10 rounded-3xl p-8 text-center max-w-lg mx-auto">
                  <p className="text-xs uppercase tracking-widest text-foreground/50 mb-3">Kurumsal Ağa Katılın</p>
                  <p className="text-sm font-light text-foreground/80 mb-6">İşletmeniz veya konsept mağazanız için toptan alım şartlarını ve iş ortaklığı fırsatlarını değerlendirin.</p>
                  <Link href="/kurumsal" className="inline-block border border-foreground px-8 py-3 text-xs uppercase tracking-widest font-medium hover:bg-foreground hover:text-background transition-colors">
                    Kurumsal Başvuru Yap
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
