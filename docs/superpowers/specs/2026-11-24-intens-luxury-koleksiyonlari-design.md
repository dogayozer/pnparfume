# Intens ve Luxury koleksiyonları — tasarım (kısa)

Tarih: 2026-11-24. Durum: ONAY BEKLİYOR (kod yazılmadı).

## Amaç
pnparfume.com'a iki yeni koleksiyon eklemek: **Pien Intens** (81 ürün, 749 TL, 60 ml, EDP, yoğun esans) ve **Pien Luxury** (14 ürün, 2300 TL, 100 ml, Extrait de Parfum). Kaynak: `C:\pnio\yeni resim üretme\lux\pnparfume_koleksiyon_aktarim.xlsx` (Sosyal medya oturumu hazırladı).

## Sahip kararları (konuşmadan)
- Intens hacmi **60 ml**. Luxury **100 ml**.
- SKU = müşteriye görünen ad. Intens: `Pien Intens <kod>` (örn. `Pien Intens RX54`, `Pien Intens 558`). Luxury: `Pien LUX <harf> <sayı>` (örn. `Pien LUX M 13`, `Pien LUX W 12`, `Pien LUX UNI 7`) — harf grubu önce, sayı sonra, aralarında boşluk.
- Fiyatlar sabit: Intens 749, Luxury 2300 (hepsinde aynı).
- LUX 11 M (bilgi/görsel eksik) dahil değil. Barkodlar çalışma numarası (868199 serisi), sitede barkod olarak GÖSTERİLMEZ. Gerçek ilham markası hiçbir yerde yok (Excel'de de yok).
- Görselleri sahibi `parfumtasarla.com/intens/` ve `/lux/` altına yükler; ben yüklemem. Kodlama/aktarım hazırlığı bende; canlıya push ve DB yazımı ayrı onayla.

## Yaklaşımlar
Tek mantıklı yol (Pien/Creative'in kurduğu düzen): koleksiyon, SKU önekiyle `collections.ts` kaydına eklenir, veritabanı şeması değişmez; ürünler Pien aktarım script'i gibi bir betikle yazılır. Alternatif (yeni `collection` sütunu + migrasyon) hem şema değişikliği hem canlı DB riski getirir, kazanç yok → seçilmedi.

## Tasarım
1. **`src/lib/collections.ts`:** iki yeni kayıt: `pien-intens` (önek `Pien Intens `), `pien-luxury` (önek `Pien LUX `), `labelPrefix: ''`, marka `Pien Parfum`. **Önek çakışması düzeltmesi:** mevcut `pien` koleksiyonu `Pien ` önekiyle "Pien Intens …" ve "Pien LUX …" ürünlerini de yakalar. Çözüm: `getCollectionBySku` en uzun eşleşen öneki seçer; `collectionScope` / Pien ürün sayımı daha uzun öneklileri (`Pien Creative`/`CS-` dahil) hariç tutar. Birim testi: `Pien M 1`→pien, `Pien Intens RX54`→pien-intens, `Pien LUX M 13`→pien-luxury, `CS-…`→pien-creative.
2. **Sayfalar/filtre:** `/koleksiyonlar/pien-intens` ve `/pien-luxury` mevcut dinamik rotadan gelir; sol filtre "Koleksiyonlar" grubu, katalog/ana sayfa karışık dizilim, sitemap, açıklama metinleri `collections.ts`'ten. Vurgu mesajları (Excel "Koleksiyonlar" sayfası: yoğun esans %25…, Luxury %30'a kadar esans, özel formül) koleksiyon açıklamasına, sahibin metniyle.
3. **Aktarım betiği** `scripts/import_intens_luxury.ts` (`import_pien_series.ts` kalıbı: varsayılan kuru çalıştırma, `--check` salt-okunur çakışma kontrolü, `--apply` yazar; `DATABASE_URL` yoksa hata, `.env` okumaz): Excel'den `Product` (barkod saklanır ama gösterilmez, `original_name = seo_name = SKU`, Excel notaları/etiketleri; Excel'de olmayan skorlar için Pien'deki varsayılanlar) + `MarketplaceListing(trendyol)` (fiyat 749/2300, `marketPrice` boş, 3 görsel URL'si `http://parfumtasarla.com/...` biçimine çevrilir). Luxury SKU'su Excel'deki `LUX 13 M` → `Pien LUX M 13` biçimine dönüştürülür (`LUX 12 W`→`Pien LUX W 12`, `LUX 7 UNI`→`Pien LUX UNI 7`). Barkod ve SKU çakışmasında durur; yalnızca bu iki koleksiyonun ürünlerine dokunur. Vitrin (`is_featured`): şimdilik yok; sahibi isterse eklenir.
4. **Ürün sayfası — benim kararım (itiraz edebilirsiniz):** bu iki koleksiyonda hazır, sabit hacimli ürün satıldığı için "özelleştirme paneli" (EDP/Extrait +200 TL, şişe seçenekleri) ve "Bana mix'le" düğmesi gizlenir; yalnız "Sepete Ekle" kalır ve hacim bilgisi (60 ml / 100 ml, EDP / Extrait) gösterilir. Aksi halde panel 2300 TL'lik ürüne +200/+250/+400 TL ekleyen anlamsız seçenekler gösterirdi. Sepet ve ödeme ucu fiyatı veritabanından okur, değişmez; kampanya (2. ürün %50, ücretsiz kargo) bu ürünlere de uygulanır.
5. **Doğrulama:** `npx tsc --noEmit`, `npm run test:unit`, betiği kuru/`--check` ile çalıştırma (Excel satır sayıları 81 + 14, çakışma yok). Canlıya: kod push'u ve `--apply` ayrı ayrı sizin onayınızla; görseller yüklenene kadar ürünler görselsiz görünür (kartlar "fotoğraf yok" gösterir; vitrin yalnız görselli ürünleri alır) — bu yüzden `--apply` görseller yüklendikten sonra çalıştırılmalı.

## Kapsam dışı
Görsel yükleme, SMS/sosyal medya duyurusu, vitrin seçimi, Trendyol eşitleme, fiyat dışı kampanya değişiklikleri, LUX 11 M.

## Açık nokta (builder'a bırakılan)
Excel'deki kısa anlatım/vurgu metinlerinin tam biçimi (koleksiyon sayfası açıklaması) uygulama sırasında Excel'den okunur; sahibin kelimeleri değiştirilmez.
