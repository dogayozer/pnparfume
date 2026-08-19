'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  Settings, Save, AlertCircle, RefreshCw, Box, Users, TrendingUp, 
  Sparkles, Server, PackagePlus, UploadCloud, Percent, Truck, 
  CheckCircle, Clock, XCircle, ExternalLink, MessageCircle, Eye, 
  Search, Filter, MapPin, User, Phone, Mail, Calendar, ChevronRight, 
  X, Package, Check, Copy, ArrowRight, ShoppingCart, Award, Gift, 
  CreditCard, Tag, Edit3, ShieldCheck
} from 'lucide-react'
import * as XLSX from 'xlsx'

type ScenarioRule = { id: string; rule_key: string; rule_value: number; description: string; is_active: boolean }
type AiConfig = { id: string; system_prompt: string; active_campaign: string | null; can_give_discount: boolean; discount_limit: number }
type Order = { 
  id: string
  orderNumber: string
  totalAmount: number
  discountApplied?: number
  status: string
  items?: any
  customerName?: string | null
  customerEmail?: string | null
  customerPhone?: string | null
  customerAddress?: string | null
  cargoCompany?: string | null
  trackingCode?: string | null
  combinedWithOrderId?: string | null
  shippingCostDiscount?: number
  ai_assisted?: boolean
  createdAt: string
  customer?: { id?: string; name?: string | null; email?: string; phone?: string | null } | null
  coupon?: { code?: string; value?: number; discount_type?: string } | null
}
type Customer = { 
  id: string
  name: string | null
  email: string
  phone?: string | null
  address?: string | null
  birth_year?: number | null
  birth_date?: string | null
  profession?: string | null
  budget_segment?: string | null
  dominant_mood?: string | null
  whatsapp_opt_in?: boolean
  email_opt_in?: boolean
  sms_opt_in?: boolean
  referral_code?: string | null
  partner_type: string
  wallet_balance: number
  earned_samples: number
  lastLogin?: string | null
  cart?: any
  createdAt: string
  updatedAt?: string
  orders?: any[]
  coupons?: any[]
}
type ReportData = { totalRevenue: number; totalOrders: number; totalCustomers: number; aiAssistedPercentage: number }
type MarketplaceStore = { id: string; name: string; platform: string; sellerId: string; isActive: boolean; createdAt: string }
type MarketplaceOrder = { id: string; trendyolOrderId: string; status: string; totalPrice: number; store: { name: string; platform: string }; createdAt: string }

