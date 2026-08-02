export default function BuildBrand() {
  return (
    <section id="build-brand" className="page-section scroll-story" style={{ padding: '0' }}>
            <div className="build-brand-sticky">
                <div className="brand-visuals">
                    <div className="brand-title">PIEN OLFACTORY WORKS</div>
                    <div className="brand-light"></div>
                    <div className="brand-part part-bottle">
                        <i className="fas fa-flask"></i>
                    </div>
                    
                    <div className="brand-part part-drop">
                        <i className="fas fa-tint"></i>
                        <span className="mono-text" data-i18n="bbPart1">Formülasyon</span>
                    </div>
                    <div className="brand-part part-box">
                        <i className="fas fa-box"></i>
                        <span className="mono-text" data-i18n="bbPart2">Ambalaj</span>
                    </div>
                    <div className="brand-part part-logo">
                        <i className="fas fa-drafting-compass"></i>
                        <span className="mono-text" data-i18n="bbPart3">Kimlik</span>
                    </div>
                    <div className="brand-part part-cert">
                        <i className="fas fa-file-contract"></i>
                        <span className="mono-text" data-i18n="bbPart4">Yasal Süreç</span>
                    </div>
                </div>
            </div>
            
            <div className="build-brand-content">
                <div className="brand-step" id="b-step-1">
                    <h3 data-i18n="bbS1H">1. Koku Tasarımı ve Formülasyon <br /><span className="mono-text" style={{ fontSize: '0.8rem', color: 'var(--color-copper)' }}>(Liquid Architecture)</span></h3>
                    <p data-i18n="bbS1P">Markanızın kalbini birlikte inşa edelim. Global trendlere uygun &apos;Comfort Scents&apos;, &apos;Savory&apos; veya klasik imza kokularından oluşan geniş kütüphanemizle, uzman parfümörlerimiz eşliğinde markanıza özel, eşsiz bir koku piramidi tasarlıyoruz.</p>
                </div>
                <div className="brand-step" id="b-step-2">
                    <h3 data-i18n="bbS2H">2. Görsel Kimlik ve Ambalaj <br /><span className="mono-text" style={{ fontSize: '0.8rem', color: 'var(--color-copper)' }}>(Imperfect by Design)</span></h3>
                    <p data-i18n="bbS2P">Kokunuz kadar görünümünüz de benzersiz olmalı. Logo tasarımı, metin boyutlandırması, etiket yerleşimi ve şişe seçiminden oluşan tam kapsamlı kreatif destek sunuyoruz. Raf algısını maksimize edecek materyal ve kapak tasarımlarını birlikte seçiyoruz.</p>
                </div>
                <div className="brand-step" id="b-step-3">
                    <h3 data-i18n="bbS3H">3. Zanaat ve Üretim <br /><span className="mono-text" style={{ fontSize: '0.8rem', color: 'var(--color-copper)' }}>(Klinik Şeffaflık)</span></h3>
                    <p data-i18n="bbS3P">Merdiven altı değil, laboratuvar hassasiyeti. Ürünleriniz, optimum maserasyon (olgunlaşma) süreleri gözetilerek, uluslararası standartlardaki yüksek kapasiteli tesislerimizde, sürdürülebilir moleküller ve birinci sınıf alkol kalitesiyle üretilir.</p>
                </div>
                <div className="brand-step" id="b-step-4">
                    <h3 data-i18n="bbS4H">4. Yasal Süreçler ve Pazara Çıkış <br /><span className="mono-text" style={{ fontSize: '0.8rem', color: 'var(--color-copper)' }}>(End-to-End Operation)</span></h3>
                    <p data-i18n="bbS4P">Fikirden rafa kadar yanınızdayız. Sağlık Bakanlığı bildirimleri, barkodlama, ürün güvenlik dosyaları (ÜGD/MSDS) ve pazaryerleri için gerekli olan tüm bürokratik süreçleri sizin adınıza anahtar teslim olarak yönetiyoruz. Siz sadece satışa odaklanın.</p>
                </div>
            </div>
        </section>
  );
}