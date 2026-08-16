'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Wallet, Gift, Users, Copy, Check, Package, Clock, ShieldCheck, Info } from 'lucide-react'

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
    { id: 'PN-49182', date: '12 Ağustos 2026', total: '1850 TL', status: 'Kargoya Verildi', combinedWith: null },
    { id: 'PN-38192', date: '01 Ağustos 2026', total: '600 TL', status: 'Teslim Edildi', combinedWith: 'PN-38191' },
  ]
}

export default function ProfilePage() {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'ozet' | 'kuponlar' | 'siparisler' | 'b2b'>('ozet')

  const copyCode = () => {
    navigator.clipboard.writeText(mockUser.referral_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        
        <Link href="/" className="inline-flex items-center text-sm font-medium text-accent-gold hover:text-accent-rose transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" /> Ana Sayfaya Dön
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-light tracking-wide mb-2 text-foreground">Hesabım</h1>
          <p className="text-foreground/60 font-light">Hoş geldin, {mockUser.name}</p>
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
                <Gift size={18} /> Kupon Kasası
              </button>
              <button 
                onClick={() => setActiveTab('siparisler')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${activeTab === 'siparisler' ? 'bg-foreground/5 text-foreground font-medium' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'}`}
              >
                <Package size={18} /> Siparişlerim
              </button>
              
              {/* Sadece B2B veya Influencer ise gösterilebilecek ek sekmeler (Demo amaçlı görünür bırakıldı) */}
              <button 
                onClick={() => setActiveTab('b2b')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${activeTab === 'b2b' ? 'bg-foreground/5 text-foreground font-medium' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'}`}
              >
                <ShieldCheck size={18} /> Ortaklık Paneli
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
                    <h2 className="text-5xl font-light text-accent-gold mb-4">{mockUser.wallet_balance} TL</h2>
                    <p className="text-sm text-foreground/70 leading-relaxed font-light max-w-[200px]">
                      Bu bakiyeyi sonraki alışverişlerinizde kargo hariç ürün bedelinden düşebilirsiniz.
                    </p>
                  </div>

                  {/* Referans Kodu */}
                  <div className="bg-background border border-foreground/10 rounded-3xl p-8 flex flex-col justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-widest text-foreground/60 mb-2">Davet Kodunuz</p>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="px-6 py-4 bg-foreground/5 border border-foreground/10 rounded-xl font-mono text-xl tracking-wider text-foreground">
                          {mockUser.referral_code}
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
                      <p className="text-xs text-foreground/60 leading-relaxed">
                        Arkadaşlarınız bu kodla üye olduklarında anında <strong>150 TL</strong> indirim kazanır. Onlar alışveriş yaptıklarında siz de cüzdanınıza komisyon kazanırsınız.
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
                    <h2 className="text-2xl font-light">Kupon Kasası</h2>
                    <p className="text-foreground/60 text-sm mt-1">Sahip olduğunuz aktif kuponlar (Maksimum 3 ay geçerlidir).</p>
                  </div>
                  <div className="bg-accent-gold/10 text-accent-gold px-4 py-2 rounded-full text-sm font-medium">
                    {mockUser.coupons.length} Aktif Kupon
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockUser.coupons.map((coupon, i) => (
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
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-light mb-8">Sipariş Geçmişim</h2>
                
                <div className="space-y-4">
                  {mockUser.orders.map((order, i) => (
                    <div key={i} className="border border-foreground/10 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-sm tracking-wider">{order.id}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'Teslim Edildi' ? 'bg-green-500/10 text-green-600' : 'bg-accent-gold/10 text-accent-gold'}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/60">{order.date}</p>
                      </div>
                      
                      <div className="text-left sm:text-right w-full sm:w-auto flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                        <span className="text-xl font-light">{order.total}</span>
                        {order.combinedWith && (
                          <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded-full mt-2 inline-block">
                            Arkadaş Kargosu ({order.combinedWith})
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'b2b' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-light mb-8">B2B Pazaryeri Ortaklığı</h2>
                <div className="bg-foreground/5 border border-foreground/10 rounded-3xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-accent-gold/20 rounded-full flex items-center justify-center text-accent-gold">
                      <Package size={24} />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-widest text-foreground/60">Hak Edilmiş Eşantiyon Kotası</p>
                      <h3 className="text-3xl font-light text-foreground">{mockUser.earned_samples} Adet <span className="text-sm text-foreground/50">Tester</span></h3>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/70 leading-relaxed font-light mb-8">
                    Müşterilerinize gönderdiğiniz paketlerin içine PN Parfüm hediye tester'ı (eşantiyon) ve sizin adınıza tanımlı <strong>{mockUser.referral_code}</strong> davet kodunu koyun. Müşteriniz sitemizden bu kodla alışveriş yaptığında kotanız otomatik olarak artar.
                  </p>
                  <button className="bg-foreground text-background px-6 py-3 rounded-full text-sm font-medium hover:bg-accent-gold transition-colors opacity-50 cursor-not-allowed">
                    Eşantiyon Talep Et (Kota Yetersiz)
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
