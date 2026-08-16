'use client'

import { useState } from 'react'
import { Package, RefreshCw, ShoppingCart, Truck, AlertCircle, Globe, Store, ShoppingBag } from 'lucide-react'

// Sahte Mağaza Listesi (2 Native, 3 Trendyol, 4 İkas)
const initialStores = [
  // Native (Kendi Web Sitemiz)
  { id: 'n1', platform: 'native', name: 'PN Parfüm Resmi Web', sellerId: 'pn-parfum.com', status: 'active', lastSync: 'Şimdi', orderCount: 245 },
  { id: 'n2', platform: 'native', name: 'PN Parfüm B2B Portal', sellerId: 'b2b.pn-parfum.com', status: 'active', lastSync: '5 dk önce', orderCount: 12 },
  
  // Trendyol
  { id: 't1', platform: 'trendyol', name: 'Trendyol Merkez', sellerId: '123456', status: 'active', lastSync: '10 dakika önce', orderCount: 145 },
  { id: 't2', platform: 'trendyol', name: 'Trendyol Fodos Bayi', sellerId: '987654', status: 'active', lastSync: '1 saat önce', orderCount: 32 },
  { id: 't3', platform: 'trendyol', name: 'Trendyol Teknoson Bayi', sellerId: '456789', status: 'warning', lastSync: 'Dün', orderCount: 8 },
  
  // İkas
  { id: 'i1', platform: 'ikas', name: 'İkas Piaks Store', sellerId: 'piaks.myikas.com', status: 'active', lastSync: 'Yarım saat önce', orderCount: 56 },
  { id: 'i2', platform: 'ikas', name: 'İkas E-Global', sellerId: 'eglobal.myikas.com', status: 'active', lastSync: '15 dk önce', orderCount: 24 },
  { id: 'i3', platform: 'ikas', name: 'İkas Kozmetik Dünyası', sellerId: 'kozmetik.myikas.com', status: 'active', lastSync: '2 saat önce', orderCount: 41 },
  { id: 'i4', platform: 'ikas', name: 'İkas Concept Parfüm', sellerId: 'concept.myikas.com', status: 'warning', lastSync: '3 gün önce', orderCount: 3 }
]

