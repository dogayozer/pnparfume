export default function Creation() {
  return (
    <section id="creation" className="page-section">
            <div className="split-section">
                <div className="split-image">
                    {/* Placeholder image for creation process */}
                    <img src="https://images.unsplash.com/photo-1616943564998-f2b3f2f8409e?q=80&w=1000&auto=format&fit=crop" alt="Perfume Creation Process"/>
                </div>
                <div className="split-content">
                    <h2 data-i18n="creaTitle">Bizim <span className="copper-gradient-text">Kreasyonumuz</span></h2>
                    <p data-i18n="creaP1">Pien Olfactory Works laboratuvarlarında, kokuyu sadece bir koku olarak değil, anıları canlandıran ve duyguları harekete geçiren bir sanat eseri olarak görüyoruz.</p>
                    <p data-i18n="creaP2">Dünyanın dört bir yanından özenle seçilmiş nadir bitki özleri, modern kimya ve geleneksel parfümeri tekniklerinin mükemmel dengesiyle formüle ediliyor.</p>
                    <ul style={{ margin: '2rem 0', color: 'var(--color-text-muted)' }}>
                        <li><i className="fas fa-check" style={{ color: 'var(--color-copper)', marginRight: '10px' }}></i> %100 Vegan ve Cruelty-Free içerikler</li>
                        <li><i className="fas fa-check" style={{ color: 'var(--color-copper)', marginRight: '10px' }}></i> Sürdürülebilir şişeleme teknolojisi</li>
                        <li><i className="fas fa-check" style={{ color: 'var(--color-copper)', marginRight: '10px' }}></i> IFRA standartlarında alerjen kontrolü</li>
                    </ul>
                    <button className="btn btn-primary" data-i18n="btnDiscover">Atölyemizi Keşfet</button>
                </div>
            </div>
        </section>
  );
}