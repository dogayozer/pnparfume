import { prisma } from '@/lib/prisma'
import QrWelcomeClaim from '@/components/QrWelcomeClaim'
import { ShieldCheck, Sparkles, Leaf } from 'lucide-react'

export const metadata = {
  title: 'Hoş Geldin | PN Parfüm',
  // Bu sayfa sadece kutudaki QR kodu okutanlar için — Google'da aratılıp
  // bulunmasın, arama sonuçlarında çıkmasın diye indexlenmeyi kapatıyoruz.
  robots: { index: false, follow: false }
}

// Kutu üzerindeki QR kod buraya düşer. Arkaplan ve şişe videoları web için özel
// sıkıştırıldı (594KB / 1.2MB — ana sayfadaki smoke.mp4'ten bile hafif), bu yüzden
// mobil veride de hızlı açılıyor. Tek alanlı (telefon) hızlı kupon talebi + gerçek,
// canlı "kurucu üye" sayacı (uydurma bir "son 3 kişi!" değil —
// prisma.customer.count()'tan gerçek rakam).
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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden bg-black">
      {/* Duman arkaplan videosu — 594KB'a sıkıştırıldı, ana sayfadaki smoke.mp4'ten
          (6.27MB) bile hafif, mobil veride sorunsuz açılıyor. */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-50"
          src="/hosgeldin-arkaplan.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black"></div>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center text-center">
        {/* Şişe videosu — 1.2MB, sayfanın "vitrin" görseli */}
        <div className="w-32 md:w-40 aspect-[9/16] rounded-2xl overflow-hidden border border-accent-gold/20 shadow-2xl shadow-black/50 mb-6">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            src="/hosgeldin-sise.mp4"
          />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent-gold mb-4">
          PN Parfüm'e Hoş Geldin
        </span>

        <h1 className="text-3xl md:text-5xl font-light tracking-tight mb-4 max-w-2xl text-white">
          Sen Farklısın. <br />
          <span className="font-medium text-accent-rose">Neden Parfümün Aynı Olsun?</span>
        </h1>

        <p className="text-sm md:text-base text-white/60 max-w-md mb-10 leading-relaxed">
          Bu kutuyu elinize aldığınız an PN ailesine bir adım attınız. Sizi burada
          küçük ama gerçek bir sürprizimiz bekliyor.
        </p>

        <QrWelcomeClaim spotsLeft={spotsLeft} />

        <div className="flex items-center justify-center gap-6 mt-14 text-white/40">
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
