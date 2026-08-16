export const metadata = {
  title: 'Kurumsal Kimlik | PN Parfüm',
  description: 'PN Parfüm marka vizyonu, misyonu ve kurumsal varlıkları.',
}

export default function KurumsalKimlikPage() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-light mb-4 text-accent-gold">Hakkımızda & Kurumsal Kimlik</h2>
        <p className="text-foreground/70 leading-relaxed mb-6">
          Güzellik ve kozmetik endüstrisinde parfüme olan yaklaşımı kökünden değiştirmek için kurulduk. Bizler; parfümü yalnızca güzel kokan bir sıvı olarak değil, insanın duygu dünyasını yöneten, bilinçaltıyla iletişim kuran biyokimyasal bir sanat eseri olarak görüyoruz.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-medium mb-3">Vizyonumuz</h3>
          <p className="text-foreground/70 text-sm leading-relaxed p-6 bg-background rounded-2xl border border-foreground/10">
            Klasik koku notalarının sınırlarını aşarak, parfüm endüstrisini "Nöropazarlama" ve "Biyokimya" temelleri üzerine yeniden inşa etmek. Tüm dünyada, kişilerin sadece kokularıyla bile karşılarındakine istedikleri duyguyu (güven, cazibe, otorite) aktarabildikleri farkındalıklı bir koku kültürü yaratmak.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-medium mb-3">Misyonumuz</h3>
          <p className="text-foreground/70 text-sm leading-relaxed p-6 bg-background rounded-2xl border border-foreground/10">
            Tüketicileri ezberletilmiş marka illüzyonlarından kurtarmak. Şeffaf, bilimsel olarak kanıtlanmış (termodinamik difüzyon analizleriyle) ve yüksek performanslı ürünleri, ulaşılabilir lüks konseptinde sunmak. Akıllı algoritmalarımız sayesinde herkesin ten kimyasına en uygun "imza kokuyu" bulmasını sağlamak.
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
