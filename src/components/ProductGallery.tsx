'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductGalleryProps {
  images: string[]
  title: string
  isOutOfStock: boolean
  sku: string
}

export default function ProductGallery({ images, title, isOutOfStock, sku }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const isVideo = (url?: string) => Boolean(url && (url.endsWith('.mp4') || url.endsWith('.webm') || url.includes('video')))

  // Auto-play: 8.5 seconds on video slide so it is fully watched, 4 seconds on images
  useEffect(() => {
    if (images.length <= 1 || isHovered) return

    const currentUrl = images[currentIndex]
    const isCurrentVideo = isVideo(currentUrl)
    const duration = isCurrentVideo ? 8500 : 4000

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, duration)

    return () => clearTimeout(timer)
  }, [images, isHovered, currentIndex])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  // Swipe handling using simple touch states
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) handleNext()
    if (isRightSwipe) handlePrev()

    setTouchStart(0)
    setTouchEnd(0)
  }

  if (!images || images.length === 0) {
    return (
      <div className={`relative aspect-[2/3] bg-foreground/[0.02] rounded-3xl overflow-hidden flex items-center justify-center border border-foreground/5 ${isOutOfStock ? 'opacity-80' : ''}`}>
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-gold rounded-full mix-blend-multiply filter blur-[96px] animate-blob"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-rose rounded-full mix-blend-multiply filter blur-[96px] animate-blob animation-delay-2000"></div>
        </div>
        <div className="relative z-10 w-48 h-64 bg-background/50 backdrop-blur-md rounded-t-full rounded-b-2xl border border-foreground/10 flex items-center justify-center shadow-2xl">
          <span className="text-foreground/30 font-light text-2xl tracking-[0.3em]">{sku}</span>
        </div>
        {isOutOfStock && (
          <div className="absolute top-6 left-6 text-xs font-medium tracking-wider px-4 py-2 bg-accent-rose text-white rounded-full z-10 shadow-lg">
            STOKTA YOK
          </div>
        )}
      </div>
    )
  }

  const toSecureUrl = (url: string) => {
    if (!url) return ''
    if (url.startsWith('http://parfumtasarla.com') || url.startsWith('http://kasaptanetyiyelim.com')) {
      return `/api/media-proxy?url=${encodeURIComponent(url)}`
    }
    return url
  }

  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({})

  const currentMedia = images[currentIndex]
  const isFailed = failedImages[currentIndex]

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image / Video */}
      <div 
        className={`relative aspect-[2/3] bg-foreground/[0.02] rounded-3xl overflow-hidden flex items-center justify-center border border-foreground/5 group ${isOutOfStock ? 'opacity-80' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full relative"
          >
            {isVideo(currentMedia) ? (
              <video
                src={toSecureUrl(currentMedia)}
                autoPlay
                loop
                muted
                playsInline
                controls
                className="w-full h-full object-cover rounded-3xl"
              />
            ) : isFailed ? (
              // Gerçek görsel yüklenemedi (bozuk link) — ürünle alakasız bir görsel
              // göstermek yerine, boş galeri durumundaki gibi zarif bir "yok" durumu.
              <div className="w-full h-full flex items-center justify-center bg-foreground/5">
                <span className="text-foreground/20 font-light text-2xl tracking-widest">{sku}</span>
              </div>
            ) : (
              <Image
                src={toSecureUrl(currentMedia)}
                alt={`${title} - Görsel ${currentIndex + 1}`}
                fill
                priority={currentIndex === 0}
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={() => setFailedImages(prev => ({ ...prev, [currentIndex]: true }))}
                className={`object-cover ${isOutOfStock ? 'grayscale' : ''}`}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-md border border-foreground/10 flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0 z-20"
              aria-label="Önceki Görsel"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-md border border-foreground/10 flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0 z-20"
              aria-label="Sonraki Görsel"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {isOutOfStock && (
          <div className="absolute top-6 left-6 text-xs font-medium tracking-wider px-4 py-2 bg-accent-rose text-white rounded-full z-10 shadow-lg">
            STOKTA YOK
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="w-full flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {images.map((img, idx) => {
            const isVid = isVideo(img)
            const imgFailed = failedImages[idx]
            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2 transition-all snap-start bg-foreground/5 flex items-center justify-center ${currentIndex === idx ? 'border-accent-gold opacity-100 scale-105 shadow-md' : 'border-transparent opacity-50 hover:opacity-100'}`}
              >
                {isVid ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-black/40 text-white gap-1">
                    <div className="w-8 h-8 rounded-full bg-accent-gold/80 flex items-center justify-center text-black font-bold">
                      ▶
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-accent-gold">Video</span>
                  </div>
                ) : imgFailed ? (
                  <div className="w-full h-full flex items-center justify-center bg-foreground/5">
                    <span className="text-foreground/20 font-light text-[10px] tracking-widest">{sku}</span>
                  </div>
                ) : (
                  <Image
                    src={toSecureUrl(img)}
                    alt={`${title} - Küçük Görsel ${idx + 1}`}
                    fill
                    sizes="80px"
                    onError={() => setFailedImages(prev => ({ ...prev, [idx]: true }))}
                    className={`object-cover ${isOutOfStock ? 'grayscale' : ''}`}
                  />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
