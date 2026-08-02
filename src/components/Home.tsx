"use client";

export default function Home() {
  return (
    <section id="home" className="page-section active hero-corporate">
            
            <div className="hero-content-corporate">
                <h1 className="hero-title" data-i18n="heroTitle">Kokunun <span className="copper-gradient-text">Mimarları.</span></h1>
                <p className="hero-subtitle" data-i18n="heroSubtitle">Sıradanlığı reddeden, bilimle zanaatı buluşturan nöro-parfümeri stüdyosu. Sınırları aşan moleküllerle kendi kimliğinizi tasarlayın.</p>
                <div className="hero-cta">
                    <a href="#create-scent" className="btn btn-primary btn-glow" onClick={() => { /* TODO: handle document.querySelector('.nav-links a[href=\'#create-scent\']').click() */ }} data-i18n="btnCreateScent">Kendi Kokunu Tasarla</a>
                    <a href="#build-brand" className="btn btn-secondary" onClick={() => { /* TODO: handle document.querySelector('.nav-links a[href=\'#build-brand\']').click() */ }} data-i18n="btnCreateBrand">Kendi Markanı Yarat</a>
                </div>
            </div>

            {/* Abone Ol Kazan Bölümü */}
            <div className="subscribe-win-container glass-panel">
                <h3 data-i18n="subWinTitle">ABONE OL KAZAN</h3>
                <p data-i18n="subWinSub">Formu doldurarak ailemize katılın, size özel lüks indirimlerden ve yeni kreasyonlarımızdan anında haberdar olun!</p>
                
                <form id="subscribe-win-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label data-i18n="formName">Ad Soyad</label>
                            <input type="text" id="sub-name" placeholder="Adınız Soyadınız" required/>
                        </div>
                        <div className="form-group">
                            <label data-i18n="subAge">Yaş</label>
                            <input type="number" id="sub-age" placeholder="Yaşınız" required/>
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label data-i18n="subGender">Cinsiyet</label>
                        <select id="sub-gender" required>
                            <option value="" disabled selected data-i18n="subGenderSelect">Cinsiyet Seçiniz</option>
                            <option value="female" data-i18n="subGenderFem">Bayan</option>
                            <option value="male" data-i18n="subGenderMas">Erkek</option>
                            <option value="unisex" data-i18n="subGenderUni">Belirtmek İstemiyorum</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label data-i18n="subFavScents">Beğendiğiniz Kokulardan/Parfümlerden birkaçını yazın</label>
                        <input type="text" id="sub-favs" placeholder="Örn: Sauvage, Black Orchid, Limonlu..." required/>
                    </div>

                    <div className="form-group">
                        <label data-i18n="subFeedback">Öneri / Şikayet</label>
                        <textarea id="sub-feedback" rows={2} placeholder="Görüşleriniz bizim için değerlidir..."></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary btn-glow" style={{ width: '100%', borderRadius: '30px', padding: '1rem' }} data-i18n="subSubmitBtn">ABONE OL VE KAZAN</button>
                </form>
                
                <div id="sub-success-msg" style={{ display: 'none', textAlign: 'center', marginTop: '1.5rem', color: '#28a745', fontWeight: '600' }}>
                    <i className="fas fa-check-circle" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'block' }}></i>
                    <span data-i18n="subSuccess">Tebrikler! Size özel indirimler için sizleri haberdar edeceğiz.</span>
                </div>
            </div>
        </section>
  );
}