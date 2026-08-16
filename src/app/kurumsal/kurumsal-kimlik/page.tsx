export const metadata = {
  title: 'Kurumsal Kimlik | PN Parfüm',
  description: 'PN Parfüm marka vizyonu, misyonu ve kurumsal varlıkları.',
}

export default function KurumsalKimlikPage() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-light mb-8 text-accent-gold">Hakkımızda</h2>
        
        <div className="space-y-8 text-foreground/70 leading-relaxed font-light">
          <p className="text-lg text-foreground font-medium italic">
            "Koku, hafızanın en derin odalarına açılan görünmez bir anahtardır. Bizim için bir parfüm, yalnızca esansların birleşiminden ibaret değil; teninizde yaşayan, sizi sarmalayan ve gün boyu sizinle nefes alan hipnotik bir duygu durum mimarisidir."
          </p>

          <p>
            PN Parfume felsefesinin merkezinde, beklentilerin ötesine geçme tutkusu yatar. Çeyrek asra yaklaşan (20 yıllık) üretim mirasımızı modern nöro-parfümeri ile harmanlıyor, sıradan bir alışkanlığı eşsiz bir ritüele dönüştürüyoruz. Şişelerimizin içine hapsettiğimiz her bir damla, kalıcılık ve tutarlılık vaadimizin kusursuz bir yansımasıdır.
          </p>

          <div className="bg-foreground/5 p-8 rounded-3xl border border-foreground/10 my-10">
            <h3 className="text-xl font-medium mb-4 text-foreground">Klinik Şeffaflık ve Sürdürülebilir Simya</h3>
            <p className="mb-4">
              Bizler sadece koku tasarlamıyor, doğaya, insana ve teknik emniyete saygı duyan bir güven ekosistemi inşa ediyoruz. Gelişmiş laboratuvarlarımızda, dünyanın en seçkin doğal özleri ile inovatif koku moleküllerini bir araya getiriyoruz.
            </p>
            <p>
              Bu eşsiz simya, <strong>IFRA (Uluslararası Koku Birliği)</strong> ve <strong>Avrupa Birliği Kozmetik regülasyonlarının</strong> titiz standartlarıyla filtrelenir. Tüketicimizi bilinçlendirmeyi ve gezegenimizi korumayı odağımıza alan Entegre Yönetim Sistemimiz, sürdürülebilir kusursuzluğa olan sarsılmaz inancımızın kanıtıdır.
            </p>
          </div>

          <h3 className="text-xl font-medium mb-4 text-foreground mt-8">Sınırları Aşan Frekans: Global Ekosistemimiz</h3>
          <p>
            PN Parfume olarak yarattığımız bu görünmez imza, sınırların ötesine uzanan bir frekansa dönüştü. Bugün, Avrupa dahil hem yurt içinde hem de yurt dışında sayısız noktada güçlü bayilik ve distribütörlük ağımızla ruhunuza dokunuyor; yenilikçi franchising sistemimizle bu karlı ekosisteme katılmak isteyen girişimcilere kapılarımızı açıyoruz.
          </p>

          <p className="text-lg text-accent-gold mt-6 font-medium">
            Amacımız; dünya standartlarındaki bu benzersiz koku deneyimini, kaliteden ödün vermeden, ruhunuzu eşsiz bir ahenkle saracak o 'doğru nota' ile buluşturmaktır.
          </p>
        </div>
      </div>

      <div className="border-t border-foreground/10 pt-10">
        <h3 className="text-2xl font-light mb-6">Marka Varlıkları (Brand Assets)</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 border border-foreground/10 rounded-2xl flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-foreground rounded-full mb-4 flex items-center justify-center shadow-lg">
              <span className="text-background font-serif text-2xl">PN</span>
            </div>
            <h4 className="font-medium mb-1">Birincil Logo</h4>
            <p className="text-xs text-foreground/50 mb-4">Siyah zemin veya açık zemin üzerinde standart kullanım.</p>
            <button className="text-xs font-medium text-accent-gold hover:underline">.PNG İndir</button>
          </div>

          <div className="p-6 border border-foreground/10 rounded-2xl flex flex-col items-center justify-center text-center bg-foreground">
            <div className="w-16 h-16 bg-accent-gold rounded-full mb-4 flex items-center justify-center shadow-lg">
              <span className="text-background font-serif text-2xl">PN</span>
            </div>
            <h4 className="font-medium mb-1 text-background">Altın Mühür</h4>
            <p className="text-xs text-background/50 mb-4">Özel davetiyeler ve premium sunumlar için.</p>
            <button className="text-xs font-medium text-accent-gold hover:underline">.SVG İndir</button>
          </div>
        </div>
      </div>

      <div className="border-t border-foreground/10 pt-10">
        <h3 className="text-lg font-medium mb-4">Renk Paleti</h3>
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="h-24 bg-foreground rounded-t-xl"></div>
            <div className="bg-background border border-t-0 border-foreground/10 p-3 rounded-b-xl text-center">
              <div className="text-xs font-medium">Obsidyen Siyah</div>
              <div className="text-[10px] text-foreground/50">#121212</div>
            </div>
          </div>
          <div className="flex-1">
            <div className="h-24 bg-[#D4AF37] rounded-t-xl"></div>
            <div className="bg-background border border-t-0 border-foreground/10 p-3 rounded-b-xl text-center">
              <div className="text-xs font-medium">İmza Altın</div>
              <div className="text-[10px] text-foreground/50">#D4AF37</div>
            </div>
          </div>
          <div className="flex-1">
            <div className="h-24 bg-[#FAFAFA] border border-b-0 border-foreground/10 rounded-t-xl"></div>
            <div className="bg-background border border-t-0 border-foreground/10 p-3 rounded-b-xl text-center">
              <div className="text-xs font-medium">Saf Beyaz</div>
              <div className="text-[10px] text-foreground/50">#FAFAFA</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
