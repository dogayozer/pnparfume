# Ürün Excel paneli (koleksiyon bazlı indir / önizle / yükle) — tasarım

Tarih: 2026-11-22. Sahip onayı: "önerini yapalım" (öneri sohbette sunuldu).

## Amaç
Admin ekibi, barkod / fiyat / stok / formül değiştiğinde ürünleri koleksiyon bazında Excel olarak indirip düzenleyip geri yükleyebilsin. Yanlış dosya canlı veriyi bozmasın.

## Hedef / hedef dışı
- Hedef: mevcut ürünlerin toplu güncellenmesi; koleksiyon (PN, Pien, Pien Creative) süzgeci; indirme; önizlemeli yükleme.
- Hedef dışı: yeni ürün oluşturma (mevcut `import` yolu kalır), ürün silme, görsel dosyası yükleme, denetim günlüğü.
- Anti-hedef: boş hücrenin veriyi silmesi; barkod çakışması; önizlemesiz yazma.

## Yaklaşımlar
1. Tek sayfalı Excel (formül yok): basit ama formül değişikliğini kapsamaz. Elendi.
2. **Seçilen:** İki sayfalı Excel — "Ürünler" (ürün başına 1 satır) ve "Formül" (hammadde başına 1 satır); sunucuda ayrıştırma, önizleme ve uygulama.
3. İstemcide ayrıştırıp parça parça gönderme (mevcut import gibi): önizleme ve geri alma zor, kısmi yazma riski. Elendi.

## Tasarım
- Admin → Ürünler sekmesine "Excel ile Toplu Güncelle" bölümü: koleksiyon seçici (Tümü / PN / Pien / Pien Creative), "Excel indir", dosya seç → önizleme → "Onayla ve uygula".
- `GET /api/admin/products/export?collection=` (requireAdmin). Kapsam `collectionScope` ile.
- `POST /api/admin/products/excel` (requireAdmin, FormData: file, apply=0|1). apply=0 değişiklik listesi ve hataları döner, yazmaz. apply=1 aynı dosyayı doğrular ve tek işlemde yazar.
- "Ürünler" sayfası sütunları: sku (anahtar, değişmez), koleksiyon (salt okunur), barkod, seo_name, publish_status, gender, is_featured, is_on_sale, top_notes, heart_notes, base_notes, base_cost, dealer_price, fiyat, piyasa_fiyati, stok (trendyol MarketplaceListing), gorsel_1..3. `original_name` dışa aktarılmaz (marka güvenliği).
- "Formül" sayfası: sku, hammadde, katman (Üst/Kalp/Dip), katman_yuzde, mutlak_yuzde.
- Kurallar: bilinmeyen sku → hata (oluşturulmaz). Boş hücre → alan değişmez. Barkod başka üründe varsa veya dosyada tekrarlıysa satır reddedilir. Hammadde adı `Ingredient` tablosunda yoksa satır reddedilir (yeni hammadde oluşturulmaz). Bir sku "Formül" sayfasında geçiyorsa o ürünün tüm formül satırları dosyadakilerle değiştirilir; geçmiyorsa formüle dokunulmaz. Katman yüzdeleri toplamı 100'den çok saparsa uyarı (engel değil). Sayısal/enum doğrulaması (durum ACTIVE/DRAFT/…, cinsiyet).
- Uygulamadan sonra katalog önbelleği (`katalog` etiketi) tazelenir.
- Ürün bazında: mevcut ürün düzenleme penceresinde barkod ve formül alanları yoksa eklenir (planda doğrulanacak).

## Builder'a bırakılanlar
Dosya/bileşen yerleşimi, sütun başlık yazımı, önizleme tablosu görünümü, Next 16 önbellek API'si ayrıntısı (`node_modules/next/dist/docs/` okunarak).
