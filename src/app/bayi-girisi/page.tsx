import DealerLoginForm from './DealerLoginForm'

export const metadata = {
  title: 'Bayi Girişi | PN Parfüm',
  robots: { index: false, follow: false }
}

export default function BayiGirisiPage() {
  return (
    <div className="min-h-[70vh] max-w-md mx-auto px-6 py-16 md:py-24">
      <span className="text-xs font-medium uppercase tracking-widest text-accent-gold">Bayi Paneli</span>
      <h1 className="text-3xl md:text-4xl font-light mt-3 mb-4">Bayi Girişi</h1>
      <p className="text-sm text-foreground/60 leading-relaxed mb-8">
        Bayi statüsü onaylanmış hesabınızla giriş yaptığınızda, sitedeki tüm ürünlerde bayi fiyatlarınızı görür ve bu fiyatlarla sipariş verirsiniz.
      </p>
      <DealerLoginForm />
    </div>
  )
}
