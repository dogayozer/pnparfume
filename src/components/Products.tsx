"use client";

const MOCK_PRODUCTS = [
  {
    id: "p1",
    title: "Premium Parfüm",
    desc: "Özel nöro-parfümeri formülleriyle zenginleştirilmiş, gün boyu teninizde yaşayan imza parfüm serimiz.",
    image: "assets/product_1.jpg",
    reference_price: 1250,
    sale_price: 890,
  },
  {
    id: "p2",
    title: "Lüks Oda Kokusu",
    desc: "Yaşam alanlarınızı dönüştüren, seçkin çubuklu oda kokusu ve oda parfümü çeşitlerimiz.",
    image: "assets/product_2.jpg",
    reference_price: 650,
    sale_price: 650, // no strikethrough if prices match
  },
  {
    id: "p3",
    title: "Zarif Kolonya",
    desc: "Geleneksel zarafeti modern ferahlıkla buluşturan premium hediyelik kolonya serimiz.",
    image: "assets/product_3.jpg",
    reference_price: 350,
    sale_price: 249,
  }
];

export default function Products() {
  return (
    <section id="products" className="page-section">
      <div className="section-header">
        <h2 data-i18n="prodTitle">Özel <span className="copper-gradient-text">Koleksiyon</span></h2>
        <p data-i18n="prodSub">En nadide esansların usta ellerde hayat bulduğu premium parfüm serimiz.</p>
      </div>
      <div className="products-grid">
        {MOCK_PRODUCTS.map((product) => (
          <div key={product.id} className="product-card glass-panel" onClick={() => { /* TODO: navigate */ }}>
            <div className="product-img-wrapper" style={{ height: '350px', overflow: 'hidden', borderRadius: '8px' }}>
              <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            </div>
            <h3 className="product-title" style={{ marginTop: '1.5rem' }}>{product.title}</h3>
            <p className="product-desc" style={{ minHeight: '60px' }}>{product.desc}</p>
            
            <div className="price-block" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {product.reference_price > product.sale_price ? (
                <>
                  <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '0.9rem' }}>
                    {product.reference_price} TL
                  </span>
                  <span style={{ color: 'var(--color-copper)', fontSize: '1.25rem', fontWeight: 'bold' }}>
                    {product.sale_price} TL
                  </span>
                  <span style={{ 
                    background: 'rgba(228, 168, 114, 0.2)', 
                    color: 'var(--color-copper)', 
                    padding: '2px 6px', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem',
                    fontWeight: 'bold' 
                  }}>
                    %{(100 - (product.sale_price / product.reference_price) * 100).toFixed(0)}
                  </span>
                </>
              ) : (
                <span style={{ color: 'var(--color-copper)', fontSize: '1.25rem', fontWeight: 'bold' }}>
                  {product.sale_price} TL
                </span>
              )}
            </div>

            <button 
              className="btn btn-outline" 
              style={{ marginTop: '1rem', width: '100%' }}
              onClick={(e) => { e.stopPropagation(); /* TODO: navigate */ }}
            >
              İncele
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}