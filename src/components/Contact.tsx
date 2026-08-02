"use client";

export default function Contact() {
  return (
    <section id="contact" className="page-section">
            <div className="section-header">
                <h2 data-i18n="contactUs">Bize Ulaşın</h2>
            </div>
            <div className="container split-section" style={{ alignItems: 'flex-start' }}>
                <div className="split-content" style={{ paddingRight: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
                        <h3 style={{ color: 'var(--color-copper)', marginBottom: '1.5rem', fontSize: '1.5rem' }} data-i18n="contMerkez">Merkez Ofis & Fabrika</h3>
                        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <i className="fas fa-map-marker-alt" style={{ fontSize: '1.5rem', color: 'var(--color-copper)', marginTop: '5px', width: '40px' }}></i>
                            <span style={{ lineHeight: '1.6' }}>Mimar Sinan Mah. 9. Cadde No: 12<br/>Silivri / İstanbul, Türkiye</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <i className="fas fa-phone-alt" style={{ fontSize: '1.5rem', color: 'var(--color-copper)', width: '40px' }}></i>
                            <span>+90 (212) 555 00 00</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <i className="fas fa-envelope" style={{ fontSize: '1.5rem', color: 'var(--color-copper)', width: '40px' }}></i>
                            <span>info@pienparfume.com.tr</span>
                        </div>
                    </div>
                    
                    {/* Google Maps Embed */}
                    <div style={{ marginTop: '2rem', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3007.82869408665!2d28.2575!3d41.0719!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b55f0000000000%3A0x0!2sMimar%20Sinan%2C%209.%20Cd.%2C%2034570%20Silivri%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1680000000000!5m2!1str!2str" width="100%" height="250" style={{ border: '0', filter: 'invert(90%) hue-rotate(180deg) contrast(80%)' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>
                <div className="glass-panel form-container" style={{ padding: '2.5rem', width: '100%' }}>
                    <form onSubmit={() => alert('Mesajınız gönderildi!')}>
                        <div className="form-group">
                            <input type="text" placeholder="Adınız" required/>
                        </div>
                        <div className="form-group">
                            <input type="email" placeholder="E-Posta Adresiniz" required/>
                        </div>
                        <div className="form-group">
                            <input type="tel" placeholder="Telefon Numaranız"/>
                        </div>
                        <div className="form-group">
                            <select>
                                <option value="" disabled selected>Konu Seçiniz</option>
                                <option value="bayilik">Bayilik ve Franchise Başvurusu</option>
                                <option value="siparis">Sipariş ve Teslimat</option>
                                <option value="kurumsal">Kurumsal Satış (B2B)</option>
                                <option value="diger">Diğer</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <textarea rows={5} placeholder="Mesajınız..." required></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem', letterSpacing: '2px' }} data-i18n="contSend">GÖNDER</button>
                    </form>
                </div>
            </div>
        </section>
  );
}