export default function OperationDashboard() {
  const [stores, setStores] = useState(initialStores)
  const [syncingStore, setSyncingStore] = useState<string | null>(null)
  const [fetchingOrders, setFetchingOrders] = useState<string | null>(null)

  const handleSyncStock = async (storeId: string) => {
    setSyncingStore(storeId)
    // Simüle API İsteği
    await new Promise(resolve => setTimeout(resolve, 2000))
    setStores(stores.map(s => s.id === storeId ? { ...s, lastSync: 'Şimdi' } : s))
    setSyncingStore(null)
  }

  const handleFetchOrders = async (storeId: string) => {
    setFetchingOrders(storeId)
    // Simüle API İsteği
    await new Promise(resolve => setTimeout(resolve, 2500))
    setStores(stores.map(s => s.id === storeId ? { ...s, orderCount: s.orderCount + Math.floor(Math.random() * 5) } : s))
    setFetchingOrders(null)
  }

  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'native': return <Globe size={18} className="text-blue-500" />
      case 'trendyol': return <ShoppingBag size={18} className="text-orange-500" />
      case 'ikas': return <Store size={18} className="text-purple-500" />
      default: return <Package size={18} />
    }
  }

  const getPlatformLabel = (platform: string) => {
    switch(platform) {
      case 'native': return <span className="text-[10px] bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Web</span>
      case 'trendyol': return <span className="text-[10px] bg-orange-500/10 text-orange-600 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Trendyol</span>
      case 'ikas': return <span className="text-[10px] bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded uppercase font-bold tracking-wider">İkas</span>
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-12 border-b border-foreground/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-light text-foreground mb-2">Omnichannel Operasyon Merkezi</h1>
            <p className="text-foreground/60 font-light">
              Tüm Kendi Web Siteleriniz, Trendyol ve İkas Mağazalarınızı Tek Ekrandan Yönetin.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center p-3 bg-foreground/5 rounded-lg min-w-24">
              <span className="text-xl font-medium text-foreground">{stores.filter(s => s.platform === 'native').length}</span>
              <span className="text-xs text-foreground/50 uppercase">Native</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-foreground/5 rounded-lg min-w-24">
              <span className="text-xl font-medium text-foreground">{stores.filter(s => s.platform === 'trendyol').length}</span>
              <span className="text-xs text-foreground/50 uppercase">Trendyol</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-foreground/5 rounded-lg min-w-24">
              <span className="text-xl font-medium text-foreground">{stores.filter(s => s.platform === 'ikas').length}</span>
              <span className="text-xs text-foreground/50 uppercase">İkas</span>
            </div>
          </div>
        </div>

        {/* Mağazalar Tablosu */}
        <div className="bg-foreground/[0.02] border border-foreground/10 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6 bg-foreground/5 border-b border-foreground/10 font-medium text-sm text-foreground/70 uppercase tracking-wider">
            <div className="md:col-span-2">Platform & Mağaza Bilgisi</div>
            <div>Bekleyen Sipariş</div>
            <div>Son Senkronizasyon</div>
            <div className="text-right">Aksiyonlar</div>
          </div>
          
          <div className="divide-y divide-foreground/10">
            {stores.map(store => (
              <div key={store.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6 items-center hover:bg-foreground/[0.01] transition-colors">
                
                <div className="md:col-span-2 flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background border border-foreground/10 shadow-sm">
                    {getPlatformIcon(store.platform)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-medium text-foreground">{store.name}</h3>
                      {getPlatformLabel(store.platform)}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${store.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <p className="text-xs text-foreground/50">{store.sellerId}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-foreground/80">
                  <Package size={16} className="text-foreground/40" />
                  <span className="font-medium">{store.orderCount} Paket</span>
                </div>

                <div className="flex items-center gap-2 text-foreground/60 text-sm">
                  <RefreshCw size={14} className={syncingStore === store.id ? 'animate-spin text-accent-gold' : ''} />
                  {store.lastSync}
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <button 
                    onClick={() => handleFetchOrders(store.id)}
                    disabled={fetchingOrders === store.id}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded-md text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {fetchingOrders === store.id ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <ShoppingCart size={14} />
                    )}
                    Siparişleri Çek
                  </button>
                  <button 
                    onClick={() => handleSyncStock(store.id)}
                    disabled={syncingStore === store.id}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-foreground text-background hover:bg-accent-gold rounded-md text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {syncingStore === store.id ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <Truck size={14} />
                    )}
                    Stokları Eşitle
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* API Uyarıları / Bilgilendirme */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-orange-500/5 border border-orange-500/20 rounded-xl flex items-start gap-4">
            <ShoppingBag className="text-orange-500 flex-shrink-0 mt-1" size={24} />
            <div>
              <h4 className="text-orange-600 font-medium mb-1">Trendyol API V2 Rate Limit</h4>
              <p className="text-sm text-orange-600/80 leading-relaxed">
                Trendyol stok eşitlemesi arka planda <code>price-and-inventory</code> V2 servisi ile batch (kuyruk) halinde yapılır. Rate limit aşılmaması için işlemler hafif gecikmeli yansıyabilir.
              </p>
            </div>
          </div>

          <div className="p-6 bg-purple-500/5 border border-purple-500/20 rounded-xl flex items-start gap-4">
            <Store className="text-purple-500 flex-shrink-0 mt-1" size={24} />
            <div>
              <h4 className="text-purple-600 font-medium mb-1">İkas GraphQL Private App</h4>
              <p className="text-sm text-purple-600/80 leading-relaxed">
                İkas stok eşitlemesi <code>saveVariantPrices</code> mutasyonu kullanılarak yapılır. Şimdilik manuel butona bağlıdır, ilerleyen aşamada Webhook entegrasyonuna geçilmesi tavsiye edilir.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
