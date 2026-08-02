"use client";

import { useState } from 'react';

type Product = {
  id: string;
  barcode: string;
  title: string;
  reference_price: number | null;
  sale_price: number;
  categoryId?: string | null;
  status: string;
};

export default function Shop({ products = [] }: { products?: Product[] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFamily, setActiveFamily] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // The original template categories are hardcoded. We will try to map them if possible,
  // but for now we apply a basic string match filter if needed, 
  // or just show all if 'all' is selected.
  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.barcode.toLowerCase().includes(searchTerm.toLowerCase());
    
    // We don't have exact category mappings from the Excel yet, so we will just return matchesSearch for now
    // If the user adds categories to the Excel later, we can filter by product.categoryId
    return matchesSearch;
  });

  return (
    <section id="shop" className="page-section">
            <div className="section-header">
                <h2 data-i18n="shopTitle">Koku Kataloğu</h2>
                <p data-i18n="shopSub">Geniş ürün kataloğumuzda dilediğiniz kokuları bulun, karşılaştırın ve keşfedin.</p>
            </div>
            
            <div className="shop-layout">
                <aside className="filters-sidebar glass-panel" style={{ padding: '2rem' }}>
                    <div className="filter-group">
                        <div className="filter-title" data-i18n="filterCat">Kategori</div>
                        <div className="filter-list">
                            <label className="filter-item">
                                <input type="radio" name="cat-filter" value="all" checked={activeCategory === 'all'} onChange={(e) => setActiveCategory(e.target.value)} />
                                <span data-i18n="filterCatAll">Tüm Ürünler</span>
                            </label>
                            <label className="filter-item">
                                <input type="radio" name="cat-filter" value="perfume" checked={activeCategory === 'perfume'} onChange={(e) => setActiveCategory(e.target.value)} />
                                <span data-i18n="filterCatWomen">Parfümler</span>
                            </label>
                            <label className="filter-item">
                                <input type="radio" name="cat-filter" value="room" checked={activeCategory === 'room'} onChange={(e) => setActiveCategory(e.target.value)} />
                                <span data-i18n="filterCatMen">Oda Kokuları</span>
                            </label>
                            <label className="filter-item">
                                <input type="radio" name="cat-filter" value="cologne" checked={activeCategory === 'cologne'} onChange={(e) => setActiveCategory(e.target.value)} />
                                <span data-i18n="filterCatUnisex">Kolonyalar</span>
                            </label>
                        </div>
                    </div>
                    
                    <div className="filter-group">
                        <div className="filter-title" data-i18n="filterFamily">Koku Ailesi</div>
                        <div className="filter-list">
                            <label className="filter-item">
                                <input type="radio" name="family-filter" value="all" checked={activeFamily === 'all'} onChange={(e) => setActiveFamily(e.target.value)} />
                                <span data-i18n="filterFamilyAll">Tüm Aileler</span>
                            </label>
                            <label className="filter-item">
                                <input type="radio" name="family-filter" value="oriental" checked={activeFamily === 'oriental'} onChange={(e) => setActiveFamily(e.target.value)} />
                                <span>Oryantal / Deri</span>
                            </label>
                            <label className="filter-item">
                                <input type="radio" name="family-filter" value="citrus" checked={activeFamily === 'citrus'} onChange={(e) => setActiveFamily(e.target.value)} />
                                <span>Narenciye / Ferah</span>
                            </label>
                            <label className="filter-item">
                                <input type="radio" name="family-filter" value="floral" checked={activeFamily === 'floral'} onChange={(e) => setActiveFamily(e.target.value)} />
                                <span>Çiçeksi</span>
                            </label>
                            <label className="filter-item">
                                <input type="radio" name="family-filter" value="woody" checked={activeFamily === 'woody'} onChange={(e) => setActiveFamily(e.target.value)} />
                                <span>Odunsu / Baharatlı</span>
                            </label>
                        </div>
                    </div>
                </aside>
                
                <div>
                    <div className="search-container">
                        <span className="search-icon"><i className="fas fa-search"></i></span>
                        <input 
                          type="text" 
                          className="search-input" 
                          placeholder="Ürün adı veya barkod arayın..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="products-grid" id="catalog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <div key={product.id} className="product-card glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div className="product-image" style={{ width: '100%', aspectRatio: '1', backgroundColor: '#f0f0f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <i className="fas fa-spray-can" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                                    </div>
                                    <div className="product-info" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>{product.barcode}</div>
                                        <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{product.title}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto' }}>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-copper)' }}>{product.sale_price} ₺</span>
                                            {product.reference_price && product.reference_price > product.sale_price && (
                                                <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.9rem' }}>{product.reference_price} ₺</span>
                                            )}
                                        </div>
                                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Sepete Ekle</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#666' }}>
                                Aradığınız kriterlere uygun ürün bulunamadı.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
  );
}