'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, ArrowRight, Check } from 'lucide-react'

const questions = [
  {
    id: 1,
    title: "Bugün kendini nasıl hissetmek istiyorsun?",
    options: [
      { id: 'energetic', label: 'Enerjik & Özgür', image: '/perfume_sillage_1786733363569.jpg' },
      { id: 'mysterious', label: 'Gizemli & Derin', image: '/perfume_longevity_paradox_1786733060486.jpg' },
      { id: 'elegant', label: 'Zarif & Klasik', image: '/signature_scent_1786733184742.jpg' },
    ]
  },
  {
    id: 2,
    title: "Hangi ortam sana daha çok hitap ediyor?",
    options: [
      { id: 'nature', label: 'Yağmur Sonrası Orman', image: '/skin_chemistry_perfume_1786734316391.jpg' },
      { id: 'night', label: 'Loş Bir Jazz Bar', image: '/cologne_leather_amber_1786736633619.jpg' },
      { id: 'sun', label: 'Güneşli Bir Sahil', image: '/cologne_neroli_oud_1786736688544.jpg' },
    ]
  },
  {
    id: 3,
    title: "Hangi notalar ruhuna dokunur?",
    options: [
      { id: 'wood', label: 'Odunsu & Baharatlı', image: '/cologne_tobacco_honey_1786736699495.jpg' },
      { id: 'floral', label: 'Taze & Çiçeksi', image: '/cologne_fig_incense_1786736624153.jpg' },
      { id: 'oriental', label: 'Tatlı & Oryantal', image: '/perfume_locations_1786733237217.jpg' },
    ]
  }
]

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resultReady, setResultReady] = useState(false)

  const handleSelect = (questionId: number, optionId: string) => {
    setAnswers({ ...answers, [questionId]: optionId })
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300)
    } else {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsSubmitting(true)
    
    // API simülasyonu (Lead Generation)
    setTimeout(() => {
      setIsSubmitting(false)
      setResultReady(true)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Progress Bar */}
        {!resultReady && (
          <div className="mb-12">
            <div className="flex justify-between text-xs uppercase tracking-widest text-foreground/40 mb-2">
              <span>Ruh Haline Göre Koku Bul</span>
              <span>{Math.min(currentStep + 1, questions.length)} / {questions.length}</span>
            </div>
            <div className="h-1 bg-foreground/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent-gold transition-all duration-500 ease-out"
                style={{ width: `${(Math.min(currentStep + 1, questions.length) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Sorular */}
        {currentStep < questions.length && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl lg:text-4xl font-light text-center text-foreground mb-12">
              {questions[currentStep].title}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {questions[currentStep].options.map((option) => {
                const isSelected = answers[questions[currentStep].id] === option.id
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(questions[currentStep].id, option.id)}
                    className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 text-left ${
                      isSelected ? 'border-accent-gold ring-4 ring-accent-gold/20' : 'border-transparent hover:border-foreground/20'
                    }`}
                  >
                    <div className="aspect-[4/5] relative bg-foreground/5">
                      <Image src={option.image} alt={option.label} fill className="object-cover mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end">
                        <span className="text-white font-medium text-lg">{option.label}</span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-accent-gold bg-accent-gold text-background' : 'border-white/50 text-transparent'}`}>
                          <Check size={14} />
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Kurşun Yakalama (Lead Capture) Formu */}
        {currentStep === questions.length && !resultReady && (
          <div className="max-w-md mx-auto text-center animate-in fade-in zoom-in-95 duration-500 pt-12">
            <div className="w-16 h-16 bg-accent-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 text-accent-gold">
              <Sparkles size={32} />
            </div>
            <h2 className="text-3xl font-light text-foreground mb-4">Profiliniz Analiz Ediliyor</h2>
            <p className="text-foreground/60 mb-8 font-light leading-relaxed">
              Verdiğiniz cevaplara göre yapay zeka destekli koku eşleştirme algoritmamız sizin için en kusursuz "İmza Kokuyu" buldu. Sonucu görmek ve size özel %15 indirimi almak için e-posta adresinizi girin.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresiniz"
                className="w-full bg-background border border-foreground/20 rounded-md py-4 px-4 text-center focus:outline-none focus:border-accent-gold text-foreground placeholder:text-foreground/30"
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-foreground text-background py-4 uppercase tracking-widest text-sm font-medium hover:bg-accent-gold transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isSubmitting ? 'Analiz Ediliyor...' : 'Sonucumu Göster'} <ArrowRight size={16} />
              </button>
              <p className="text-xs text-foreground/40 mt-4">
                Söz veriyoruz, spam göndermeyeceğiz. Sadece ruhunuza hitap eden notalar.
              </p>
            </form>
          </div>
        )}

        {/* Sonuç Ekranı */}
        {resultReady && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 pt-8">
            <div className="text-center mb-12">
              <span className="text-accent-gold text-sm font-medium tracking-widest uppercase mb-4 block">Eşleşme Oranı: %94</span>
              <h2 className="text-4xl lg:text-5xl font-light text-foreground mb-4">Sizin İmza Kokunuz: Pera Leather & Amber</h2>
              <p className="text-foreground/60 max-w-2xl mx-auto font-light text-lg">
                Seçimleriniz derin, karizmatik ve iz bırakan bir ruha sahip olduğunuzu gösteriyor. Derinin asi duruşuyla amberin sıcaklığını birleştiren bu koku tam size göre.
              </p>
            </div>

            <div className="bg-foreground/[0.02] border border-foreground/10 rounded-2xl p-8 lg:p-12 flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/2 aspect-[3/4] relative bg-foreground/5 rounded-xl overflow-hidden">
                <Image src="/cologne_leather_amber_1786736633619.jpg" alt="Pera Leather" fill className="object-cover mix-blend-multiply opacity-90" />
              </div>
              <div className="w-full md:w-1/2 space-y-8">
                <div>
                  <h3 className="text-2xl font-medium text-foreground mb-2">Pera Leather & Amber</h3>
                  <div className="flex gap-2">
                    <span className="text-xs bg-foreground/10 px-2 py-1 rounded text-foreground/70 uppercase">Odunsu</span>
                    <span className="text-xs bg-foreground/10 px-2 py-1 rounded text-foreground/70 uppercase">Deri</span>
                    <span className="text-xs bg-foreground/10 px-2 py-1 rounded text-foreground/70 uppercase">Sıcak Baharat</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-accent-gold/10 border border-accent-gold/20 rounded-lg">
                    <p className="text-sm text-accent-gold font-medium mb-1">Hoş Geldin Hediyesi</p>
                    <p className="text-xs text-accent-gold/80">QUIZ15 kodunu sepette kullanarak bu ürüne %15 indirimle sahip olabilirsiniz.</p>
                  </div>
                </div>

                <Link href="/urun/pera-leather-amber" className="inline-block w-full text-center bg-foreground text-background py-4 uppercase tracking-widest text-sm font-medium hover:bg-accent-gold transition-colors">
                  Ürünü İncele
                </Link>
                
                <button className="w-full text-center py-4 uppercase tracking-widest text-sm font-medium text-foreground/60 hover:text-foreground transition-colors border border-foreground/20 hover:border-foreground">
                  Sonucu Paylaş
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
