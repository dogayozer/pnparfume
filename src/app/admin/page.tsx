'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { 
  Settings, Save, AlertCircle, RefreshCw, Box, Users, TrendingUp, 
  Sparkles, Server, PackagePlus, UploadCloud, Percent, Truck, 
  CheckCircle, Clock, XCircle, ExternalLink, MessageCircle, Eye, 
  EyeOff, Search, Filter, MapPin, User, Phone, Mail, Calendar, ChevronRight, 
  X, Package, Check, Copy, ArrowRight, ShoppingCart, Award, Gift, 
  CreditCard, Tag, Edit3, ShieldCheck, Key, Lock, History, Info, 
  CheckSquare, Square, Bell, Send, MessageSquare
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

// Sistem Versiyon ve Değişiklik Günlüğü (Changelog)
const SYSTEM_VERSION = 'v2.9.0'
const SYSTEM_BUILD_DATE = '2026.08.20'
const CHANGELOG = [
  {
    version: 'v2.9.0',
    code: 'EXPANSION-20260820-A',
    date: '20.08.2026',
    type: 'Yeni Özellik & Büyüme (Major)',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    title: "5'li Discovery Set (Keşif Kutusu) & Fotoğraflı UGC Yorum Motoru",
    changes: [
      "5'li Discovery Set (Keşif Kutusu) Stüdyosu: Müşterinin 338 parfüm arasından 5 adet 10ml seçip avantajlı tek paket olarak alabileceği interaktif kutu seçici (/mix/discovery-set) yayına alındı.",
      "Hızlı Hazır Paketler: En Çok Satan 5 İmza, Karizmatik & Ofis, Gece Cazibesi ve Çiçeksi Zarafet paketleri tek tıkla sepete eklenebilir.",
      "%100 Cashback Garantisi: Keşif kutusu alan müşteriye tam boy parfümde geçerli kutu bedeli kadar VIP hediye çeki tanımlanır.",
      "UGC & Fotoğraflı Müşteri Yorumları: Ürün detay sayfalarında 1-5 yıldız puanlama, doğrulanmış alıcı yorumları ve deneyim paylaşım modülü.",
      "Admin Yorum Moderasyon Merkezi: Admin panelinde gelen yorumları tek tıkla onaylama, yayından kaldırma ve silme ekranı eklendi."
    ]
  },
  {
    version: 'v2.8.0',
    code: 'CRITICAL-AUDIT-20260820-A',
    date: '20.08.2026',
    type: 'Güvenlik & Bütünlük (Major)',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    title: 'Kritik Güvenlik, Idempotency, Stok & Performans Paketi',
    changes: [
      'PayTR Callback Idempotency: Mükerrer webhook bildirimlerinde çift SMS ve çift komisyon tetiklenmesi engellendi.',
      'Atomik Stok Düşümü: Ödeme onaylandığında DB transaction içinde yarış durumu (race condition) korumalı stok eksiltme eklendi.',
      'OrderItem Modeli & Senkronizasyon: Sipariş kalemleri ilişkisel modele bağlanarak iade ve stok takibi güçlendirildi.',
      'Admin Brute-Force Koruması: IP bazlı 5 hatalı deneme sonrası 15 dakikalık akıllı kilit mekanizması getirildi.',
      'Cart-Sync Debounce: Sepet senkronizasyonuna 1.5 sn gecikme eklenerek Neon DB compute kota tüketimi %80 düşürüldü.',
      'Aura AI İstismar & Maliyet Koruması: /api/chat endpointine rate limit, sunucu taraflı kupon tavanı ve 24 saatlik süre sınırı eklendi.',
      'Dinamik Komisyon: %15 affiliate komisyonu ScenarioRule (AFFILIATE_COMMISSION_RATE) üzerinden dinamik hale getirildi.',
      'İade/İptal Komisyon Geri Alımı: İptal veya iadelerde elçiye ödenen komisyonun cüzdandan güvenle düşülmesi sağlandı.'
    ]
  },
  {
    version: 'v2.7.0',
    code: 'MAJOR-20260820-E',
    date: '20.08.2026',
    type: 'Büyük Değişim (Major)',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    title: 'Admin Tekil Ürün & Stok/Görsel Yönetim Paneli',
    changes: [
      'Admin panelinde tek tek yeni parfüm ekleme (SKU, isim, koku piramidi, kalıcılık/yayılım puanları, mood/tarz etiketleri, fiyat, stok ve görsel).',
      'Mevcut parfümleri tek tıkla düzenleme, aktif/pasif satış durumu değiştirme ve güvenli silme özelliği.',
      'Canlı ürün arama, cinsiyet ve yayın durumuna göre filtreleme kataloğu.',
      'Toplu Fiyat Güncelleme motoru ve Excel Toplu Aktarım araçlarının alt sekmeler halinde birleştirilmesi.'
    ]
  },
  {
    version: 'v2.6.0',
    code: 'MAJOR-20260820-D',
    date: '20.08.2026',
    type: 'Büyük Değişim (Major)',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    title: 'Otomatik Kargo & Sipariş WhatsApp/SMS Bildirim Motoru & Elçi Hakedişi',
    changes: [
      'Netgsm ve SMS/WhatsApp Gateway entegrasyonu ile otomatik bildirim motoru (notificationEngine) kuruldu.',
      'Sipariş oluşturulduğunda / PayTR ile ödendiğinde otomatik "Sipariş Alındı" SMS bildirimi.',
      'Sipariş kargoya verildiğinde kargo firması ve takip linki içeren otomatik "Kargoya Verildi" SMS bildirimi.',
      'Sipariş teslim edildiğinde "Teslim Edildi" VIP kupon bildirimi ve Elçiye anında komisyon bakiye aktarımı bildirimi.',
      'Admin panelinde canlı SMS/WhatsApp logları, iletim durumu ve tek tıkla test SMS gönderim merkezi eklendi.',
      'Müşteri profilinde Marka Elçisi & Kazanç Paneli ve cüzdan bakiyesini alışveriş kuponuna dönüştürme özelliği eklendi.'
    ]
  },
  {
    version: 'v2.5.0',
    code: 'MAJOR-20260820-A',
    date: '20.08.2026',
    type: 'Büyük Değişim (Major)',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    title: 'Admin Güvenlik & Versiyon Takip Sistemi',
    changes: [
      'Admin girişinde şifre gizle/göster (göz ikonu) ve "Beni Hatırla" kalıcı oturum özelliği eklendi.',
      'Admin kendi kullanıcı adı ve şifresini yönetebilme / değiştirebilme paneli (AdminUser DB modeli) eklendi.',
      'Sistem sürüm ve küçük/büyük değişim kodlarının takip edildiği interaktif Versiyon Günlüğü (Changelog) oluşturuldu.'
    ]
  },
  {
    version: 'v2.4.2',
    code: 'MINOR-20260820-B',
    date: '20.08.2026',
    type: 'Özellik (Minor)',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    title: 'Müşteriler & Marka Elçileri Yönetimi',
    changes: [
      'Hesap adı soyadı, telefon, e-posta, sisteme son giriş tarihi takibi.',
      'Canlı sepet doluluk ve terk edilmiş sepet tespiti (ürünler, adetler, sepet tutarı).',
      'Müşteriye tek tıkla sepet hatırlatması veya destek içeren doğrudan WhatsApp mesajı açma butonu.',
      'Influencer marka elçisi komisyon cüzdanı ve B2B tester hak ediş kotası düzenleme paneli.'
    ]
  },
  {
    version: 'v2.4.0',
    code: 'MAJOR-20260820-C',
    date: '20.08.2026',
    type: 'Büyük Değişim (Major)',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    title: 'Sipariş Yönetimi & Lojistik Takip Modülü',
    changes: [
      'Tüm siparişlerin listelendiği, filtrelendiği ve arandığı yeni Sipariş Yönetimi sekmesi.',
      'Kargo firması seçimi ve Kargo Takip Kodu tanımlama penceresi.',
      'Sipariş durumu akışı: İşleme Al (Hazırlanıyor), Kargoya Verildi, Teslim Edildi, İptal.',
      'Müşteri profilinde kargo firması ve takip numarasının anlık gösterimi.'
    ]
  },
  {
    version: 'v2.3.5',
    code: 'PATCH-20260819-A',
    date: '19.08.2026',
    type: 'Geliştirme / Düzeltme (Patch)',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    title: 'Görsel Dağıtım & Sepet Kampanya Optimizasyonu',
    changes: [
      'kasaptanetyiyelim.com/pnio görsel kaynağı için SSL uyumlu HTTPS Proxy API rotası geliştirildi.',
      'Çok satanlar ve katalog ürünleri yeni yüksek kaliteli parfüm görselleriyle dinamik eşleştirildi.',
      'Sepet VIP hoşgeldin indirim sayacı 10 dakikaya (600s) ayarlandı.'
    ]
  },
  {
    version: 'v2.3.0',
    code: 'MAJOR-20260818-A',
    date: '18.08.2026',
    type: 'Büyük Değişim (Major)',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    title: 'PayTR Canlı Sanal POS & Müşteri Adres Yönetimi',
    changes: [
      'PayTR HMAC-SHA256 token imzalama algoritması canlı API standartlarına göre optimize edildi.',
      'Müşteri profil sayfasında teslimat adresi güncelleme ve aktif sipariş adresi düzenleme özelliği eklendi.',
      'Dinamik Navbar kullanıcı oturum durumu entegre edildi.'
    ]
  },
  {
    version: 'v2.2.0',
    code: 'MINOR-20260817-A',
    date: '17.08.2026',
    type: 'Özellik (Minor)',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    title: 'Excel Toplu Ürün Aktarımı & Toplu Fiyatlandırma',
    changes: [
      'Chunking algoritması ile binlerce ürünün Excel dosyalarından sisteme tek tıkla aktarımı.',
      'Pazaryerleri ve ana site için tek tıkla % Zam / % İndirim toplu fiyat güncelleme motoru.'
    ]
  },
  {
    version: 'v2.1.0',
    code: 'MINOR-20260816-A',
    date: '16.08.2026',
    type: 'Özellik (Minor)',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    title: 'Pazaryeri & Bayi API Entegrasyonları',
    changes: [
      'Trendyol ve Hepsiburada mağaza satıcı API anahtarları yönetimi.',
      'Pazaryeri sipariş senkronizasyonu ve kargo takip numarası eşleme.'
    ]
  },
  {
    version: 'v2.0.0',
    code: 'MAJOR-20260815-A',
    date: '15.08.2026',
    type: 'Büyük Değişim (Major)',
    badgeColor: 'bg-slate-50 text-slate-700 border-slate-200',
    title: 'PN Parfüm Core Platformu & Nöropazarlama Mimarisi',
    changes: [
      'Next.js 16 App Router & PostgreSQL Neon DB tam entegrasyonu.',
      'Yapay Zeka Koku Asistanı (Aura) & Koku Piramidi algoritması.',
      'Dinamik Senaryo Kuralları ve arkadaş kargo birleştirme mimarisi.'
    ]
  }
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'scenarios' | 'ai' | 'orders' | 'customers' | 'notifications' | 'reports' | 'api' | 'products'>('orders')
  const [loading, setLoading] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Auth states
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loginError, setLoginError] = useState('')
  const [adminUser, setAdminUser] = useState<{ id?: string, username?: string, name?: string } | null>(null)
  // Admin API'lerine giden her istekte Authorization header'ı olarak eklenen imzalı
  // oturum token'ı. "Beni Hatırla" işaretli değilse localStorage'a yazılmaz ama bu
  // state, sekme açık kaldığı sürece token'ı hafızada tutar (aksi halde her istek
  // korumasız API'lere düşerdi).
  const [adminToken, setAdminToken] = useState<string | null>(null)

  // Modals
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showVersionModal, setShowVersionModal] = useState(false)
  
  // Password Change Form States
  const [currentPassInput, setCurrentPassInput] = useState('')
  const [newUsernameInput, setNewUsernameInput] = useState('')
  const [newPassInput, setNewPassInput] = useState('')
  const [newPassConfirm, setNewPassConfirm] = useState('')
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)

  // Data states
  const [rules, setRules] = useState<ScenarioRule[]>([])
  const [aiConfig, setAiConfig] = useState<AiConfig | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [reports, setReports] = useState<ReportData | null>(null)
  const [stores, setStores] = useState<MarketplaceStore[]>([])
  const [marketOrders, setMarketOrders] = useState<MarketplaceOrder[]>([])

  // Notification States
  const [customSmsPhone, setCustomSmsPhone] = useState('')
  const [customSmsMessage, setCustomSmsMessage] = useState('')
  const [customSmsSending, setCustomSmsSending] = useState(false)
  const [notifFilter, setNotifFilter] = useState('all')

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

  // Coupon Management States
  const [coupons, setCoupons] = useState<any[]>([])
  const [showCouponModal, setShowCouponModal] = useState(false)
  const [newCoupon, setNewCoupon] = useState({ code: '', discount_type: 'percentage', value: 10, usage_limit: '', expiresInDays: '' })

  // Integration Settings States (NETGSM SMS / SMTP e-posta)
  const [integrationSettings, setIntegrationSettings] = useState<any>(null)
  const [integrationForm, setIntegrationForm] = useState({
    netgsm_usercode: '', netgsm_password: '', netgsm_header: '',
    smtp_host: '', smtp_port: '', smtp_user: '', smtp_pass: '',
    admin_order_email: ''
  })

  // Product Management States
  const [products, setProducts] = useState<any[]>([])
  const [productSearch, setProductSearch] = useState('')
  const [productGenderFilter, setProductGenderFilter] = useState('all')
  const [productStatusFilter, setProductStatusFilter] = useState('all')
  const [productSubTab, setProductSubTab] = useState<'catalog' | 'bulk_price' | 'excel' | 'showcase'>('catalog')
  const [showcaseSearch, setShowcaseSearch] = useState('')
  const [showProductModal, setShowProductModal] = useState(false)
  const [productModalMode, setProductModalMode] = useState<'create' | 'edit'>('create')
  const [productForm, setProductForm] = useState({
    sku: '',
    original_name: '',
    gender: 'Unisex',
    fragrance_family: 'Odunsu',
    top_notes: 'Bergamot, Pembe Biber, Narenciye',
    heart_notes: 'Gül, Yasemin, Paçuli',
    base_notes: 'Sedir Ağacı, Amber, Misk',
    mood_tag: 'Karizmatik & Çekici',
    persona_tag: 'Modern Şehirli',
    season_tag: 'Dört Mevsim',
    occasion_tag: 'Özel Davet & Günlük',
    longevity_score: 9,
    sillage_score: 8,
    price: 850,
    stock: 50,
    base_cost: 250,
    publish_status: 'ACTIVE',
    image: ''
  })

  // Product Bulk update states
  const [importProgress, setImportProgress] = useState<{current: number, total: number} | null>(null)
  const [bulkPriceData, setBulkPriceData] = useState({ platform: 'all', type: 'zam', percentage: '', family: 'all' })

  // UGC & Reviews state
  const [reviews, setReviews] = useState<any[]>([])
  const [reviewFilter, setReviewFilter] = useState<'all' | 'pending' | 'approved'>('all')

  const showMsg = (type: 'success'|'error', text: string) => { setMessage({type, text}); setTimeout(() => setMessage(null), 4000) }

  // Check saved session on mount ("Beni Hatırla")
  useEffect(() => {
    const savedSession = localStorage.getItem('pn_admin_session')
    const savedUser = localStorage.getItem('pn_admin_user')
    if (savedSession && savedUser) {
      try {
        setAdminUser(JSON.parse(savedUser))
        setAdminToken(savedSession)
        setIsAuthenticated(true)
      } catch (e) {
        localStorage.removeItem('pn_admin_session')
      }
    }
  }, [])

  // Tüm /api/admin/* isteklerini bu fonksiyon üzerinden atıyoruz — Authorization
  // header'ını otomatik ekler. 401 dönerse (token geçersiz/süresi dolmuş), admin
  // oturumunu güvenli şekilde sonlandırıp giriş ekranına döner.
  const adminFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
      }
    })
    if (res.status === 401) {
      localStorage.removeItem('pn_admin_session')
      localStorage.removeItem('pn_admin_user')
      setAdminToken(null)
      setIsAuthenticated(false)
      setAdminUser(null)
    }
    return res
  }, [adminToken])

  const fetchData = async (endpoint: string, setter: any) => {
    setLoading(true)
    try {
      const res = await adminFetch(endpoint)
      if (res.ok) setter(await res.json())
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const fetchIntegrationSettings = async () => {
    setLoading(true)
    try {
      const res = await adminFetch('/api/admin/settings')
      if (res.ok) {
        const data = await res.json()
        setIntegrationSettings(data)
        // Şifre alanları API'den asla düz metin gelmez (hasNetgsmPassword/hasSmtpPass
        // olarak boolean gelir) — formda boş bırakılır, doldurulursa değiştirilir.
        setIntegrationForm({
          netgsm_usercode: data.netgsm_usercode || '',
          netgsm_password: '',
          netgsm_header: data.netgsm_header || '',
          smtp_host: data.smtp_host || '',
          smtp_port: data.smtp_port ? String(data.smtp_port) : '',
          smtp_user: data.smtp_user || '',
          smtp_pass: '',
          admin_order_email: data.admin_order_email || ''
        })
      }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleSaveIntegrationSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingId('integrations')
    try {
      const res = await adminFetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(integrationForm)
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showMsg('success', 'Entegrasyon ayarları kaydedildi.')
        fetchIntegrationSettings()
      } else {
        showMsg('error', data.error || 'Kaydedilemedi')
      }
    } catch {
      showMsg('error', 'Bağlantı hatası oluştu')
    } finally {
      setSavingId(null)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) return;
    if (activeTab === 'scenarios') fetchData('/api/admin/scenarios', setRules)
    else if (activeTab === 'ai') fetchData('/api/admin/ai', setAiConfig)
    else if (activeTab === 'orders') fetchData('/api/admin/orders', setOrders)
    else if (activeTab === 'customers') fetchData('/api/admin/customers', setCustomers)
    else if (activeTab === 'notifications') fetchData('/api/admin/notifications', setNotifications)
    else if (activeTab === 'products') fetchData('/api/admin/products', setProducts)
    else if (activeTab === 'reports') fetchData('/api/admin/reports', setReports)
    else if (activeTab === 'coupons') fetchData('/api/admin/coupons', setCoupons)
    else if (activeTab === 'integrations') fetchIntegrationSettings()
    else if (activeTab === 'api') {
      fetchData('/api/admin/marketplace/stores', setStores)
      fetchData('/api/admin/marketplace/orders', setMarketOrders)
    }
  }, [activeTab, isAuthenticated])

  const handleSendCustomSms = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customSmsPhone || !customSmsMessage) return
    setCustomSmsSending(true)

    try {
      const res = await adminFetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: customSmsPhone,
          message: customSmsMessage,
          type: 'sms'
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        showMsg('success', 'SMS bildirimi başarıyla sıraya alındı!')
        setCustomSmsPhone('')
        setCustomSmsMessage('')
        fetchData('/api/admin/notifications', setNotifications)
      } else {
        showMsg('error', data.error || 'Bildirim gönderilemedi')
      }
    } catch {
      showMsg('error', 'Bağlantı hatası oluştu')
    } finally {
      setCustomSmsSending(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setIsAuthenticated(true)
        setAdminUser(data.user)
        // Token'ı her zaman hafızada tut (adminFetch bunu kullanıyor) — "Beni Hatırla"
        // yalnızca localStorage'a KALICI olarak yazılıp yazılmayacağını belirler,
        // mevcut sekimde oturumun çalışıp çalışmayacağını değil.
        setAdminToken(data.token)
        setNewUsernameInput(data.user.username || 'admin')

        // Handle "Beni Hatırla"
        if (rememberMe) {
          localStorage.setItem('pn_admin_session', data.token)
          localStorage.setItem('pn_admin_user', JSON.stringify(data.user))
        } else {
          localStorage.removeItem('pn_admin_session')
          localStorage.removeItem('pn_admin_user')
        }
      } else {
        setLoginError(data.error || 'Kullanıcı adı veya şifre hatalı.')
      }
    } catch (err) {
      setLoginError('Bağlantı hatası oluştu.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('pn_admin_session')
    localStorage.removeItem('pn_admin_user')
    setIsAuthenticated(false)
    setPassword('')
    setAdminUser(null)
    setAdminToken(null)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassInput && newPassInput !== newPassConfirm) {
      showMsg('error', 'Yeni şifre ve şifre tekrarı uyuşmuyor.')
      return
    }

    setSavingId('change_pass')
    try {
      const res = await adminFetch('/api/admin/auth', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: currentPassInput,
          newUsername: newUsernameInput,
          newPassword: newPassInput
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        showMsg('success', 'Yönetici giriş bilgileri başarıyla güncellendi.')
        setAdminUser(data.user)
        if (rememberMe) {
          localStorage.setItem('pn_admin_user', JSON.stringify(data.user))
        }
        setShowPasswordModal(false)
        setCurrentPassInput('')
        setNewPassInput('')
        setNewPassConfirm('')
      } else {
        showMsg('error', data.error || 'Şifre güncellenemedi.')
      }
    } catch {
      showMsg('error', 'Sunucu hatası oluştu.')
    } finally {
      setSavingId(null)
    }
  }

  const handleUpdateRule = async (rule_key: string, newValue: number) => {
    setSavingId(rule_key)
    try {
      const res = await adminFetch('/api/admin/scenarios', {
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
      const res = await adminFetch('/api/admin/ai', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(aiConfig)
      })
      if (res.ok) showMsg('success', 'AI ayarları kaydedildi.')
      else throw new Error('Hata')
    } catch { showMsg('error', 'Hata oluştu.') }
    finally { setSavingId(null) }
  }

  const handleToggleReviewApproval = async (reviewId: string, currentStatus: boolean) => {
    try {
      const res = await adminFetch('/api/admin/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, isApproved: !currentStatus })
      })
      if (res.ok) {
        showMsg('success', !currentStatus ? 'Yorum onaylandı ve yayına alındı.' : 'Yorum yayından kaldırıldı.')
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, isApproved: !currentStatus } : r))
      } else {
        showMsg('error', 'İşlem başarısız')
      }
    } catch { showMsg('error', 'Hata oluştu') }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Bu yorumu kalıcı olarak silmek istediğinize emin misiniz?')) return
    try {
      const res = await adminFetch(`/api/admin/reviews?id=${reviewId}`, { method: 'DELETE' })
      if (res.ok) {
        showMsg('success', 'Yorum silindi.')
        setReviews(prev => prev.filter(r => r.id !== reviewId))
      } else {
        showMsg('error', 'Silinemedi')
      }
    } catch { showMsg('error', 'Hata oluştu') }
  }

  const handleUpdateOrderStatus = async (orderId: string, status: string, cargoCompany?: string, trackingCode?: string) => {
    setSavingId(`order_${orderId}`)
    try {
      const res = await adminFetch('/api/admin/orders', {
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
      const res = await adminFetch('/api/admin/customers', {
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
      const res = await adminFetch('/api/admin/marketplace/stores', {
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
        const res = await adminFetch('/api/admin/products/import', {
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
      const res = await adminFetch('/api/admin/products/bulk-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bulkPriceData)
      })

      const data = await res.json()
      if (res.ok) {
        showMsg('success', data.message || 'Fiyatlar başarıyla güncellendi.')
        setBulkPriceData({ platform: 'all', type: 'zam', percentage: '', family: 'all' })
      } else {
        throw new Error(data.error || 'İşlem başarısız')
      }
    } catch (err: any) {
      showMsg('error', err.message || 'Fiyat güncelleme hatası.')
    } finally {
      setSavingId(null)
    }
  }

  // --- Single Product Management Functions ---
  const handleOpenCreateProduct = () => {
    setProductModalMode('create')
    setSelectedProduct(null)
    setProductForm({
      sku: '',
      original_name: '',
      gender: 'Unisex',
      fragrance_family: 'Odunsu',
      top_notes: 'Bergamot, Pembe Biber, Narenciye',
      heart_notes: 'Gül, Yasemin, Paçuli',
      base_notes: 'Sedir Ağacı, Amber, Misk',
      mood_tag: 'Karizmatik & Çekici',
      persona_tag: 'Modern Şehirli',
      season_tag: 'Dört Mevsim',
      occasion_tag: 'Özel Davet & Günlük',
      longevity_score: 9,
      sillage_score: 8,
      price: 850,
      stock: 50,
      base_cost: 250,
      publish_status: 'ACTIVE',
      image: ''
    })
    setShowProductModal(true)
  }

  const handleOpenEditProduct = (prod: any) => {
    setProductModalMode('edit')
    setSelectedProduct(prod)
    const listing = prod.marketplaceListings?.find((l: any) => l.platform === 'pn_store') || prod.marketplaceListings?.[0]
    setProductForm({
      sku: prod.sku,
      original_name: prod.original_name,
      gender: prod.gender || 'Unisex',
      fragrance_family: Array.isArray(prod.fragrance_family) ? prod.fragrance_family[0] || 'Odunsu' : prod.fragrance_family || 'Odunsu',
      top_notes: prod.top_notes || '',
      heart_notes: prod.heart_notes || '',
      base_notes: prod.base_notes || '',
      mood_tag: prod.mood_tag || 'Karizmatik & Çekici',
      persona_tag: prod.persona_tag || 'Modern Şehirli',
      season_tag: prod.season_tag || 'Dört Mevsim',
      occasion_tag: prod.occasion_tag || 'Özel Davet & Günlük',
      longevity_score: prod.longevity_score || 9,
      sillage_score: prod.sillage_score || 8,
      price: listing?.price || 850,
      stock: listing?.stock !== undefined ? listing.stock : 50,
      base_cost: prod.base_cost || 250,
      publish_status: prod.publish_status || 'ACTIVE',
      image: listing?.images?.[0] || ''
    })
    setShowProductModal(true)
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingId('save_product')

    try {
      const method = productModalMode === 'create' ? 'POST' : 'PUT'
      const res = await adminFetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productForm,
          fragrance_family: [productForm.fragrance_family]
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        showMsg('success', data.message || 'Ürün başarıyla kaydedildi.')
        setShowProductModal(false)
        fetchData('/api/admin/products', setProducts)
      } else {
        showMsg('error', data.error || 'İşlem başarısız')
      }
    } catch {
      showMsg('error', 'Ürün kaydedilirken bağlantı hatası oluştu.')
    } finally {
      setSavingId(null)
    }
  }

  const handleDeleteProduct = async (sku: string) => {
    if (!confirm(`PN ${sku} ürününü silmek istediğinize emin misiniz?`)) return
    setSavingId(`del_${sku}`)

    try {
      const res = await adminFetch(`/api/admin/products?sku=${sku}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok && data.success) {
        showMsg('success', data.message || 'Ürün silindi.')
        fetchData('/api/admin/products', setProducts)
      } else {
        showMsg('error', data.error || 'Ürün silinemedi')
      }
    } catch {
      showMsg('error', 'Silme işlemi sırasında hata oluştu.')
    } finally {
      setSavingId(null)
    }
  }

  const handleToggleProductStatus = async (prod: any) => {
    const newStatus = prod.publish_status === 'ACTIVE' ? 'PASSIVE' : 'ACTIVE'
    try {
      const res = await adminFetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku: prod.sku, publish_status: newStatus })
      })
      if (res.ok) {
        showMsg('success', `PN ${prod.sku} durumu ${newStatus === 'ACTIVE' ? 'Aktif' : 'Pasif'} yapıldı.`)
        fetchData('/api/admin/products', setProducts)
      }
    } catch {
      showMsg('error', 'Durum güncellenemedi')
    }
  }

  // "Çok Satanlar" / "İndirimde" vitrinleri — her biri en fazla 10 ürünle sınırlı
  // (sunucu tarafında da doğrulanıyor, bkz. api/admin/products PUT).
  const handleToggleShowcase = async (prod: any, field: 'is_featured' | 'is_on_sale') => {
    try {
      const res = await adminFetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku: prod.sku, [field]: !prod[field] })
      })
      const data = await res.json()
      if (res.ok) {
        setProducts(prev => prev.map(p => p.sku === prod.sku ? { ...p, [field]: !prod[field] } : p))
      } else {
        showMsg('error', data.error || 'Güncellenemedi')
      }
    } catch {
      showMsg('error', 'Bağlantı hatası oluştu')
    }
  }

  // --- Coupon Management ---
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCoupon.code.trim()) {
      showMsg('error', 'Kupon kodu gereklidir')
      return
    }
    setSavingId('create_coupon')
    try {
      const res = await adminFetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCoupon.code,
          discount_type: newCoupon.discount_type,
          value: newCoupon.value,
          usage_limit: newCoupon.usage_limit || null,
          expiresInDays: newCoupon.expiresInDays || null
        })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showMsg('success', `${data.coupon.code} kuponu oluşturuldu.`)
        setShowCouponModal(false)
        setNewCoupon({ code: '', discount_type: 'percentage', value: 10, usage_limit: '', expiresInDays: '' })
        fetchData('/api/admin/coupons', setCoupons)
      } else {
        showMsg('error', data.error || 'Kupon oluşturulamadı')
      }
    } catch {
      showMsg('error', 'Bağlantı hatası oluştu')
    } finally {
      setSavingId(null)
    }
  }

  const handleToggleCoupon = async (coupon: any) => {
    try {
      const res = await adminFetch('/api/admin/coupons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: coupon.id, is_active: !coupon.is_active })
      })
      if (res.ok) {
        showMsg('success', `${coupon.code} ${!coupon.is_active ? 'aktif' : 'pasif'} yapıldı.`)
        setCoupons(prev => prev.map(c => c.id === coupon.id ? { ...c, is_active: !coupon.is_active } : c))
      }
    } catch {
      showMsg('error', 'Kupon güncellenemedi')
    }
  }

  const handleDeleteCoupon = async (coupon: any) => {
    if (!confirm(`"${coupon.code}" kuponunu kalıcı olarak silmek istediğinize emin misiniz?`)) return
    try {
      const res = await adminFetch(`/api/admin/coupons?id=${coupon.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok) {
        showMsg('success', 'Kupon silindi.')
        setCoupons(prev => prev.filter(c => c.id !== coupon.id))
      } else {
        showMsg('error', data.error || 'Kupon silinemedi')
      }
    } catch {
      showMsg('error', 'Bağlantı hatası oluştu')
    }
  }

  // Filtered Products Calculation
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (productGenderFilter !== 'all' && p.gender?.toLowerCase() !== productGenderFilter.toLowerCase()) {
        return false
      }
      if (productStatusFilter !== 'all' && p.publish_status !== productStatusFilter) {
        return false
      }
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase()
        const matchSku = p.sku?.toLowerCase().includes(q)
        const matchName = p.original_name?.toLowerCase().includes(q)
        const matchMood = p.mood_tag?.toLowerCase().includes(q)
        const matchFamily = Array.isArray(p.fragrance_family) && p.fragrance_family.some((f: string) => f.toLowerCase().includes(q))
        if (!matchSku && !matchName && !matchMood && !matchFamily) {
          return false
        }
      }
      return true
    })
  }, [products, productGenderFilter, productStatusFilter, productSearch])

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

  // ===================== GIRIS EKRANI =====================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-md w-full p-8 md:p-10 relative overflow-hidden">
          {/* Top Version Indicator */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">PN</div>
              <span className="font-bold text-gray-900 text-base">PN Parfüm</span>
            </div>
            <button 
              onClick={() => setShowVersionModal(true)} 
              className="inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-mono font-semibold px-2.5 py-1 rounded-full transition-colors"
            >
              <Info size={12} /> {SYSTEM_VERSION}
            </button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Yönetici Paneli</h1>
            <p className="text-xs text-gray-500 mt-1">Lütfen devam etmek için oturum açın</p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs flex items-center gap-2">
              <AlertCircle size={16} /> {loginError}
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
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="••••••••" 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  title={showPassword ? 'Şifreyi Gizle' : 'Şifreyi Göster'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Beni Hatırla */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-xs text-gray-600 font-medium">Beni Hatırla</span>
              </label>

              <button 
                type="button" 
                onClick={() => setShowVersionModal(true)} 
                className="text-[11px] text-gray-400 hover:text-indigo-600 transition-colors"
              >
                Sürüm Detayları
              </button>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors mt-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? <RefreshCw className="animate-spin" size={16} /> : null}
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
        </div>

        {/* Versiyon Modalı (Login ekranı için) */}
        {showVersionModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <History className="text-indigo-600" size={22} />
                  <div>
                    <h3 className="font-bold text-gray-900">PN Parfüm Sürüm & Değişiklik Günlüğü</h3>
                    <p className="text-xs text-gray-500">Güncel Sürüm: {SYSTEM_VERSION} (Build {SYSTEM_BUILD_DATE})</p>
                  </div>
                </div>
                <button onClick={() => setShowVersionModal(false)} className="p-2 text-gray-400 hover:text-gray-700 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {CHANGELOG.map((rel, idx) => (
                  <div key={idx} className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-base">{rel.version}</span>
                        <span className="font-mono text-[11px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-semibold">{rel.code}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${rel.badgeColor}`}>{rel.type}</span>
                        <span className="text-xs text-gray-400 font-mono">{rel.date}</span>
                      </div>
                    </div>

                    <h4 className="text-sm font-semibold text-gray-800">{rel.title}</h4>

                    <ul className="space-y-1.5 text-xs text-gray-600 list-disc list-inside">
                      {rel.changes.map((c, cIdx) => (
                        <li key={cIdx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ===================== ANA ADMIN ARAYUZU =====================
  return (
    <div className="min-h-screen bg-gray-50/50 flex">
      {/* Sol Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold tracking-wider text-sm shadow">PN</div>
              <div>
                <span className="font-bold text-gray-900 text-sm block">PN Panel</span>
                <span className="text-[10px] text-gray-400 font-mono">{SYSTEM_VERSION}</span>
              </div>
            </div>

            <button 
              onClick={() => setShowVersionModal(true)} 
              className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Sürüm Geçmişi (Changelog)"
            >
              <History size={16} />
            </button>
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
              onClick={() => setActiveTab('notifications')} 
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${activeTab === 'notifications' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <Bell size={18} /> Bildirim & SMS
              </div>
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Otomatik</span>
            </button>

            <button 
              onClick={() => setActiveTab('scenarios')} 
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${activeTab === 'scenarios' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Settings size={18} /> Senaryo Kuralları
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${activeTab === 'coupons' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Tag size={18} /> Kuponlar
            </button>

            <button
              onClick={() => setActiveTab('integrations')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${activeTab === 'integrations' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Server size={18} /> Entegrasyonlar
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
              onClick={() => { setActiveTab('reviews'); fetchData('/api/admin/reviews', setReviews) }} 
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${activeTab === 'reviews' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={18} /> Yorumlar & UGC
              </div>
              {reviews.filter(r => !r.isApproved).length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {reviews.filter(r => !r.isApproved).length} Yeni
                </span>
              )}
            </button>

            <button 
              onClick={() => setActiveTab('api')} 
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${activeTab === 'api' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Server size={18} /> Pazaryeri & Bayi API
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-2">
          {/* Admin Güvenlik & Şifre Yönetimi Butonu */}
          <button 
            onClick={() => setShowPasswordModal(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors font-medium border border-gray-200"
          >
            <Key size={14} className="text-indigo-600" /> Şifre & Güvenlik
          </button>

          <div className="flex items-center justify-between text-xs text-gray-400 px-1 pt-1">
            <button onClick={() => setShowVersionModal(true)} className="hover:text-indigo-600 font-mono transition-colors">
              {SYSTEM_VERSION}
            </button>
            <button onClick={handleLogout} className="hover:text-red-600 font-medium transition-colors">
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>

      {/* Sağ Ana İçerik */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-gray-900 text-lg">
              {activeTab === 'orders' && 'Sipariş Yönetimi & Lojistik'}
              {activeTab === 'customers' && 'Müşteriler, Elçiler & Cüzdan Yönetimi'}
              {activeTab === 'notifications' && 'Bildirim & SMS Merkezi'}
              {activeTab === 'scenarios' && 'Senaryo Kuralları'}
              {activeTab === 'coupons' && 'Kupon Yönetimi'}
              {activeTab === 'integrations' && 'SMS & E-posta Entegrasyonları'}
              {activeTab === 'products' && 'Toplu Fiyat & Excel Ürün Yönetimi'}
              {activeTab === 'reviews' && 'Müşteri Yorumları & UGC Değerlendirmeleri'}
              {activeTab === 'ai' && 'Nöropazarlama & Yapay Zeka'}
              {activeTab === 'reports' && 'Performans Raporları'}
              {activeTab === 'api' && 'Pazaryeri & Bayi Entegrasyonları'}
            </h1>

            {/* Versiyon Rozeti */}
            <button 
              onClick={() => setShowVersionModal(true)} 
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-mono font-medium transition-colors"
              title="Değişiklik Günlüğü (Changelog)"
            >
              <Info size={12} /> {SYSTEM_VERSION}
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="p-2 text-gray-500 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 rounded-lg transition-colors border border-gray-200 flex items-center gap-1.5 text-xs font-medium"
              title="Şifre Değiştir"
            >
              <Key size={14} /> <span className="hidden sm:inline">Şifre Değiştir</span>
            </button>

            <button 
              onClick={() => {
                if (activeTab === 'orders') fetchData('/api/admin/orders', setOrders)
                else if (activeTab === 'customers') fetchData('/api/admin/customers', setCustomers)
                else if (activeTab === 'scenarios') fetchData('/api/admin/scenarios', setRules)
                else if (activeTab === 'reports') fetchData('/api/admin/reports', setReports)
                else if (activeTab === 'reviews') fetchData('/api/admin/reviews', setReviews)
                else if (activeTab === 'coupons') fetchData('/api/admin/coupons', setCoupons)
                else if (activeTab === 'integrations') fetchIntegrationSettings()
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
                                  <td className="px-6 py-4">
                                    <div className="font-semibold text-gray-900">{c.name || 'İsimsiz Üye'}</div>
                                    <div className="text-xs text-gray-500 font-mono">{c.email}</div>
                                  </td>

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

                                  <td className="px-6 py-4">
                                    {getPartnerBadge(c.partner_type)}
                                    {c.referral_code && (
                                      <div className="text-[10px] font-mono text-gray-400 mt-0.5">Kod: {c.referral_code}</div>
                                    )}
                                  </td>

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

                                  <td className="px-6 py-4">
                                    <span className="font-bold text-emerald-600 text-sm">{c.wallet_balance} TL</span>
                                    {c.earned_samples > 0 && (
                                      <div className="text-[11px] text-purple-600 font-medium">({c.earned_samples} Tester Kotası)</div>
                                    )}
                                  </td>

                                  <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                                    {new Date(c.createdAt).toLocaleDateString('tr-TR')}
                                  </td>

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

              {/* ===================== BILDIRIM & SMS YONETIMI ===================== */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  {/* Top Notification Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase mb-2">
                        <span>Toplam Bildirim</span>
                        <Bell size={16} className="text-indigo-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{notifications.length}</div>
                      <p className="text-[11px] text-gray-400 mt-1">İletilen SMS & Mesaj</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between text-purple-600 text-xs font-semibold uppercase mb-2">
                        <span>Kargo Bildirimleri</span>
                        <Truck size={16} />
                      </div>
                      <div className="text-2xl font-bold text-purple-700">
                        {notifications.filter((n: any) => n.trigger_reason === 'order_shipped').length}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">Kargo takip linki iletilen</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between text-blue-600 text-xs font-semibold uppercase mb-2">
                        <span>Sipariş Onayları</span>
                        <CheckCircle size={16} />
                      </div>
                      <div className="text-2xl font-bold text-blue-700">
                        {notifications.filter((n: any) => n.trigger_reason === 'order_created').length}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">Ödeme alındı bildirimi</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between text-emerald-600 text-xs font-semibold uppercase mb-2">
                        <span>Elçi Komisyonu</span>
                        <Award size={16} />
                      </div>
                      <div className="text-2xl font-bold text-emerald-700">
                        {notifications.filter((n: any) => n.trigger_reason === 'affiliate_commission').length}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">Hakediş bilgilendirmesi</p>
                    </div>
                  </div>

                  {/* Manual SMS Dispatch & Gateway Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* SMS Test & Send Form */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                          <Send size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">Hızlı SMS / Bildirim Gönder</h3>
                          <p className="text-xs text-gray-500">Müşteriye veya test numaranıza özel SMS iletin</p>
                        </div>
                      </div>

                      <form onSubmit={handleSendCustomSms} className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Telefon Numarası</label>
                          <input 
                            type="tel"
                            placeholder="0532 123 45 67"
                            value={customSmsPhone}
                            onChange={e => setCustomSmsPhone(e.target.value)}
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                          />
                        </div>

                        {/* Template Quick Pills */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Hazır Şablonlar</label>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => setCustomSmsMessage('Sayın Müşterimiz, PN Parfüm siparişiniz kargoya verilmiştir. Takip: https://pnparfume.com/profil')}
                              className="text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-lg transition-colors"
                            >
                              🚚 Kargo Şablonu
                            </button>
                            <button
                              type="button"
                              onClick={() => setCustomSmsMessage('PN Parfümde sana özel %15 indirim kuponun: PN-VIP15. Hemen keşfet: https://pnparfume.com/katalog')}
                              className="text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-lg transition-colors"
                            >
                              🎁 VIP İndirim
                            </button>
                            <button
                              type="button"
                              onClick={() => setCustomSmsMessage('Sayın Müşterimiz, sepetinizdeki ürünler tükenmek üzere. Tamamlamak için: https://pnparfume.com/sepet')}
                              className="text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-lg transition-colors"
                            >
                              🛒 Terk Edilmiş Sepet
                            </button>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-semibold text-gray-700">Mesaj İçeriği</label>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {customSmsMessage.length} karakter ({Math.ceil((customSmsMessage.length || 1) / 155)} SMS)
                            </span>
                          </div>
                          <textarea 
                            rows={3}
                            placeholder="İletilecek mesaj metnini yazın..."
                            value={customSmsMessage}
                            onChange={e => setCustomSmsMessage(e.target.value)}
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                          />
                        </div>

                        <button 
                          type="submit"
                          disabled={customSmsSending || !customSmsPhone || !customSmsMessage}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-xs font-semibold transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                        >
                          <Send size={14} />
                          {customSmsSending ? 'Gönderiliyor...' : 'Bildirimi Gönder'}
                        </button>
                      </form>
                    </div>

                    {/* Gateway Config Status */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <CheckCircle size={18} />
                          </div>
                          <h4 className="font-bold text-gray-900 text-sm">SMS Gateway Durumu</h4>
                        </div>
                        
                        <p className="text-xs text-gray-600 leading-relaxed mb-4">
                          Sistem Netgsm REST API ve simülasyon motoruyla tam entegredir. Siparişler ve kargolama işlemleri yapıldığında müşterilere otomatik SMS tetiklenir.
                        </p>

                        <div className="space-y-2.5 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200 font-mono">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Sağlayıcı:</span>
                            <span className="font-semibold text-gray-800">Netgsm / Webhook</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">SMS Başlığı:</span>
                            <span className="font-semibold text-indigo-600">PN PARFUM</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Otomasyon:</span>
                            <span className="font-semibold text-emerald-600">Aktif (Canlı)</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-400">
                        * `.env` dosyasında `NETGSM_USERCODE` ve `NETGSM_PASSWORD` tanımlandığında mesajlar doğrudan GSM operatörlerine iletilir.
                      </div>
                    </div>
                  </div>

                  {/* Notification History Log Table */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">Bildirim & İletim Günlüğü</h3>
                        <p className="text-xs text-gray-500">Sistem tarafından otomatik ve manuel iletilen tüm bildirimler</p>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        {['all', 'order_created', 'order_shipped', 'order_delivered', 'affiliate_commission', 'cart_abandonment'].map((f) => (
                          <button
                            key={f}
                            onClick={() => setNotifFilter(f)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors border ${
                              notifFilter === f 
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            {f === 'all' ? 'Tümü' : 
                             f === 'order_created' ? 'Sipariş Onayı' :
                             f === 'order_shipped' ? 'Kargo' :
                             f === 'order_delivered' ? 'Teslim' :
                             f === 'affiliate_commission' ? 'Elçi Komisyonu' : 'Terk Edilmiş Sepet'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider">
                            <th className="px-6 py-4">Tarih</th>
                            <th className="px-6 py-4">Alıcı</th>
                            <th className="px-6 py-4">Tetikleyici Sebep</th>
                            <th className="px-6 py-4">Tür</th>
                            <th className="px-6 py-4">Durum</th>
                            <th className="px-6 py-4">Mesaj Önizleme</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {notifications.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="p-12 text-center text-gray-400">
                                <Bell size={36} className="mx-auto mb-2 opacity-30" />
                                Henüz iletilmiş bildirim bulunmuyor.
                              </td>
                            </tr>
                          ) : (
                            notifications
                              .filter((n: any) => notifFilter === 'all' || n.trigger_reason === notifFilter)
                              .map((n: any) => (
                                <tr key={n.id} className="hover:bg-gray-50/70 transition-colors">
                                  <td className="px-6 py-4 font-mono text-gray-500 whitespace-nowrap">
                                    {new Date(n.createdAt).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="font-semibold text-gray-900">{n.customer?.name || 'Müşteri'}</div>
                                    <div className="font-mono text-[11px] text-gray-500">{n.phone || '-'}</div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                                      n.trigger_reason === 'order_shipped' ? 'bg-purple-100 text-purple-700' :
                                      n.trigger_reason === 'order_created' ? 'bg-blue-100 text-blue-700' :
                                      n.trigger_reason === 'order_delivered' ? 'bg-emerald-100 text-emerald-700' :
                                      n.trigger_reason === 'affiliate_commission' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                      {n.trigger_reason === 'order_shipped' ? '🚚 Kargoya Verildi' :
                                       n.trigger_reason === 'order_created' ? '💳 Sipariş Alındı' :
                                       n.trigger_reason === 'order_delivered' ? '✨ Teslim Edildi' :
                                       n.trigger_reason === 'affiliate_commission' ? '💰 Elçi Komisyonu' :
                                       n.trigger_reason === 'cart_abandonment' ? '🛒 Terk Sepet' : 'Özel Mesaj'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 uppercase font-bold text-gray-600 font-mono text-[11px]">
                                    {n.type}
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                                      n.status === 'sent' ? 'bg-emerald-100 text-emerald-700' :
                                      n.status === 'simulated' ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'
                                    }`}>
                                      {n.status === 'sent' ? '✅ İletildi' : n.status === 'simulated' ? '⚡ Simüle Edildi' : '❌ Hatalı'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 max-w-xs truncate text-gray-700" title={n.message_content}>
                                    {n.message_content}
                                  </td>
                                </tr>
                              ))
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

              {/* ===================== KUPONLAR ===================== */}
              {activeTab === 'coupons' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-between gap-4 shadow-sm">
                    <span className="text-sm text-gray-500">{coupons.length} kupon</span>
                    <button
                      onClick={() => setShowCouponModal(true)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
                    >
                      <Tag size={14} /> Yeni Kupon Oluştur
                    </button>
                  </div>

                  {coupons.length === 0 ? (
                    <div className="p-16 bg-white rounded-2xl border border-gray-200 text-center text-gray-400 text-sm">
                      <Tag className="mx-auto mb-2 text-gray-300" size={32} />
                      Henüz kupon bulunmuyor.
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wider">
                            <th className="px-5 py-3">Kod</th>
                            <th className="px-5 py-3">Değer</th>
                            <th className="px-5 py-3">Kaynak</th>
                            <th className="px-5 py-3">Sahibi</th>
                            <th className="px-5 py-3">Kullanım</th>
                            <th className="px-5 py-3">Son Kullanma</th>
                            <th className="px-5 py-3">Durum</th>
                            <th className="px-5 py-3"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {coupons.map((c: any) => {
                            const isExpired = c.expiresAt && new Date(c.expiresAt) < new Date()
                            return (
                              <tr key={c.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                                <td className="px-5 py-3 font-mono font-bold text-gray-800">{c.code}</td>
                                <td className="px-5 py-3 text-gray-700">
                                  {c.value == null ? <span className="text-rose-500 text-xs">Değer yok (bozuk kayıt)</span> : c.discount_type === 'percentage' ? `%${c.value}` : `${c.value} TL`}
                                </td>
                                <td className="px-5 py-3">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600 uppercase tracking-wide">{c.source}</span>
                                </td>
                                <td className="px-5 py-3 text-xs text-gray-500">{c.customer?.name || c.customer?.email || '—'}</td>
                                <td className="px-5 py-3 text-xs text-gray-500">{c.usage_count}{c.usage_limit ? ` / ${c.usage_limit}` : ' / ∞'}</td>
                                <td className="px-5 py-3 text-xs text-gray-500">
                                  {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('tr-TR') : 'Süresiz'}
                                  {isExpired && <span className="ml-1.5 text-[10px] font-bold text-rose-600">SÜRESİ DOLDU</span>}
                                </td>
                                <td className="px-5 py-3">
                                  <button
                                    onClick={() => handleToggleCoupon(c)}
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide transition-colors ${
                                      c.is_active && !isExpired
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200'
                                        : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
                                    }`}
                                  >
                                    {c.is_active ? 'Aktif' : 'Pasif'}
                                  </button>
                                </td>
                                <td className="px-5 py-3 text-right">
                                  <button
                                    onClick={() => handleDeleteCoupon(c)}
                                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                    title="Sil"
                                  >
                                    <X size={14} />
                                  </button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ===================== ENTEGRASYONLAR (SMS / E-POSTA) ===================== */}
              {activeTab === 'integrations' && (
                <form onSubmit={handleSaveIntegrationSettings} className="space-y-6 max-w-2xl">
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h3 className="font-bold text-gray-900 mb-1">SMS (NETGSM)</h3>
                    <p className="text-xs text-gray-500 mb-5">Sipariş, kargo, teslimat ve indirim kodu SMS'leri buradan gönderilir. Boş bırakılırsa (henüz hiç girilmediyse) SMS'ler simülasyon modunda kalır, hiçbir şey bozulmaz.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Kullanıcı Kodu</label>
                        <input
                          type="text"
                          value={integrationForm.netgsm_usercode}
                          onChange={e => setIntegrationForm({ ...integrationForm, netgsm_usercode: e.target.value })}
                          placeholder="NETGSM kullanıcı kodunuz"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Şifre</label>
                        <input
                          type="password"
                          value={integrationForm.netgsm_password}
                          onChange={e => setIntegrationForm({ ...integrationForm, netgsm_password: e.target.value })}
                          placeholder={integrationSettings?.hasNetgsmPassword ? '•••••••• (değiştirmek için doldurun)' : 'NETGSM şifreniz'}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Mesaj Başlığı (Gönderen Adı)</label>
                        <input
                          type="text"
                          value={integrationForm.netgsm_header}
                          onChange={e => setIntegrationForm({ ...integrationForm, netgsm_header: e.target.value })}
                          placeholder="PN PARFUM"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h3 className="font-bold text-gray-900 mb-1">E-posta (SMTP)</h3>
                    <p className="text-xs text-gray-500 mb-5">Her ödemesi onaylanan siparişte aşağıdaki adrese otomatik "Yeni Siparişiniz Var" e-postası gider.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">SMTP Sunucu</label>
                        <input
                          type="text"
                          value={integrationForm.smtp_host}
                          onChange={e => setIntegrationForm({ ...integrationForm, smtp_host: e.target.value })}
                          placeholder="mail.kurumsaleposta.com"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Port</label>
                        <input
                          type="number"
                          value={integrationForm.smtp_port}
                          onChange={e => setIntegrationForm({ ...integrationForm, smtp_port: e.target.value })}
                          placeholder="465"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Gönderici E-posta / Kullanıcı Adı</label>
                        <input
                          type="text"
                          value={integrationForm.smtp_user}
                          onChange={e => setIntegrationForm({ ...integrationForm, smtp_user: e.target.value })}
                          placeholder="siparis@pienparfume.com.tr"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Şifre</label>
                        <input
                          type="password"
                          value={integrationForm.smtp_pass}
                          onChange={e => setIntegrationForm({ ...integrationForm, smtp_pass: e.target.value })}
                          placeholder={integrationSettings?.hasSmtpPass ? '•••••••• (değiştirmek için doldurun)' : 'E-posta şifreniz'}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Sipariş Bildirimi Gidecek Adres</label>
                        <input
                          type="email"
                          value={integrationForm.admin_order_email}
                          onChange={e => setIntegrationForm({ ...integrationForm, admin_order_email: e.target.value })}
                          placeholder="muhasebe@pienparfume.com.tr"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingId === 'integrations'}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium text-sm disabled:opacity-50"
                  >
                    {savingId === 'integrations' ? 'Kaydediliyor...' : 'Entegrasyon Ayarlarını Kaydet'}
                  </button>
                </form>
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

              {/* ===================== URUN & STOK YONETIMI ===================== */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  {/* Top Subtab Switcher */}
                  <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap gap-2">
                    <button
                      onClick={() => setProductSubTab('catalog')}
                      className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
                        productSubTab === 'catalog'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Box size={16} /> Tekil Ürün Kataloğu ({products.length})
                    </button>

                    <button
                      onClick={() => setProductSubTab('showcase')}
                      className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
                        productSubTab === 'showcase'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Award size={16} /> Vitrin Seçimi
                    </button>

                    <button
                      onClick={() => setProductSubTab('bulk_price')}
                      className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
                        productSubTab === 'bulk_price'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Percent size={16} /> Toplu Fiyat Güncelleme
                    </button>

                    <button
                      onClick={() => setProductSubTab('excel')}
                      className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
                        productSubTab === 'excel'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <UploadCloud size={16} /> Excel Toplu Aktarım
                    </button>
                  </div>

                  {/* SUBTAB 1: TEKIL URUN KATALOGU */}
                  {productSubTab === 'catalog' && (
                    <div className="space-y-6">
                      {/* Search & Filter & Add Button Bar */}
                      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row gap-3 flex-1">
                          <div className="relative flex-1 max-w-md">
                            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                              type="text" 
                              placeholder="SKU, Parfüm Adı, Koku Ailesi veya Tarz ara..." 
                              value={productSearch}
                              onChange={e => setProductSearch(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {productSearch && (
                              <button onClick={() => setProductSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <X size={14} />
                              </button>
                            )}
                          </div>

                          <select
                            value={productGenderFilter}
                            onChange={e => setProductGenderFilter(e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-medium text-gray-700"
                          >
                            <option value="all">Tüm Cinsiyetler</option>
                            <option value="Erkek">Erkek</option>
                            <option value="Kadın">Kadın</option>
                            <option value="Unisex">Unisex</option>
                          </select>

                          <select
                            value={productStatusFilter}
                            onChange={e => setProductStatusFilter(e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-medium text-gray-700"
                          >
                            <option value="all">Tüm Durumlar</option>
                            <option value="ACTIVE">Yalnızca Aktif</option>
                            <option value="PASSIVE">Yalnızca Pasif</option>
                          </select>
                        </div>

                        <button
                          onClick={handleOpenCreateProduct}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                          <PackagePlus size={16} /> Yeni Parfüm Ekle
                        </button>
                      </div>

                      {/* Products Table */}
                      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider">
                                <th className="px-6 py-4">SKU / Kod</th>
                                <th className="px-6 py-4">Parfüm İsmi</th>
                                <th className="px-6 py-4">Koku Ailesi / Cinsiyet</th>
                                <th className="px-6 py-4">Koku Piramidi (Notalar)</th>
                                <th className="px-6 py-4">Kalıcılık / Yayılım</th>
                                <th className="px-6 py-4">Fiyat & Stok</th>
                                <th className="px-6 py-4">Durum</th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {filteredProducts.length === 0 ? (
                                <tr>
                                  <td colSpan={8} className="p-12 text-center text-gray-400">
                                    <Box size={36} className="mx-auto mb-2 opacity-30" />
                                    Aranan kriterlere uygun parfüm bulunamadı.
                                  </td>
                                </tr>
                              ) : (
                                filteredProducts.map((prod: any) => {
                                  const listing = prod.marketplaceListings?.find((l: any) => l.platform === 'pn_store') || prod.marketplaceListings?.[0]
                                  const priceVal = listing?.price || 850
                                  const stockVal = listing?.stock !== undefined ? listing.stock : 50

                                  return (
                                    <tr key={prod.sku} className="hover:bg-gray-50/70 transition-colors">
                                      <td className="px-6 py-4">
                                        <div className="font-mono font-bold text-indigo-700 text-sm">PN {prod.sku}</div>
                                      </td>
                                      <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900 text-sm">{prod.original_name}</div>
                                        <div className="text-[10px] text-gray-400 truncate max-w-[160px]">{prod.mood_tag || 'Özel Seri'}</div>
                                      </td>
                                      <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 items-start">
                                          <span className="font-semibold text-gray-700">{Array.isArray(prod.fragrance_family) ? prod.fragrance_family.join(', ') : prod.fragrance_family}</span>
                                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            prod.gender?.toLowerCase() === 'kadın' ? 'bg-rose-100 text-rose-700' :
                                            prod.gender?.toLowerCase() === 'erkek' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                          }`}>
                                            {prod.gender || 'Unisex'}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 max-w-xs">
                                        <div className="text-[11px] text-gray-600 line-clamp-1">
                                          <span className="font-bold text-gray-400">Üst:</span> {prod.top_notes || '-'}
                                        </div>
                                        <div className="text-[11px] text-gray-600 line-clamp-1">
                                          <span className="font-bold text-gray-400">Kalp:</span> {prod.heart_notes || '-'}
                                        </div>
                                        <div className="text-[11px] text-gray-600 line-clamp-1">
                                          <span className="font-bold text-gray-400">Dip:</span> {prod.base_notes || '-'}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-gray-700 font-medium">Kalıcılık: <span className="font-bold text-indigo-600">{prod.longevity_score || 9}/10</span></div>
                                        <div className="text-gray-500 text-[10px]">Yayılım: <span className="font-bold text-indigo-600">{prod.sillage_score || 8}/10</span></div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-bold text-gray-900 text-sm">{priceVal} TL</div>
                                        <div className={`text-[10px] font-semibold ${stockVal > 10 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                          Stok: {stockVal} Adet
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                          onClick={() => handleToggleProductStatus(prod)}
                                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                                            prod.publish_status === 'ACTIVE'
                                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                          }`}
                                          title="Durumu Değiştir"
                                        >
                                          {prod.publish_status === 'ACTIVE' ? '✅ Aktif' : '⏸️ Pasif'}
                                        </button>
                                      </td>
                                      <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-1.5">
                                          <button
                                            onClick={() => handleOpenEditProduct(prod)}
                                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium transition-colors"
                                          >
                                            Düzenle
                                          </button>
                                          <button
                                            onClick={() => handleDeleteProduct(prod.sku)}
                                            disabled={savingId === `del_${prod.sku}`}
                                            className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-medium transition-colors"
                                            title="Sil"
                                          >
                                            Sil
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

                  {/* SUBTAB: VITRIN SECIMI (COK SATANLAR / INDIRIMDE) */}
                  {productSubTab === 'showcase' && (
                    <div className="space-y-4">
                      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">
                          Ana sayfadaki "Çok Satanlar" vitrini ve <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">/indirimli-parfum</code> sayfası burada işaretlediğiniz ürünleri gösterir. Her vitrin en fazla <strong>10 ürünle</strong> sınırlıdır; hiç seçim yapılmazsa "Çok Satanlar" otomatik seçime döner.
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-xs font-semibold">
                          <span className={`px-2.5 py-1 rounded-full ${products.filter((p: any) => p.is_featured).length >= 10 ? 'bg-rose-100 text-rose-700' : 'bg-indigo-50 text-indigo-700'}`}>
                            Çok Satanlar: {products.filter((p: any) => p.is_featured).length} / 10
                          </span>
                          <span className={`px-2.5 py-1 rounded-full ${products.filter((p: any) => p.is_on_sale).length >= 10 ? 'bg-rose-100 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>
                            İndirimde: {products.filter((p: any) => p.is_on_sale).length} / 10
                          </span>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="relative mb-4">
                          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="SKU veya ürün adıyla ara..."
                            value={showcaseSearch}
                            onChange={e => setShowcaseSearch(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm"
                          />
                        </div>

                        <div className="overflow-x-auto max-h-[560px] overflow-y-auto">
                          <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-white">
                              <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wider">
                                <th className="px-3 py-2">SKU</th>
                                <th className="px-3 py-2">Ürün</th>
                                <th className="px-3 py-2 text-center">Çok Satanlar</th>
                                <th className="px-3 py-2 text-center">İndirimde</th>
                              </tr>
                            </thead>
                            <tbody>
                              {products
                                .filter((p: any) => {
                                  if (!showcaseSearch) return true
                                  const q = showcaseSearch.toLowerCase()
                                  return p.sku.toLowerCase().includes(q) || (p.original_name || '').toLowerCase().includes(q)
                                })
                                .map((p: any) => (
                                  <tr key={p.sku} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                                    <td className="px-3 py-2 font-mono font-bold text-gray-800">{p.sku}</td>
                                    <td className="px-3 py-2 text-gray-600 truncate max-w-[240px]">{p.seo_name || p.original_name}</td>
                                    <td className="px-3 py-2 text-center">
                                      <button
                                        onClick={() => handleToggleShowcase(p, 'is_featured')}
                                        disabled={!p.is_featured && products.filter((x: any) => x.is_featured).length >= 10}
                                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                                          p.is_featured ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                        }`}
                                      >
                                        {p.is_featured ? 'Seçili' : 'Seç'}
                                      </button>
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                      <button
                                        onClick={() => handleToggleShowcase(p, 'is_on_sale')}
                                        disabled={!p.is_on_sale && products.filter((x: any) => x.is_on_sale).length >= 10}
                                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                                          p.is_on_sale ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                        }`}
                                      >
                                        {p.is_on_sale ? 'Seçili' : 'Seç'}
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 2: TOPLU FIYAT GUNCELLEME */}
                  {productSubTab === 'bulk_price' && (
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <h3 className="font-semibold text-gray-900 mb-2">Toplu Fiyat Değişikliği (% Zam / % İndirim)</h3>
                      <p className="text-sm text-gray-500 mb-6">Seçilen platformdaki tüm parfümlerin fiyatlarını tek tıkla toplu olarak artırın veya azaltın.</p>
                      <form onSubmit={handleBulkPriceUpdate} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-semibold mb-1 text-gray-700">Hedef Platform</label>
                          <select value={bulkPriceData.platform} onChange={e => setBulkPriceData({...bulkPriceData, platform: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm">
                            <option value="all">Tüm Platformlar & Kendi Sitemiz</option>
                            <option value="trendyol">Yalnızca Trendyol</option>
                            <option value="hepsiburada">Yalnızca Hepsiburada</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1 text-gray-700">Ürün Grubu (Koku Ailesi)</label>
                          <select value={bulkPriceData.family} onChange={e => setBulkPriceData({...bulkPriceData, family: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm">
                            <option value="all">Tüm Ürünler</option>
                            <option value="Odunsu">Odunsu</option>
                            <option value="Çiçeksi">Çiçeksi</option>
                            <option value="Baharatlı">Baharatlı</option>
                            <option value="Ferah">Ferah</option>
                            <option value="Oryantal">Oryantal</option>
                            <option value="Tatlı">Tatlı</option>
                            <option value="Meyveli">Meyveli</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1 text-gray-700">İşlem Tipi</label>
                          <select value={bulkPriceData.type} onChange={e => setBulkPriceData({...bulkPriceData, type: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm">
                            <option value="zam">Fiyat Artışı (% Zam)</option>
                            <option value="indirim">Fiyat Düşüşü (% İndirim)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1 text-gray-700">Yüzde (%)</label>
                          <input type="number" step="0.01" placeholder="Örn: 15" value={bulkPriceData.percentage} onChange={e => setBulkPriceData({...bulkPriceData, percentage: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" required />
                        </div>
                        <div className="sm:col-span-4">
                          <button type="submit" disabled={savingId === 'bulk_price'} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-xl text-xs transition-colors shadow-sm">
                            {savingId === 'bulk_price' ? 'Güncelleniyor...' : 'Fiyatları Toplu Güncelle'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* SUBTAB 3: EXCEL TOPLU AKTARIM */}
                  {productSubTab === 'excel' && (
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <h3 className="font-semibold text-gray-900 mb-2">Excel Ürün Aktarımı (Toplu Yükleme / Güncelleme)</h3>
                      <p className="text-sm text-gray-500 mb-6">Trendyol veya sistem formatındaki Excel dosyasını seçerek ürünleri anında güncelleyin veya yeni ürünler ekleyin.</p>
                      <label className="border-2 border-dashed border-gray-300 hover:border-indigo-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50/50">
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
                  )}
                </div>
              )}

              {/* ===================== YORUMLAR & UGC YÖNETİMİ ===================== */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Filter bar */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setReviewFilter('all')}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${reviewFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        Tümü ({reviews.length})
                      </button>
                      <button
                        onClick={() => setReviewFilter('pending')}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${reviewFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'}`}
                      >
                        Onay Bekleyenler ({reviews.filter(r => !r.isApproved).length})
                      </button>
                      <button
                        onClick={() => setReviewFilter('approved')}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${reviewFilter === 'approved' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'}`}
                      >
                        Yayındakiler ({reviews.filter(r => r.isApproved).length})
                      </button>
                    </div>

                    <button
                      onClick={() => fetchData('/api/admin/reviews', setReviews)}
                      className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 flex items-center gap-2"
                    >
                      <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Listeyi Yenile
                    </button>
                  </div>

                  {/* Reviews List */}
                  {reviews.length === 0 ? (
                    <div className="p-16 bg-white rounded-2xl border border-gray-200 text-center text-gray-400 text-sm">
                      <MessageSquare className="mx-auto mb-2 text-gray-300" size={32} />
                      Henüz müşteri yorumu bulunmuyor.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reviews
                        .filter(r => {
                          if (reviewFilter === 'pending') return !r.isApproved
                          if (reviewFilter === 'approved') return r.isApproved
                          return true
                        })
                        .map((rev) => (
                          <div key={rev.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-mono text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                                      PN {rev.product?.sku || rev.productSku}
                                    </span>
                                    <span className="text-xs font-semibold text-gray-800">
                                      {rev.product?.original_name || 'Parfüm'}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-600 font-medium flex items-center gap-2">
                                    <span>{rev.customerName}</span>
                                    <span className="text-[10px] text-gray-400 font-mono">
                                      {new Date(rev.createdAt).toLocaleDateString('tr-TR')}
                                    </span>
                                  </div>
                                </div>

                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  rev.isApproved 
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                                }`}>
                                  {rev.isApproved ? 'Yayında' : 'Onay Bekliyor'}
                                </span>
                              </div>

                              {/* Rating Stars */}
                              <div className="flex items-center gap-1 text-amber-400 mb-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star key={s} size={14} className={s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
                                ))}
                                <span className="text-xs font-bold text-gray-700 ml-1.5">{rev.rating}/5</span>
                              </div>

                              {/* Comment */}
                              <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 italic leading-relaxed">
                                "{rev.comment}"
                              </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-gray-100">
                              <button
                                onClick={() => handleToggleReviewApproval(rev.id, rev.isApproved)}
                                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                                  rev.isApproved
                                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                }`}
                              >
                                {rev.isApproved ? 'Yayından Kaldır' : '✓ Onayla ve Yayınla'}
                              </button>

                              <button
                                onClick={() => handleDeleteReview(rev.id)}
                                className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-medium transition-colors"
                                title="Yorumu Sil"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ===================== ADMIN SIFRE & GUVENLIK MODALI ===================== */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Admin Hesap & Şifre Yönetimi</h3>
                  <p className="text-xs text-gray-500">Yönetici kimlik bilgilerinizi güncelleyin</p>
                </div>
              </div>
              <button onClick={() => setShowPasswordModal(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Mevcut Şifreniz *</label>
                <div className="relative">
                  <input 
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassInput} 
                    onChange={e => setCurrentPassInput(e.target.value)}
                    placeholder="Mevcut yönetici şifreniz"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-3 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Kullanıcı Adı</label>
                <input 
                  type="text" 
                  value={newUsernameInput} 
                  onChange={e => setNewUsernameInput(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Yeni Şifre (Değiştirmek istemiyorsanız boş bırakın)</label>
                <div className="relative">
                  <input 
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassInput} 
                    onChange={e => setNewPassInput(e.target.value)}
                    placeholder="En az 6 karakter"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-3 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {newPassInput && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Yeni Şifre Tekrar</label>
                  <input 
                    type="password"
                    value={newPassConfirm} 
                    onChange={e => setNewPassConfirm(e.target.value)}
                    placeholder="Yeni şifreyi tekrar girin"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              )}

              <div className="pt-3 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowPasswordModal(false)} 
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-medium transition-colors"
                >
                  Vazgeç
                </button>
                <button 
                  type="submit" 
                  disabled={savingId === 'change_pass'}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-medium transition-colors shadow-sm disabled:opacity-50"
                >
                  {savingId === 'change_pass' ? 'Kaydediliyor...' : 'Bilgileri Güncelle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== YENİ KUPON MODALI ===================== */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Tag size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Yeni Kupon Oluştur</h3>
                  <p className="text-xs text-gray-500">Elle, özel bir kampanya kodu tanımlayın</p>
                </div>
              </div>
              <button onClick={() => setShowCouponModal(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Kupon Kodu *</label>
                <input
                  type="text"
                  value={newCoupon.code}
                  onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="ÖRN: YILBASI2026"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tür</label>
                  <select
                    value={newCoupon.discount_type}
                    onChange={e => setNewCoupon({ ...newCoupon, discount_type: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="percentage">Yüzde (%)</option>
                    <option value="fixed">Sabit Tutar (TL)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Değer *</label>
                  <input
                    type="number"
                    value={newCoupon.value}
                    onChange={e => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Kullanım Limiti</label>
                  <input
                    type="number"
                    value={newCoupon.usage_limit}
                    onChange={e => setNewCoupon({ ...newCoupon, usage_limit: e.target.value })}
                    placeholder="Boş = sınırsız"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Geçerlilik (Gün)</label>
                  <input
                    type="number"
                    value={newCoupon.expiresInDays}
                    onChange={e => setNewCoupon({ ...newCoupon, expiresInDays: e.target.value })}
                    placeholder="Boş = süresiz"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-medium transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={savingId === 'create_coupon'}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-medium transition-colors shadow-sm disabled:opacity-50"
                >
                  {savingId === 'create_coupon' ? 'Oluşturuluyor...' : 'Kuponu Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== VERSIYON & CHANGELOG MODALI ===================== */}
      {showVersionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <History size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">PN Parfüm Sürüm & Değişiklik Günlüğü</h3>
                  <p className="text-xs text-gray-500">Güncel Canlı Versiyon: <span className="font-mono font-bold text-indigo-600">{SYSTEM_VERSION}</span> (Build {SYSTEM_BUILD_DATE})</p>
                </div>
              </div>
              <button onClick={() => setShowVersionModal(false)} className="p-2 text-gray-400 hover:text-gray-700 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {CHANGELOG.map((rel, idx) => (
                <div key={idx} className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-base">{rel.version}</span>
                      <span className="font-mono text-[11px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-semibold">{rel.code}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${rel.badgeColor}`}>{rel.type}</span>
                      <span className="text-xs text-gray-400 font-mono">{rel.date}</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-semibold text-gray-800">{rel.title}</h4>

                  <ul className="space-y-1.5 text-xs text-gray-600 list-disc list-inside">
                    {rel.changes.map((c, cIdx) => (
                      <li key={cIdx}>{c}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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

      {/* ===================== YENI PARFUM EKLE / DUZENLE MODALI ===================== */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <PackagePlus size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {productModalMode === 'create' ? 'Yeni Parfüm Ekle' : `Parfüm Düzenle: PN ${productForm.sku}`}
                  </h3>
                  <p className="text-xs text-gray-500">Koku piramidi, notalar, fiyat ve stok bilgilerini yapılandırın</p>
                </div>
              </div>
              <button 
                onClick={() => setShowProductModal(false)} 
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">SKU / Parfüm Kodu *</label>
                  <input
                    type="text"
                    placeholder="Örn: 201 veya PN-201"
                    value={productForm.sku}
                    onChange={e => setProductForm({ ...productForm, sku: e.target.value })}
                    disabled={productModalMode === 'edit'}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Parfüm İsmi / İlham *</label>
                  <input
                    type="text"
                    placeholder="Örn: Noir Extrême"
                    value={productForm.original_name}
                    onChange={e => setProductForm({ ...productForm, original_name: e.target.value })}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Cinsiyet</label>
                  <select
                    value={productForm.gender}
                    onChange={e => setProductForm({ ...productForm, gender: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Unisex">Unisex</option>
                    <option value="Erkek">Erkek</option>
                    <option value="Kadın">Kadın</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Koku Ailesi</label>
                  <select
                    value={productForm.fragrance_family}
                    onChange={e => setProductForm({ ...productForm, fragrance_family: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Odunsu">Odunsu</option>
                    <option value="Çiçeksi">Çiçeksi</option>
                    <option value="Ferah">Ferah / Su</option>
                    <option value="Baharatlı">Baharatlı</option>
                    <option value="Oryantal">Oryantal</option>
                    <option value="Meyvemsi">Meyvemsi</option>
                    <option value="Gurme">Gurme / Tatlı</option>
                    <option value="Deri">Deri / Dumansı</option>
                  </select>
                </div>
              </div>

              {/* Koku Piramidi */}
              <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 space-y-3">
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Koku Piramidi (Notalar)</h4>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Üst Notalar (İlk Hissedilen)</label>
                  <input
                    type="text"
                    placeholder="Örn: Bergamot, Kakule, Pembe Biber"
                    value={productForm.top_notes}
                    onChange={e => setProductForm({ ...productForm, top_notes: e.target.value })}
                    className="w-full bg-white border border-indigo-200 rounded-xl p-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Kalp Notalar (Karakter & Gövde)</label>
                  <input
                    type="text"
                    placeholder="Örn: Gül, Yasemin, Paçuli, Kahve"
                    value={productForm.heart_notes}
                    onChange={e => setProductForm({ ...productForm, heart_notes: e.target.value })}
                    className="w-full bg-white border border-indigo-200 rounded-xl p-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Dip Notalar (Kalıcılık & İz)</label>
                  <input
                    type="text"
                    placeholder="Örn: Sandal Ağacı, Amber, Vanilya, Beyaz Misk"
                    value={productForm.base_notes}
                    onChange={e => setProductForm({ ...productForm, base_notes: e.target.value })}
                    className="w-full bg-white border border-indigo-200 rounded-xl p-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Kalıcılık & Yayılım & Nöropazarlama */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Kalıcılık Puanı: <span className="text-indigo-600 font-bold">{productForm.longevity_score}/10</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={productForm.longevity_score}
                    onChange={e => setProductForm({ ...productForm, longevity_score: parseInt(e.target.value) || 9 })}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Yayılım (Sillage) Puanı: <span className="text-indigo-600 font-bold">{productForm.sillage_score}/10</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={productForm.sillage_score}
                    onChange={e => setProductForm({ ...productForm, sillage_score: parseInt(e.target.value) || 8 })}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Ruh Hali / Tarz (Mood Tag)</label>
                  <input
                    type="text"
                    placeholder="Örn: Karizmatik & Çekici"
                    value={productForm.mood_tag}
                    onChange={e => setProductForm({ ...productForm, mood_tag: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Mevsim / Kullanım</label>
                  <select
                    value={productForm.season_tag}
                    onChange={e => setProductForm({ ...productForm, season_tag: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs"
                  >
                    <option value="Dört Mevsim">Dört Mevsim</option>
                    <option value="Sonbahar / Kış">Sonbahar / Kış</option>
                    <option value="İlkbahar / Yaz">İlkbahar / Yaz</option>
                  </select>
                </div>
              </div>

              {/* Fiyat, Stok ve Durum */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Satış Fiyatı (TL) *</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={e => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                    required
                    className="w-full bg-white border border-gray-200 rounded-xl p-2 text-xs font-bold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Maliyet (TL)</label>
                  <input
                    type="number"
                    value={productForm.base_cost}
                    onChange={e => setProductForm({ ...productForm, base_cost: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2 text-xs text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Stok Adedi *</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={e => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
                    required
                    className="w-full bg-white border border-gray-200 rounded-xl p-2 text-xs font-bold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Yayın Durumu</label>
                  <select
                    value={productForm.publish_status}
                    onChange={e => setProductForm({ ...productForm, publish_status: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2 text-xs font-semibold text-gray-800"
                  >
                    <option value="ACTIVE">Aktif (Satışta)</option>
                    <option value="PASSIVE">Pasif (Gizli)</option>
                  </select>
                </div>
              </div>

              {/* Görsel */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Görsel URL veya Kasap Image Dosyası</label>
                <input
                  type="text"
                  placeholder="Örn: 201.jpg veya https://.../image.jpg (Boş bırakılırsa varsayılan şişe kullanılır)"
                  value={productForm.image}
                  onChange={e => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-mono"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-gray-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl text-xs font-semibold transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={savingId === 'save_product'}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
                >
                  {savingId === 'save_product' ? 'Kaydediliyor...' : 'Parfümü Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
