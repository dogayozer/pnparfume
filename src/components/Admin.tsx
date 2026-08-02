"use client";

export default function Admin() {
  return (
    <section id="admin" className="page-section">
            <div className="container">
                <div className="section-header">
                    <h2 data-i18n="adminDashboard">Yönetim Paneli</h2>
                </div>

                {/* Login State Container */}
                <div id="admin-login-box" className="glass-panel form-container" style={{ maxWidth: '450px', margin: '4rem auto', padding: '2.5rem' }}>
                    <h3 style={{ color: 'var(--color-copper)', textAlign: 'center', marginBottom: '2rem' }}>Yönetici Girişi</h3>
                    <form id="admin-login-form">
                        <div className="form-group">
                            <label>Kullanıcı Adı</label>
                            <input type="text" id="admin-username" required/>
                        </div>
                        <div className="form-group">
                            <label>Şifre</label>
                            <input type="password" id="admin-password" required/>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>GİRİŞ YAP</button>
                    </form>
                </div>

                {/* Admin Dashboard Grid */}
                <div id="admin-dashboard" className="admin-grid" style={{ display: 'none' }}>
                    <aside className="admin-sidebar">
                        <button className="admin-menu-btn active" id="admin-btn-apps" data-i18n="adminApps">Bayilik Başvuruları</button>
                        <button className="admin-menu-btn" id="admin-btn-prods" data-i18n="adminProducts">Ürün Yönetimi</button>
                        <button className="admin-menu-btn" id="admin-btn-logout" data-i18n="adminSignOut" style={{ marginTop: '2rem', borderColor: '#dc3545', color: '#dc3545' }}>Çıkış Yap</button>
                    </aside>

                    <main className="admin-content">
                        {/* Franchise Applications Panel */}
                        <div className="admin-panel-box active" id="admin-panel-apps">
                            <h3 style={{ color: 'var(--color-copper)', marginBottom: '1.5rem' }} data-i18n="adminApps">Bayilik Başvuruları</h3>
                            <div style={{ overflowX: 'auto' }}>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Ad Soyad</th>
                                            <th>Telefon / E-posta</th>
                                            <th>İl / Konum</th>
                                            <th>Bütçe</th>
                                            <th>Durum</th>
                                            <th>İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody id="admin-apps-list">
                                        {/* Dynamic application rows */}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Product Management Panel */}
                        <div className="admin-panel-box" id="admin-panel-prods">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ color: 'var(--color-copper)' }} data-i18n="adminProducts">Ürün Yönetimi</h3>
                                <button className="btn btn-sm btn-primary" onClick={() => { /* TODO: handle showProductForm() */ }} data-i18n="adminAddProd">Yeni Ürün Ekle</button>
                            </div>

                            {/* Product Edit Form */}
                            <div id="product-form-container" className="glass-panel form-container" style={{ display: 'none', marginBottom: '3rem', padding: '2rem', maxWidth: '100%' }}>
                                <h4 style={{ color: 'var(--color-copper)', marginBottom: '1.5rem' }} id="prod-form-title">Ürün Ekle</h4>
                                <form id="admin-product-form">
                                    <input type="hidden" id="prod-id"/>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className="form-group">
                                            <label data-i18n="adminProdName">Ürün Adı</label>
                                            <input type="text" id="prod-name" required/>
                                        </div>
                                        <div className="form-group">
                                            <label data-i18n="adminProdCode">Ürün Kodu</label>
                                            <input type="text" id="prod-code" required/>
                                        </div>
                                        <div className="form-group">
                                            <label data-i18n="adminProdPrice">Fiyat (TL)</label>
                                            <input type="number" id="prod-price" required/>
                                        </div>
                                        <div className="form-group">
                                            <label data-i18n="adminProdCat">Kategori</label>
                                            <select id="prod-cat" required>
                                                <option value="perfume">Parfüm</option>
                                                <option value="room">Oda Kokusu</option>
                                                <option value="cologne">Kolonya</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label data-i18n="adminProdFamily">Koku Ailesi</label>
                                            <select id="prod-family" required>
                                                <option value="oriental">Oryantal / Deri</option>
                                                <option value="citrus">Narenciye / Ferah</option>
                                                <option value="floral">Çiçeksi</option>
                                                <option value="woody">Odunsu / Baharatlı</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Görsel Dosya Yolu</label>
                                            <input type="text" id="prod-img" placeholder="Örn: assets/product_1.jpg"/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label data-i18n="adminProdDesc">Açıklama</label>
                                        <textarea id="prod-desc" rows={3} required></textarea>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                        <button type="button" className="btn btn-outline" onClick={() => { /* TODO: handle hideProductForm() */ }} data-i18n="adminCancel">İptal</button>
                                        <button type="submit" className="btn btn-primary" data-i18n="adminSave">Kaydet</button>
                                    </div>
                                </form>
                            </div>

                            <div style={{ overflowX: 'auto' }}>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Kod</th>
                                            <th>Görsel</th>
                                            <th>Ürün Adı</th>
                                            <th>Kategori</th>
                                            <th>Fiyat</th>
                                            <th>İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody id="admin-prods-list">
                                        {/* Dynamic product rows */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </section>
  );
}