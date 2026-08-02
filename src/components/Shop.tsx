export default function Shop() {
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
                                <input type="radio" name="cat-filter" value="all" checked/>
                                <span data-i18n="filterCatAll">Tüm Ürünler</span>
                            </label>
                            <label className="filter-item">
                                <input type="radio" name="cat-filter" value="perfume"/>
                                <span data-i18n="filterCatWomen">Parfümler</span>
                            </label>
                            <label className="filter-item">
                                <input type="radio" name="cat-filter" value="room"/>
                                <span data-i18n="filterCatMen">Oda Kokuları</span>
                            </label>
                            <label className="filter-item">
                                <input type="radio" name="cat-filter" value="cologne"/>
                                <span data-i18n="filterCatUnisex">Kolonyalar</span>
                            </label>
                        </div>
                    </div>
                    
                    <div className="filter-group">
                        <div className="filter-title" data-i18n="filterFamily">Koku Ailesi</div>
                        <div className="filter-list">
                            <label className="filter-item">
                                <input type="radio" name="family-filter" value="all" checked/>
                                <span data-i18n="filterFamilyAll">Tüm Aileler</span>
                            </label>
                            <label className="filter-item">
                                <input type="radio" name="family-filter" value="oriental"/>
                                <span>Oryantal / Deri</span>
                            </label>
                            <label className="filter-item">
                                <input type="radio" name="family-filter" value="citrus"/>
                                <span>Narenciye / Ferah</span>
                            </label>
                            <label className="filter-item">
                                <input type="radio" name="family-filter" value="floral"/>
                                <span>Çiçeksi</span>
                            </label>
                            <label className="filter-item">
                                <input type="radio" name="family-filter" value="woody"/>
                                <span>Odunsu / Baharatlı</span>
                            </label>
                        </div>
                    </div>
                </aside>
                
                <div>
                    <div className="search-container">
                        <span className="search-icon"><i className="fas fa-search"></i></span>
                        <input type="text" className="search-input" id="shop-search" placeholder="Arayın..." data-i18n="searchPl"/>
                    </div>
                    
                    <div className="products-grid" id="catalog-grid">
                        {/* Dynamic JS rendering */}
                    </div>
                </div>
            </div>
        </section>
  );
}