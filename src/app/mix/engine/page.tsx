'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ArrowLeft, Plus, Sparkles, Check, ShoppingCart, RefreshCw } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { computeBlendCompatibility, compatibilityLabel, FAMILY_ANGLES, type BlendItem, type WeightedIngredient } from '@/lib/fragranceCompatibility'
import { blendProfiles, recommendEssenceForFamily, nearestCatalogMatch, topFamilies, type FamilyProfile, type CandidateProduct } from '@/lib/fragranceRecommender'
import { BOTTLE_OPTIONS, DEFAULT_BOTTLE_CODE, toSecureImageUrl } from '@/lib/bottleOptions'

// Activity -> suggested family mapping (soft suggestion only, does not
// restrict which products the user can pick in Step 3).
const activities = [
  { id: 'davet', label: 'Özel Davet', families: ['Odunsu', 'Amberli'] },
  { id: 'is', label: 'İş / Toplantı', families: ['Ferah', 'Narenciye'] },
  { id: 'romantik', label: 'Romantik Buluşma', families: ['Gourmand', 'Çiçeksi'] },
  { id: 'gunluk', label: 'Günlük / Rahat', families: ['Çiçeksi', 'Ferah'] },
  { id: 'spor', label: 'Spor / Aktivite', families: ['Narenciye', 'Aromatik'] },
  { id: 'ozgur', label: 'Tüm Aileleri Göster', families: ['Tümü'] },
]

type MarketplaceListing = {
  platform: string
  price: number
}

type Product = {
  sku: string
  original_name: string
  fragrance_family: string[]
  mood_tag?: string
  sillage_score?: number
  base_cost?: number
  marketplaceListings?: MarketplaceListing[]
}

// Same price rule used on the product detail page (urun/[sku]/page.tsx):
// prefer the site's own (trendyol-platform) listing price, fall back to cost.
const getProductPrice = (p: Product) => {
  const listing = p.marketplaceListings?.find(l => l.platform === 'trendyol')
  return listing?.price || p.base_cost || 0
}

import { Suspense } from 'react'

