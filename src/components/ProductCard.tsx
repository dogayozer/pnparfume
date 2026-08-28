'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import Image from 'next/image'

export interface ProductProps {
  sku: string;
  families?: string[];
  gender?: string | null;
  price?: number | null;
  longevity?: string | null;
  imageUrl?: string | null;
  seoName?: string | null;
  publishStatus?: string;
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent Link navigation
    if (product.publishStatus === 'OUT_OF_STOCK' || !product.price || product.price <= 0) return
    
    addToCart({
      sku: product.sku,
      name: product.seoName || product.families?.join(', ') || 'Özel Harman',
      price: product.price,
      quantity: 1
    })
  }

  const [hasError, setHasError] = useState(false)
  const isOutOfStock = product.publishStatus === 'OUT_OF_STOCK'
  const title = product.seoName || `PN ${product.sku}`

  const toSecureUrl = (url?: string | null) => {
    if (!url) return ''
    if (url.startsWith('http://parfumtasarla.com') || url.startsWith('http://kasaptanetyiyelim.com')) {
      return `/api/media-proxy?url=${encodeURIComponent(url)}`
    }
    return url
  }

  const fallbackSrc = `/api/kasap-image/${encodeURIComponent("WhatsApp Image 2026-08-20 at 01.06.09.jpeg")}`
  const finalSrc = hasError ? fallbackSrc : toSecureUrl(product.imageUrl)

  return (
    <Link href={`/urun/${product.sku}`}>
      <motion.div 
        whileHover={{ y: -5 }}
        className={`group flex flex-col h-full bg-background md:rounded-2xl border border-foreground/5 overflow-hidden hover:border-accent-gold/40 transition-colors duration-300 ${isOutOfStock ? 'opacity-80' : ''}`}
      >
        <div className="relative aspect-[2/3] bg-foreground/[0.02] flex items-center justify-center p-2 md:p-6">
          <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
             {finalSrc ? (
               <Image 
                 src={finalSrc} 
                 alt={title} 
                 fill 
                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                 onError={() => setHasError(true)}
                 className={`object-cover rounded-xl ${isOutOfStock ? 'grayscale' : ''}`}
               />
             ) : (
               <div className="w-32 h-40 bg-foreground/5 rounded-t-full rounded-b-xl flex items-center justify-center">
                 <span className="text-foreground/20 font-light text-sm tracking-widest">{product.sku}</span>
               </div>
             )}
          </div>
          {product.gender === 'Unisex' && (
             <div className="absolute top-4 right-4 text-[10px] font-medium tracking-wider px-2 py-1 bg-foreground text-background rounded-full z-10 shadow-sm">
               UNISEX
             </div>
          )}
          {isOutOfStock && (
             <div className="absolute top-4 left-4 text-[10px] font-medium tracking-wider px-2 py-1 bg-accent-rose text-white rounded-full z-10 shadow-sm">
               STOKTA YOK
             </div>
          )}
        </div>
        
        <div className="p-3 md:p-6 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-1 md:mb-2">
            <span className="text-[9px] md:text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">
              PN {product.sku}
            </span>
            <span className="text-[9px] md:text-[10px] font-bold text-accent-gold uppercase tracking-widest line-clamp-1 text-right ml-1 md:ml-2">
              {product.families?.[0] || 'ÖZEL'}
            </span>
          </div>
          
          <h3 className="text-sm md:text-xl font-medium md:font-light text-foreground mb-1 group-hover:text-accent-gold transition-colors line-clamp-2 leading-tight tracking-tight">
            {title}
          </h3>
          <p className="hidden md:block text-xs text-foreground/50 mb-4 line-clamp-1 font-medium tracking-wide">
            {product.families?.join(' • ') || 'Gizli Formül'}
          </p>
          
          <div className="mt-auto pt-3 md:pt-4 flex flex-col gap-2 md:gap-3">
            <span className="text-base md:text-lg font-bold text-foreground">
              {product.price && product.price > 0 ? `${product.price.toLocaleString('tr-TR')} ₺` : 'Fiyat Belirlenmedi'}
            </span>
            {!isOutOfStock && product.price && product.price > 0 ? (
              <button 
                onClick={handleAddToCart}
                className="w-full py-2 md:py-2.5 rounded border border-foreground text-foreground text-xs md:text-sm font-bold flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
              >
                Sepete Ekle
              </button>
            ) : (
              <button disabled className="w-full py-2 md:py-2.5 rounded bg-foreground/10 text-foreground/50 text-xs md:text-sm font-bold cursor-not-allowed">
                {isOutOfStock ? 'Tükendi' : 'Satışa Kapalı'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
