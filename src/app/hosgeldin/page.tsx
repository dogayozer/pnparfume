import { prisma } from '@/lib/prisma'
import QrWelcomeClaim from '@/components/QrWelcomeClaim'
import { ShieldCheck, Sparkles, Leaf } from 'lucide-react'

export const metadata = {
  title: 'Hoş Geldin | PN Parfüm'
}

// Kutu üzerindeki QR kod buraya düşer. Kasıtlı olarak ağır görsel/video YOK — sayfa
// sadece CSS gradient + ince metinle açılıyor, mobil veride bile anında yükleniyor.
// Tek alanlı (telefon) hızlı kupon talebi + gerçek, canlı "kurucu üye" sayacı
// (uydurma bir "son 3 kişi!" değil — prisma.customer.count()'tan gerçek rakam).
export const revalidate = 60

const FOUNDER_MEMBER_CAP = 500

export default async function HosgeldinPage() {
  let spotsLeft: number | null = null
  try {
    const totalCustomers = await prisma.customer.count()
    spotsLeft = Math.max(FOUNDER_MEMBER_CAP - totalCustomers, 0)
  } catch {
    spotsLeft = null
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* Hafif, hızlı yüklenen arkaplan — video/ağır görsel yok */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-gold/40 rounded-full mix-blend-multiply filter blur-[96px] animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-rose/40 rounded-full mix-blend-multiply filter blur-[96px] animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center text-center">
        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent-gold mb-4">
          PN Parfüm'e Hoş Geldin
        </span>

        <h1 className="text-3xl md:text-5xl font-light tracking-tight mb-4 max-w-2xl">
          Sen Farklısın. <br />
          <span className="font-medium text-accent-rose">Neden Parfümün Aynı Olsun?</span>
        </h1>

        <p className="text-sm md:text-base text-foreground/60 max-w-md mb-10 leading-relaxed">
          Bu kutuyu elinize aldığınız an PN ailesine bir adım attınız. Sizi burada
          küçük ama gerçek bir sürprizimiz bekliyor.
        </p>

        <QrWelcomeClaim spotsLeft={spotsLeft} />

        <div className="flex items-center justify-center gap-6 mt-14 text-foreground/40">
          <div className="flex flex-col items-center gap-1.5">
            <ShieldCheck size={20} />
            <span className="text-[10px] uppercase tracking-widest">GMP / IFRA</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Sparkles size={20} />
            <span className="text-[10px] uppercase tracking-widest">20 Yıllık Miras</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Leaf size={20} />
            <span className="text-[10px] uppercase tracking-widest">Vegan & Cruelty Free</span>
          </div>
        </div>
      </div>
    </div>
  )
}
