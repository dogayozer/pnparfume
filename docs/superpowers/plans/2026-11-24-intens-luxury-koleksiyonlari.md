# Intens ve Luxury koleksiyonları — uygulama planı

**Spec:** `docs/superpowers/specs/2026-11-24-intens-luxury-koleksiyonlari-design.md` (sahibi onayladı: "uygula").
**Çalıştırma:** yerel, tek oturum. Tech: Next.js 16, Prisma 7, tsx + node:test.

## Global kısıtlar
Marka güvenliği (gerçek marka adı yok), barkod sitede gösterilmez, Intens 749 TL/60 ml/EDP, Luxury 2300 TL/100 ml/Extrait, SKU `Pien Intens <kod>` ve `Pien LUX <M|W|UNI> <sayı>`, canlıya push ve DB `--apply` yapılmaz (ayrı onay).

## Task 1 — Koleksiyon kaydı ve önek çakışması (`src/lib/collections.ts`, `src/lib/collections.test.ts`)
- Test (önce): `getCollectionBySku('Pien M 1').slug==='pien'`, `('Pien Intens RX54')==='pien-intens'`, `('Pien LUX M 13')==='pien-luxury'`, `('CS-X')==='pien-creative'`, `('M 12')===undefined`; `collectionScope(pien)` Intens/LUX SKU'larını dışlar (NOT içerir).
- Kod: `Collection` arayüzüne `fixed?: { volumeLabel: string }`; `COLLECTIONS`'a iki kayıt; `getCollectionBySku` en uzun eşleşen öneki seçer; `collectionScope` önekli koleksiyon için, daha uzun öneklileri `NOT` ile dışlar.
- Doğrulama: `npm run test:unit` geçer. Commit.

## Task 2 — Ürün sayfası: sabit ürün (`src/components/ProductActions.tsx`, `src/app/urun/[sku]/page.tsx`)
- `ProductActions`'a isteğe bağlı `fixedVolume?: string` prop'u: doluysa özelleştirme paneli ve "Bana mix'le" düğmesi render edilmez, hacim satırı gösterilir. Sayfa, `getCollectionBySku(sku)?.fixed?.volumeLabel` değerini geçer.
- Doğrulama: `npx tsc --noEmit`. Commit.

## Task 3 — Aktarım betiği (`scripts/import_intens_luxury.ts`)
- `import_pien_series.ts` kalıbı: varsayılan kuru çalıştırma, `--check`, `--apply`; `DATABASE_URL` yoksa hata. Excel sayfası `Ürünler`. Luxury SKU dönüşümü `LUX 13 M`→`Pien LUX M 13`, `LUX 7 UNI`→`Pien LUX UNI 7`. Beklenen: 81 Intens + 14 Luxury, geçersiz SKU/barkod yok.
- Doğrulama: kuru çalıştırma çıktısı "95 ürün", sorun yok. Commit (push yok).
