"use client";

import { useState } from "react";

export default function DigitalFranchise() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <section id="digital-franchise" className="page-section">
            <div className="split-section" style={{ alignItems: 'stretch' }}>
                
                {/* Sol Taraf: Anti-Gravity Tablet & Lojistik Ekosistemi */}
                <div className="split-image franchise-visuals">
                    <div className="franchise-light"></div>
                    <div className="floating-tablet">
                        <div className="tablet-screen">
                            <div className="brand-logo-pien copper-gradient-text" style={{ fontSize: '2rem', textAlign: 'center', marginTop: '30px' }}>pn</div>
                            <div className="mono-text" style={{ textAlign: 'center', fontSize: '0.8rem', letterSpacing: '4px' }}>PARFUM</div>
                            
                            {/* Yükselen Grafikler */}
                            <div className="sales-graphs">
                                <div className="bar" style={{ height: '30%' }}></div>
                                <div className="bar" style={{ height: '50%' }}></div>
                                <div className="bar" style={{ height: '40%' }}></div>
                                <div className="bar" style={{ height: '70%' }}></div>
                                <div className="bar" style={{ height: '90%' }}></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Yörüngede Dönen Objeler */}
                    <div className="orbit-item orbit-bottle">
                        <i className="fas fa-flask"></i>
                    </div>
                    <div className="orbit-item orbit-box">
                        <i className="fas fa-box"></i>
                    </div>
                    <div className="orbit-item orbit-node node-1"></div>
                    <div className="orbit-item orbit-node node-2"></div>
                    <div className="orbit-item orbit-node node-3"></div>
                </div>

                {/* Sağ Taraf: İkna Edici Metin Akışı */}
                <div className="split-content franchise-content" style={{ overflowY: 'auto', maxHeight: '80vh', paddingRight: '20px' }}>
                    
                    {/* 1. Hero Bölümü */}
                    <div className="franchise-hero">
                        <h2 data-i18n="franHeroH">Lojistiğin Ağırlığını Bize Bırakın, <br /><span className="copper-gradient-text">Siz Sadece Büyümeye Odaklanın.</span></h2>
                        <p style={{ fontSize: '1.1rem', color: '#ccc' }} data-i18n="franHeroP">Gelişmiş API entegrasyonumuz ve Küresel Operasyon Modelimiz ile dijital bayimiz olun. Depo yok, kargo sırası yok, operasyonel stres yok.</p>
                    </div>

                    {/* Bayi Giriş Portalı & B2B Sipariş Matrisi */}
                    <div className="b2b-login-box glass-panel" style={{ marginTop: '2.5rem', padding: '2rem', borderColor: 'rgba(228, 168, 114, 0.3)' }}>
                        {!isLoggedIn ? (
                          <>
                            <h3 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: 'var(--color-copper)' }} data-i18n="b2bTitle">B2B BAYİ PORTALI GİRİŞİ</h3>
                            <form onSubmit={(e)=>{e.preventDefault(); setIsLoggedIn(true);}}>
                                <div className="form-group" style={{ marginBottom: '1rem' }}>
                                    <label style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '5px', display: 'block' }} data-i18n="b2bUser">Bayi Kullanıcı Adı</label>
                                    <input type="text" placeholder="Kullanıcı Adı" required style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px' }}/>
                                </div>
                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '5px', display: 'block' }} data-i18n="b2bPass">Şifre</label>
                                    <input type="password" placeholder="••••••••" required style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px' }}/>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontFamily: 'var(--font-mono)', letterSpacing: '1px' }} data-i18n="b2bBtn">SİSTEME GİRİŞ YAP</button>
                            </form>
                          </>
                        ) : (
                          <>
                            <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: 'var(--color-copper)' }}>TOPTAN SİPARİŞ MATRİSİ (B2B)</h3>
                            <p style={{ fontSize: '0.85rem', color: '#ccc', marginBottom: '1.5rem' }}>Hoş geldiniz, Bayi. Size özel uygulanan iskonto: <strong style={{ color: 'var(--color-copper)' }}>%30</strong></p>
                            <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <thead>
                                  <tr style={{ borderBottom: '1px solid rgba(228, 168, 114, 0.5)' }}>
                                    <th style={{ padding: '8px' }}>Ürün Kodu</th>
                                    <th style={{ padding: '8px' }}>Ürün Adı</th>
                                    <th style={{ padding: '8px' }}>Toptan Fiyat</th>
                                    <th style={{ padding: '8px' }}>Sipariş Adedi</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <td style={{ padding: '8px', color: '#888' }}>EDP-101</td>
                                    <td style={{ padding: '8px' }}>Premium Parfüm (50ml)</td>
                                    <td style={{ padding: '8px', color: 'var(--color-copper)' }}>623 TL</td>
                                    <td style={{ padding: '8px' }}><input type="number" min="0" placeholder="0" style={{ width: '60px', padding: '4px', background: 'rgba(0,0,0,0.5)', border: '1px solid #555', color: '#fff' }} /></td>
                                  </tr>
                                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <td style={{ padding: '8px', color: '#888' }}>TST-101</td>
                                    <td style={{ padding: '8px' }}>Tester Parfüm (5ml)</td>
                                    <td style={{ padding: '8px', color: 'var(--color-copper)' }}>45 TL</td>
                                    <td style={{ padding: '8px' }}><input type="number" min="0" placeholder="0" style={{ width: '60px', padding: '4px', background: 'rgba(0,0,0,0.5)', border: '1px solid #555', color: '#fff' }} /></td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Min. Sipariş: 10 Adet</div>
                              <button className="btn btn-primary" style={{ padding: '8px 16px' }}>Toplu Sepete Ekle</button>
                            </div>
                          </>
                        )}
                    </div>

                    {/* 2. Model Seçimi */}
                    <div className="franchise-models" style={{ marginTop: '3rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: 'var(--color-copper)' }} data-i18n="franModH">MODEL SEÇİMİ: İŞLETMENİZE EN UYGUN YAPIYI KURUN</h3>
                        
                        {/* Tip 1 */}
                        <div className="model-card glass-panel" style={{ padding: '1.5rem' }}>
                            <h4 style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span data-i18n="mod1T">TİP 1: Kendi Stoğunu Yönetenler</span>
                                <span className="badge" style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontFamily: 'var(--font-mono)' }} data-i18n="mod1B">GELENEKSEL</span>
                            </h4>
                            <p style={{ fontSize: '0.95rem' }} data-i18n="mod1P">Ürünlerini kendi deposunda tutmak ve operasyonunu kendi yönetmek isteyen güçlü satıcılar için tasarlanmıştır.</p>
                        </div>

                        {/* Tip 2 */}
                        <div className="model-card glass-panel" style={{ marginTop: '1.5rem', padding: '1.5rem', borderColor: 'var(--color-copper)', boxShadow: '0 0 20px rgba(228, 168, 114, 0.1)' }}>
                            <h4 style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-copper)' }}>
                                <span data-i18n="mod2T">TİP 2: Uçtan Uca Lojistik</span>
                                <span className="badge copper-bg" style={{ fontSize: '0.7rem', background: 'var(--color-copper)', color: '#000', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }} data-i18n="mod2B">DROPSHIPPING</span>
                            </h4>
                            <p style={{ fontSize: '0.95rem' }} data-i18n="mod2P">Fiziki stok yükü, depo yönetimi ve muhafazası tamamen bizim tarafımızdan sağlanır. E-ticaret platformlarından gelen siparişleriniz doğrudan fabrikamızdan ambalajlanır ve kargoya verilir.</p>
                            <ul className="model-features" style={{ marginTop: '1rem', listStyle: 'none', padding: '0' }}>
                                <li style={{ marginBottom: '10px', fontSize: '0.9rem' }}><i className="fas fa-check" style={{ color: 'var(--color-copper)', marginRight: '10px' }}></i> <strong>Sermaye & Stok:</strong> Başlangıçta asgari 2.400 adetlik stok yatırımı.</li>
                                <li style={{ marginBottom: '10px', fontSize: '0.9rem' }}><i className="fas fa-check" style={{ color: 'var(--color-copper)', marginRight: '10px' }}></i> <strong>Şeffaf Maliyet:</strong> Hazırlanan her sipariş paketi için yalnızca <strong>5,00 TL</strong> operasyon bedeli.</li>
                                <li style={{ fontSize: '0.9rem' }}><i className="fas fa-check" style={{ color: 'var(--color-copper)', marginRight: '10px' }}></i> <strong>İade & Kalite Kontrol:</strong> İade süreçleri aynı şeffaflıkla yönetilir.</li>
                            </ul>
                        </div>
                    </div>

                    {/* 3. Güven ve Koruma */}
                    <div className="franchise-trust" style={{ marginTop: '3rem', padding: '2rem', background: 'rgba(228, 168, 114, 0.05)', borderLeft: '4px solid var(--color-copper)', borderRadius: '0 8px 8px 0' }}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}><i className="fas fa-shield-alt" style={{ color: 'var(--color-copper)', marginRight: '10px' }}></i><span data-i18n="franTrustH">Güven ve Koruma</span></h3>
                        <p style={{ marginBottom: '0', fontSize: '0.95rem', lineHeight: '1.6' }} data-i18n="franTrustP"><strong>Fiyat İstikrarı ve Marka Koruması:</strong> Algoritmaların sizi ezmesine izin vermiyoruz. Belirlenen <em>&quot;Tavsiye Edilen Son Tüketici Satış Fiyatının&quot;</em> <strong>%20&apos;sinden daha aşağıya satış yapılmasına kesinlikle müsaade edilmez.</strong> Bu sayede tüm bayilerimiz haksız rekabetten korunur ve kar marjları garanti altına alınır.</p>
                    </div>

                </div>
            </div>
        </section>
  );
}