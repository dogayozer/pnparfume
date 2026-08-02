import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
        <div className="footer-grid">
            <div className="footer-col">
                <div className="brand-logo-pien copper-gradient-text" style={{ fontSize: '2rem' }}>PIEN</div>
                <div className="brand-logo-sub" style={{ marginBottom: '1.5rem' }}>Olfactory Works</div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Yeni nesil, premium ve kişiselleştirilebilir parfümeri deneyimi.</p>
            </div>
            <div className="footer-col">
                <h4>Hızlı Menü</h4>
                <ul>
                    <li><a href="#home" data-i18n="navHome">Ana Sayfa</a></li>
                    <li><a href="#products">Koleksiyon</a></li>
                    <li><a href="#create-scent" data-i18n="navCreateScent">Kendi Kokunu Yarat</a></li>
                </ul>
            </div>
            <div className="footer-col">
                <h4>Kurumsal</h4>
                <ul>
                    <li><a href="#about" data-i18n="navAbout">Hakkımızda</a></li>
                    <li><a href="#digital-franchise" data-i18n="navFranchise">Digital Bayilik</a></li>
                    <li><a href="#b2b">B2B Hizmetler</a></li>
                </ul>
            </div>
            <div className="footer-col">
                <h4>Sosyal Medya</h4>
                <ul>
                    <li><a href="#"><i className="fab fa-instagram" style={{ marginRight: '10px' }}></i> Instagram</a></li>
                    <li><a href="#"><i className="fab fa-linkedin" style={{ marginRight: '10px' }}></i> LinkedIn</a></li>
                    <li><a href="#"><i className="fab fa-twitter" style={{ marginRight: '10px' }}></i> Twitter</a></li>
                </ul>
            </div>
        </div>
        <div className="footer-bottom">
            &copy; 2026 Pien Olfactory Works. Tüm hakları saklıdır.
        </div>
    </footer>
  );
}