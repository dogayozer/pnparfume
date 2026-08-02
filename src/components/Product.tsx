export default function Product() {
  return (
    <section id="product" className="page-section">
            <div className="container">
                <div className="detail-layout">
                    <div className="detail-img-container glass-panel">
                        <img id="detail-img" src="" alt="Product Image"/>
                    </div>
                    
                    <div className="detail-info">
                        <span className="detail-gender-tag" id="detail-category-tag">Kategori</span>
                        <h1 className="detail-name" id="detail-name">Ürün Adı</h1>
                        <div className="detail-code" style={{ color: 'var(--color-copper)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                            <span data-i18n="adminProdCode">Ürün Kodu</span>: <span id="detail-code">---</span>
                        </div>
                        <div className="detail-price" id="detail-price-display">0 TL</div>
                        
                        <p className="detail-desc" id="detail-desc">Açıklama yükleniyor...</p>
                        
                        <div className="size-selector">
                            <span className="size-label" data-i18n="detailSize">Şişe Boyutu Seçin:</span>
                            <div className="size-options">
                                <button className="size-btn active" data-size="50ml">50 ml</button>
                                <button className="size-btn" data-size="100ml">100 ml</button>
                            </div>
                        </div>
                        
                        <div className="cart-actions">
                            <div className="quantity-control">
                                <button className="qty-btn" id="detail-qty-minus">-</button>
                                <div className="qty-val" id="detail-qty-val">1</div>
                                <button className="qty-btn" id="detail-qty-plus">+</button>
                            </div>
                            <button className="btn btn-primary" id="detail-add-btn" style={{ flexGrow: '1' }} data-i18n="btnAddToBag">SEPETE EKLE</button>
                        </div>
                    </div>
                </div>
                
                <div className="pyramid-container">
                    <div className="section-header" style={{ marginBottom: '3rem', textAlign: 'left', maxWidth: '100%' }}>
                        <h2 data-i18n="pyramidTitle">Koku Piramidi</h2>
                        <p data-i18n="pyramidSub">Kokunun zaman içindeki dönüşümünü ve içerdiği zengin notaları keşfedin.</p>
                    </div>
                    
                    <div className="detail-layout" style={{ alignItems: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <div className="scent-pyramid" style={{ width: '100%', maxWidth: '400px' }}>
                                <div className="pyramid-layer" id="layer-btn-top" style={{ borderColor: 'var(--color-copper)' }}>
                                    <span className="layer-tag">Tepe Nota</span>
                                    <span className="layer-notes">İlk Saniyeler</span>
                                    <span className="layer-icon">🍋</span>
                                </div>
                                <div className="pyramid-layer" id="layer-btn-heart">
                                    <span className="layer-tag">Kalp Nota</span>
                                    <span className="layer-notes">Parfümün Ruhu</span>
                                    <span className="layer-icon">🌸</span>
                                </div>
                                <div className="pyramid-layer" id="layer-btn-base">
                                    <span className="layer-tag">Dip Nota</span>
                                    <span className="layer-notes">Kalıcı İz</span>
                                    <span className="layer-icon">🪵</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="glass-panel" id="pyramid-explanation-card" style={{ padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h3 id="explain-title" style={{ color: 'var(--color-copper)', marginBottom: '1rem' }}>Tepe Notaları</h3>
                            <p id="explain-desc" style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Kokunun açılışını yapan uçucu üst notalardır.</p>
                            <div id="explain-list" style={{ fontWeight: '600', fontSize: '1.1rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
  );
}