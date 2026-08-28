'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Sparkles, Gift, Check, ArrowRight, Plus, X, Search, Filter, 
  ShoppingCart, Heart, ShieldCheck, Flame, Star, Award, Layers,
  ChevronRight, RefreshCw, CheckCircle2
} from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { getProductKasapImage } from '@/lib/kasapImages'

type PerfumeItem = {
  sku: string
  original_name: string
  gender: string
  fragrance_family: string[]
  top_notes: string
  heart_notes: string
  base_notes: string
  mood_tag: string
  longevity_score: number
  sillage_score: number
}

const CURATED_PACKS = [
  {
    id: 'bestsellers',
    name: '🏆 En Çok Satan 5 İmza',
    desc: 'PN Parfümün en çok sevilen 5 ikonik kokusu',
    skus: ['101', '102', '105', '201', '203']
  },
  {
    id: 'charismatic',
    name: '💼 Karizmatik & Ofis',
    desc: 'Ferah narenciye ve sofistike odunsu kompozisyonlar',
    skus: ['101', '104', '108', '204', '208']
  },
  {
    id: 'night_allure',
    name: '🌙 Gece & Özel Davet',
    desc: 'Kalıcı amber, vanilya ve baharatlı baştan çıkarıcı kokular',
    skus: ['105', '201', '205', '210', '302']
  },
  {
    id: 'floral_elegance',
    name: '🌸 Zarif Çiçeksi & Pudra',
    desc: 'Gül, yasemin ve beyaz miskin romantik dansı',
    skus: ['202', '203', '206', '209', '305']
  }
]

