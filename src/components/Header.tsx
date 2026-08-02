"use client";

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState('tr');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <div className="logo-container">
        <Link href="#home">
          <div className="brand-logo-pien copper-gradient-text">PIEN</div>
          <div className="brand-logo-sub">Olfactory Works</div>
        </Link>
      </div>
      
      <nav>
        <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <li style={{ marginRight: '1rem' }}>
            <select 
              id="lang-selector" 
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.5)', 
                color: 'var(--color-copper)', 
                border: '1px solid var(--color-copper)', 
                borderRadius: '4px', 
                padding: '4px 8px', 
                fontFamily: 'var(--font-mono)', 
                outline: 'none', 
                cursor: 'pointer'
              }}
            >
              <option value="tr">🇹🇷 TR</option>
              <option value="en">🇬🇧 EN</option>
              <option value="de">🇩🇪 DE</option>
              <option value="ru">🇷🇺 RU</option>
            </select>
          </li>
          <li><Link href="#home" className="active" onClick={() => setMobileMenuOpen(false)}>Ana Sayfa</Link></li>
          <li><Link href="#shop" onClick={() => setMobileMenuOpen(false)}>Koleksiyon</Link></li>
          <li><Link href="#sales-channels" onClick={() => setMobileMenuOpen(false)}>Satış Kanalları</Link></li>
          <li><Link href="#create-scent" onClick={() => setMobileMenuOpen(false)}>Kendi Kokunu Yarat</Link></li>
          <li><Link href="#build-brand" className="copper-gradient-text" style={{ fontWeight: 600 }} onClick={() => setMobileMenuOpen(false)}>Kendi Markanı Yarat</Link></li>
          <li><Link href="#digital-franchise" onClick={() => setMobileMenuOpen(false)}>Digital Bayilik</Link></li>
          <li><Link href="#about" onClick={() => setMobileMenuOpen(false)}>Hakkımızda</Link></li>
          <li><Link href="#contact" onClick={() => setMobileMenuOpen(false)}>İletişim</Link></li>
          <li><Link href="#admin" style={{ border: '1px solid var(--color-copper)', padding: '4px 10px', borderRadius: '4px', display: 'inline-block' }} onClick={() => setMobileMenuOpen(false)}>Admin</Link></li>
        </ul>
      </nav>

      <div className="header-actions">
        <button className="header-icon" id="header-cart-icon" title="Sepetim">
          <i className="fas fa-shopping-bag"></i>
          <span className="cart-count" id="cart-icon-count" style={{ display: 'none' }}>0</span>
        </button>
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>
    </header>
  );
}
