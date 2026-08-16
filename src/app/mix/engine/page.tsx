'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ArrowLeft, Wand2, Plus, Sparkles, Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Mock Data for Activities
const activities = [
  { id: 'davet', label: 'Özel Davet', families: ['Odunsu', 'Amberli'] },
  { id: 'is', label: 'İş / Toplantı', families: ['Ferah', 'Narenciye'] },
  { id: 'romantik', label: 'Romantik Buluşma', families: ['Gourmand', 'Çiçeksi'] },
  { id: 'gunluk', label: 'Günlük / Rahat', families: ['Çiçeksi', 'Ferah'] },
  { id: 'spor', label: 'Spor / Aktivite', families: ['Narenciye', 'Aromatik'] },
  { id: 'ozgur', label: 'Tüm Aileleri Göster', families: ['Tümü'] },
]

// Mock Data for Essences (Master Library)
const allEssences = [
  { id: 'e1', name: 'Santal Noir', family: 'Odunsu', intensity: 8 },
  { id: 'e2', name: 'Bergamot Zest', family: 'Narenciye', intensity: 5 },
  { id: 'e3', name: 'Vanilla Bean', family: 'Gourmand', intensity: 7 },
  { id: 'e4', name: 'Velvet Rose', family: 'Çiçeksi', intensity: 6 },
  { id: 'e5', name: 'Oud Wood', family: 'Odunsu', intensity: 10 },
  { id: 'e6', name: 'Ocean Breeze', family: 'Ferah', intensity: 4 },
  { id: 'e7', name: 'Spicy Cardamom', family: 'Baharatlı', intensity: 9 },
]

export default function BlendEngine() {
  const [step, setStep] = useState(1)
  
  // State 1: Activity
  const [activity, setActivity] = useState<string | null>(null)
  
  // State 2: Selected Family
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null)
  
  // State 3: Essences (max 3)
  const [selectedEssences, setSelectedEssences] = useState<{id: string, name: string}[]>([])
  
  // State 4: Ratios
  const [ratios, setRatios] = useState<Record<string, number>>({})

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

  const toggleEssence = (essence: any) => {
    if (selectedEssences.find(e => e.id === essence.id)) {
      const newE = selectedEssences.filter(e => e.id !== essence.id)
      setSelectedEssences(newE)
      
      // redistribute ratios
      const newRatios: Record<string, number> = {}
      newE.forEach(e => { newRatios[e.id] = 100 / newE.length })
      setRatios(newRatios)
    } else {
      if (selectedEssences.length < 3) {
        const newE = [...selectedEssences, { id: essence.id, name: essence.name }]
        setSelectedEssences(newE)
        
        // redistribute ratios equally
        const newRatios: Record<string, number> = {}
        newE.forEach(e => { newRatios[e.id] = 100 / newE.length })
        setRatios(newRatios)
      }
    }
  }

  const generateDesignCode = () => {
    return 'MIX-' + Math.random().toString(36).substring(2, 6).toUpperCase()
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

          {/* STEP 2: FAMILY */}
          {step === 2 && (
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
                  {allEssences
                    .filter(e => selectedFamily === 'Tümü' || e.family === selectedFamily)
                    .map(essence => {
                    const isSelected = selectedEssences.find(e => e.id === essence.id)
                    return (
                      <button
                        key={essence.id}
                        onClick={() => toggleEssence(essence)}
                        disabled={!isSelected && selectedEssences.length >= 3}
                        className={`text-left p-6 rounded-2xl border transition-all duration-300 flex flex-col h-full
                          ${isSelected ? 'border-[#B48A3F] bg-[#B48A3F]/10 shadow-lg' : 'border-[#4A3527]/10 bg-white hover:border-[#B48A3F]/50'}
                          ${(!isSelected && selectedEssences.length >= 3) ? 'opacity-40 cursor-not-allowed' : ''}
                        `}
                      >
                        <div className="text-[#B48A3F] text-[10px] font-bold uppercase tracking-widest mb-2">{essence.family}</div>
                        <h4 className="font-serif text-xl mb-4 flex-grow">{essence.name}</h4>
                        <div className="flex items-center gap-1">
                          {[...Array(10)].map((_, i) => (
                            <div key={i} className={`h-1 w-full rounded-full ${i < essence.intensity ? 'bg-[#4A3527]' : 'bg-[#4A3527]/10'}`} />
                          ))}
                        </div>
                      </button>
                    )
                  })}
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
                  
                  <button 
                    onClick={() => setStep(4)}
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
                  <h1 className="text-5xl font-serif mb-8">{generateDesignCode()}</h1>
                  
                  <p className="text-[#4A3527]/70 text-lg mb-12 leading-relaxed">
                    Kusursuz harmanın koku kütüphanemize kaydedildi. Bu kod ile dilediğin zaman 
                    sipariş verebilir veya Keşif Seti (Discovery Set) alarak önce deneyebilirsin.
                  </p>

                  <div className="space-y-8 mb-12">
                    {selectedEssences.map((essence) => (
                      <div key={essence.id}>
                        <div className="flex justify-between text-sm font-medium uppercase tracking-widest mb-3">
                          <span>{essence.name}</span>
                          <span className="text-[#B48A3F]">{Math.round(ratios[essence.id])}%</span>
                        </div>
                        <div className="h-2 bg-[#F5F0E6] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#B48A3F] rounded-full transition-all duration-500" 
                            style={{ width: `${ratios[essence.id]}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button className="flex-1 py-4 bg-[#4A3527] text-white rounded-full text-sm font-medium uppercase tracking-widest hover:bg-[#B48A3F] transition-colors">
                      Amazon ile Al
                    </button>
                    <Link href="/mix/discovery-set" className="flex-1 py-4 bg-[#F5F0E6] text-[#4A3527] rounded-full text-sm font-medium uppercase tracking-widest hover:bg-[#B48A3F]/20 transition-colors text-center">
                      Keşif Seti Al
                    </Link>
                  </div>
                </div>

                <div className="flex-1 relative flex items-center justify-center">
                   <div className="w-full aspect-[3/4] bg-[#4A3527]/5 rounded-3xl border border-[#B48A3F]/20 flex items-center justify-center overflow-hidden">
                      <Image src="/images/products/pnerkeksise.png" alt="Your Blend" fill className="object-contain p-12 drop-shadow-2xl opacity-90" />
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
