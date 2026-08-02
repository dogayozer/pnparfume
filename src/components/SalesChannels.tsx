"use client";

export default function SalesChannels() {
  return (
    <section id="sales-channels" className="page-section">
            <div className="container">
                <div className="section-header">
                    <h2 data-i18n="salesChannelsTitle">Satış Kanallarımız</h2>
                    <p data-i18n="salesChannelsSub">Ürünlerimize resmi online pazaryeri mağazalarımız aracılığıyla da güvenle ulaşabilirsiniz.</p>
                </div>
                
                {/* Banners */}
                <div className="sales-banners" style={{ display: 'flex', gap: '2rem', marginBottom: '3.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <div className="sales-banner-card glass-panel" style={{ flex: '1 1 45%', maxWidth: '480px', overflow: 'hidden', borderRadius: '16px', borderColor: 'rgba(196,139,113,0.2)', transition: 'var(--transition-smooth)', background: '#ffffff', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src="assets/sales_bg_1.png" alt="PN Parfume Collection Box" style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform 0.5s ease', borderRadius: '8px' }}/>
                    </div>
                    <div className="sales-banner-card glass-panel" style={{ flex: '1 1 45%', maxWidth: '480px', overflow: 'hidden', borderRadius: '16px', borderColor: 'rgba(196,139,113,0.2)', transition: 'var(--transition-smooth)', background: '#ffffff', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src="assets/sales_bg_2.png" alt="PN Parfume Signature Collection Bottles" style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform 0.5s ease', borderRadius: '8px' }}/>
                    </div>
                </div>
                
                <div className="glass-panel" style={{ padding: '3.5rem', maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', borderColor: 'rgba(196, 139, 113, 0.3)' }}>
                    <a href="https://www.trendyol.com" target="_blank" className="btn btn-outline" style={{ borderRadius: '12px', display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
                        <i className="fas fa-shopping-cart" style={{ color: 'var(--color-copper)' }}></i> <span data-i18n="chTrendyol">Trendyol Mağazamız</span>
                    </a>
                    <a href="https://www.hepsiburada.com" target="_blank" className="btn btn-outline" style={{ borderRadius: '12px', display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
                        <i className="fas fa-shopping-cart" style={{ color: 'var(--color-copper)' }}></i> <span data-i18n="chHepsiburada">HepsiBurada Mağazamız</span>
                    </a>
                    <a href="https://www.n11.com" target="_blank" className="btn btn-outline" style={{ borderRadius: '12px', display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
                        <i className="fas fa-shopping-cart" style={{ color: 'var(--color-copper)' }}></i> <span data-i18n="chN11">N11 Mağazamız</span>
                    </a>
                    <a href="https://www.pttavm.com" target="_blank" className="btn btn-outline" style={{ borderRadius: '12px', display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
                        <i className="fas fa-shopping-cart" style={{ color: 'var(--color-copper)' }}></i> <span data-i18n="chPttavm">Ptt AVM Mağazamız</span>
                    </a>
                    <a href="https://www.ciceksepeti.com" target="_blank" className="btn btn-outline" style={{ borderRadius: '12px', display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
                        <i className="fas fa-shopping-cart" style={{ color: 'var(--color-copper)' }}></i> <span data-i18n="chCiceksepeti">Çiçek Sepeti Mağazamız</span>
                    </a>
                    <a href="https://www.amazon.com" target="_blank" className="btn btn-outline" style={{ borderRadius: '12px', display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
                        <i className="fas fa-shopping-cart" style={{ color: 'var(--color-copper)' }}></i> <span data-i18n="chAmazon">Amazon Mağazamız</span>
                    </a>
                    <a href="https://www.temu.com" target="_blank" className="btn btn-outline" style={{ borderRadius: '12px', display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
                        <i className="fas fa-shopping-cart" style={{ color: 'var(--color-copper)' }}></i> <span data-i18n="chTemu">Temu Mağazamız</span>
                    </a>
                    <a href="#contact" onClick={() => { /* TODO: handle navigateTo('contact') */ }} className="btn btn-outline" style={{ borderRadius: '12px', display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', padding: '1.25rem', borderColor: 'var(--color-copper)', background: 'rgba(196,139,113,0.05)', gridColumn: '1 / -1' }}>
                        <i className="fas fa-store" style={{ color: 'var(--color-copper-light)' }}></i> <span data-i18n="chOutlets">Fabrika Satış Mağazalarımız</span>
                    </a>
                </div>
            </div>
        </section>
  );
}