"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, Package, CreditCard, ShieldCheck } from "lucide-react";

export default function Cart() {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [isNextDay, setIsNextDay] = useState(false);

  // Mock cart total for now
  const cartTotal = 850;
  const FREE_SHIPPING_THRESHOLD = 950;
  const neededForFreeShipping = FREE_SHIPPING_THRESHOLD - cartTotal;

  // Calculate the time left until 15:00
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      
      // Calculate target time (15:00 today)
      let target = new Date();
      target.setHours(15, 0, 0, 0);

      // If it's Saturday, the cutoff is 12:00
      if (now.getDay() === 6) {
        target.setHours(12, 0, 0, 0);
      }

      // If Sunday or past cutoff time, it's next day
      if (now.getDay() === 0 || now.getTime() > target.getTime()) {
        setIsNextDay(true);
        setTimeLeft(null);
        return;
      }

      setIsNextDay(false);
      const diff = target.getTime() - now.getTime();
      
      setTimeLeft({
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="cart" className="page-section" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      <div className="section-header">
        <h2>Sepetim</h2>
        <p>Alışverişinizi güvenle tamamlayın.</p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Left Side: Items */}
        <div className="glass-panel" style={{ flex: '1 1 500px', padding: '2rem' }}>
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <ShoppingCart size={20} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
            Ürünler
          </h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '80px', height: '80px', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', overflow: 'hidden' }}>
                <img src="assets/product_1.jpg" alt="Parfüm" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 5px 0' }}>Premium Parfüm</h4>
                <p style={{ margin: '0', fontSize: '0.85rem', color: '#aaa' }}>Miktar: 1</p>
              </div>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-copper)' }}>850 TL</div>
          </div>
        </div>

        {/* Right Side: Summary & Checkout */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Shipping Scarcity Countdown */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderColor: 'var(--color-copper)' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 10px 0', fontSize: '1rem' }}>
              <Package size={18} color="var(--color-copper)" /> 
              Kargo Durumu
            </h4>
            
            {isNextDay ? (
              <p style={{ margin: '0', fontSize: '0.9rem', color: '#ccc' }}>
                Siparişiniz bir sonraki iş günü kargoya verilecektir.
              </p>
            ) : timeLeft ? (
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#ccc' }}>Bugün kargoya verilmesi için kalan süre:</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>
                    {String(timeLeft.hours).padStart(2, '0')}s
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>
                    {String(timeLeft.minutes).padStart(2, '0')}d
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '4px', fontFamily: 'var(--font-mono)', color: 'var(--color-copper)' }}>
                    {String(timeLeft.seconds).padStart(2, '0')}s
                  </div>
                </div>
              </div>
            ) : null}

            <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              {cartTotal >= FREE_SHIPPING_THRESHOLD ? (
                <div style={{ color: '#4ade80', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>🎉 Ücretsiz Kargo Kazandınız!</span>
                </div>
              ) : (
                <div style={{ color: '#ccc', fontSize: '0.9rem' }}>
                  Ücretsiz kargo için sepetinize <span style={{ color: 'var(--color-copper)', fontWeight: 'bold' }}>{neededForFreeShipping} TL</span> daha ekleyin.
                </div>
              )}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem' }}>Özet</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Ara Toplam</span>
              <span>{cartTotal} TL</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span>Kargo</span>
              <span>{cartTotal >= FREE_SHIPPING_THRESHOLD ? '0 TL' : '45 TL'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-copper)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
              <span>Toplam</span>
              <span>{cartTotal >= FREE_SHIPPING_THRESHOLD ? cartTotal : cartTotal + 45} TL</span>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              <CreditCard size={18} />
              Güvenle Öde
            </button>

            {/* Trust Badges */}
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '15px', fontSize: '0.75rem', color: '#888' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={14} /> 256-bit SSL</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={14} /> 30 Gün İade</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={14} /> Paynet</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