function BlendEngineContent() {
  const searchParams = useSearchParams()
  const baseSku = searchParams.get('base')

  const { addToCart, setIsCartOpen } = useCart()
  const [step, setStep] = useState(1)

  // Real product library (replaces the old mock essence list)
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  // State 1: Activity
  const [activity, setActivity] = useState<string | null>(null)

  // State 2: Selected Family
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null)

  // State 3: Essences (max 3) — { sku, name }
  const [selectedEssences, setSelectedEssences] = useState<{ sku: string, name: string }[]>([])

  // State 4: Ratios (keyed by sku) + the design code generated once per blend
  const [ratios, setRatios] = useState<Record<string, number>>({})
  const [designCode, setDesignCode] = useState('')
  const [bottleCode, setBottleCode] = useState(DEFAULT_BOTTLE_CODE)

  // Uyumluluk skoru için: seçilen esansların üst/kalp/dip hammadde dökümü
  const [ingredientsBySku, setIngredientsBySku] = useState<Record<string, WeightedIngredient[]>>({})

  // "Notalarını Ayarla" öneri motoru için: TÜM kataloğun aile-ağırlık profili
  // (yalnızca ?base=SKU ile gelindiğinde çekilir)
  const [familyProfiles, setFamilyProfiles] = useState<Record<string, FamilyProfile>>({})

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/admin/products?status=ACTIVE')
        if (res.ok) {
          const data = await res.json()
          setProducts(data)
        }
      } catch (err) {
        console.error('Error loading blend engine products:', err)
      } finally {
        setLoadingProducts(false)
      }
    }
    loadProducts()
  }, [])

  // Ürün sayfasından "Bu Ürünü Bana Mix'le" ile gelindiyse (?base=SKU), o ürünü
  // 1. esans slotuna otomatik yükleyip kullanıcıyı Adım 2'deki "Notalarını
  // Ayarla" ekranına götür (bkz. aşağıdaki familyProfiles fetch'i).
  useEffect(() => {
    if (!baseSku || products.length === 0 || step !== 1) return
    const baseProduct = products.find(p => p.sku === baseSku)
    if (!baseProduct) return

    setSelectedEssences([{ sku: baseProduct.sku, name: `PN ${baseProduct.sku}` }])
    setRatios({ [baseProduct.sku]: 100 })
    setSelectedFamily(baseProduct.fragrance_family?.[0] || 'Tümü')
    setStep(2)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseSku, products])

  // "Notalarını Ayarla" için tüm kataloğun aile profilini bir kez çek —
  // yalnızca bir baz üründen ("Bu Ürünü Bana Mix'le") gelindiyse gerekiyor.
  useEffect(() => {
    if (!baseSku) return
    fetch('/api/products/family-profiles')
      .then(res => res.json())
      .then(data => setFamilyProfiles(data.profiles || {}))
      .catch(() => {})
  }, [baseSku])

  // Uyumluluk skoru için, seçilen ama henüz hammadde verisi çekilmemiş
  // esansların üst/kalp/dip dökümünü getir (yalnızca eksik olanları).
  useEffect(() => {
    const missing = selectedEssences.map(e => e.sku).filter(sku => !ingredientsBySku[sku])
    if (missing.length === 0) return

    let cancelled = false
    Promise.all(missing.map(async (sku): Promise<[string, WeightedIngredient[]]> => {
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(sku)}/ingredients`)
        if (!res.ok) return [sku, []]
        const data = await res.json()
        return [sku, data.ingredients as WeightedIngredient[]]
      } catch {
        return [sku, []]
      }
    })).then(results => {
      if (cancelled) return
      setIngredientsBySku(prev => {
        const next = { ...prev }
        for (const [sku, ingredients] of results) next[sku] = ingredients
        return next
      })
    })

    return () => { cancelled = true }
  }, [selectedEssences, ingredientsBySku])

  // 2-3 esans seçiliyken canlı uyumluluk skoru (üst/kalp/dip ayrı ayrı)
  const compatibility = useMemo(() => {
    if (selectedEssences.length < 2) return null
    const blendItems: BlendItem[] = selectedEssences
      .filter(e => ingredientsBySku[e.sku])
      .map(e => ({ sku: e.sku, ratio: ratios[e.sku] || 0, ingredients: ingredientsBySku[e.sku] }))
    if (blendItems.length < 2) return null
    return computeBlendCompatibility(blendItems)
  }, [selectedEssences, ratios, ingredientsBySku])

  // "Notalarını Ayarla" öneri motoru için türetilen veriler
  const familyCandidates: CandidateProduct[] = useMemo(
    () => Object.entries(familyProfiles).map(([sku, profile]) => ({ sku, profile })),
    [familyProfiles]
  )
  const baseProfile: FamilyProfile = useMemo(
    () => (baseSku ? familyProfiles[baseSku] || {} : {}),
    [baseSku, familyProfiles]
  )
  const combinedProfile: FamilyProfile = useMemo(
    () => blendProfiles(selectedEssences.map(e => ({ profile: familyProfiles[e.sku] || {}, ratio: ratios[e.sku] || 0 }))),
    [selectedEssences, ratios, familyProfiles]
  )
  const nearestMatch = useMemo(() => {
    if (!baseSku || familyCandidates.length === 0 || selectedEssences.length === 0) return null
    const match = nearestCatalogMatch(combinedProfile, familyCandidates, selectedEssences.map(e => e.sku))
    if (!match) return null
    const product = products.find(p => p.sku === match.sku)
    return product ? { name: `PN ${product.sku}`, mood: product.mood_tag, similarity: match.similarity } : null
  }, [baseSku, familyCandidates, combinedProfile, selectedEssences, products])

  // Essences available for Step 3, filtered by the family chosen in Step 2
  const filteredEssences = useMemo(() => {
    if (!selectedFamily || selectedFamily === 'Tümü') return products
    return products.filter(p =>
      p.fragrance_family?.some(f => f.toLowerCase().includes(selectedFamily.toLowerCase()))
    )
  }, [products, selectedFamily])

  const selectedBottle = BOTTLE_OPTIONS.find(b => b.code === bottleCode) || BOTTLE_OPTIONS[0]

  // Ratio-weighted essence price + seçilen şişenin tam fiyatı (kutu dahil —
  // ProductActions.tsx'teki özelleştirme paneliyle aynı kural, kaynak: Excel "sise" sayfası).
  const blendPrice = useMemo(() => {
    if (selectedEssences.length === 0) return 0
    const total = selectedEssences.reduce((sum, e) => {
      const product = products.find(p => p.sku === e.sku)
      const price = product ? getProductPrice(product) : 0
      const ratio = (ratios[e.sku] || 0) / 100
      return sum + price * ratio
    }, 0)
    return Math.round(total / 10) * 10 + selectedBottle.price
  }, [selectedEssences, ratios, products, selectedBottle])

  // Handlers
  const handleSelectActivity = (act: any) => {
    setActivity(act.id)
    if (act.id === 'ozgur') {
      setSelectedFamily('Tümü')
    } else {
      setSelectedFamily(act.families[0])
    }
    setTimeout(() => setStep(2), 400)
  }

  const handleSelectFamily = (fam: string) => {
    setSelectedFamily(fam)
    setTimeout(() => setStep(3), 400)
  }

  const toggleEssence = (essence: Product) => {
    if (selectedEssences.find(e => e.sku === essence.sku)) {
      const newE = selectedEssences.filter(e => e.sku !== essence.sku)
      setSelectedEssences(newE)

      // redistribute ratios
      const newRatios: Record<string, number> = {}
      newE.forEach(e => { newRatios[e.sku] = 100 / newE.length })
      setRatios(newRatios)
    } else {
      if (selectedEssences.length < 3) {
        const newE = [...selectedEssences, { sku: essence.sku, name: `PN ${essence.sku}` }]
        setSelectedEssences(newE)

        // redistribute ratios equally
        const newRatios: Record<string, number> = {}
        newE.forEach(e => { newRatios[e.sku] = 100 / newE.length })
        setRatios(newRatios)
      }
    }
  }

  // "Notalarını Ayarla": bir aileyi artır/dengele — kütüphaneden gerçek bir
  // ürün önerip boş bir slota ekler (max 3 esans, base zaten 1'ini dolduruyor).
  const handleAdjustFamily = (family: string, direction: 'boost' | 'reduce') => {
    if (selectedEssences.length >= 3) return
    const excludeSkus = selectedEssences.map(e => e.sku)
    const recommended = recommendEssenceForFamily(family, direction, familyCandidates, excludeSkus, baseProfile)
    if (!recommended) return
    const product = products.find(p => p.sku === recommended.sku)
    if (!product) return

    const newE = [...selectedEssences, { sku: product.sku, name: `PN ${product.sku}` }]
    setSelectedEssences(newE)
    const newRatios: Record<string, number> = {}
    newE.forEach(e => { newRatios[e.sku] = 100 / newE.length })
    setRatios(newRatios)
  }

  // "Notalarını Ayarla" ekranında eklenen bir esansı geri çıkar (baz ürün hariç)
  const removeEssence = (sku: string) => {
    const newE = selectedEssences.filter(e => e.sku !== sku)
    setSelectedEssences(newE)
    const newRatios: Record<string, number> = {}
    newE.forEach(e => { newRatios[e.sku] = 100 / newE.length })
    setRatios(newRatios)
  }

  const generateDesignCode = () => {
    return 'MIX-' + Math.random().toString(36).substring(2, 6).toUpperCase()
  }

  // Generate the design code once, when the user finalizes their essence selection
  const handleFinalizeBlend = () => {
    setDesignCode(generateDesignCode())
    setStep(4)
  }

  // Add the finished blend to the real cart — flows into the existing
  // sepet -> PayTR checkout exactly like every other cart item.
  const handleAddBlendToCart = () => {
    const scentList = selectedEssences.map(e => `PN ${e.sku} (%${Math.round(ratios[e.sku] || 0)})`)

    addToCart({
      sku: designCode,
      name: `Kişiye Özel Blend (${designCode})`,
      price: blendPrice,
      quantity: 1,
      size: `${selectedBottle.volumeMl}ml Blend`,
      selectedScents: scentList,
      imageUrl: toSecureImageUrl(selectedBottle.imageUrl)
    })

    setIsCartOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#4A3527] font-sans pt-24 pb-20">

      {/* Header / Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 mb-12 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm font-medium tracking-widest uppercase">
          <span className={step >= 1 ? "text-[#B48A3F]" : "text-[#4A3527]/30"}>1. Aktivite</span>
          <ChevronRight size={14} className="text-[#4A3527]/20" />
          <span className={step >= 2 ? "text-[#B48A3F]" : "text-[#4A3527]/30"}>2. Profil</span>
          <ChevronRight size={14} className="text-[#4A3527]/20" />
          <span className={step >= 3 ? "text-[#B48A3F]" : "text-[#4A3527]/30"}>3. Esans</span>
          <ChevronRight size={14} className="text-[#4A3527]/20" />
          <span className={step >= 4 ? "text-[#B48A3F]" : "text-[#4A3527]/30"}>4. Harman</span>
        </div>

        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-sm hover:text-[#B48A3F] transition-colors">
            <ArrowLeft size={16} /> Geri Dön
          </button>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6 min-h-[60vh]">
        <AnimatePresence mode="wait">

          {/* STEP 1: ACTIVITY */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-4xl md:text-5xl font-serif font-light mb-4">Bu koku seninle nerede olacak?</h2>
              <p className="text-[#4A3527]/60 mb-12 text-lg">En doğru aile eşleşmesi için bize ipucu ver.</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {activities.map(act => (
                  <button
                    key={act.id}
                    onClick={() => handleSelectActivity(act)}
                    className={`aspect-video rounded-2xl flex flex-col items-center justify-center gap-3 border transition-all duration-300
                      ${activity === act.id ? 'border-[#B48A3F] bg-[#B48A3F]/10' : 'border-[#4A3527]/10 bg-white hover:border-[#B48A3F]/50'}
                    `}
                  >
                    <span className="font-serif text-xl">{act.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2a: baz üründen geldiyse — NOTALARINI AYARLA */}
          {step === 2 && baseSku && (() => {
            const baseProduct = products.find(p => p.sku === baseSku)
            const loadingProfiles = Object.keys(familyProfiles).length === 0
            const currentTop = topFamilies(combinedProfile, 6)
            const presentFamilies = new Set(Object.keys(combinedProfile))
            const addableFamilies = Object.keys(FAMILY_ANGLES).filter(f => !presentFamilies.has(f))
            const slotsFull = selectedEssences.length >= 3
            const addedEssences = selectedEssences.filter(e => e.sku !== baseSku)

            return (
              <motion.div
                key="step2-notes"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto"
              >
                <div className="text-center mb-10">
                  <h2 className="text-4xl md:text-5xl font-serif font-light mb-4">
                    PN {baseProduct?.sku || ''} Notalarını Ayarla
                  </h2>
                  <p className="text-[#4A3527]/60 text-lg">
                    Bir notayı artır, dengele veya yeni bir nota ekle — kütüphaneden gerçek bir esans senin için seçilecek.
                    {!slotsFull && <> ({addedEssences.length}/2 ek esans kullanıldı)</>}
                  </p>
                </div>

                {loadingProfiles ? (
                  <div className="py-16 text-center text-[#4A3527]/50">
                    <RefreshCw className="animate-spin mx-auto mb-3" size={24} />
                    Nota profili yükleniyor...
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-6 md:p-10 border border-[#4A3527]/10">
                    <div className="space-y-4 mb-8">
                      {currentTop.map(([family, weight]) => (
                        <div key={family} className="flex items-center gap-4">
                          <span className="w-32 text-sm font-medium">{family}</span>
                          <div className="flex-1 h-2 bg-[#F5F0E6] rounded-full overflow-hidden">
                            <div className="h-full bg-[#B48A3F] rounded-full transition-all duration-500" style={{ width: `${Math.min(100, weight * 2.5)}%` }} />
                          </div>
                          <span className="w-10 text-xs text-[#4A3527]/50 text-right">%{Math.round(weight)}</span>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleAdjustFamily(family, 'reduce')}
                              disabled={slotsFull}
                              title="Bu notayı zayıflatan bir esansla dengele"
                              className="w-7 h-7 rounded-full border border-[#4A3527]/20 text-[#4A3527] text-sm hover:border-[#B48A3F] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              −
                            </button>
                            <button
                              onClick={() => handleAdjustFamily(family, 'boost')}
                              disabled={slotsFull}
                              title="Bu notayı öne çıkaran bir esans ekle"
                              className="w-7 h-7 rounded-full border border-[#4A3527]/20 text-[#4A3527] text-sm hover:border-[#B48A3F] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-[#4A3527]/10">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#4A3527]/50 mb-3">Yeni Nota Ekle</h4>
                      <div className="flex flex-wrap gap-2">
                        {addableFamilies.map(family => (
                          <button
                            key={family}
                            onClick={() => handleAdjustFamily(family, 'boost')}
                            disabled={slotsFull}
                            className="px-3 py-1.5 rounded-full border border-[#4A3527]/15 text-xs text-[#4A3527]/70 hover:border-[#B48A3F] hover:text-[#B48A3F] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            + {family}
                          </button>
                        ))}
                      </div>
                    </div>

                    {addedEssences.length > 0 && (
                      <div className="pt-6 mt-6 border-t border-[#4A3527]/10">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-[#4A3527]/50 mb-3">Eklenen Esanslar</h4>
                        <div className="space-y-2">
                          {addedEssences.map(e => (
                            <div key={e.sku} className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#F5F0E6]/60 text-sm">
                              <span className="font-medium">{e.name}</span>
                              <button onClick={() => removeEssence(e.sku)} className="text-[#4A3527]/40 hover:text-[#B48A3F] text-xs uppercase tracking-widest">
                                Kaldır
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {slotsFull && (
                      <p className="text-[11px] text-[#4A3527]/40 mt-4 text-center">3 esans sınırına ulaştın — devam etmeden önce bir esansı kaldırabilirsin.</p>
                    )}
                  </div>
                )}

                <div className="text-center mt-8">
                  <button
                    onClick={() => setStep(3)}
                    className="px-10 py-4 bg-[#4A3527] text-[#F5F0E6] rounded-full uppercase tracking-widest text-sm font-medium hover:bg-[#B48A3F] transition-colors"
                  >
                    Devam Et &rarr;
                  </button>
                </div>
              </motion.div>
            )
          })()}

          {/* STEP 2b: sıfırdan başladıysa — genel aile tekerleği */}
          {step === 2 && !baseSku && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-4xl md:text-5xl font-serif font-light mb-4">Senin İçin Önerilen Aileler</h2>
              <p className="text-[#4A3527]/60 mb-12 text-lg">Seçtiğin an'a en uygun koku profillerini listeledik.</p>

              <div className="flex flex-wrap justify-center gap-6">
                {['Odunsu', 'Narenciye', 'Gourmand', 'Çiçeksi', 'Ferah', 'Baharatlı'].map(fam => (
                  <button
                    key={fam}
                    onClick={() => handleSelectFamily(fam)}
                    className={`w-40 h-40 rounded-full flex flex-col items-center justify-center gap-2 border transition-all duration-500
                      ${selectedFamily === fam || (selectedFamily === 'Tümü')
                        ? 'border-[#B48A3F] bg-[#B48A3F]/10 scale-105'
                        : 'border-[#4A3527]/10 bg-white opacity-50 hover:opacity-100'}
                    `}
                  >
                    <span className="font-serif text-lg">{fam}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: ESSENCES */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-serif font-light mb-4">Esanslarını Seç</h2>
                <p className="text-[#4A3527]/60 text-lg">
                  Kütüphaneden en fazla 3 kompozit esans harmanlayabilirsin.
                  (Seçilen: {selectedEssences.length}/3)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {loadingProducts ? (
                    <div className="col-span-full py-16 text-center text-[#4A3527]/50">
                      <RefreshCw className="animate-spin mx-auto mb-3" size={24} />
                      Kütüphane yükleniyor...
                    </div>
                  ) : filteredEssences.length === 0 ? (
                    <div className="col-span-full py-16 text-center text-[#4A3527]/50">
                      Bu koku ailesinde henüz esans bulunmuyor.
                    </div>
                  ) : (
                    filteredEssences.map(essence => {
                    const isSelected = selectedEssences.find(e => e.sku === essence.sku)
                    const intensity = essence.sillage_score || 5
                    return (
                      <button
                        key={essence.sku}
                        onClick={() => toggleEssence(essence)}
                        disabled={!isSelected && selectedEssences.length >= 3}
                        className={`text-left p-6 rounded-2xl border transition-all duration-300 flex flex-col h-full
                          ${isSelected ? 'border-[#B48A3F] bg-[#B48A3F]/10 shadow-lg' : 'border-[#4A3527]/10 bg-white hover:border-[#B48A3F]/50'}
                          ${(!isSelected && selectedEssences.length >= 3) ? 'opacity-40 cursor-not-allowed' : ''}
                        `}
                      >
                        <div className="text-[#B48A3F] text-[10px] font-bold uppercase tracking-widest mb-2">{essence.fragrance_family?.[0] || 'Özel Seri'}</div>
                        <h4 className="font-serif text-xl mb-4 flex-grow">PN {essence.sku}</h4>
                        <div className="flex items-center gap-1">
                          {[...Array(10)].map((_, i) => (
                            <div key={i} className={`h-1 w-full rounded-full ${i < intensity ? 'bg-[#4A3527]' : 'bg-[#4A3527]/10'}`} />
                          ))}
                        </div>
                      </button>
                    )
                  })
                  )}
                </div>

                {/* Selection Sidebar */}
                <div className="bg-white rounded-3xl p-8 border border-[#4A3527]/10 h-fit sticky top-24">
                  <h3 className="font-serif text-2xl mb-6">Senin Harmanın</h3>
                  <div className="space-y-4 mb-8">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="h-16 rounded-xl border border-dashed border-[#4A3527]/20 flex items-center justify-center bg-[#F5F0E6]/50">
                        {selectedEssences[i] ? (
                          <span className="font-serif font-medium text-[#B48A3F] flex items-center gap-2">
                            <Check size={16} /> {selectedEssences[i].name}
                          </span>
                        ) : (
                          <span className="text-[#4A3527]/30 text-sm"><Plus size={16} /></span>
                        )}
                      </div>
                    ))}
                  </div>

                  {compatibility && (() => {
                    const { label, tone } = compatibilityLabel(compatibility.overall)
                    const toneColor = tone === 'good' ? 'text-emerald-600' : tone === 'balanced' ? 'text-[#B48A3F]' : 'text-orange-500'
                    const toneBg = tone === 'good' ? 'bg-emerald-500' : tone === 'balanced' ? 'bg-[#B48A3F]' : 'bg-orange-500'
                    return (
                      <div className="mb-6 p-4 rounded-xl bg-[#F5F0E6]/60 border border-[#4A3527]/10">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold uppercase tracking-widest text-[#4A3527]/50">Uyumluluk</span>
                          <span className={`text-sm font-serif font-bold ${toneColor}`}>%{compatibility.overall} · {label}</span>
                        </div>
                        <div className="space-y-1.5">
                          {([['Üst', compatibility.top], ['Kalp', compatibility.heart], ['Dip', compatibility.base]] as const).map(([lbl, val]) => (
                            <div key={lbl} className="flex items-center gap-2 text-[10px] text-[#4A3527]/50">
                              <span className="w-8">{lbl}</span>
                              <div className="flex-1 h-1.5 bg-[#4A3527]/10 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${toneBg}`} style={{ width: `${val}%` }} />
                              </div>
                              <span className="w-7 text-right">%{val}</span>
                            </div>
                          ))}
                        </div>
                        {tone === 'bold' && (
                          <p className="text-[10px] text-[#4A3527]/40 mt-3 leading-relaxed">
                            Bu esanslar birbirinden uzak ailelerden — sonuç sıra dışı ve cesur bir imza koku olabilir.
                          </p>
                        )}
                      </div>
                    )
                  })()}

                  <button
                    onClick={handleFinalizeBlend}
                    disabled={selectedEssences.length === 0}
                    className="w-full py-4 bg-[#4A3527] text-[#F5F0E6] rounded-full uppercase tracking-widest text-sm font-medium hover:bg-[#B48A3F] transition-colors disabled:opacity-50"
                  >
                    Oranları Belirle &rarr;
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: RATIO & RESULT */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="max-w-5xl mx-auto"
            >
              <div className="bg-white rounded-[40px] p-8 md:p-16 border border-[#4A3527]/10 shadow-2xl flex flex-col md:flex-row gap-16">

                <div className="flex-1">
                  <h2 className="text-[#B48A3F] text-xs font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                    <Sparkles size={14} /> Design Code Üretildi
                  </h2>
                  <h1 className="text-5xl font-serif mb-4">{designCode}</h1>
                  <div className={`text-2xl font-serif text-[#B48A3F] ${nearestMatch ? 'mb-2' : 'mb-8'}`}>{blendPrice} TL <span className="text-sm text-[#4A3527]/50 font-sans">/ {selectedBottle.volumeMl}ml</span></div>
                  {nearestMatch && (
                    <p className="text-xs text-[#4A3527]/50 mb-8">
                      Karakterine En Yakın: <span className="font-medium text-[#4A3527]">{nearestMatch.name}</span>
                      {nearestMatch.mood && <> — <span className="italic">{nearestMatch.mood}</span></>}
                    </p>
                  )}

                  <p className="text-[#4A3527]/70 text-lg mb-12 leading-relaxed">
                    Kusursuz harmanın koku kütüphanemize kaydedildi. Bu kod ile dilediğin zaman
                    sipariş verebilir veya Keşif Seti (Discovery Set) alarak önce deneyebilirsin.
                  </p>

                  <div className="space-y-8 mb-12">
                    {selectedEssences.map((essence) => (
                      <div key={essence.sku}>
                        <div className="flex justify-between text-sm font-medium uppercase tracking-widest mb-3">
                          <span>{essence.name}</span>
                          <span className="text-[#B48A3F]">{Math.round(ratios[essence.sku])}%</span>
                        </div>
                        <div className="h-2 bg-[#F5F0E6] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#B48A3F] rounded-full transition-all duration-500"
                            style={{ width: `${ratios[essence.sku]}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Şişe Seçimi (kutu dahil) */}
                  <div className="mb-8">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#4A3527]/50 mb-3">Şişe Seçimi (Kutu Dahil)</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {BOTTLE_OPTIONS.map(b => (
                        <button
                          key={b.code}
                          onClick={() => setBottleCode(b.code)}
                          className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-colors ${bottleCode === b.code ? 'border-[#B48A3F] bg-[#B48A3F]/10' : 'border-[#4A3527]/10 hover:border-[#4A3527]/30'}`}
                        >
                          <img src={toSecureImageUrl(b.imageUrl)} alt={b.label} className="w-12 h-12 object-contain" />
                          <span className="text-[11px] font-medium text-[#4A3527] text-center leading-tight">{b.label}</span>
                          <span className="text-[10px] text-[#4A3527]/50">{b.volumeMl}ml · {b.price} TL</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={handleAddBlendToCart}
                      className="flex-1 py-4 bg-[#4A3527] text-white rounded-full text-sm font-medium uppercase tracking-widest hover:bg-[#B48A3F] transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={16} /> Sepete Ekle
                    </button>
                    <Link href="/mix/discovery-set" className="flex-1 py-4 bg-[#F5F0E6] text-[#4A3527] rounded-full text-sm font-medium uppercase tracking-widest hover:bg-[#B48A3F]/20 transition-colors text-center">
                      Keşif Seti Al
                    </Link>
                  </div>
                </div>

                <div className="flex-1 relative flex items-center justify-center">
                   <div className="w-full aspect-[3/4] bg-[#4A3527]/5 rounded-3xl border border-[#B48A3F]/20 flex items-center justify-center overflow-hidden">
                      <Image src={toSecureImageUrl(selectedBottle.imageUrl)} alt="Your Blend" fill className="object-contain p-12 drop-shadow-2xl opacity-90" />
                   </div>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  )
}

export default function BlendEngine() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F0E6] flex items-center justify-center">Yükleniyor...</div>}>
      <BlendEngineContent />
    </Suspense>
  )
}
