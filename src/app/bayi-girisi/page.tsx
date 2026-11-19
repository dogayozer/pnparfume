import DealerLoginForm from './DealerLoginForm'
import { T } from '@/lib/i18n'

export const metadata = {
  title: 'Bayi Girişi | PN Parfüm',
  robots: { index: false, follow: false }
}

export default function BayiGirisiPage() {
  return (
    <div className="min-h-[70vh] max-w-md mx-auto px-6 py-16 md:py-24">
      <span className="text-xs font-medium uppercase tracking-widest text-accent-gold"><T tr="Bayi Paneli" en="Dealer Panel" ar="لوحة الوكلاء" /></span>
      <h1 className="text-3xl md:text-4xl font-light mt-3 mb-4"><T tr="Bayi Girişi" en="Dealer Login" ar="دخول الوكلاء" /></h1>
      <p className="text-sm text-foreground/60 leading-relaxed mb-8">
        <T tr="Bayi statüsü onaylanmış hesabınızla giriş yaptığınızda, sitedeki tüm ürünlerde bayi fiyatlarınızı görür ve bu fiyatlarla sipariş verirsiniz." en="When you sign in with your approved dealer account, you see your dealer prices on all products on the site and order at those prices." ar="عند تسجيل الدخول بحساب الوكيل المعتمد الخاص بك، سترى أسعار الوكلاء على جميع المنتجات في الموقع وتطلب بهذه الأسعار." />
      </p>
      <DealerLoginForm />
    </div>
  )
}
