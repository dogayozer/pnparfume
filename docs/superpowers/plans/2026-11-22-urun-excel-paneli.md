# Ürün Excel Paneli Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Admin ekibi ürünleri koleksiyon bazında Excel olarak indirip, düzenleyip, önizlemeli şekilde geri yükleyerek barkod/fiyat/stok/formül güncelleyebilsin.

**Architecture:** Saf (DB'siz) mantık `src/lib/productExcel.ts` içinde: sütun tanımı, çalışma kitabı üretme, ayrıştırma, satır doğrulama ve fark çıkarma. İki admin API ucu bunu kullanır: indirme (GET) ve önizle/uygula (POST, aynı dosyayı iki kez doğrular). UI, admin "Ürünler" sekmesine eklenen küçük bir bileşendir.

**Tech Stack:** Next.js 16 (route handler), Prisma 7, `xlsx` 0.18.5 (kurulu), testler `node:test` + `tsx` (projede test çerçevesi yok; yeni paket eklenmez).

**Spec:** `docs/superpowers/specs/2026-11-22-urun-excel-paneli-design.md`

## Global Constraints

- Tüm uçlar `requireAdmin(req)` ile korunur; yetkisiz → 401 `{ error: 'Yetkisiz erişim' }`.
- `original_name` Excel'e ASLA yazılmaz (marka güvenliği).
- Yeni ürün oluşturulmaz, ürün silinmez; bilinmeyen `sku` satırı hata olur.
- Boş hücre = alan değişmez (asla null/boşa çevirmez).
- Mağaza fiyatı/stok/görsel `MarketplaceListing` `platform: 'trendyol'` kaydındadır (`STOREFRONT_PLATFORM`).
- Koleksiyon kapsamı `collectionScope(getCollection(slug))` ile (`src/lib/collections.ts`).
- Önbellek: yazımdan sonra `revalidateTag('katalog', 'max')` (Next 16 iki argüman zorunlu).
- Kullanıcıya dönük metinler Türkçe. Canlı DB'ye test amaçlı yazılmaz.
- Commit mesajı sonuna: `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. Push yalnızca sahibin onayıyla.

## Review Focus

1. Başka üründe zaten olan barkod → satır reddedilir, diğerleri uygulanır (Task 1 testi).
2. Aynı barkod dosyada iki satırda → ikisi de reddedilir (Task 1 testi).
3. Boş hücreler → alan değişmez; "Formül" sayfasında olmayan sku'nun formülüne dokunulmaz (Task 1 + Task 3).
4. Sayı hücresine metin ("abc", "1.250,50") → o satır hata, Türkçe virgüllü sayı kabul edilir (Task 1 testi).
5. Excel'in barkodu sayıya çevirmesi (`8.68E+12`, baştaki sıfır kaybı) → barkod yalnızca 8–14 haneli düz rakam metni kabul edilir, aksi hata (Task 1 testi).

---

### Task 1: Excel mantığı (saf kütüphane)

**Files:**
- Create: `src/lib/productExcel.ts`
- Test: `src/lib/productExcel.test.ts`
- Modify: `package.json` (script `"test:unit": "tsx --test src/lib/*.test.ts"`)

**Interfaces:**
- Produces:
  - `type ProductRow = { sku: string; barkod?: string; seo_name?: string; publish_status?: string; gender?: string; is_featured?: boolean; is_on_sale?: boolean; top_notes?: string; heart_notes?: string; base_notes?: string; base_cost?: number; dealer_price?: number; fiyat?: number; piyasa_fiyati?: number; stok?: number; gorsel_1?: string; gorsel_2?: string; gorsel_3?: string }`
  - `type FormulaRow = { sku: string; hammadde: string; katman: 'Üst' | 'Kalp' | 'Dip'; katman_yuzde: number; mutlak_yuzde: number }`
  - `type RowIssue = { sheet: 'Ürünler' | 'Formül'; row: number; sku?: string; message: string }`
  - `buildWorkbook(products: ExportProduct[], formulas: FormulaRow[]): Buffer` — iki sayfa: "Ürünler" (başlık sırası: sku, koleksiyon, barkod, seo_name, publish_status, gender, is_featured, is_on_sale, top_notes, heart_notes, base_notes, base_cost, dealer_price, fiyat, piyasa_fiyati, stok, gorsel_1..3) ve "Formül" (sku, hammadde, katman, katman_yuzde, mutlak_yuzde). `ExportProduct` mevcut alanların düz hâlidir; `original_name` içermez.
  - `parseWorkbook(buf: Buffer): { products: ProductRow[]; formulas: FormulaRow[]; hasFormulaSheet: boolean; issues: RowIssue[] }` — boş hücreler `undefined` olur; sayılar `"1.250,50"` ve `1250.5` ikisini de kabul eder; barkod metne zorlanır.
  - `planChanges(input: { rows: ProductRow[]; existing: Map<string, ExistingProduct>; barcodeOwners: Map<string, string> }): { updates: { sku: string; changes: Record<string, [old: unknown, next: unknown]> }[]; issues: RowIssue[] }` — `barcodeOwners` barkod→sku haritasıdır (DB'deki mevcut sahipler).
- Consumes: yok.

- [ ] **Step 1: Test dosyasını yaz** (`node:test`, `assert`). Testler (ad → assertion):
  - `buildWorkbook ürünler sayfasında original_name sütunu yok` → başlık satırı `original_name` içermez.
  - `round-trip: build sonra parse aynı satırları verir` → 2 ürün + 3 formül satırı eşit.
  - `parse: boş hücre undefined` → `barkod` boşsa `row.barkod === undefined`.
  - `parse: virgüllü Türkçe sayı` → `"1.250,50"` → `1250.5`; `"abc"` → issue `row` numarası ile.
  - `parse: barkod 8.68E+12 reddedilir, "8680000000012" kabul` (Review Focus 5).
  - `planChanges: bilinmeyen sku → issue, update yok`.
  - `planChanges: barkod başka üründe → o satır issue, diğer satır update` (Review Focus 1).
  - `planChanges: dosyada tekrar eden barkod → iki satır da issue` (Review Focus 2).
  - `planChanges: yalnız değişen alanlar changes içinde; değişmeyen satır updates'e girmez`.
  - `planChanges: publish_status 'ACTIVE'|'DRAFT'|'INACTIVE' dışı → issue` (mevcut kodda kullanılan durum değerleri `grep publish_status src` ile doğrulanıp liste buna göre sabitlenir).
- [ ] **Step 2: Çalıştırıp başarısız olduğunu doğrula:** `npm run test:unit` → FAIL (modül yok).
- [ ] **Step 3: `src/lib/productExcel.ts` içinde yukarıdaki imzaları uygula.** `xlsx` ile `XLSX.utils.aoa_to_sheet`/`sheet_to_json({ defval: undefined, raw: false })`; barkod sütunu hücre tipi metin (`t: 's'`) yazılır; ayrıştırmada rakam dışı/yanlış uzunluk → issue.
- [ ] **Step 4: Testleri çalıştır:** `npm run test:unit` → tümü PASS.
- [ ] **Step 5: Commit:** `git add package.json src/lib/productExcel.ts src/lib/productExcel.test.ts && git commit -m "feat: ürün Excel mantığı (üret, ayrıştır, doğrula)"`

### Task 2: İndirme ucu

**Files:**
- Create: `src/app/api/admin/products/export/route.ts`

**Interfaces:**
- Consumes: `buildWorkbook`, `collectionScope`, `getCollection`, `requireAdmin`, `prisma`.
- Produces: `GET /api/admin/products/export?collection=<slug|all>` → `.xlsx` (Content-Disposition `attachment; filename="urunler-<slug>-<YYYY-MM-DD>.xlsx"`); geçersiz slug → 400 `{ error: 'Geçersiz koleksiyon' }`.

- [ ] **Step 1: Ucu yaz.** Ürünleri `where: collectionScope(...)` (all → boş where), `include: { marketplaceListings: true, ingredients: { include: { ingredient: true } } }`, `orderBy: { sku: 'asc' }` ile çek; trendyol ilanından fiyat/piyasa/stok/görselleri düz alanlara indir; formül satırlarını `FormulaRow[]`'a çevir; `buildWorkbook` çıktısını döndür. `Cache-Control: private, no-store`.
- [ ] **Step 2: Tip kontrolü:** `npx tsc --noEmit` → hatasız.
- [ ] **Step 3: Elle doğrulama (yerel ya da canlı sonrası):** yetkisiz istek 401; yetkili istekten inen dosya Excel'de açılır, "Ürünler" ve "Formül" sayfaları, `original_name` yok.
- [ ] **Step 4: Commit:** `git commit -m "feat: ürünleri koleksiyon bazında Excel olarak indir"`

### Task 3: Önizle / uygula ucu

**Files:**
- Create: `src/app/api/admin/products/excel/route.ts`

**Interfaces:**
- Consumes: `parseWorkbook`, `planChanges`, `prisma`, `requireAdmin`, `revalidateTag`.
- Produces: `POST /api/admin/products/excel` (FormData: `file`, `apply` = `'0'|'1'`). Yanıt: `{ applied: boolean; summary: { updated: number; unchanged: number; rejected: number }; updates: { sku; changes }[]; formulaUpdates: { sku: string; before: number; after: number }[]; issues: RowIssue[] }`. Dosya > 4 MB veya `.xlsx` değilse 400.

- [ ] **Step 1: Ucu yaz.** Dosyayı ayrıştır; sku'ları `prisma.product.findMany({ where: { sku: { in } } })` ile çek, mevcut barkod sahiplerini `barcode: { in }` ile çek; `planChanges` çalıştır. Formül sayfası için: dosyada geçen sku'lar için hammadde adlarını `Ingredient.name` ile eşle, bulunmayan hammadde → `RowIssue` (o sku'nun formülü hiç değişmez); katman yüzdeleri toplamı 100'den ±1'den fazla sapıyorsa uyarı issue'su (engel değil, `message` "Uyarı:" ile başlar). `apply=0` ise yazmadan döndür.
- [ ] **Step 2: Uygulama kısmı.** `apply=1`: hatasız satırları tek `prisma.$transaction` içinde yaz: `product.update` (yalnız değişen alanlar), trendyol `marketplaceListing.upsert` (`price` yoksa mevcut kalır; yeni ilan gerekiyorsa `price` zorunlu → yoksa issue), formül değişen sku'lar için `productIngredient.deleteMany({ productId })` + `createMany`. Hatalı satırlar atlanır, kalanlar uygulanır; yanıt `applied: true`. Sonra `revalidateTag('katalog', 'max')`.
- [ ] **Step 3: Tip kontrolü:** `npx tsc --noEmit` → hatasız.
- [ ] **Step 4: Elle doğrulama (test veritabanında ya da tek ürünle):** `apply=0` DB'yi değiştirmez (sorgu ile kontrol); bilinmeyen sku, çakışan barkod ve bilinmeyen hammadde satırları `issues`'ta; formülsüz sku'nun formülü aynı kalır.
- [ ] **Step 5: Commit:** `git commit -m "feat: Excel ile toplu ürün güncelleme (önizle ve uygula)"`

### Task 4: Admin arayüzü

**Files:**
- Create: `src/app/admin/ProductExcelPanel.tsx`
- Modify: `src/app/admin/page.tsx` (Ürünler sekmesi içinde bileşeni göster; `import` + tek satır kullanım)

**Interfaces:**
- Consumes: `COLLECTIONS` (`src/lib/collections.ts`), `adminFetch` (admin sayfasındaki mevcut yardımcı; `ProductExcelPanel` prop olarak alır: `adminFetch: (url: string, init?: RequestInit) => Promise<Response>`, `onApplied: () => void`).
- Produces: `<ProductExcelPanel adminFetch onApplied />`.

- [ ] **Step 1: Bileşeni yaz.** Koleksiyon seçici (Tümü + her koleksiyon), "Excel indir" düğmesi (blob indirme, `adminFetch` ile), dosya seçici → `apply=0` çağrısı → önizleme: özet sayıları, değişiklik tablosu (sku, alan, eski → yeni; ilk 200 satır, fazlası "…ve N satır daha"), hata/uyarı listesi (sayfa, satır, mesaj). "Onayla ve uygula" yalnızca önizleme varken etkin; `apply=1` ile aynı dosyayı gönderir; başarıda `onApplied()` (ürün listesini yeniler) ve özet mesajı. Hata satırı varsa "Hatalı satırlar atlanacak" uyarısı gösterilir.
- [ ] **Step 2: `page.tsx` içine ekle**, mevcut "Toplu Fiyat & Excel Ürün Yönetimi" bölümünün üstüne; mevcut eski Excel yüklemesi dokunulmadan kalır.
- [ ] **Step 3: Tip kontrolü:** `npx tsc --noEmit` → hatasız.
- [ ] **Step 4: Tarayıcıda doğrula** (`preview_start`; `node_modules` junction Turbopack'te çalışmıyorsa Task 5'ten sonra canlı sürümde): indir → hücre değiştir → yükle → önizleme tablosu doğru → uygula → ürün listesi güncel.
- [ ] **Step 5: Commit:** `git commit -m "feat: admin Ürünler sekmesine Excel ile toplu güncelleme paneli"`

### Task 5: Ürün bazında düzenleme penceresi (barkod)

**Files:**
- Modify: `src/app/admin/page.tsx` (ürün formu: `productForm`, ~satır 900–925 ve ~4466 civarı)
- Modify: `src/app/api/admin/products/route.ts` (POST/PUT)

**Interfaces:**
- Consumes: mevcut ürün PUT akışı.
- Produces: ürün formunda "Barkod" alanı; PUT'ta barkod 8–14 rakam ise kaydedilir, başka üründe varsa 409 `{ error: 'Bu barkod başka bir üründe kayıtlı' }`.

- [ ] **Step 1:** `grep -n barcode src/app/admin/page.tsx src/app/api/admin/products/route.ts` ile formda/PUT'ta barkod olup olmadığını doğrula; varsa yalnız çakışma kontrolünü ekle, yoksa alanı forma ve PUT'a ekle. Formül düzenleme ürün penceresine EKLENMEZ (toplu iş Excel'dedir).
- [ ] **Step 2: Tip kontrolü:** `npx tsc --noEmit` → hatasız.
- [ ] **Step 3: Elle doğrula:** barkod değiştir → kaydedilir; başka ürünün barkodunu gir → 409 mesajı.
- [ ] **Step 4: Commit:** `git commit -m "feat: ürün düzenlemede barkod alanı ve çakışma kontrolü"`

---

## Self-review notları
- Spec kapsamı: indirme (T2), önizleme/uygulama + formül kuralları (T1/T3), UI (T4), ürün bazında düzenleme (T5), önbellek (T3), `original_name` hariç tutma (T1 testi). Eksik yok.
- İsim tutarlılığı: `ProductRow`, `FormulaRow`, `RowIssue`, `buildWorkbook`, `parseWorkbook`, `planChanges` tüm görevlerde aynı.
- Bilinçli sınır: eski `import` ucu ve eski Excel yükleme düğmesi değişmez.
