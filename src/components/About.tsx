export default function About() {
  return (
    <section id="about" className="page-section">
      <div className="section-header" style={{ maxWidth: '900px' }}>
        <h2 style={{ fontSize: '2.5rem' }} data-i18n="abH">
          Mükemmelliğin Sessiz Yankısı: <br /><span className="copper-gradient-text" style={{ fontSize: '3rem' }}>Pien Olfactory Works</span>
        </h2>
      </div>
      <div className="glass-panel" style={{ padding: '4rem', maxWidth: '900px', margin: '0 auto', textAlign: 'left' }}>
        <img src="assets/pien-logo.png" alt="Pien Parfume Logo" style={{ display: 'block', maxWidth: '250px', margin: '0 auto 2.5rem auto' }}/>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--color-text-main)', fontStyle: 'italic', borderLeft: '3px solid var(--color-copper)', paddingLeft: '15px' }} data-i18n="abQ">
          &quot;Koku, hafızanın en derin odalarına açılan görünmez bir anahtardır. Bizim için bir parfüm, yalnızca esansların birleşiminden ibaret değil; teninizde yaşayan, sizi sarmalayan ve gün boyu sizinle nefes alan hipnotik bir duygu durum mimarisidir.&quot;
        </p>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: '1.8' }} data-i18n="abP1">
          Pien Parfume felsefesinin merkezinde, beklentilerin ötesine geçme tutkusu yatar. Çeyrek asra yaklaşan üretim mirasımızı modern nöro-parfümeri ile harmanlıyor, sıradan bir alışkanlığı eşsiz bir ritüele dönüştürüyoruz. Şişelerimizin içine hapsettiğimiz her bir damla, kalıcılık ve tutarlılık vaadimizin kusursuz bir yansımasıdır.
        </p>

        <h3 style={{ color: 'var(--color-copper)', marginBottom: '1rem', fontSize: '1.3rem' }} data-i18n="abH2">Klinik Şeffaflık ve Sürdürülebilir Simya</h3>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', lineHeight: '1.8' }} data-i18n="abP2">
          Bizler sadece koku tasarlamıyor, doğaya, insana ve teknik emniyete saygı duyan bir güven ekosistemi inşa ediyoruz. Gelişmiş laboratuvarlarımızda, dünyanın en seçkin doğal özleri ile inovatif koku moleküllerini bir araya getiriyoruz.
        </p>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: '1.8' }} data-i18n="abP3">
          Bu eşsiz simya, IFRA (Uluslararası Koku Birliği) ve Avrupa Birliği Kozmetik regülasyonlarının titiz standartlarıyla filtrelenir. Tüketicimizi bilinçlendirmeyi ve gezegenimizi korumayı odağımıza alan Entegre Yönetim Sistemimiz, sürdürülebilir kusursuzluğa olan sarsılmaz inancımızın kanıtıdır.
        </p>

        <h3 style={{ color: 'var(--color-copper)', marginBottom: '1rem', fontSize: '1.3rem' }} data-i18n="abH3">Sınırları Aşan Frekans: Global Ekosistemimiz</h3>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', lineHeight: '1.8' }} data-i18n="abP4">
          Pien Parfume olarak yarattığımız bu görünmez imza, sınırların ötesine uzanan bir frekansa dönüştü. Bugün, hem yurt içinde hem de yurt dışında güçlü bayilik ve distribütörlük ağımızla ruhunuza dokunuyor; yenilikçi franchising sistemimizle bu karlı ekosisteme katılmak isteyen girişimcilere kapılarımızı açıyoruz.
        </p>
        <p style={{ color: 'var(--color-text-main)', fontWeight: 'bold', lineHeight: '1.8' }} data-i18n="abP5">
          Amacımız; dünya standartlarındaki bu benzersiz koku deneyimini, kaliteden ödün vermeden, ruhunuzu eşsiz bir ahenkle saracak o &quot;doğru nota&quot; ile buluşturmaktır.
        </p>
      </div>
    </section>
  );
}