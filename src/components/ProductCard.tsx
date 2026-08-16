'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

export interface ProductProps {
  sku: string;
  families?: string[];
  gender?: string | null;
  price?: number | null;
  longevity?: string | null;
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent Link navigation
    addToCart({
      sku: product.sku,
      name: product.families?.join(', ') || 'Özel Harman',
      price: product.price || 1500, // Default price if null
      quantity: 1
    })
  }

  return (
    <Link href={`/urun/${product.sku}`}>
      <motion.div 
        whileHover={{ y: -5 }}
        className="group flex flex-col h-full bg-background rounded-2xl border border-foreground/5 overflow-hidden hover:border-accent-gold/40 transition-colors duration-300"
      >
        <div className="relative aspect-square bg-foreground/[0.02] flex items-center justify-center p-6">
          <div className="w-32 h-40 bg-foreground/5 rounded-t-full rounded-b-xl relative group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
             <span className="text-foreground/20 font-light text-sm tracking-widest">{product.sku}</span>
          </div>
          {product.gender === 'Unisex' && (
             <div className="absolute top-4 right-4 text-[10px] font-medium tracking-wider px-2 py-1 bg-foreground text-background rounded-full">
               UNISEX
             </div>
          )}
        </div>
        
        <div className="p-6 flex flex-col flex-grow">
          <div className="text-xs font-medium text-accent-gold mb-2 tracking-widest line-clamp-1">
            {product.families?.[0]?.toUpperCase() || 'ÖZEL HARMAN'}
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1 group-hover:text-accent-rose transition-colors">
            PN {product.sku}
          </h3>
          <p className="text-sm text-foreground/50 mb-4 line-clamp-1">
            {product.families?.join(', ') || 'Gizli Formül'}
          </p>
          
          <div className="mt-auto pt-4 flex items-center justify-between">
            <span className="text-sm font-medium">{product.price ? `₺${product.price}` : '₺1500'}</span>
            <button 
              onClick={handleAddToCart}
              className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-accent-rose group-hover:text-background transition-colors"
            >
              <ShoppingCart size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
