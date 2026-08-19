'use client'

import { useState, useEffect } from 'react'
import { Star, MessageSquare, CheckCircle2, User, Send, ThumbsUp, Sparkles, X } from 'lucide-react'

type ReviewItem = {
  id: string
  customerName: string
  rating: number
  comment: string
  createdAt: string
}

export default function ProductReviews({ sku, productName }: { sku: string; productName: string }) {
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [avgRating, setAvgRating] = useState(5.0)
  const [loading, setLoading] = useState(true)
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [customerName, setCustomerName] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch(`/api/reviews?sku=${sku}`)
        if (res.ok) {
          const data = await res.json()
          setReviews(data.reviews || [])
          setTotalCount(data.totalCount || 0)
          setAvgRating(data.averageRating || 5.0)
        }
      } catch (err) {
        console.error('Reviews load error:', err)
      } finally {
        setLoading(false)
      }
    }
    loadReviews()
  }, [sku])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName || !comment) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productSku: sku,
          customerName,
          rating,
          comment
        })
      })
      const data = await res.json()
      if (res.ok) {
        setSuccessMessage('Değerlendirmeniz için teşekkür ederiz! Yorumunuz incelendikten sonra yayınlanacaktır.')
        setTimeout(() => {
          setIsModalOpen(false)
          setSuccessMessage('')
          setCustomerName('')
          setComment('')
          setRating(5)
        }, 2500)
      } else {
        alert(data.error || 'Yorum gönderilemedi')
      }
    } catch (err) {
      alert('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-16 pt-12 border-t border-foreground/10">
      {/* Header & Rating Summary */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-light text-foreground mb-2 flex items-center gap-2">
            <MessageSquare className="text-accent-gold" size={24} /> Müşteri Yorumları & Deneyimleri
          </h2>
          <p className="text-sm text-foreground/60">
            {productName} hakkında gerçek kullanıcı değerlendirmeleri ve koku deneyimleri.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 bg-foreground/5 px-4 py-2 rounded-2xl border border-foreground/10">
            <div className="flex items-center text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={16} 
                  className={star <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-zinc-600"} 
                />
              ))}
            </div>
            <span className="font-bold text-sm text-foreground">{avgRating} / 5</span>
            <span className="text-xs text-foreground/40 font-light">({totalCount} Yorum)</span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-foreground text-background hover:bg-accent-gold transition-colors rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            + Yorum Yaz
          </button>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="py-12 text-center text-foreground/40 text-sm">Yorumlar yükleniyor...</div>
      ) : reviews.length === 0 ? (
        <div className="py-12 px-6 bg-foreground/[0.02] border border-foreground/10 rounded-2xl text-center">
          <Sparkles className="mx-auto text-accent-gold mb-2" size={24} />
          <h3 className="font-medium text-foreground text-sm mb-1">İlk Değerlendiren Siz Olun!</h3>
          <p className="text-xs text-foreground/60 max-w-md mx-auto mb-4">
            Bu koku hakkındaki ilk izlenimlerinizi paylaşarak koku meraklılarına ilham verin.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-foreground text-background hover:bg-accent-gold transition-colors rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            Yorum Yap
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-foreground/[0.02] border border-foreground/10 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent-gold/10 text-accent-gold font-bold flex items-center justify-center text-xs">
                      {rev.customerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        {rev.customerName}
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 bg-emerald-500/10 px-1.5 py-0.5 rounded font-normal">
                          <CheckCircle2 size={10} /> Doğrulanmış
                        </span>
                      </div>
                      <div className="text-[10px] text-foreground/40">
                        {new Date(rev.createdAt).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} className={s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-zinc-600"} />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-foreground/80 leading-relaxed italic mt-2">
                  "{rev.comment}"
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-foreground/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-foreground/40 hover:text-foreground p-1.5"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-serif font-light text-foreground mb-1">
              {productName} Değerlendirmesi
            </h3>
            <p className="text-xs text-foreground/60 mb-6">
              Koku yayılımı, kalıcılık ve hissettirdiği duyguları puanlayın.
            </p>

            {successMessage ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl text-center space-y-2">
                <CheckCircle2 size={32} className="mx-auto" />
                <div className="font-bold text-sm">{successMessage}</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating Stars */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/70 mb-2">
                    Puanınız
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1 text-amber-400 transition-transform hover:scale-125"
                      >
                        <Star
                          size={28}
                          className={(hoverRating || rating) >= star ? "fill-amber-400 text-amber-400" : "text-foreground/20"}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-foreground/60 ml-2">
                      {rating === 5 ? 'Mükemmel' : rating === 4 ? 'Çok İyi' : rating === 3 ? 'İyi' : rating === 2 ? 'Orta' : 'Geliştirilmeli'}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/70 mb-1">
                    Adınız Soyadınız
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Örn: Caner D."
                    className="w-full px-4 py-2.5 bg-foreground/[0.03] border border-foreground/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/70 mb-1">
                    Yorumunuz & Deneyiminiz
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Kalıcılığı nasıl buldunuz? Hangi ortamlara yakışıyor? Detaylı anlatın..."
                    className="w-full px-4 py-2.5 bg-foreground/[0.03] border border-foreground/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-foreground text-background hover:bg-accent-gold transition-colors rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  {submitting ? 'Gönderiliyor...' : 'Yorumu Yayınlanmak Üzere Gönder'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
