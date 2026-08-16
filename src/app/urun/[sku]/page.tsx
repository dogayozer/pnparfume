import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Sparkles, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function ProductPage({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params
  
  const product = await prisma.product.findUnique({
    where: { sku: decodeURIComponent(sku) },
    include: {
      ingredients: {
        include: {
          ingredient: true
        }
      }
    }
  })

  if (!product) {
    notFound()
  }


  return (
    <div className="min-h-screen max-w-5xl mx-auto px-6 py-12 md:px-12">
      <Link href="/katalog" className="inline-flex items-center gap-2 text-foreground/50 hover:text-accent-rose mb-12 transition-colors">
        <ArrowLeft size={16} /> Kataloğa Dön
      </Link>

      <div className="grid md:grid-cols-2 gap-16 items-start">
        {/* Left: Product Visual/Abstract */}
        <div className="relative aspect-[4/5] bg-foreground/[0.02] rounded-3xl overflow-hidden flex items-center justify-center border border-foreground/5">
           <div className="absolute inset-0 z-0 opacity-30">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-gold rounded-full mix-blend-multiply filter blur-[96px] animate-blob"></div>
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-rose rounded-full mix-blend-multiply filter blur-[96px] animate-blob animation-delay-2000"></div>
           </div>
           
           <div className="relative z-10 w-48 h-64 bg-background/50 backdrop-blur-md rounded-t-full rounded-b-2xl border border-foreground/10 flex items-center justify-center shadow-2xl">
              <span className="text-foreground/30 font-light text-2xl tracking-[0.3em]">{product.sku}</span>
           </div>
        </div>

        {/* Right: Info */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-sm font-medium tracking-widest text-accent-gold">
                {product.fragrance_family?.[0]?.toUpperCase() || 'ÖZEL HARMAN'}
              </span>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-light text-foreground">{product.base_cost.toLocaleString('tr-TR')} ₺</span>
                {product.base_cost > 3000 && (
                  <span className="text-xs bg-foreground/10 px-2 py-1 uppercase tracking-widest text-foreground/70">Premium Ücretsiz Kargo</span>
                )}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-light text-foreground">
              PN {product.sku}
            </h1>
            <p className="text-xl text-foreground/50 mt-2 font-medium">
              {product.fragrance_family?.join(', ') || 'Gizli Formül'}
            </p>
          </div>

          <p className="text-foreground/70 leading-relaxed text-lg font-light">
            Bu benzersiz kompozisyon, <span className="font-medium text-accent-rose">nöropazarlama</span> ilkeleri dikkate alınarak karakterinizi yansıtacak şekilde formüle edilmiştir. 
            Çevrenizde {product.sillage_score ? `seviye ${product.sillage_score}/10` : 'etkileyici'} bir izlenim bırakmak için idealdir.
          </p>

          <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-foreground text-background font-medium rounded-full hover:bg-accent-rose transition-colors duration-300">
            <Sparkles size={18} />
            Yapay Zeka ile Bana Özel Yap
          </button>

          <div className="pt-8 border-t border-foreground/10">
            <div className="flex items-center gap-4 mb-6 text-foreground/60">
              <span className="text-xs font-medium uppercase tracking-widest">Kalıcılık: {product.longevity_score || 0}/10</span>
              <span className="text-foreground/20">|</span>
              <span className="text-xs font-medium uppercase tracking-widest">Silaj (İz): {product.sillage_score || 0}/10</span>
            </div>
            <h3 className="text-xl font-medium mb-6">Koku Piramidi</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-foreground/50 uppercase tracking-widest mb-3">Üst (Tepe) Notalar</h4>
                <div className="flex flex-wrap gap-2">
                  {(product.top_notes || 'Gizli Formül').split(',').map((note, index) => (
                    <span key={index} className="px-3 py-1.5 bg-background border border-foreground/10 rounded-lg text-sm">
                      {note.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground/50 uppercase tracking-widest mb-3">Kalp (Orta) Notalar</h4>
                <div className="flex flex-wrap gap-2">
                  {(product.heart_notes || 'Gizli Formül').split(',').map((note, index) => (
                    <span key={index} className="px-3 py-1.5 bg-background border border-foreground/10 rounded-lg text-sm">
                      {note.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground/50 uppercase tracking-widest mb-3">Dip Notalar</h4>
                <div className="flex flex-wrap gap-2">
                  {(product.base_notes || 'Gizli Formül').split(',').map((note, index) => (
                    <span key={index} className="px-3 py-1.5 bg-background border border-foreground/10 rounded-lg text-sm">
                      {note.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