export default function DiscoverySetPage() {
  const { addToCart, setIsCartOpen } = useCart()
  const [products, setProducts] = useState<PerfumeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedScents, setSelectedScents] = useState<PerfumeItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [genderFilter, setGenderFilter] = useState('all')
  const [familyFilter, setFamilyFilter] = useState('all')
  const [addedAnimation, setAddedAnimation] = useState(false)
  const [customNote, setCustomNote] = useState('')

  const BOX_PRICE = 690 // 5x10ml Avantajlı Set Fiyatı (Tekil 1000 TL yerine)

  // Fetch all active perfumes
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/admin/products?status=ACTIVE')
        if (res.ok) {
          const data = await res.json()
          setProducts(data)
        }
      } catch (err) {
        console.error('Error loading discovery set products:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (genderFilter !== 'all' && p.gender?.toLowerCase() !== genderFilter.toLowerCase()) {
        return false
      }
      if (familyFilter !== 'all' && (!p.fragrance_family || !p.fragrance_family.some(f => f.toLowerCase().includes(familyFilter.toLowerCase())))) {
        return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchSku = p.sku?.toLowerCase().includes(q)
        const matchName = p.original_name?.toLowerCase().includes(q)
        const matchMood = p.mood_tag?.toLowerCase().includes(q)
        const matchNotes = (p.top_notes + ' ' + p.heart_notes + ' ' + p.base_notes).toLowerCase().includes(q)
        if (!matchSku && !matchName && !matchMood && !matchNotes) {
          return false
        }
      }
      return true
    })
  }, [products, genderFilter, familyFilter, searchQuery])

  // Handle Add to Slot
  const handleSelectPerfume = (perfume: PerfumeItem) => {
    if (selectedScents.some(s => s.sku === perfume.sku)) return
    if (selectedScents.length >= 5) return

    setSelectedScents(prev => [...prev, perfume])
  }

  // Handle Remove from Slot
  const handleRemoveSlot = (sku: string) => {
    setSelectedScents(prev => prev.filter(s => s.sku !== sku))
  }

  // Quick Curated Pack Selector
  const handleApplyCuratedPack = (skus: string[]) => {
    const packItems = products.filter(p => skus.includes(p.sku))
    if (packItems.length > 0) {
      // If we got matches, fill up to 5
      setSelectedScents(packItems.slice(0, 5))
    }
  }

  const isCartReady = selectedScents.length === 5 || customNote.trim().length > 3;

  // Add Entire Discovery Set to Cart
  const handleAddSetToCart = () => {
    if (!isCartReady) return

    const scentList = selectedScents.map(s => `PN ${s.sku}`)
    if (customNote.trim()) {
      scentList.push(`Talepler: ${customNote.trim()}`)
    }
    
    addToCart({
      sku: 'DISCOVERY-5X10',
      name: "5'li Lüks Keşif Kutusu (5x10ml Cam Şişe)",
      price: BOX_PRICE,
      quantity: 1,
      size: '5x10ml',
      selectedScents: scentList,
      imageUrl: '/images/products/pnkutulu3luseri.png'
    })

    setAddedAnimation(true)

    setTimeout(() => {
      setIsCartOpen(true)
      setAddedAnimation(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[#0E0E10] text-[#EDE8E1] pt-24 pb-28 selection:bg-amber-500 selection:text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles size={14} /> Kendi Kutunu Tasarla
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light tracking-tight mb-4">
            5'li Keşif Kutusu <span className="text-amber-400 italic">(10 ml Cam Şişe)</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            338 farklı lüks parfümümüz arasından kendi setini oluştur. İster aşağıdaki katalogdan beğendiğin kokuları seç, ister nasıl kokular sevdiğini (mekan, tarz, marka vb.) bize yaz; uzmanlarımız senin için hazırlasın.
          </p>
        </div>

        {/* ===================== INTERACTIVE 5-SLOT BOX ===================== */}
        <div className="sticky top-20 z-30 bg-zinc-900/95 backdrop-blur-md rounded-3xl border border-amber-500/30 p-5 md:p-6 mb-12 shadow-2xl shadow-black/80">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-serif font-semibold text-white">Lüks Keşif Kutun</h3>
                <span className="bg-amber-500/20 text-amber-300 font-mono text-xs px-2.5 py-0.5 rounded-full border border-amber-500/40 font-bold">
                  {selectedScents.length} / 5 Seçildi
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">Kutunu tamamlamak için aşağıdaki katalogdan beğendiğin kokuları ekle.</p>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <div className="text-right">
                <div className="text-xs text-zinc-400 line-through">1.000 TL</div>
                <div className="text-2xl font-serif font-bold text-amber-400">{BOX_PRICE} TL</div>
              </div>

              <button
                onClick={handleAddSetToCart}
                disabled={!isCartReady}
                className={`px-6 py-3.5 rounded-2xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg ${
                  isCartReady
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-amber-500/20 hover:scale-105 active:scale-95'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                }`}
              >
                {isCartReady ? (
                  <>
                    <ShoppingCart size={16} /> Kutuyu Sepete Ekle
                  </>
                ) : (
                  '5 Koku Seç veya Not Yaz'
                )}
              </button>
            </div>
          </div>

          {/* 5 Slots Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
            {[0, 1, 2, 3, 4].map((slotIdx) => {
              const scent = selectedScents[slotIdx]

              return (
                <div 
                  key={slotIdx}
                  className={`relative rounded-2xl p-3 flex flex-col justify-between min-h-[110px] transition-all border ${
                    scent 
                      ? 'bg-zinc-800/90 border-amber-500/40 shadow-sm' 
                      : 'bg-zinc-950/60 border-dashed border-zinc-700/80 items-center justify-center text-center'
                  }`}
                >
                  {scent ? (
                    <>
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                          PN {scent.sku}
                        </span>
                        <button
                          onClick={() => handleRemoveSlot(scent.sku)}
                          className="w-5 h-5 rounded-full bg-zinc-700 hover:bg-rose-600 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
                          title="Kaldır"
                        >
                          <X size={12} />
                        </button>
                      </div>

                      <div className="my-1">
                        <h4 className="font-medium text-xs text-zinc-100 line-clamp-1">{scent.fragrance_family?.[0] || 'Özel Seri'}</h4>
                        <p className="text-[10px] text-zinc-400 line-clamp-1">{scent.mood_tag || 'Özel Seri'}</p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-700/50">
                        <span>10ml Sprey</span>
                        <span className="text-amber-400 font-bold">✓ Hazır</span>
                      </div>
                    </>
                  ) : (
                    <div className="py-3 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-zinc-800/80 text-zinc-500 flex items-center justify-center mb-1">
                        <Plus size={16} />
                      </div>
                      <span className="text-[11px] text-zinc-500 font-medium">{slotIdx + 1}. Şişe Boş</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-800">
            <h4 className="text-sm font-bold text-amber-400 mb-2">Kararsız mısın? Tarzını Bize Yaz</h4>
            <p className="text-xs text-zinc-400 mb-3">
              Kutuyu katalogdan doldurmak yerine sevdiğin koku ailelerini, kullanacağın mekanları veya benzerini istediğin popüler parfümleri yaz, uzmanlarımız senin için seçsin.
            </p>
            
            {/* Clickable Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {['Odunsu', 'Çiçeksi', 'Ferah', 'Baharatlı', 'Oryantal', 'Ofis / İş', 'Gece / Davet', 'Spor / Günlük', 'Romantik'].map(tag => (
                <button 
                  key={tag}
                  onClick={() => setCustomNote(prev => prev ? `${prev}, ${tag}` : tag)}
                  className="px-3 py-1 rounded-full border border-zinc-700 bg-zinc-800/50 text-[10px] text-zinc-300 hover:border-amber-500 hover:text-amber-400 transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>

            <textarea
              value={customNote}
              onChange={e => setCustomNote(e.target.value)}
              placeholder="Örn: 2 tane ofis için ferah koku, 1 tane odunsu gece kokusu, diğerleri Tom Ford tarzı olsun..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-200 focus:outline-none focus:border-amber-500 h-20 resize-none"
            />
            
            <p className="text-[10px] text-zinc-500 mt-2 italic">
              * PN koku kütüphanemizdeki koku notalarına en yakın ürünler numune olarak gönderilecektir.
            </p>
          </div>
        </div>


        {/* ===================== CURATED FAST PACKS ===================== */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <Flame size={18} className="text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-300">
              Vaktin Yok mu? Tek Tıkla Hazır Paket Doldur:
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CURATED_PACKS.map((pack) => (
              <div 
                key={pack.id}
                onClick={() => handleApplyCuratedPack(pack.skus)}
                className="bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-bold text-sm text-zinc-100 mb-1">{pack.name}</h4>
                  <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{pack.desc}</p>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-amber-400 pt-2 border-t border-zinc-800/80">
                  <span>Kutuyu Doldur</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===================== CASHBACK GUARANTEE ===================== */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-3xl p-6 md:p-8 mb-14 flex flex-col md:flex-row items-center gap-6 shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
            <Gift size={32} />
          </div>
          <div>
            <h4 className="text-lg font-serif font-bold text-amber-300 mb-1">
              %100 Cashback Garantisi (Keşif Kutusu Aslında Bedava!)
            </h4>
            <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
              Keşif kutun teslim edildiğinde hesabına <b>690 TL değerinde VIP hediye kuponu</b> tanımlanır. Beğendiğin kokunun 50ml veya 100ml tam boyunu sipariş ederken bu kuponu kullanarak ödediğin tutarın tamamını fiyattan düşebilirsin.
            </p>
          </div>
        </div>

        {/* ===================== PERFUME CATALOG BROWSER ===================== */}
        <div>
          {/* Search & Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-8 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Parfüm adı, SKU kodu veya nota ara (Örn: vanilya, bergamot)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200">
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={genderFilter}
                onChange={e => setGenderFilter(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Tüm Cinsiyetler</option>
                <option value="Erkek">Erkek</option>
                <option value="Kadın">Kadın</option>
                <option value="Unisex">Unisex</option>
              </select>

              <select
                value={familyFilter}
                onChange={e => setFamilyFilter(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Tüm Koku Aileleri</option>
                <option value="Odunsu">Odunsu</option>
                <option value="Çiçeksi">Çiçeksi</option>
                <option value="Ferah">Ferah / Su</option>
                <option value="Baharatlı">Baharatlı</option>
                <option value="Oryantal">Oryantal</option>
                <option value="Gurme">Gurme / Tatlı</option>
              </select>
            </div>
          </div>

          {/* Perfumes Grid */}
          {loading ? (
            <div className="py-24 text-center text-zinc-500">
              <RefreshCw className="animate-spin mx-auto mb-3" size={28} />
              Katalog yükleniyor...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center text-zinc-500 bg-zinc-900/40 rounded-3xl border border-zinc-800">
              Aradığınız kriterlere uygun parfüm bulunamadı.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((perfume) => {
                const isSelected = selectedScents.some(s => s.sku === perfume.sku)
                const isFull = selectedScents.length >= 5

                return (
                  <div
                    key={perfume.sku}
                    className={`bg-zinc-900/80 rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                      isSelected 
                        ? 'border-amber-500/80 ring-1 ring-amber-500/50 bg-amber-500/5' 
                        : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                          PN {perfume.sku}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          perfume.gender?.toLowerCase() === 'kadın' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          perfume.gender?.toLowerCase() === 'erkek' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}>
                          {perfume.gender || 'Unisex'}
                        </span>
                      </div>

                      <h4 className="font-serif font-bold text-base text-zinc-100 mb-1">{perfume.fragrance_family?.[0] || 'Özel Seri'}</h4>
                      <p className="text-xs text-zinc-400 line-clamp-1 mb-3">{perfume.mood_tag || 'Özel Seri'}</p>

                      {/* Note Pyramid summary */}
                      <div className="space-y-1 text-[11px] text-zinc-400 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/80 mb-4">
                        <div className="line-clamp-1"><span className="text-zinc-500 font-semibold">Üst:</span> {perfume.top_notes || '-'}</div>
                        <div className="line-clamp-1"><span className="text-zinc-500 font-semibold">Kalp:</span> {perfume.heart_notes || '-'}</div>
                        <div className="line-clamp-1"><span className="text-zinc-500 font-semibold">Dip:</span> {perfume.base_notes || '-'}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => isSelected ? handleRemoveSlot(perfume.sku) : handleSelectPerfume(perfume)}
                      disabled={!isSelected && isFull}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30'
                          : isFull
                          ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                          : 'bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-200 border border-zinc-700 hover:border-amber-500'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check size={14} /> Kutudan Çıkar
                        </>
                      ) : isFull ? (
                        'Kutu Dolu (5/5)'
                      ) : (
                        <>
                          <Plus size={14} /> + Kutuya Ekle (10ml)
                        </>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
