"use client";

export default function CreateScent() {
  return (
    <section id="create-scent" className="page-section">
            <div className="wizard-container">
                {/* Sol Taraf: İnteraktif Görseller & Laboratuvar */}
                <div className="wizard-visuals">
                    {/* Image moved to step 4 for visibility on mobile */}
                    <div className="anti-gravity-zone" id="anti-gravity-zone">
                        {/* Damlacıklar buraya JS ile eklenecek */}
                    </div>
                    
                    <div className="wizard-bottle">
                        <div className="bottle-cap-minimal"></div>
                        <div className="bottle-body">
                            <div className="bottle-liquid" id="wizard-liquid"></div>
                            <div className="bottle-label" id="bottle-label">
                                <span className="label-title">PIEN</span>
                                <span className="label-formula" id="formula-no">Formül No: ---</span>
                            </div>
                        </div>
                    </div>

                    <div className="maceration-card" id="maceration-card">
                        <h4>Maserasyon Şeffaflık Kartı</h4>
                        <div className="timeline">
                            <div className="timeline-item active">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <h5>Formül Birleştirme</h5>
                                    <p>Hassas laboratuvar terazisinde (Anlık)</p>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <h5>Soğuk Stabilizasyon</h5>
                                    <p>-4°C derecede stabilizasyon (3 Gün)</p>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <h5>Maserasyon</h5>
                                    <p>Işıksız ortamda olgunlaşma (28 Gün)</p>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <h5>Filtreleme & Şişeleme</h5>
                                    <p>Son süzüm ve isme özel paketleme (1 Gün)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sağ Taraf: Akış */}
                <div className="wizard-flow">
                    {/* Step 1: Duygu Durumu */}
                    <div className="wizard-step active" id="wizard-step-1">
                        <div className="step-counter" data-i18n="wizStep1">01 / 04</div>
                        <h2 data-i18n="wizQ1">Bugün hangi duygu durumunu giymek istersin?</h2>
                        <div className="options-list">
                            <button className="option-btn" onClick={() => { /* TODO: handle selectMood('Özgüven & Güç', 2) */ }}>
                                <i className="fas fa-crown"></i> <span data-i18n="mood1">Özgüven & Güç</span> <span className="mono-text" data-i18n="mood1Desc">(Oryantal/Deri)</span>
                            </button>
                            <button className="option-btn" onClick={() => { /* TODO: handle selectMood('Huzur & Sakinlik', 2) */ }}>
                                <i className="fas fa-feather-alt"></i> <span data-i18n="mood2">Huzur & Sakinlik</span> <span className="mono-text" data-i18n="mood2Desc">(Comfort Scents/Pamuk)</span>
                            </button>
                            <button className="option-btn" onClick={() => { /* TODO: handle selectMood('Enerji & Odaklanma', 2) */ }}>
                                <i className="fas fa-bolt"></i> <span data-i18n="mood3">Enerji & Odaklanma</span> <span className="mono-text" data-i18n="mood3Desc">(Narenciye/Taze)</span>
                            </button>
                        </div>
                        <div className="info-box">
                            <span data-i18n="wizInfo1"><strong>Nöro-Parfümeri:</strong> Kokular beyninizin limbik sistemini doğrudan tetikler. Seçtiğiniz tema, gün boyu modunuzu regüle edecektir.</span>
                        </div>
                    </div>

                    {/* Step 2: Koku Kütüphanesi */}
                    <div className="wizard-step" id="wizard-step-2">
                        <div className="step-counter" data-i18n="wizStep2">02 / 04</div>
                        <h2 data-i18n="wizQ2">Koku Kütüphanesi</h2>
                        <p className="mono-text" style={{ marginBottom: '1.5rem' }} data-i18n="wizQ2Sub">Notaları seçerek formülünüzü inşa edin. (Min. 3 nota)</p>

                        {/* Klinik Şeffaflık Notu */}
                        <div className="info-box" style={{ marginBottom: '1.5rem', borderLeftColor: 'var(--color-rose-gold)' }}>
                            <span data-i18n="wizInfo2"><strong>Klinik Şeffaflık & Vegan Moleküller:</strong> Laboratuvar hassasiyeti: Doğayı korumak ve kalıcılığı artırmak adına formülümüzde sürdürülebilir, vegan ve hipnotik koku moleküllerine (Iso E Super, Ambroxan) yer veriyoruz.</span>
                        </div>

                        {/* Üst Notalar */}
                        <h3 style={{ color: 'var(--color-copper)', fontSize: '1.1rem', marginTop: '1.5rem' }} data-i18n="noteTop">1. ÜST NOTALAR (İlk Merhaba)</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }} data-i18n="noteTopSub">Sıkıldığı an duyulan ferahlatıcı kokulardır. Beyninizi anında canlandırır.</p>
                        <div className="library-grid">
                            <div className="note-card" onClick={() => { /* TODO: handle toggleNote(this, 'Bergamot', 'top', 'rgba(255, 204, 0, 0.8)', 0) */ }}><span data-i18n="noteTop1">Bergamot</span> <span className="note-type">Narenciye</span></div>
                            <div className="note-card" onClick={() => { /* TODO: handle toggleNote(this, 'Limon & Mandalina', 'top', 'rgba(255, 220, 0, 0.8)', 0) */ }}>Limon & Mand. <span className="note-type">Narenciye</span></div>
                            <div className="note-card" onClick={() => { /* TODO: handle toggleNote(this, 'Nane & Okaliptüs', 'top', 'rgba(152, 251, 152, 0.8)', 0) */ }}>Nane & Oka. <span className="note-type">Ferah/Yeşil</span></div>
                            <div className="note-card" onClick={() => { /* TODO: handle toggleNote(this, 'Yeşil Çay & Adaçayı', 'top', 'rgba(143, 188, 143, 0.8)', 0) */ }}>Yeşil Çay <span className="note-type">Aromatik</span></div>
                            <div className="note-card" onClick={() => { /* TODO: handle toggleNote(this, 'Armut & P.Greyfurt', 'top', 'rgba(255, 182, 193, 0.8)', -1) */ }}>Armut/Greyfurt <span className="note-type">Hafif Meyvemsi</span></div>
                            <div className="note-card" onClick={() => { /* TODO: handle toggleNote(this, 'Ozonik & Denizel', 'top', 'rgba(173, 216, 230, 0.8)', 0) */ }}>Deniz Tuzu/Yağmur <span className="note-type">Ozonik/Aquatic</span></div>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }} data-i18n="noteTopDesc">*Ozonik & Denizel: Fırtınalı bir deniz kıyısı veya yağmur sonrası orman gibi. Fütüristik ve ferah bir açılış.</p>

                        {/* Orta Notalar */}
                        <h3 style={{ color: 'var(--color-copper)', fontSize: '1.1rem', marginTop: '1.5rem' }} data-i18n="noteMid">2. ORTA NOTALAR (Parfümün Kalbi)</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }} data-i18n="noteMidSub">Ana temayı belirleyen katmandır. Çevrenizdekilerin sizden alacağı imza kokudur.</p>
                        <div className="library-grid">
                            <div className="note-card" onClick={() => { /* TODO: handle toggleNote(this, 'Yasemin & Gül', 'mid', 'rgba(255, 105, 180, 0.8)', -2) */ }}><span data-i18n="noteMid1">Yasemin & Gül</span> <span className="note-type">Çiçeksi</span></div>
                            <div className="note-card" onClick={() => { /* TODO: handle toggleNote(this, 'Lavanta & P.Çiçeği', 'mid', 'rgba(230, 230, 250, 0.8)', -1) */ }}>Lavanta & P.Çiç. <span className="note-type">Çiçeksi</span></div>
                            <div className="note-card" onClick={() => { /* TODO: handle toggleNote(this, 'Karabiber & P.Biber', 'mid', 'rgba(169, 169, 169, 0.8)', 1) */ }}>Karabiber <span className="note-type">Baharatlı</span></div>
                            <div className="note-card" onClick={() => { /* TODO: handle toggleNote(this, 'Tarçın & Karanfil', 'mid', 'rgba(210, 105, 30, 0.8)', 1) */ }}><span data-i18n="noteMid4">Tarçın & Karanfil</span> <span className="note-type">Oryantal</span></div>
                            <div className="note-card" onClick={() => { /* TODO: handle toggleNote(this, 'İncir Y. & F.Üzümü', 'mid', 'rgba(128, 0, 128, 0.8)', -1) */ }}>İncir & Üzüm <span className="note-type">Modern Meyve</span></div>
                            <div className="note-card" onClick={() => { /* TODO: handle toggleNote(this, 'Savory & Gourmand', 'mid', 'rgba(139, 69, 19, 0.8)', 0) */ }}>Kavrulmuş Kahve <span className="note-type">Savory/Gurme</span></div>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }} data-i18n="noteMidDesc">*Savory & Gourmand: Kahve, sıcak süt, tuzlu karamel. Bağımlılık yapıcı gurme sıcaklık.</p>

                        {/* Alt Notalar */}
                        <h3 style={{ color: 'var(--color-copper)', fontSize: '1.1rem', marginTop: '1.5rem' }} data-i18n="noteBase">3. ALT NOTALAR (Gövde ve Zemin)</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }} data-i18n="noteBaseSub">Kalıcılığı ve yayılımı sağlayan katmandır. Teninizle bütünleşir.</p>
                        <div className="library-grid">
                            <div className="note-card" onClick={() => { /* TODO: handle toggleNote(this, 'Sedir Ağacı', 'base', 'rgba(101, 67, 33, 0.8)', 2) */ }}><span data-i18n="noteBase1">Sedir Ağacı</span> <span className="note-type">Odunsu</span></div>
                            <div className="note-card" onClick={() => { /* TODO: handle toggleNote(this, 'Paçuli & Vetiver', 'base', 'rgba(85, 107, 47, 0.8)', 2) */ }}><span data-i18n="noteBase2">Paçuli & Vetiver</span> <span className="note-type">Toprak/Mistik</span></div>
                            <div className="note-card" onClick={() => { /* TODO: handle toggleNote(this, 'Amber & Vanilya', 'base', 'rgba(255, 200, 0, 0.8)', -1) */ }}><span data-i18n="noteBase3">Amber & Vanilya</span> <span className="note-type">Oryantal</span></div>
                            <div className="note-card" onClick={() => { /* TODO: handle toggleNote(this, 'Oud & Deri', 'base', 'rgba(50, 20, 10, 0.8)', 2) */ }}><span data-i18n="noteBase4">Oud & Deri</span> <span className="note-type">Sessiz Lüks</span></div>
                            <div className="note-card" onClick={() => { /* TODO: handle toggleNote(this, &apos;Comfort Scents&apos;, 'base', 'rgba(240, 248, 255, 0.8)', 0) */ }}>Pamuk & Keten <span className="note-type">Comfort/Huzur</span></div>
                            <div className="note-card" onClick={() => { /* TODO: handle toggleNote(this, 'Sentetik Moleküller', 'base', 'rgba(255, 255, 255, 0.5)', 0) */ }}>Iso E Super / Ambroxan <span className="note-type">Sentetik/Vegan</span></div>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }} data-i18n="noteBaseDesc1">*Comfort Scents: Temizlik, çocukluk ve saf huzur hissi (Beyaz Sabun, Pirinç Tozu).</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontStyle: 'italic', marginBottom: '1.5rem' }} data-i18n="noteBaseDesc2">*Iso E Super & Ambroxan: Tene göre koku değiştiren, kalıcılığı zirveye taşıyan inovatif vegan moleküller.</p>
                        
                        <div className="gender-bar-container">
                            <p className="mono-text" style={{ textAlign: 'center', fontSize: '0.85rem', marginBottom: '0.8rem', color: 'var(--color-copper)' }} data-i18n="genderAnal">Cinsiyetsiz (Unisex) Akıllı Eşleştirme Analizi</p>
                            <div className="gender-labels">
                                <span className="mono-text" style={{ fontSize: '0.75rem' }} data-i18n="fem">Feminen</span>
                                <span className="mono-text" style={{ fontSize: '0.75rem', color: 'var(--color-copper)' }} data-i18n="uni">Unisex</span>
                                <span className="mono-text" style={{ fontSize: '0.75rem' }} data-i18n="mas">Maskülen</span>
                            </div>
                            <div className="gender-track">
                                <div className="gender-indicator" id="gender-indicator"></div>
                            </div>
                        </div>

                        <div className="formula-stats">
                            <div className="stat-item">
                                <span className="stat-label" data-i18n="statTop">Üst Nota</span>
                                <span className="stat-value mono-text" id="stat-top">0%</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label" data-i18n="statMid">Orta Nota</span>
                                <span className="stat-value mono-text" id="stat-mid">0%</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label" data-i18n="statBase">Alt Nota</span>
                                <span className="stat-value mono-text" id="stat-base">0%</span>
                            </div>
                        </div>
                        
                        <div className="info-box">
                            <span data-i18n="wizInfo3"><strong>Aktif Formül Oranları:</strong> İdeal bir piramit %30 Üst, %50 Orta, %20 Alt nota dengesidir. Otomatik stabilizasyon sistemi formülünüzü mükemmelleştirecektir.</span>
                        </div>

                        <div className="wizard-actions">
                            <button className="btn btn-outline" onClick={() => { /* TODO: handle nextWizardStep(1) */ }} data-i18n="btnBack">Geri</button>
                            <button className="btn btn-outline" onClick={() => { /* TODO: handle nextWizardStep(3) */ }} id="btn-to-step-3" disabled>İleri: Scent Stacking</button>
                        </div>
                    </div>

                    {/* Step 3: Yoğunluk */}
                    <div className="wizard-step" id="wizard-step-3">
                        <div className="step-counter" data-i18n="wizStep3">03 / 04</div>
                        <h2 data-i18n="wizQ3">Scent Stacking</h2>
                        <p className="mono-text" data-i18n="wizQ3Sub">Konsantrasyon ve Yayılım (Sillage)</p>
                        
                        <div className="slider-container">
                            <div className="slider-labels">
                                <span className="mono-text" data-i18n="edt">EDT (Hafif)</span>
                                <span className="mono-text" data-i18n="edp">EDP (Yoğun)</span>
                            </div>
                            <input type="range" min="1" max="100" value="50" className="intensity-slider" id="intensitySlider" onInput={() => {}}/>
                        </div>

                        <div className="info-box" id="intensity-info" data-i18n="wizInfo4">
                            Formülünüz %15-%20 saf esans konsantrasyonu ile Eau de Parfum (EDP) olarak seyreltiliyor. Bu, kokunuzun arkasında unutulmaz bir iz (sillage) bırakmasını sağlayacak.
                        </div>
                        
                        <div className="wizard-actions">
                            <button className="btn btn-outline" onClick={() => { /* TODO: handle nextWizardStep(2) */ }} data-i18n="btnBack">Geri</button>
                            <button className="btn btn-primary" onClick={() => { /* TODO: handle generateSummary() */ }} data-i18n="btnToLab">Laboratuvara Gönder</button>
                        </div>
                    </div>

                    {/* Step 4: Kontrol Paneli */}
                    <div className="wizard-step" id="wizard-step-4">
                        <div className="step-counter" data-i18n="wizStep4">04 / 05</div>
                        <h2 data-i18n="wizQ4">Kontrol Paneli</h2>
                        <img src="assets/final-bottle.png" alt="Pien Luxury Parfum" className="final-bottle-display" style={{ width: '100%', maxWidth: '400px', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.8)', objectFit: 'cover', margin: '1rem auto', display: 'block' }}/>
                        <p data-i18n="wizQ4Sub">Lütfen siparişi onaylamadan önce formül dökümünüzü kontrol edin.</p>
                        
                        <div className="control-panel-receipt">
                            <div className="receipt-header">
                                <span className="mono-text" data-i18n="recHead">PIEN LAB. RAPORU</span>
                                <span className="mono-text" id="receipt-date"></span>
                            </div>
                            <div className="receipt-body">
                                <div className="receipt-row">
                                    <span className="r-label" data-i18n="recCon">Konsept:</span>
                                    <span className="r-value" id="receipt-mood">Özgüven & Güç</span>
                                </div>
                                <div className="receipt-row">
                                    <span className="r-label" data-i18n="recInt">Konsantrasyon:</span>
                                    <span className="r-value" id="receipt-intensity">EDP</span>
                                </div>
                                <div className="receipt-notes">
                                    <span className="r-label" data-i18n="recEss">Seçilen Esanslar:</span>
                                    <ul id="receipt-notes-list" className="mono-text">
                                        {/* JS ile dolacak */}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div className="delivery-info info-box" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                            <i className="fas fa-truck" style={{ color: 'var(--color-copper)', fontSize: '1.5rem', marginBottom: '10px' }}></i>
                            <p style={{ margin: '0', fontSize: '0.9rem' }} data-i18n="delivInfo">Ürün tarafımızdan özenle hazırlanıp <strong>ortalama 2 gün içinde</strong> şişelenip kargolanacaktır.</p>
                            <h3 style={{ color: 'var(--color-copper)', marginTop: '10px' }} data-i18n="delivTotal">Toplam: 2500 TL</h3>
                        </div>

                        <div className="wizard-actions">
                            <button className="btn btn-outline" onClick={() => { /* TODO: handle nextWizardStep(3) */ }} data-i18n="btnBack">Geri</button>
                            <button className="btn btn-primary" onClick={() => { /* TODO: handle nextWizardStep(5) */ }} data-i18n="btnNextOrder">İleri: Sipariş Onayı</button>
                        </div>
                    </div>

                    {/* Step 5: Müşteri Formu */}
                    <div className="wizard-step" id="wizard-step-5">
                        <div className="step-counter" data-i18n="wizStep5">05 / 05</div>
                        <h2 data-i18n="wizQ5">Sipariş Onayı</h2>
                        <img src="assets/final-bottle.png" alt="Pien Luxury Parfum" className="final-bottle-display" style={{ width: '100%', maxWidth: '400px', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.8)', objectFit: 'cover', margin: '1rem auto', display: 'block' }}/>
                        <p data-i18n="wizQ5Sub">Lütfen gönderim bilgilerinizi doldurun.</p>
                        
                        <div className="info-box" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                            <strong data-i18n="reorderCode">Tekrar Sipariş Kodunuz:</strong> <br />
                            <span id="reorder-code" className="mono-text" style={{ fontSize: '1.2rem', color: 'var(--color-copper)' }}></span>
                            <br /><span style={{ fontSize: '0.8rem' }} data-i18n="reorderSub">Bu kodu saklayarak formülünüzü dilediğiniz zaman tekrar ürettirebilirsiniz.</span>
                        </div>

                        <div className="form-container">
                            <div className="form-group">
                                <label data-i18n="formName">Ad Soyad</label>
                                <input type="text" id="order-name" placeholder="Adınız Soyadınız" data-i18n="formNamePl" required/>
                            </div>
                            <div className="form-group">
                                <label data-i18n="formPhone">Telefon</label>
                                <input type="tel" id="order-phone" placeholder="05XX XXX XX XX" data-i18n="formPhonePl" required/>
                            </div>
                            <div className="form-group">
                                <label data-i18n="formAddr">Teslimat Adresi</label>
                                <textarea id="order-address" rows={3} placeholder="Açık adresinizi giriniz..." data-i18n="formAddrPl" required></textarea>
                            </div>
                        </div>

                        <div className="wizard-actions">
                            <button className="btn btn-outline" onClick={() => { /* TODO: handle nextWizardStep(4) */ }} data-i18n="btnBack">Geri</button>
                            <button className="btn btn-primary" onClick={() => { /* TODO: handle submitOrder() */ }} data-i18n="btnSubmit">Siparişi Onayla</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
  );
}