const CARGO_COMPANIES = [
  'Yurtiçi Kargo',
  'Aras Kargo',
  'MNG Kargo',
  'Sürat Kargo',
  'PTT Kargo',
  'HepsiJet',
  'Trendyol Express',
  'Kolay Gelsin',
  'Özel Kurye / Diğer'
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'scenarios' | 'ai' | 'orders' | 'customers' | 'reports' | 'api' | 'products'>('orders')
  const [loading, setLoading] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Auth states
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Data states
  const [rules, setRules] = useState<ScenarioRule[]>([])
  const [aiConfig, setAiConfig] = useState<AiConfig | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [reports, setReports] = useState<ReportData | null>(null)
  const [stores, setStores] = useState<MarketplaceStore[]>([])
  const [marketOrders, setMarketOrders] = useState<MarketplaceOrder[]>([])

  // Order Management States
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderSearch, setOrderSearch] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState('all')
  const [shippingModalOrder, setShippingModalOrder] = useState<Order | null>(null)
  const [cargoCompanyInput, setCargoCompanyInput] = useState('Yurtiçi Kargo')
  const [trackingCodeInput, setTrackingCodeInput] = useState('')
  const [copiedAddr, setCopiedAddr] = useState(false)

  // Customer Management States
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerSearch, setCustomerSearch] = useState('')
  const [customerFilter, setCustomerFilter] = useState('all')
  const [customerModalTab, setCustomerModalTab] = useState<'profile' | 'partner' | 'cart' | 'history'>('profile')
  const [editCustomerData, setEditCustomerData] = useState<{
    partner_type: string
    wallet_balance: number
    earned_samples: number
    phone: string
    name: string
    address: string
    profession: string
  }>({
    partner_type: 'retail',
    wallet_balance: 0,
    earned_samples: 0,
    phone: '',
    name: '',
    address: '',
    profession: ''
  })

  // New store form state
  const [newStore, setNewStore] = useState({ name: '', platform: 'trendyol', sellerId: '', apiKey: '', apiSecret: '' })

  // Product Bulk update states
  const [importProgress, setImportProgress] = useState<{current: number, total: number} | null>(null)
  const [bulkPriceData, setBulkPriceData] = useState({ platform: 'all', type: 'zam', percentage: '' })

  const showMsg = (type: 'success'|'error', text: string) => { setMessage({type, text}); setTimeout(() => setMessage(null), 4000) }

  const fetchData = async (endpoint: string, setter: any) => {
    setLoading(true)
    try {
      const res = await fetch(endpoint)
      if (res.ok) setter(await res.json())
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    if (!isAuthenticated) return;
    if (activeTab === 'scenarios') fetchData('/api/admin/scenarios', setRules)
    else if (activeTab === 'ai') fetchData('/api/admin/ai', setAiConfig)
    else if (activeTab === 'orders') fetchData('/api/admin/orders', setOrders)
    else if (activeTab === 'customers') fetchData('/api/admin/customers', setCustomers)
    else if (activeTab === 'reports') fetchData('/api/admin/reports', setReports)
    else if (activeTab === 'api') {
      fetchData('/api/admin/marketplace/stores', setStores)
      fetchData('/api/admin/marketplace/orders', setMarketOrders)
    }
  }, [activeTab, isAuthenticated])

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

  const handleUpdateOrderStatus = async (orderId: string, status: string, cargoCompany?: string, trackingCode?: string) => {
    setSavingId(`order_${orderId}`)
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status,
          cargoCompany: cargoCompany !== undefined ? cargoCompany : undefined,
          trackingCode: trackingCode !== undefined ? trackingCode : undefined
        })
      })
      const data = await res.json()
      if (res.ok) {
        showMsg('success', 'Sipariş durumu güncellendi.')
        setOrders(prev => prev.map(o => o.id === orderId ? {
          ...o,
          status,
          cargoCompany: cargoCompany !== undefined ? cargoCompany : o.cargoCompany,
          trackingCode: trackingCode !== undefined ? trackingCode : o.trackingCode
        } : o))
        
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => prev ? {
            ...prev,
            status,
            cargoCompany: cargoCompany !== undefined ? cargoCompany : prev.cargoCompany,
            trackingCode: trackingCode !== undefined ? trackingCode : prev.trackingCode
          } : null)
        }
        setShippingModalOrder(null)
      } else {
        showMsg('error', data.error || 'Güncelleme hatası')
      }
    } catch {
      showMsg('error', 'Sunucu hatası')
    } finally {
      setSavingId(null)
    }
  }

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCustomer) return
    setSavingId('save_customer')

    try {
      const res = await fetch('/api/admin/customers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: selectedCustomer.id,
          ...editCustomerData
        })
      })
      const data = await res.json()
      if (res.ok) {
        showMsg('success', 'Müşteri bilgileri güncellendi.')
        setCustomers(prev => prev.map(c => c.id === selectedCustomer.id ? { ...c, ...data.customer } : c))
        setSelectedCustomer(prev => prev ? { ...prev, ...data.customer } : null)
      } else {
        showMsg('error', data.error || 'Güncelleme başarısız')
      }
    } catch {
      showMsg('error', 'Sunucu hatası')
    } finally {
      setSavingId(null)
    }
  }

  const handleOpenCustomerDetail = (c: Customer) => {
    setSelectedCustomer(c)
    setEditCustomerData({
      partner_type: c.partner_type || 'retail',
      wallet_balance: c.wallet_balance || 0,
      earned_samples: c.earned_samples || 0,
      phone: c.phone || '',
      name: c.name || '',
      address: c.address || '',
      profession: c.profession || ''
    })
    setCustomerModalTab('profile')
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

  // --- Excel Import (Chunking) Logic ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSavingId('excel_import')
    
    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data, { type: 'buffer' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      if (!jsonData || jsonData.length === 0) {
        showMsg('error', 'Excel dosyası boş veya hatalı formatta.')
        setSavingId(null)
        return
      }

      const chunkSize = 50
      const chunks = []
      for (let i = 0; i < jsonData.length; i += chunkSize) {
        chunks.push(jsonData.slice(i, i + chunkSize))
      }

      setImportProgress({ current: 0, total: jsonData.length })

      let totalProcessed = 0
      for (let i = 0; i < chunks.length; i++) {
        const res = await fetch('/api/admin/products/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ products: chunks[i] })
        })

        if (!res.ok) {
          throw new Error(`Chunk ${i + 1} aktarılamadı`)
        }

        totalProcessed += chunks[i].length
        setImportProgress({ current: totalProcessed, total: jsonData.length })
      }

      showMsg('success', `Toplam ${totalProcessed} ürün başarıyla yüklendi/güncellendi!`)
      setImportProgress(null)
    } catch (err: any) {
      console.error(err)
      showMsg('error', err.message || 'Excel aktarımı sırasında hata oluştu.')
    } finally {
      setSavingId(null)
      e.target.value = ''
    }
  }

  const handleBulkPriceUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bulkPriceData.percentage || isNaN(Number(bulkPriceData.percentage))) {
      showMsg('error', 'Geçerli bir yüzde girin.')
      return
    }

    setSavingId('bulk_price')
    try {
      const res = await fetch('/api/admin/products/bulk-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bulkPriceData)
      })

      const data = await res.json()
      if (res.ok) {
        showMsg('success', data.message || 'Fiyatlar başarıyla güncellendi.')
        setBulkPriceData({ platform: 'all', type: 'zam', percentage: '' })
      } else {
        throw new Error(data.error || 'İşlem başarısız')
      }
    } catch (err: any) {
      showMsg('error', err.message || 'Fiyat güncelleme hatası.')
    } finally {
      setSavingId(null)
    }
  }

  // Filtered Orders Calculation
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) {
        return false
      }
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase()
        const matchOrderNo = o.orderNumber?.toLowerCase().includes(q)
        const matchName = (o.customerName || o.customer?.name || '').toLowerCase().includes(q)
        const matchPhone = (o.customerPhone || o.customer?.phone || '').toLowerCase().includes(q)
        const matchEmail = (o.customerEmail || o.customer?.email || '').toLowerCase().includes(q)
        const matchTracking = (o.trackingCode || '').toLowerCase().includes(q)
        if (!matchOrderNo && !matchName && !matchPhone && !matchEmail && !matchTracking) {
          return false
        }
      }
      return true
    })
  }, [orders, orderStatusFilter, orderSearch])

  // Order Counts by Status
  const orderCounts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      paid: orders.filter(o => o.status === 'paid').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    }
  }, [orders])

  // Filtered Customers Calculation
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      if (customerFilter === 'influencer' && c.partner_type !== 'influencer') return false
      if (customerFilter === 'b2b_sampler' && c.partner_type !== 'b2b_sampler') return false
      if (customerFilter === 'retail' && c.partner_type !== 'retail') return false
      if (customerFilter === 'cart_full') {
        const cartItems = Array.isArray(c.cart) ? c.cart : []
        if (cartItems.length === 0) return false
      }
      if (customerFilter === 'recent_login') {
        if (!c.lastLogin) return false
        const diffHours = (Date.now() - new Date(c.lastLogin).getTime()) / (1000 * 60 * 60)
        if (diffHours > 24) return false
      }

      if (customerSearch.trim()) {
        const q = customerSearch.toLowerCase()
        const matchName = (c.name || '').toLowerCase().includes(q)
        const matchEmail = (c.email || '').toLowerCase().includes(q)
        const matchPhone = (c.phone || '').toLowerCase().includes(q)
        const matchRef = (c.referral_code || '').toLowerCase().includes(q)
        const matchProf = (c.profession || '').toLowerCase().includes(q)
        if (!matchName && !matchEmail && !matchPhone && !matchRef && !matchProf) {
          return false
        }
      }
      return true
    })
  }, [customers, customerFilter, customerSearch])

  const customerCounts = useMemo(() => {
    return {
      all: customers.length,
      influencer: customers.filter(c => c.partner_type === 'influencer').length,
      b2b_sampler: customers.filter(c => c.partner_type === 'b2b_sampler').length,
      retail: customers.filter(c => c.partner_type === 'retail').length,
      cart_full: customers.filter(c => Array.isArray(c.cart) && c.cart.length > 0).length,
    }
  }, [customers])

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-semibold"><Clock size={12} /> Ödeme Bekliyor</span>
      case 'paid':
        return <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-semibold"><Settings size={12} /> Hazırlanıyor / İşlemde</span>
      case 'shipped':
        return <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-full text-xs font-semibold"><Truck size={12} /> Kargoya Verildi</span>
      case 'delivered':
        return <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-semibold"><CheckCircle size={12} /> Teslim Edildi</span>
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full text-xs font-semibold"><XCircle size={12} /> İptal Edildi</span>
      default:
        return <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-semibold">{status}</span>
    }
  }

  const getPartnerBadge = (partner_type: string) => {
    switch(partner_type) {
      case 'influencer':
        return <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm"><Award size={12} /> Influencer Elçi</span>
      case 'b2b_sampler':
        return <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"><Gift size={12} /> B2B Sampler</span>
      default:
        return <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-[11px] font-medium">Bireysel Müşteri</span>
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'admin' && password === 'pn2026!') {
      setIsAuthenticated(true)
      setLoginError('')
    } else {
      setLoginError('Kullanıcı adı veya şifre hatalı.')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">PN Parfüm Yönetim</h1>
            <p className="text-sm text-gray-500 mt-1">Lütfen devam etmek için giriş yapın</p>
          </div>
          {loginError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm flex items-center gap-2">
              <AlertCircle size={18} /> {loginError}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Kullanıcı Adı</label>
              <input 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                placeholder="admin" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Şifre</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                placeholder="••••••••" 
                required 
              />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors mt-2">
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex">
      {/* Sol Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold tracking-wider text-sm">PN</div>
            <span className="font-semibold text-gray-900">PN Panel</span>
          </div>
          
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('orders')} 
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${activeTab === 'orders' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <Package size={18} /> Sipariş Yönetimi
              </div>
              {orderCounts.paid > 0 && (
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{orderCounts.paid}</span>
              )}
            </button>

            <button 
              onClick={() => setActiveTab('customers')} 
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${activeTab === 'customers' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <Users size={18} /> Müşteriler & Elçiler
              </div>
              {customerCounts.influencer > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{customerCounts.influencer} Elçi</span>
              )}
            </button>

            <button 
              onClick={() => setActiveTab('scenarios')} 
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${activeTab === 'scenarios' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Settings size={18} /> Senaryo Kuralları
            </button>

            <button 
              onClick={() => setActiveTab('products')} 
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${activeTab === 'products' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <UploadCloud size={18} /> Toplu Fiyat & Ürün
            </button>

            <button 
              onClick={() => setActiveTab('ai')} 
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${activeTab === 'ai' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Sparkles size={18} /> Yapay Zeka (AI)
            </button>

            <button 
              onClick={() => setActiveTab('reports')} 
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${activeTab === 'reports' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <TrendingUp size={18} /> Raporlar
            </button>

            <button 
              onClick={() => setActiveTab('api')} 
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${activeTab === 'api' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Server size={18} /> Pazaryeri & Bayi API
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span>PN Parfüm v2.5</span>
          <button onClick={() => setIsAuthenticated(false)} className="hover:text-red-600 transition-colors">Çıkış</button>
        </div>
      </div>

      {/* Sağ Ana İçerik */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-gray-900 text-lg">
              {activeTab === 'orders' && 'Sipariş Yönetimi & Lojistik'}
              {activeTab === 'customers' && 'Müşteriler, Elçiler & Cüzdan Yönetimi'}
              {activeTab === 'scenarios' && 'Senaryo Kuralları'}
              {activeTab === 'products' && 'Toplu Fiyat & Excel Ürün Yönetimi'}
              {activeTab === 'ai' && 'Nöropazarlama & Yapay Zeka'}
              {activeTab === 'reports' && 'Performans Raporları'}
              {activeTab === 'api' && 'Pazaryeri & Bayi Entegrasyonları'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                if (activeTab === 'orders') fetchData('/api/admin/orders', setOrders)
                else if (activeTab === 'customers') fetchData('/api/admin/customers', setCustomers)
                else if (activeTab === 'scenarios') fetchData('/api/admin/scenarios', setRules)
                else if (activeTab === 'reports') fetchData('/api/admin/reports', setReports)
              }} 
              disabled={loading} 
              className="p-2 text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              title="Yenile"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        <main className="p-8 flex-1 overflow-y-auto">
          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm flex items-center gap-3 border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
              <AlertCircle size={18} /> {message.text}
            </div>
          )}

          {loading && !rules.length && !orders.length && !customers.length ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              <RefreshCw className="animate-spin mr-2" size={20} /> Yükleniyor...
            </div>
          ) : (
            <>
              {/* ===================== SIPARIS YONETIMI ===================== */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  {/* Status Filter Cards & Search */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      {/* Search Bar */}
                      <div className="relative flex-1 max-w-md">
                        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Sipariş No, Müşteri Adı, Telefon, Takip No ara..." 
                          value={orderSearch}
                          onChange={e => setOrderSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {orderSearch && (
                          <button onClick={() => setOrderSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <X size={14} />
                          </button>
                        )}
                      </div>

                      <div className="text-xs text-gray-500">
                        Toplam <span className="font-semibold text-gray-900">{filteredOrders.length}</span> sipariş listeleniyor
                      </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                      {[
                        { key: 'all', label: 'Tüm Siparişler', count: orderCounts.all },
                        { key: 'paid', label: 'Hazırlanıyor / İşlemde', count: orderCounts.paid, color: 'text-blue-700 bg-blue-50 border-blue-200' },
                        { key: 'shipped', label: 'Kargoda', count: orderCounts.shipped, color: 'text-purple-700 bg-purple-50 border-purple-200' },
                        { key: 'pending', label: 'Ödeme Bekliyor', count: orderCounts.pending, color: 'text-amber-700 bg-amber-50 border-amber-200' },
                        { key: 'delivered', label: 'Teslim Edildi', count: orderCounts.delivered, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                        { key: 'cancelled', label: 'İptal', count: orderCounts.cancelled, color: 'text-rose-700 bg-rose-50 border-rose-200' },
                      ].map(tab => (
                        <button
                          key={tab.key}
                          onClick={() => setOrderStatusFilter(tab.key)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors border flex items-center gap-1.5 ${
                            orderStatusFilter === tab.key 
                              ? 'bg-gray-900 text-white border-gray-900 shadow-sm' 
                              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {tab.label}
                          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${orderStatusFilter === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'}`}>
                            {tab.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orders Table */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                            <th className="px-6 py-4">Sipariş No</th>
                            <th className="px-6 py-4">Müşteri</th>
                            <th className="px-6 py-4">Ürünler</th>
                            <th className="px-6 py-4">Tutar</th>
                            <th className="px-6 py-4">Durum</th>
                            <th className="px-6 py-4">Kargo Bilgisi</th>
                            <th className="px-6 py-4">Tarih</th>
                            <th className="px-6 py-4 text-right">İşlemler</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                          {filteredOrders.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="p-12 text-center text-gray-400">
                                <Package size={36} className="mx-auto mb-2 opacity-40" />
                                Bu filtreye uygun sipariş bulunamadı.
                              </td>
                            </tr>
                          ) : (
                            filteredOrders.map(o => {
                              const customerDisplayName = o.customerName || o.customer?.name || 'Misafir Müşteri'
                              const customerPhone = o.customerPhone || o.customer?.phone || ''
                              const itemsList = Array.isArray(o.items) ? o.items : []
                              const itemCount = itemsList.reduce((sum: number, it: any) => sum + (it.quantity || 1), 0)

                              return (
                                <tr key={o.id} className="hover:bg-gray-50/70 transition-colors">
                                  <td className="px-6 py-4">
                                    <div className="font-mono font-semibold text-gray-900 text-xs">{o.orderNumber}</div>
                                    {o.combinedWithOrderId && (
                                      <span className="inline-block mt-1 bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.5 rounded border border-blue-200">
                                        Arkadaş Kargosu: {o.combinedWithOrderId}
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{customerDisplayName}</div>
                                    <div className="text-xs text-gray-500">{customerPhone || o.customerEmail || o.customer?.email || '-'}</div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="text-xs font-medium text-gray-800">
                                      {itemCount > 0 ? `${itemCount} Parfüm` : 'Özel Sipariş'}
                                    </div>
                                    <div className="text-[11px] text-gray-400 truncate max-w-[180px]">
                                      {itemsList.map((it: any) => `${it.quantity || 1}x PN ${it.sku}`).join(', ')}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className="font-semibold text-gray-900">{o.totalAmount} TL</span>
                                    {o.discountApplied && o.discountApplied > 0 ? (
                                      <div className="text-[10px] text-emerald-600">(-{o.discountApplied} TL İndirim)</div>
                                    ) : null}
                                  </td>
                                  <td className="px-6 py-4">
                                    {getStatusBadge(o.status)}
                                  </td>
                                  <td className="px-6 py-4 text-xs">
                                    {o.cargoCompany ? (
                                      <div>
                                        <span className="font-medium text-gray-800">{o.cargoCompany}</span>
                                        <div className="font-mono text-[11px] text-gray-500">{o.trackingCode || 'Takip No Yok'}</div>
                                      </div>
                                    ) : (
                                      <span className="text-gray-400">-</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                                    {new Date(o.createdAt).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </td>
                                  <td className="px-6 py-4 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-1.5">
                                      {o.status === 'pending' && (
                                        <button
                                          onClick={() => handleUpdateOrderStatus(o.id, 'paid')}
                                          disabled={savingId === `order_${o.id}`}
                                          className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
                                          title="İşleme Al (Hazırlanıyor)"
                                        >
                                          İşleme Al
                                        </button>
                                      )}
                                      {(o.status === 'paid' || o.status === 'pending') && (
                                        <button
                                          onClick={() => {
                                            setShippingModalOrder(o)
                                            setCargoCompanyInput(o.cargoCompany || 'Yurtiçi Kargo')
                                            setTrackingCodeInput(o.trackingCode || '')
                                          }}
                                          className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm flex items-center gap-1"
                                          title="Kargoya Ver"
                                        >
                                          <Truck size={13} /> Kargola
                                        </button>
                                      )}
                                      {o.status === 'shipped' && (
                                        <button
                                          onClick={() => handleUpdateOrderStatus(o.id, 'delivered')}
                                          disabled={savingId === `order_${o.id}`}
                                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm flex items-center gap-1"
                                          title="Teslim Edildi Olarak İşaretle"
                                        >
                                          <Check size={13} /> Teslim Et
                                        </button>
                                      )}
                                      <button
                                        onClick={() => setSelectedOrder(o)}
                                        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-gray-200"
                                        title="Sipariş Detayı"
                                      >
                                        <Eye size={16} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              )
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ===================== MUSTERILER & ELCILER ===================== */}
              {activeTab === 'customers' && (
                <div className="space-y-6">
                  {/* Filter & Search Bar */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      {/* Search */}
                      <div className="relative flex-1 max-w-md">
                        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="İsim, E-posta, Telefon, Davet Kodu ara..." 
                          value={customerSearch}
                          onChange={e => setCustomerSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {customerSearch && (
                          <button onClick={() => setCustomerSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <X size={14} />
                          </button>
                        )}
                      </div>

                      <div className="text-xs text-gray-500">
                        Toplam <span className="font-semibold text-gray-900">{filteredCustomers.length}</span> üye listeleniyor
                      </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                      {[
                        { key: 'all', label: 'Tüm Üyeler', count: customerCounts.all },
                        { key: 'influencer', label: '🌟 Influencer Elçiler', count: customerCounts.influencer },
                        { key: 'b2b_sampler', label: '📦 B2B Sampler', count: customerCounts.b2b_sampler },
                        { key: 'cart_full', label: '🛒 Sepeti Dolu Olanlar', count: customerCounts.cart_full },
                        { key: 'recent_login', label: '⚡ Son 24s Giriş Yapanlar', count: customers.filter(c => c.lastLogin && (Date.now() - new Date(c.lastLogin).getTime()) < 86400000).length },
                      ].map(tab => (
                        <button
                          key={tab.key}
                          onClick={() => setCustomerFilter(tab.key)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors border flex items-center gap-1.5 ${
                            customerFilter === tab.key 
                              ? 'bg-gray-900 text-white border-gray-900 shadow-sm' 
                              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {tab.label}
                          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${customerFilter === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'}`}>
                            {tab.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Customers Table */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                            <th className="px-6 py-4">Müşteri / Hesap Adı</th>
                            <th className="px-6 py-4">Telefon</th>
                            <th className="px-6 py-4">Üyelik Rolü</th>
                            <th className="px-6 py-4">Son Giriş Tarihi</th>
                            <th className="px-6 py-4">Sepet Durumu</th>
                            <th className="px-6 py-4">Cüzdan / Elçi Bakiyesi</th>
                            <th className="px-6 py-4">Kayıt Tarihi</th>
                            <th className="px-6 py-4 text-right">İşlemler</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                          {filteredCustomers.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="p-12 text-center text-gray-400">
                                <Users size={36} className="mx-auto mb-2 opacity-40" />
                                Bu filtreye uygun üye bulunamadı.
                              </td>
                            </tr>
                          ) : (
                            filteredCustomers.map(c => {
                              const cartItems = Array.isArray(c.cart) ? c.cart : []
                              const cartCount = cartItems.reduce((s: number, it: any) => s + (it.quantity || 1), 0)
                              const cartTotal = cartItems.reduce((s: number, it: any) => s + ((it.price || 0) * (it.quantity || 1)), 0)

                              return (
                                <tr key={c.id} className="hover:bg-gray-50/70 transition-colors">
                                  {/* İsim & E-posta */}
                                  <td className="px-6 py-4">
                                    <div className="font-semibold text-gray-900">{c.name || 'İsimsiz Üye'}</div>
                                    <div className="text-xs text-gray-500 font-mono">{c.email}</div>
                                  </td>

                                  {/* Telefon & WhatsApp */}
                                  <td className="px-6 py-4">
                                    {c.phone ? (
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs text-gray-700">{c.phone}</span>
                                        <a 
                                          href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=Merhaba%20${encodeURIComponent(c.name || '')},%20PN%20Parfüm'den%20ulaşıyoruz.`}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-emerald-600 hover:text-emerald-700"
                                          title="WhatsApp Mesajı Gönder"
                                        >
                                          <MessageCircle size={15} />
                                        </a>
                                      </div>
                                    ) : (
                                      <span className="text-gray-400 text-xs">-</span>
                                    )}
                                  </td>

                                  {/* Üyelik Rolü */}
                                  <td className="px-6 py-4">
                                    {getPartnerBadge(c.partner_type)}
                                    {c.referral_code && (
                                      <div className="text-[10px] font-mono text-gray-400 mt-0.5">Kod: {c.referral_code}</div>
                                    )}
                                  </td>

                                  {/* Son Giriş Tarihi */}
                                  <td className="px-6 py-4 text-xs text-gray-600">
                                    {c.lastLogin ? (
                                      <div>
                                        <div className="font-medium text-gray-800">
                                          {new Date(c.lastLogin).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                        </div>
                                        <div className="text-[10px] text-gray-400">
                                          {new Date(c.lastLogin).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                      </div>
                                    ) : (
                                      <span className="text-gray-400 text-[11px] italic">Giriş Kaydı Yok</span>
                                    )}
                                  </td>

                                  {/* Sepet Durumu */}
                                  <td className="px-6 py-4 text-xs">
                                    {cartCount > 0 ? (
                                      <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                                        <ShoppingCart size={12} className="text-amber-600" />
                                        {cartCount} Ürün ({cartTotal} TL)
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-gray-400 text-xs">
                                        <ShoppingCart size={12} className="opacity-40" /> Boş
                                      </span>
                                    )}
                                  </td>

                                  {/* Cüzdan / Bakiye */}
                                  <td className="px-6 py-4">
                                    <span className="font-bold text-emerald-600 text-sm">{c.wallet_balance} TL</span>
                                    {c.earned_samples > 0 && (
                                      <div className="text-[11px] text-purple-600 font-medium">({c.earned_samples} Tester Kotası)</div>
                                    )}
                                  </td>

                                  {/* Kayıt Tarihi */}
                                  <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                                    {new Date(c.createdAt).toLocaleDateString('tr-TR')}
                                  </td>

                                  {/* İşlemler */}
                                  <td className="px-6 py-4 text-right whitespace-nowrap">
                                    <button
                                      onClick={() => handleOpenCustomerDetail(c)}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-medium transition-colors shadow-sm"
                                    >
                                      <Eye size={14} /> Detay
                                    </button>
                                  </td>
                                </tr>
                              )
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ===================== SENARYO KURALLARI ===================== */}
              {activeTab === 'scenarios' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-100 text-blue-800 rounded-xl p-4 text-sm">
                    <h3 className="font-semibold mb-1">Senaryo Kuralları Hakkında</h3>
                    <p>Bu bölümden sistem genelinde kullanılan dinamik kuralları (kargo alt limiti, kampanya tutarları vb.) yönetebilirsiniz. Değişiklikler anında tüm sisteme yansıyacaktır.</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead><tr className="bg-gray-50 border-b text-gray-500 text-sm"><th className="px-6 py-4 font-medium">Anahtar</th><th className="px-6 py-4 font-medium">Açıklama</th><th className="px-6 py-4 font-medium">Değer</th><th className="px-6 py-4">İşlem</th></tr></thead>
                      <tbody className="divide-y divide-gray-100">
                        {rules.map(rule => (
                          <tr key={rule.id}>
                            <td className="px-6 py-5"><span className="bg-gray-100 px-3 py-1 rounded-md text-sm font-mono border">{rule.rule_key}</span></td>
                            <td className="px-6 py-5 text-sm text-gray-600">{rule.description || 'Açıklama bulunmuyor'}</td>
                            <td className="px-6 py-5"><input type="number" value={rule.rule_value} onChange={(e) => setRules(rules.map(r => r.id === rule.id ? { ...r, rule_value: parseFloat(e.target.value) || 0 } : r))} className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500" /></td>
                            <td className="px-6 py-5"><button onClick={() => handleUpdateRule(rule.rule_key, rule.rule_value)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">Kaydet</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ===================== YAPAY ZEKA ===================== */}
              {activeTab === 'ai' && aiConfig && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <div className="space-y-6">
                    <div><label className="block text-sm font-semibold mb-2">Sistem Komutu</label><textarea rows={10} value={aiConfig.system_prompt} onChange={e => setAiConfig({...aiConfig, system_prompt: e.target.value})} className="w-full bg-gray-50 border rounded-lg p-4 font-mono text-sm" /></div>
                    <div><label className="block text-sm font-semibold mb-2">Aktif Kampanya</label><textarea rows={3} value={aiConfig.active_campaign || ''} onChange={e => setAiConfig({...aiConfig, active_campaign: e.target.value})} className="w-full border rounded-lg p-4 text-sm" /></div>
                    <button onClick={handleUpdateAiConfig} className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium">Yapay Zeka Ayarlarını Kaydet</button>
                  </div>
                </div>
              )}

              {/* ===================== RAPORLAR ===================== */}
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
                  <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-gray-500 font-medium mb-2">Yapay Zeka Satış Oranı</h3>
                    <p className="text-4xl font-bold text-indigo-600">%{reports.aiAssistedPercentage}</p>
                  </div>
                </div>
              )}

              {/* ===================== PAZARYERI & BAYI API ===================== */}
              {activeTab === 'api' && (
                <div className="space-y-8">
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-4">Yeni Bayi / Pazaryeri Ekle</h3>
                    <form onSubmit={handleAddStore} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="block text-xs font-semibold mb-1">Mağaza Adı</label><input type="text" value={newStore.name} onChange={e => setNewStore({...newStore, name: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm" required placeholder="Örn: PN Trendyol Ana Mağaza" /></div>
                      <div><label className="block text-xs font-semibold mb-1">Platform</label><select value={newStore.platform} onChange={e => setNewStore({...newStore, platform: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm"><option value="trendyol">Trendyol</option><option value="hepsiburada">Hepsiburada</option></select></div>
                      <div><label className="block text-xs font-semibold mb-1">Satıcı ID (Seller ID)</label><input type="text" value={newStore.sellerId} onChange={e => setNewStore({...newStore, sellerId: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm" required /></div>
                      <div><label className="block text-xs font-semibold mb-1">API Key</label><input type="text" value={newStore.apiKey} onChange={e => setNewStore({...newStore, apiKey: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm" required /></div>
                      <div className="md:col-span-2"><label className="block text-xs font-semibold mb-1">API Secret</label><input type="password" value={newStore.apiSecret} onChange={e => setNewStore({...newStore, apiSecret: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm" required /></div>
                      <div className="md:col-span-2"><button type="submit" disabled={savingId === 'add_store'} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors">Bayi Bağla</button></div>
                    </form>
                  </div>

                  <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                    <div className="p-6 border-b"><h3 className="font-semibold text-gray-900">Bağlı Mağazalar</h3></div>
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b text-sm"><tr className="text-gray-500"><th className="px-6 py-4">Mağaza</th><th className="px-6 py-4">Platform</th><th className="px-6 py-4">Satıcı ID</th><th className="px-6 py-4">Durum</th></tr></thead>
                      <tbody className="divide-y">
                        {stores.length === 0 ? <tr><td colSpan={4} className="p-8 text-center text-gray-500">Kayıtlı mağaza bulunmuyor</td></tr> : stores.map(s => (
                          <tr key={s.id} className="hover:bg-gray-50 text-sm">
                            <td className="px-6 py-4 font-medium">{s.name}</td>
                            <td className="px-6 py-4 capitalize">{s.platform}</td>
                            <td className="px-6 py-4 font-mono text-xs">{s.sellerId}</td>
                            <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${s.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{s.isActive ? 'Aktif' : 'Pasif'}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ===================== TOPLU FIYAT & URUN ===================== */}
              {activeTab === 'products' && (
                <div className="space-y-8">
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">Excel Ürün Aktarımı (Toplu Yükleme / Güncelleme)</h3>
                    <p className="text-sm text-gray-500 mb-6">Trendyol veya sistem formatındaki Excel dosyasını seçerek ürünleri anında güncelleyin veya yeni ürünler ekleyin.</p>
                    <label className="border-2 border-dashed border-gray-300 hover:border-indigo-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors">
                      <UploadCloud size={48} className="text-indigo-600 mb-2" />
                      <span className="text-sm font-semibold text-gray-900">Excel Dosyası Seçin</span>
                      <span className="text-xs text-gray-500 mt-1">.xlsx veya .xls formatı</span>
                      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" />
                    </label>
                    {importProgress && (
                      <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                        <div className="flex justify-between text-xs font-semibold text-indigo-900 mb-1">
                          <span>Aktarılıyor...</span>
                          <span>{importProgress.current} / {importProgress.total}</span>
                        </div>
                        <div className="w-full bg-indigo-200 rounded-full h-2">
                          <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">Toplu Fiyat Değişikliği (% Zam / % İndirim)</h3>
                    <p className="text-sm text-gray-500 mb-6">Seçilen platformdaki tüm ürünlerin fiyatlarını tek tıkla toplu olarak artırın veya azaltın.</p>
                    <form onSubmit={handleBulkPriceUpdate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1">Hedef Platform</label>
                        <select value={bulkPriceData.platform} onChange={e => setBulkPriceData({...bulkPriceData, platform: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm">
                          <option value="all">Tüm Platformlar & Kendi Sitemiz</option>
                          <option value="trendyol">Yalnızca Trendyol</option>
                          <option value="hepsiburada">Yalnızca Hepsiburada</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">İşlem Tipi</label>
                        <select value={bulkPriceData.type} onChange={e => setBulkPriceData({...bulkPriceData, type: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm">
                          <option value="zam">Fiyat Artışı (% Zam)</option>
                          <option value="indirim">Fiyat Düşüşü (% İndirim)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Yüzde (%)</label>
                        <input type="number" step="0.01" placeholder="Örn: 15" value={bulkPriceData.percentage} onChange={e => setBulkPriceData({...bulkPriceData, percentage: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm" required />
                      </div>
                      <div className="sm:col-span-3">
                        <button type="submit" disabled={savingId === 'bulk_price'} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors">
                          {savingId === 'bulk_price' ? 'Güncelleniyor...' : 'Fiyatları Toplu Güncelle'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ===================== SIPARIS DETAY MODALI ===================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900">Sipariş #{selectedOrder.orderNumber}</h2>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Sipariş Tarihi: {new Date(selectedOrder.createdAt).toLocaleString('tr-TR')}
                </p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Müşteri Bilgileri */}
                <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                    <User size={14} /> Müşteri & Teslimat Bilgileri
                  </h3>
                  
                  <div>
                    <div className="font-semibold text-gray-900 text-base">{selectedOrder.customerName || selectedOrder.customer?.name || 'Misafir Müşteri'}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{selectedOrder.customerEmail || selectedOrder.customer?.email || '-'}</div>
                  </div>

                  {(selectedOrder.customerPhone || selectedOrder.customer?.phone) && (
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
                      <div className="text-sm font-mono text-gray-700 flex items-center gap-1.5">
                        <Phone size={14} className="text-gray-400" />
                        {selectedOrder.customerPhone || selectedOrder.customer?.phone}
                      </div>
                      <a 
                        href={`https://wa.me/${(selectedOrder.customerPhone || selectedOrder.customer?.phone || '').replace(/[^0-9]/g, '')}?text=Merhaba%20${encodeURIComponent(selectedOrder.customerName || '')},%20PN%20Parfüm%20siparişiniz%20hakkında%20bilgilendirme:`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                      >
                        <MessageCircle size={13} /> WhatsApp
                      </a>
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-200/60">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400 font-medium flex items-center gap-1"><MapPin size={12} /> Teslimat Adresi</span>
                      <button 
                        onClick={() => {
                          if (selectedOrder.customerAddress) {
                            navigator.clipboard.writeText(selectedOrder.customerAddress)
                            setCopiedAddr(true)
                            setTimeout(() => setCopiedAddr(false), 2000)
                          }
                        }}
                        className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        {copiedAddr ? <Check size={11} /> : <Copy size={11} />}
                        {copiedAddr ? 'Kopyalandı' : 'Adresi Kopyala'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-800 bg-white p-3 rounded-xl border border-gray-200 leading-relaxed font-sans">
                      {selectedOrder.customerAddress || 'Adres bilgisi girilmedi'}
                    </p>
                  </div>
                </div>

                {/* Kargo & Lojistik */}
                <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                      <Truck size={14} /> Kargo & Lojistik Takip
                    </h3>

                    {selectedOrder.cargoCompany ? (
                      <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 font-medium">Kargo Firması:</span>
                          <span className="font-bold text-gray-900 text-sm">{selectedOrder.cargoCompany}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 font-medium">Takip Numarası:</span>
                          <span className="font-mono font-bold text-indigo-600 text-sm">{selectedOrder.trackingCode || 'Belirtilmedi'}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl text-xs text-amber-800">
                        Henüz kargo takip bilgisi girilmedi. Aşağıdaki butondan kargo firması ve takip kodu ekleyebilirsiniz.
                      </div>
                    )}

                    {selectedOrder.combinedWithOrderId && (
                      <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-xs text-blue-800">
                        <span className="font-semibold">Paydaş Kargo Kodu:</span> {selectedOrder.combinedWithOrderId}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-200/60">
                    <button
                      onClick={() => {
                        setShippingModalOrder(selectedOrder)
                        setCargoCompanyInput(selectedOrder.cargoCompany || 'Yurtiçi Kargo')
                        setTrackingCodeInput(selectedOrder.trackingCode || '')
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <Truck size={15} /> {selectedOrder.cargoCompany ? 'Kargo Bilgilerini Güncelle' : 'Kargoya Teslim Et & Takip Kodu Gir'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sipariş İçeriği Tablosu */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                  <Package size={14} /> Sipariş Edilen Parfümler & Ürünler
                </h3>
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold">
                        <th className="px-4 py-3">Ürün Adı</th>
                        <th className="px-4 py-3">SKU</th>
                        <th className="px-4 py-3 text-center">Adet</th>
                        <th className="px-4 py-3 text-right">Birim Fiyat</th>
                        <th className="px-4 py-3 text-right">Toplam</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((it: any, idx: number) => (
                          <tr key={idx} className="hover:bg-gray-50/50">
                            <td className="px-4 py-3 font-medium text-gray-900">{it.name || 'Özel Harman Parfüm'}</td>
                            <td className="px-4 py-3 font-mono text-gray-500">PN {it.sku}</td>
                            <td className="px-4 py-3 text-center font-bold">{it.quantity || 1}</td>
                            <td className="px-4 py-3 text-right text-gray-600">{it.price} TL</td>
                            <td className="px-4 py-3 text-right font-semibold text-gray-900">{(it.price || 0) * (it.quantity || 1)} TL</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-gray-400">Ürün detayı bulunamadı</td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="bg-gray-50/50 border-t border-gray-200">
                      <tr>
                        <td colSpan={4} className="px-4 py-2.5 text-right font-medium text-gray-600">Toplam Sipariş Tutarı:</td>
                        <td className="px-4 py-2.5 text-right font-bold text-gray-900 text-sm">{selectedOrder.totalAmount} TL</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/80 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-gray-500 font-medium">Hızlı Durum Değiştir:</div>
              <div className="flex flex-wrap items-center gap-2">
                {selectedOrder.status !== 'paid' && (
                  <button 
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'paid')}
                    disabled={savingId === `order_${selectedOrder.id}`}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <Settings size={14} /> İşleme Al (Hazırlanıyor)
                  </button>
                )}

                {selectedOrder.status !== 'delivered' && (
                  <button 
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'delivered')}
                    disabled={savingId === `order_${selectedOrder.id}`}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle size={14} /> Teslim Edildi
                  </button>
                )}

                {selectedOrder.status !== 'cancelled' && (
                  <button 
                    onClick={() => {
                      if (confirm('Siparişi iptal etmek istediğinize emin misiniz?')) {
                        handleUpdateOrderStatus(selectedOrder.id, 'cancelled')
                      }
                    }}
                    disabled={savingId === `order_${selectedOrder.id}`}
                    className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <XCircle size={14} /> Siparişi İptal Et
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MUSTERI & ELCI DETAY MODALI ===================== */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                  {(selectedCustomer.name || selectedCustomer.email).charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-900">{selectedCustomer.name || 'İsimsiz Üye'}</h2>
                    {getPartnerBadge(selectedCustomer.partner_type)}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 font-mono">{selectedCustomer.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)} 
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Sub-tabs */}
            <div className="flex border-b border-gray-100 px-8 bg-gray-50/30">
              <button 
                onClick={() => setCustomerModalTab('profile')}
                className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${customerModalTab === 'profile' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <User size={14} /> Profil & Demografi
              </button>
              <button 
                onClick={() => setCustomerModalTab('partner')}
                className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${customerModalTab === 'partner' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <Award size={14} /> Elçilik, Rol & Cüzdan
              </button>
              <button 
                onClick={() => setCustomerModalTab('cart')}
                className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${customerModalTab === 'cart' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <ShoppingCart size={14} /> Canlı Sepet
                {Array.isArray(selectedCustomer.cart) && selectedCustomer.cart.length > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">{selectedCustomer.cart.length}</span>
                )}
              </button>
              <button 
                onClick={() => setCustomerModalTab('history')}
                className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${customerModalTab === 'history' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <Package size={14} /> Siparişler & Kuponlar
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto space-y-6 flex-1">
              {/* TAB 1: Profil & Demografi */}
              {customerModalTab === 'profile' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <span className="text-xs text-gray-400 font-medium block mb-1">Hesap Adı Soyadı</span>
                      <span className="font-semibold text-gray-900 text-sm">{selectedCustomer.name || 'Belirtilmedi'}</span>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <span className="text-xs text-gray-400 font-medium block mb-1">E-posta Adresi</span>
                      <span className="font-mono text-gray-900 text-sm">{selectedCustomer.email}</span>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400 font-medium block mb-1">Telefon Numarası</span>
                        <span className="font-mono text-gray-900 text-sm">{selectedCustomer.phone || 'Belirtilmedi'}</span>
                      </div>
                      {selectedCustomer.phone && (
                        <a 
                          href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, '')}?text=Merhaba%20${encodeURIComponent(selectedCustomer.name || '')},%20PN%20Parfüm'den%20ulaşıyoruz.`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"
                        >
                          <MessageCircle size={13} /> WhatsApp
                        </a>
                      )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <span className="text-xs text-gray-400 font-medium block mb-1">Meslek / Sektör</span>
                      <span className="font-medium text-gray-900 text-sm">{selectedCustomer.profession || 'Belirtilmedi'}</span>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <span className="text-xs text-gray-400 font-medium block mb-1">Doğum Tarihi / Yılı</span>
                      <span className="font-medium text-gray-900 text-sm">{selectedCustomer.birth_date || selectedCustomer.birth_year || 'Belirtilmedi'}</span>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <span className="text-xs text-gray-400 font-medium block mb-1">Sisteme Son Giriş</span>
                      <span className="font-semibold text-indigo-700 text-sm">
                        {selectedCustomer.lastLogin ? new Date(selectedCustomer.lastLogin).toLocaleString('tr-TR') : 'Giriş Kaydı Yok'}
                      </span>
                    </div>
                  </div>

                  {/* Teslimat Adresi */}
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                        <MapPin size={13} /> Kayıtlı Teslimat Adresi
                      </span>
                      {selectedCustomer.address && (
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(selectedCustomer.address || '')
                            setCopiedAddr(true)
                            setTimeout(() => setCopiedAddr(false), 2000)
                          }}
                          className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1"
                        >
                          {copiedAddr ? <Check size={11} /> : <Copy size={11} />}
                          {copiedAddr ? 'Kopyalandı' : 'Kopyala'}
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-800 bg-white p-4 rounded-xl border border-gray-200 leading-relaxed font-sans">
                      {selectedCustomer.address || 'Kullanıcının kayıtlı adresi bulunmuyor.'}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: Elçilik & Cüzdan Yönetimi (Form) */}
              {customerModalTab === 'partner' && (
                <form onSubmit={handleUpdateCustomer} className="space-y-6">
                  <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 flex items-start gap-3">
                    <Award className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <span className="font-bold">Elçilik & İş Ortaklığı Paneli</span>
                      <p className="mt-0.5 text-amber-800">
                        Buradan kullanıcıya influencer veya B2B ortağı rolü atayabilir, cüzdanına satış komisyonu yükleyebilir veya tester kotasını güncelleyebilirsiniz.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Üyelik Rolü</label>
                      <select 
                        value={editCustomerData.partner_type} 
                        onChange={e => setEditCustomerData({...editCustomerData, partner_type: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                      >
                        <option value="retail">Bireysel Müşteri (Retail)</option>
                        <option value="influencer">🌟 Influencer / Marka Elçisi</option>
                        <option value="b2b_sampler">📦 B2B Sampler / İş Ortağı</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Özel Davet / Elçi Kodu</label>
                      <div className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-sm font-mono text-gray-700">
                        {selectedCustomer.referral_code || 'Sistem tarafından henüz kod üretilmedi'}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Cüzdan Bakiyesi (TL)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={editCustomerData.wallet_balance}
                        onChange={e => setEditCustomerData({...editCustomerData, wallet_balance: parseFloat(e.target.value) || 0})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-semibold text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Hak Edilen Tester Kotası (Adet)</label>
                      <input 
                        type="number" 
                        value={editCustomerData.earned_samples}
                        onChange={e => setEditCustomerData({...editCustomerData, earned_samples: parseInt(e.target.value) || 0})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-semibold text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button 
                      type="submit" 
                      disabled={savingId === 'save_customer'}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                    >
                      <Save size={16} /> {savingId === 'save_customer' ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: Canlı Sepet Analizi (Terk Edilmiş Sepet) */}
              {customerModalTab === 'cart' && (
                <div className="space-y-6">
                  {Array.isArray(selectedCustomer.cart) && selectedCustomer.cart.length > 0 ? (
                    <>
                      <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
                        <div>
                          <div className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                            <ShoppingCart size={16} /> Sepet Dolu ({selectedCustomer.cart.length} Farklı Ürün)
                          </div>
                          <p className="text-xs text-emerald-700 mt-0.5">
                            Müşteri bu ürünleri sepetine ekledi ancak henüz satın almayı tamamlamadı.
                          </p>
                        </div>

                        {selectedCustomer.phone && (
                          <a 
                            href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, '')}?text=Merhaba%20${encodeURIComponent(selectedCustomer.name || '')},%20PN%20Parfüm%20sepetinizdeki%20ürünleriniz%20için%20özel%20ayrıcalıklar%20sizi%20bekliyor!`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
                          >
                            <MessageCircle size={14} /> Sepet Hatırlatması Gönder
                          </a>
                        )}
                      </div>

                      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold">
                              <th className="px-4 py-3">Ürün Adı</th>
                              <th className="px-4 py-3">SKU</th>
                              <th className="px-4 py-3 text-center">Adet</th>
                              <th className="px-4 py-3 text-right">Birim Fiyat</th>
                              <th className="px-4 py-3 text-right">Toplam</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {selectedCustomer.cart.map((it: any, idx: number) => (
                              <tr key={idx} className="hover:bg-gray-50/50">
                                <td className="px-4 py-3 font-medium text-gray-900">{it.name || 'Özel Harman Parfüm'}</td>
                                <td className="px-4 py-3 font-mono text-gray-500">PN {it.sku}</td>
                                <td className="px-4 py-3 text-center font-bold">{it.quantity || 1}</td>
                                <td className="px-4 py-3 text-right text-gray-600">{it.price} TL</td>
                                <td className="px-4 py-3 text-right font-semibold text-gray-900">{(it.price || 0) * (it.quantity || 1)} TL</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-gray-50/50 border-t border-gray-200">
                            <tr>
                              <td colSpan={4} className="px-4 py-3 text-right font-medium text-gray-600">Sepet Toplam Tutarı:</td>
                              <td className="px-4 py-3 text-right font-bold text-gray-900 text-sm">
                                {selectedCustomer.cart.reduce((sum: number, it: any) => sum + ((it.price || 0) * (it.quantity || 1)), 0)} TL
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </>
                  ) : (
                    <div className="bg-gray-50 rounded-2xl p-12 text-center text-gray-400 border border-dashed border-gray-200">
                      <ShoppingCart size={40} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm font-medium text-gray-600">Müşterinin sepeti şu anda boş</p>
                      <p className="text-xs text-gray-400 mt-1">Kullanıcı sepete ürün eklediğinde burada canlı olarak listelenecektir.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Siparişler & Kuponlar */}
              {customerModalTab === 'history' && (
                <div className="space-y-6">
                  {/* Sipariş Geçmişi */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                      <Package size={14} /> Geçmiş Siparişleri ({selectedCustomer.orders?.length || 0})
                    </h4>
                    {Array.isArray(selectedCustomer.orders) && selectedCustomer.orders.length > 0 ? (
                      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold">
                              <th className="px-4 py-3">Sipariş No</th>
                              <th className="px-4 py-3">Tutar</th>
                              <th className="px-4 py-3">Durum</th>
                              <th className="px-4 py-3">Tarih</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {selectedCustomer.orders.map((o: any) => (
                              <tr key={o.id} className="hover:bg-gray-50/50">
                                <td className="px-4 py-3 font-mono font-semibold text-gray-900">{o.orderNumber}</td>
                                <td className="px-4 py-3 font-bold text-gray-900">{o.totalAmount} TL</td>
                                <td className="px-4 py-3">{getStatusBadge(o.status)}</td>
                                <td className="px-4 py-3 text-gray-500">{new Date(o.createdAt).toLocaleDateString('tr-TR')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-6 bg-gray-50 rounded-2xl text-center text-gray-400 text-xs border">
                        Henüz siparişi bulunmuyor.
                      </div>
                    )}
                  </div>

                  {/* Kupon Kasası */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                      <Tag size={14} /> Tanımlı Kuponları ({selectedCustomer.coupons?.length || 0})
                    </h4>
                    {Array.isArray(selectedCustomer.coupons) && selectedCustomer.coupons.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedCustomer.coupons.map((cp: any) => (
                          <div key={cp.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                            <div>
                              <div className="font-mono font-bold text-indigo-700 text-xs">{cp.code}</div>
                              <div className="text-[10px] text-gray-500">
                                {cp.discount_type === 'percentage' ? `%${cp.value} İndirim` : `${cp.value} TL İndirim`}
                              </div>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${cp.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                              {cp.is_active ? 'Aktif' : 'Kullanıldı'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 bg-gray-50 rounded-2xl text-center text-gray-400 text-xs border">
                        Tanımlı kupon bulunmuyor.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================== KARGOYA TESLIM ET MODALI ===================== */}
      {shippingModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Truck size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Kargoya Teslim Et</h3>
                  <p className="text-xs text-gray-500">#{shippingModalOrder.orderNumber}</p>
                </div>
              </div>
              <button onClick={() => setShippingModalOrder(null)} className="p-2 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              handleUpdateOrderStatus(shippingModalOrder.id, 'shipped', cargoCompanyInput, trackingCodeInput)
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Kargo Firması</label>
                <select 
                  value={cargoCompanyInput} 
                  onChange={e => setCargoCompanyInput(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {CARGO_COMPANIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Kargo Takip Kodu</label>
                <input 
                  type="text" 
                  value={trackingCodeInput} 
                  onChange={e => setTrackingCodeInput(e.target.value)}
                  placeholder="Örn: 123456789012"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShippingModalOrder(null)} 
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl text-sm font-medium transition-colors"
                >
                  Vazgeç
                </button>
                <button 
                  type="submit" 
                  disabled={savingId === `order_${shippingModalOrder.id}`}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
                >
                  {savingId === `order_${shippingModalOrder.id}` ? 'Kaydediliyor...' : 'Kargoya Ver'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
