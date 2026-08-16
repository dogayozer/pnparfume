'use client'

import { useState, useEffect } from 'react'
import { Settings, Save, AlertCircle, RefreshCw, Box, Users, TrendingUp, Sparkles, Server } from 'lucide-react'

type ScenarioRule = { id: string; rule_key: string; rule_value: number; description: string; is_active: boolean }
type AiConfig = { id: string; system_prompt: string; active_campaign: string | null; can_give_discount: boolean; discount_limit: number }
type Order = { id: string; orderNumber: string; totalAmount: number; status: string; createdAt: string; customer: { name: string, email: string } | null }
type Customer = { id: string; name: string | null; email: string; partner_type: string; wallet_balance: number; earned_samples: number; createdAt: string }
type ReportData = { totalRevenue: number; totalOrders: number; totalCustomers: number; aiAssistedPercentage: number }
type MarketplaceStore = { id: string; name: string; platform: string; sellerId: string; isActive: boolean; createdAt: string }
type MarketplaceOrder = { id: string; trendyolOrderId: string; status: string; totalPrice: number; store: { name: string; platform: string }; createdAt: string }

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'scenarios' | 'ai' | 'orders' | 'customers' | 'reports' | 'api'>('scenarios')
  const [loading, setLoading] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Data states
  const [rules, setRules] = useState<ScenarioRule[]>([])
  const [aiConfig, setAiConfig] = useState<AiConfig | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [reports, setReports] = useState<ReportData | null>(null)
  const [stores, setStores] = useState<MarketplaceStore[]>([])
  const [marketOrders, setMarketOrders] = useState<MarketplaceOrder[]>([])

  // New store form state
  const [newStore, setNewStore] = useState({ name: '', platform: 'trendyol', sellerId: '', apiKey: '', apiSecret: '' })

  const showMsg = (type: 'success'|'error', text: string) => { setMessage({type, text}); setTimeout(() => setMessage(null), 3000) }

  const fetchData = async (endpoint: string, setter: any) => {
    setLoading(true)
    try {
      const res = await fetch(endpoint)
      if (res.ok) setter(await res.json())
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    if (activeTab === 'scenarios') fetchData('/api/admin/scenarios', setRules)
    else if (activeTab === 'ai') fetchData('/api/admin/ai', setAiConfig)
    else if (activeTab === 'orders') fetchData('/api/admin/orders', setOrders)
    else if (activeTab === 'customers') fetchData('/api/admin/customers', setCustomers)
    else if (activeTab === 'reports') fetchData('/api/admin/reports', setReports)
    else if (activeTab === 'api') {
      fetchData('/api/admin/marketplace/stores', setStores)
      fetchData('/api/admin/marketplace/orders', setMarketOrders)
    }
  }, [activeTab])

  const handleUpdateRule = async (rule_key: string, newValue: number) => {
    setSavingId(rule_key)
    try {
      const res = await fetch('/api/admin/scenarios', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rule_key, rule_value: newValue })
      })
      if (res.ok) showMsg('success', 'Kural güncellendi.')
      else throw new Error('Hata')
    } catch { showMsg('error', 'Hata oluştu.') }
    finally { setSavingId(null) }
  }

  const handleUpdateAiConfig = async () => {
    if (!aiConfig) return
    setSavingId('ai_config')
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(aiConfig)
      })
      if (res.ok) showMsg('success', 'AI ayarları kaydedildi.')
      else throw new Error('Hata')
    } catch { showMsg('error', 'Hata oluştu.') }
    finally { setSavingId(null) }
  }

  const handleAddStore = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingId('add_store')
    try {
      const res = await fetch('/api/admin/marketplace/stores', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newStore)
      })
      if (res.ok) {
        showMsg('success', 'Bayi başarıyla eklendi.')
        setNewStore({ name: '', platform: 'trendyol', sellerId: '', apiKey: '', apiSecret: '' })
        fetchData('/api/admin/marketplace/stores', setStores)
      } else throw new Error('Hata')
    } catch { showMsg('error', 'Bayi eklenirken hata oluştu.') }
    finally { setSavingId(null) }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 text-white rounded-md flex items-center justify-center font-bold">PN</div>
            <span className="font-medium tracking-wide">Yönetim Paneli</span>
          </div>
          <div className="text-sm font-medium text-gray-500">Hoş geldiniz, Yönetici</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {[
              { id: 'scenarios', icon: Settings, label: 'Senaryolar (Kurallar)' },
              { id: 'ai', icon: Sparkles, label: 'Yapay Zeka (Aura)' },
              { id: 'orders', icon: Box, label: 'Sipariş Yönetimi' },
              { id: 'customers', icon: Users, label: 'Müşteriler & Elçiler' },
              { id: 'reports', icon: TrendingUp, label: 'Raporlar' },
              { id: 'api', icon: Server, label: 'Bayi & API Ent.' },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === tab.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-semibold mb-2">
                {activeTab === 'scenarios' ? 'Senaryo Kuralları' : 
                 activeTab === 'ai' ? 'Asistan Eğitmeni (Aura)' : 
                 activeTab === 'orders' ? 'Sipariş Yönetimi' :
                 activeTab === 'customers' ? 'Müşteriler ve Elçiler' :
                 activeTab === 'reports' ? 'Genel Raporlar' :
                 'Bayi ve API Entegrasyonları'}
              </h1>
            </div>
            <button onClick={() => setActiveTab(activeTab)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 bg-white px-4 py-2 border rounded-lg shadow-sm">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Yenile
            </button>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'} border`}>
              <AlertCircle size={20} /> <span className="font-medium">{message.text}</span>
            </div>
          )}

          {loading && (!reports && !aiConfig && rules.length===0 && orders.length===0 && customers.length===0 && stores.length===0) ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
              <RefreshCw size={32} className="mx-auto mb-4 animate-spin text-gray-300" />
            </div>
          ) : (
            <>
              {activeTab === 'scenarios' && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead><tr className="bg-gray-50 border-b text-gray-500 text-sm"><th className="px-6 py-4 font-medium">Anahtar</th><th className="px-6 py-4 font-medium">Değer</th><th className="px-6 py-4">İşlem</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">
                      {rules.map(rule => (
                        <tr key={rule.id}>
                          <td className="px-6 py-5"><span className="bg-gray-100 px-3 py-1 rounded-md text-sm font-mono border">{rule.rule_key}</span></td>
                          <td className="px-6 py-5"><input type="number" value={rule.rule_value} onChange={(e) => setRules(rules.map(r => r.id === rule.id ? { ...r, rule_value: parseFloat(e.target.value) || 0 } : r))} className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500" /></td>
                          <td className="px-6 py-5"><button onClick={() => handleUpdateRule(rule.rule_key, rule.rule_value)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">Kaydet</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'ai' && aiConfig && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <div className="space-y-6">
                    <div><label className="block text-sm font-semibold mb-2">Sistem Komutu</label><textarea rows={10} value={aiConfig.system_prompt} onChange={e => setAiConfig({...aiConfig, system_prompt: e.target.value})} className="w-full bg-gray-50 border rounded-lg p-4 font-mono text-sm" /></div>
                    <div><label className="block text-sm font-semibold mb-2">Aktif Kampanya</label><textarea rows={3} value={aiConfig.active_campaign || ''} onChange={e => setAiConfig({...aiConfig, active_campaign: e.target.value})} className="w-full border rounded-lg p-4 text-sm" /></div>
                    <button onClick={handleUpdateAiConfig} className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium">Yapay Zeka Ayarlarını Kaydet</button>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b text-sm"><tr className="text-gray-500"><th className="px-6 py-4">Sipariş No</th><th className="px-6 py-4">Müşteri</th><th className="px-6 py-4">Tutar</th><th className="px-6 py-4">Durum</th><th className="px-6 py-4">Tarih</th></tr></thead>
                    <tbody className="divide-y">
                      {orders.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-gray-500">Kayıt yok</td></tr> : orders.map(o => (
                        <tr key={o.id} className="hover:bg-gray-50 text-sm">
                          <td className="px-6 py-4 font-medium">{o.orderNumber}</td>
                          <td className="px-6 py-4">{o.customer?.name || o.customer?.email || 'Bilinmiyor'}</td>
                          <td className="px-6 py-4 font-medium">{o.totalAmount} TL</td>
                          <td className="px-6 py-4"><span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold uppercase">{o.status}</span></td>
                          <td className="px-6 py-4 text-gray-500">{new Date(o.createdAt).toLocaleString('tr-TR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'customers' && (
                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b text-sm"><tr className="text-gray-500"><th className="px-6 py-4">E-posta</th><th className="px-6 py-4">Üyelik Tipi</th><th className="px-6 py-4">Cüzdan</th><th className="px-6 py-4">Tester Kotası</th></tr></thead>
                    <tbody className="divide-y">
                      {customers.length === 0 ? <tr><td colSpan={4} className="p-8 text-center text-gray-500">Kayıt yok</td></tr> : customers.map(c => (
                        <tr key={c.id} className="hover:bg-gray-50 text-sm">
                          <td className="px-6 py-4 font-medium">{c.email}</td>
                          <td className="px-6 py-4"><span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs uppercase font-bold">{c.partner_type}</span></td>
                          <td className="px-6 py-4 font-medium text-green-600">{c.wallet_balance} TL</td>
                          <td className="px-6 py-4">{c.earned_samples} Adet</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'reports' && reports && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-gray-500 font-medium mb-2">Toplam Ciro</h3>
                    <p className="text-4xl font-bold text-gray-900">{reports.totalRevenue.toLocaleString('tr-TR')} TL</p>
                  </div>
                  <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-gray-500 font-medium mb-2">Toplam Sipariş</h3>
                    <p className="text-4xl font-bold text-gray-900">{reports.totalOrders}</p>
                  </div>
                  <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-gray-500 font-medium mb-2">Toplam Müşteri</h3>
                    <p className="text-4xl font-bold text-gray-900">{reports.totalCustomers}</p>
                  </div>
                  <div className="bg-indigo-600 p-8 rounded-2xl shadow-sm text-white">
                    <h3 className="text-indigo-100 font-medium mb-2">Yapay Zeka (Aura) Satış Oranı</h3>
                    <p className="text-4xl font-bold">% {reports.aiAssistedPercentage}</p>
                  </div>
                </div>
              )}

              {activeTab === 'api' && (
                <div className="space-y-8">
                  {/* Yeni Bayi Ekleme */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4">Yeni Bayi / API Entegrasyonu Ekle</h3>
                    <form onSubmit={handleAddStore} className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Mağaza Adı</label>
                        <input required value={newStore.name} onChange={e=>setNewStore({...newStore, name:e.target.value})} className="w-full border rounded-lg px-4 py-2" placeholder="Örn: Fodos Bayi" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Platform</label>
                        <select value={newStore.platform} onChange={e=>setNewStore({...newStore, platform:e.target.value})} className="w-full border rounded-lg px-4 py-2 bg-white">
                          <option value="trendyol">Trendyol</option>
                          <option value="hepsiburada">Hepsiburada</option>
                          <option value="ikas">İkas</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Satıcı (Seller) ID</label>
                        <input required value={newStore.sellerId} onChange={e=>setNewStore({...newStore, sellerId:e.target.value})} className="w-full border rounded-lg px-4 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">API Key</label>
                        <input required value={newStore.apiKey} onChange={e=>setNewStore({...newStore, apiKey:e.target.value})} className="w-full border rounded-lg px-4 py-2" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">API Secret</label>
                        <input required type="password" value={newStore.apiSecret} onChange={e=>setNewStore({...newStore, apiSecret:e.target.value})} className="w-full border rounded-lg px-4 py-2" />
                      </div>
                      <div className="md:col-span-2 text-right">
                        <button type="submit" disabled={savingId==='add_store'} className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium">{savingId==='add_store' ? 'Ekleniyor...' : 'Ekle'}</button>
                      </div>
                    </form>
                  </div>

                  {/* Tanımlı Bayiler */}
                  <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                    <h3 className="font-semibold text-lg p-6 pb-2">Tanımlı Bayiler</h3>
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b text-sm"><tr className="text-gray-500"><th className="px-6 py-4">Mağaza Adı</th><th className="px-6 py-4">Platform</th><th className="px-6 py-4">Satıcı ID</th><th className="px-6 py-4">Durum</th></tr></thead>
                      <tbody className="divide-y">
                        {stores.length === 0 ? <tr><td colSpan={4} className="p-8 text-center text-gray-500">Henüz bayi eklenmedi.</td></tr> : stores.map(s => (
                          <tr key={s.id} className="hover:bg-gray-50 text-sm">
                            <td className="px-6 py-4 font-medium">{s.name}</td>
                            <td className="px-6 py-4 capitalize">{s.platform}</td>
                            <td className="px-6 py-4 font-mono text-xs">{s.sellerId}</td>
                            <td className="px-6 py-4"><span className="text-green-600 bg-green-50 px-2 py-1 rounded font-semibold text-xs">Aktif</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Bayi Siparişleri */}
                  <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                    <h3 className="font-semibold text-lg p-6 pb-2">Pazaryeri Siparişleri</h3>
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b text-sm"><tr className="text-gray-500"><th className="px-6 py-4">Sipariş No (Portal)</th><th className="px-6 py-4">Mağaza / Bayi</th><th className="px-6 py-4">Tutar</th><th className="px-6 py-4">Tarih</th></tr></thead>
                      <tbody className="divide-y">
                        {marketOrders.length === 0 ? <tr><td colSpan={4} className="p-8 text-center text-gray-500">Pazaryeri siparişi bulunamadı.</td></tr> : marketOrders.map(mo => (
                          <tr key={mo.id} className="hover:bg-gray-50 text-sm">
                            <td className="px-6 py-4 font-medium">{mo.trendyolOrderId}</td>
                            <td className="px-6 py-4">{mo.store.name} <span className="text-gray-400 text-xs uppercase">({mo.store.platform})</span></td>
                            <td className="px-6 py-4 font-medium">{mo.totalPrice} TL</td>
                            <td className="px-6 py-4 text-gray-500">{new Date(mo.createdAt).toLocaleDateString('tr-TR')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
