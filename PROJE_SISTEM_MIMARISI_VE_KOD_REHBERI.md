# PN PARFÜM (pnparfume.com) — Sistem Mimarisi, Veritabanı ve Kodbase İnceleme Raporu

> **Bu belge, PN Parfüm e-ticaret platformunun tüm mimarisini, veri modellerini, iş mantığını, algoritmalarını ve API uç noktalarını başka bir Yapay Zeka (AI) veya yazılım ekibi tarafından tam kapsamlı incelenebilmesi için hazırlanmıştır.**

---

## 1. 🏗️ Genel Teknoloji Yığını (Tech Stack)

- **Framework:** Next.js 16.3.0 (App Router, Turbopack, React 19, TypeScript)
- **Veritabanı:** PostgreSQL (Neon Serverless Cloud DB)
- **ORM:** Prisma ORM 7.9.1 (`@prisma/client` + `@prisma/adapter-pg`)
- **Stil & Arayüz:** Tailwind CSS 4, Lucide React Icons, Canvas Confetti
- **Ödeme Altyapısı:** PayTR iFrame Tokenized Sanal POS (3D Secure, Webhook Callback Doğrulama)
- **SMS & Bildirim Motoru:** Netgsm HTTP/REST API + Otomatik Webhook Tetikleyicileri + Dahili Simülasyon Motoru
- **Yapay Zeka (AI Asistanı - Aura):** OpenAI / Vercel AI Gateway / Gemini API ile RAG (Retrieval-Augmented Generation) koku eşleme ve dinamik kupon üretimi
- **Veri Dağıtımı & Deployment:** Vercel Edge Cloud, Serverless Functions, Otomatik CI/CD

---

## 2. 🗄️ Veritabanı Şeması (`prisma/schema.prisma`)

Aşağıda veritabanında aktif olarak çalışan tüm ilişkisel modeller yer almaktadır:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

// 1. ÜRÜN & KOKU KATALOĞU
model Product {
  sku                  String   @id // Örn: "101", "205"
  original_name        String   // Parfüm ilhamı veya adı
  seo_name             String?
  publish_status       String   @default("ACTIVE") // ACTIVE | PASSIVE | DRAFT
  barcode              String?  @unique
  gender               String   // Erkek | Kadın | Unisex
  fragrance_family     String[] // ["Odunsu", "Baharatlı", "Ferah"]
  
  // Koku Piramidi (Notalar)
  top_notes            String   @default("Gizli Formül") // Açılış Notaları
  heart_notes          String   @default("Gizli Formül") // Kalp/Gövde Notaları
  base_notes           String   @default("Gizli Formül") // Dip/Kalıcılık Notaları
  
  // Nöropazarlama & Karakter Etiketleri
  mood_tag             String   // "Karizmatik & Çekici", "Ferah & Dinamik"
  persona_tag          String   // "Modern Şehirli", "İş İnsanı"
  status_tag           String   // "İmza Parfüm", "Niche Seri"
  bottle_aesthetic_tag String   // "Minimalist Lüks"
  season_tag           String   // "Dört Mevsim", "Sonbahar / Kış"
  time_of_day_tag      String   // "Gündüz & Gece"
  occasion_tag         String   // "Özel Davet & Günlük"
  
  // Performans Metrikleri (1-10)
  longevity_score      Int      // Kalıcılık puanı
  sillage_score        Int      // Yayılım / Fark edilirlik puanı
  gift_safe_score      Int      // Hediye uygunluk puanı
  
  age_focus            String   // "20-45"
  content_tag          String   // "Extrait de Parfum"
  base_cost            Float    @default(0) // Maliyet
  is_sample            Boolean  @default(false)

  ingredients          ProductIngredient[]
  marketplaceListings  MarketplaceListing[]

  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  @@index([original_name])
  @@index([gender])
}

// 2. PAZARYERİ VE SATIŞ LİSTELEMELERİ (Trendyol, Mağaza vb.)
model MarketplaceListing {
  id                String   @id @default(cuid())
  productId         String
  product           Product  @relation(fields: [productId], references: [sku], onDelete: Cascade)
  platform          String   // "pn_store", "trendyol", "hepsiburada"
  url               String?
  price             Float    // Satış Fiyatı (TL)
  marketPrice       Float?   // Üstü çizili piyasa fiyatı
  stock             Int      @default(0)
  images            String[] // Görsel URL'leri
  description       String?

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@unique([productId, platform])
  @@index([platform])
}

// 3. MÜŞTERİ & MARKA ELÇİSİ (AFFILIATE)
model Customer {
  id                 String   @id @default(cuid())
  name               String?
  email              String   @unique
  password           String?
  phone              String?
  address            String?
  birth_year         Int?
  profession         String?
  
  // İzinler
  whatsapp_opt_in    Boolean  @default(true)
  email_opt_in       Boolean  @default(true)
  sms_opt_in         Boolean  @default(true)

  // Marka Elçiliği (Affiliate)
  referral_code      String?  @unique // Örn: "AHMET10"
  partner_type       String   @default("retail") // retail | influencer | b2b
  wallet_balance     Float    @default(0.0) // Nakit Komisyon Bakiyesi (TL)
  earned_samples     Int      @default(0)   // B2B Hak Edilen Tester Sayısı
  referredOrders     Order[]  @relation("CustomerReferredOrders")

  lastLogin          DateTime?
  cart               Json?    // Terk Edilmiş Sepet Takibi (Ürünler, Adetler)

  orders             Order[]
  coupons            Coupon[]
  notifications      Notification[]

  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

// 4. SİPARİŞ & LOJİSTİK YÖNETİMİ
model Order {
  id                   String      @id @default(cuid())
  orderNumber          String      @unique // Örn: "PN-1740001"
  customerId           String?
  customer             Customer?   @relation(fields: [customerId], references: [id])
  
  // Misafir Siparişi Detayları
  customerName         String?
  customerEmail        String?
  customerPhone        String?
  shippingAddress      String?
  billingAddress       String?
  
  totalAmount          Float
  discountApplied      Float       @default(0)
  status               String      @default("pending") // pending | paid | shipped | delivered | cancelled
  paymentStatus        String      @default("pending")
  paymentMethod        String      @default("paytr")
  
  // Lojistik & Kargo Takip
  cargoCompany         String?     // "Yurtiçi Kargo", "Aras Kargo", "MNG Kargo"
  trackingCode         String?     // Kargo takip kodu
  
  // Marka Elçisi / Referans Takibi
  referrerId           String?
  referrer             Customer?   @relation("CustomerReferredOrders", fields: [referrerId], references: [id])
  referralCode         String?     // Kullanılan referans kodu
  affiliateEarned      Float       @default(0) // Bu siparişten elçiye ödenen %15 komisyon
  isCommissionPaid     Boolean     @default(false)
  
  couponId             String?
  coupon               Coupon?     @relation(fields: [couponId], references: [id])
  items                OrderItem[]
  ai_assisted          Boolean     @default(false) // Aura AI asistanı yardımıyla mı satıldı?

  createdAt            DateTime    @default(now())
  updatedAt            DateTime    @updatedAt

  @@index([orderNumber])
  @@index([status])
}

// 5. BİLDİRİM & SMS İLETİM MOTORU
model Notification {
  id                   String    @id @default(cuid())
  customerId           String?
  customer             Customer? @relation(fields: [customerId], references: [id])
  phone                String?
  orderNumber          String?
  type                 String    // "sms" | "whatsapp" | "email"
  trigger_reason       String    // order_created | order_shipped | order_delivered | affiliate_commission | cart_abandonment
  message_content      String
  status               String    @default("sent") // sent | simulated | failed
  providerResponse     String?

  createdAt            DateTime  @default(now())
}

// 6. ADMİN KULLANICISI & GÜVENLİK
model AdminUser {
  id                   String    @id @default(cuid())
  username             String    @unique
  password             String    // Güvenli Hash / PBKDF2 / SHA-256
  name                 String?
  role                 String    @default("superadmin")
  isActive             Boolean   @default(true)
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt
}

// 7. DİNAMİK SENARYO & KAMPANYA KURALLARI
model ScenarioRule {
  id          String   @id @default(cuid())
  rule_key    String   @unique // FREE_SHIPPING_LIMIT, MIN_DISCOUNT_THRESHOLD
  rule_value  Float
  description String?
  is_active   Boolean  @default(true)
  updatedAt   DateTime @updatedAt
}

// 8. YAPAY ZEKA SİSTEM AYARLARI
model AiConfig {
  id                 String   @id @default(cuid())
  system_prompt      String
  active_campaign    String?
  can_give_discount  Boolean  @default(false)
  discount_limit     Float    @default(0.0)
  updatedAt          DateTime @updatedAt
}
```

---

## 3. 🧩 Temel Sistem Modülleri ve İşleyiş Mantığı

### 1. Sepet & Akıllı Kampanya Motoru (`src/app/sepet/page.tsx`)
- **Dinamik Kargo Hesabı:** Veritabanındaki `FREE_SHIPPING_LIMIT` (Örn: 500 TL) kuralına göre sepet tutarı eşiği aştığında kargo otomatik ücretsiz olur.
- **Kupon ve Elçi İndirimi:** Kupon girildiğinde tutar kontrol edilir, sepet toplamından anında düşülür.
- **Terk Edilmiş Sepet Senkronizasyonu:** Kullanıcı sepete ürün eklediğinde veya adet değiştirdiğinde `/api/user/cart-sync` üzerinden Neon DB'deki `Customer.cart` alanına anlık yazılır.

### 2. PayTR 3D Secure Ödeme Entegrasyonu (`src/app/api/paytr/...`)
- **Token İsteme (`/api/paytr/token`):**
  - Müşteri IP'si, sepet içeriği (Base64), sipariş no ve tutar PayTR HMAC-SHA256 algoritmasıyla hash'lenerek imzalanır.
  - PayTR'den alınan `iframe_token` ile güvenli ödeme penceresi açılır.
- **Callback & Webhook Onayı (`/api/paytr/callback`):**
  - PayTR sunucularından POST isteği geldiğinde HMAC imzası doğrulanır.
  - Başarılı ödemede sipariş durumu `paid` yapılır.
  - Otomatik Bildirim Motoru (`sendOrderCreatedNotification`) tetiklenir ve müşteriye anında SMS gönderilir.

### 3. Otomatik WhatsApp & SMS Bildirim Motoru (`src/lib/notifications/notificationEngine.ts`)
- **Netgsm Entegrasyonu:** `.env` dosyasında `NETGSM_USERCODE` ve `NETGSM_PASSWORD` varsa resmi GSM operatörüne iletilir; yoksa kesintisiz **Simülasyon Modu** ile log tablosuna yazılır.
- **Tetikleyici Akışlar:**
  1. `sendOrderCreatedNotification`: Ödeme alındığında SMS gönderir.
  2. `sendOrderShippedNotification`: Kargo firması ve canlı takip linki (`https://pnparfume.com/profil`) iletilir.
  3. `sendOrderDeliveredNotification`: VIP teşekkür mesajı ve %15 indirim kuponu tanımlanır.
  4. `sendAffiliateCommissionNotification`: Marka elçisine sipariş tesliminde kazandığı %15 nakit komisyon SMS ile bildirilir.
  5. `sendAbandonedCartNotification`: Sepetini terk eden müşterilere kurtarma kuponu gider.

### 4. Marka Elçiliği & Komisyon Hakediş Sistemi (Affiliate)
- **URL Takibi:** Herhangi bir elçi linki paylaştığında (`?ref=AHMET10` veya `?elci=AHMET10`), `Navbar.tsx` bunu yakalayıp `localStorage: pn_referral_code` içine yazar.
- **Komisyon Hesaplama:** Sipariş tamamlandığında %15 ciro elçinin sanal cüzdanına (`wallet_balance`) yansır.
- **Cüzdanı Kupona Dönüştürme (`/api/affiliate/wallet-to-coupon`):** Elçi, kazandığı nakit bakiyeyi tek tıkla sitede kullanabileceği alışveriş kuponuna dönüştürebilir.

### 5. Yapay Zeka Koku Danışmanı — Aura (`/api/chat` & `AuraWidget.tsx`)
- Kullanıcının aradığı koku tarzı, sevdiği notalar, mevsim veya kullanım ortamına göre PN Parfüm ürünlerini RAG yöntemiyle analiz eder.
- Sohbet içerisinde doğrudan görseli, fiyatı ve **"Sepete Ekle"** butonu bulunan ürün kartları üretir.
- Kullanıcıya özel dinamik indirim kuponu oluşturup tek tıkla sepete tanımlatabilir.

### 6. Admin Yönetim Paneli (`/admin`)
- **Sipariş Yönetimi:** Siparişleri arama, filtreleme, kargo firması seçerek takip kodu girme, durum güncelleme (`İşleme Al`, `Kargoya Ver`, `Teslim Edildi`).
- **Müşteriler & Elçiler:** Son giriş tarihi, adres, telefon, canlı sepet doluluğu, WhatsApp'tan müşteriye tek tıkla yazma butonu.
- **Ürün & Stok Yönetimi:**
  - Tek tıkla yeni parfüm ekleme (SKU, koku piramidi notaları, kalıcılık/yayılım puanları, fiyat, stok, görsel).
  - Aktif/Pasif satış durumu değiştirme, ürün düzenleme ve silme.
  - Toplu Fiyat Değişikliği (% Zam / % İndirim Motoru).
  - Excel ile Toplu Yükleme / Güncelleme.
- **Bildirim & SMS Merkezi:** İletilen bildirim logları, teslimat durumları ve özel SMS test arayüzü.
- **Güvenlik & Changelog:** Admin kullanıcı adı/şifre yönetimi, interaktif sürüm takip günlüğü.

---

## 4. 🌐 API Uç Noktaları Haritası (API Routes Reference)

| Uç Nokta | Metot | Açıklama |
|---|---|---|
| `/api/admin/auth` | `POST` | Admin kullanıcı adı ve şifre doğrulaması / Giriş |
| `/api/admin/auth/change-password` | `POST` | Admin şifresi ve kullanıcı adı güncelleme |
| `/api/admin/orders` | `GET`, `PUT` | Siparişleri listeleme ve kargo takip / durum güncelleme |
| `/api/admin/customers` | `GET`, `PUT` | Müşteri profilleri, sepet analizi ve elçi cüzdanı düzenleme |
| `/api/admin/products` | `GET`, `POST`, `PUT`, `DELETE` | Tekil ürün ekleme, koku piramidi düzenleme, stok/fiyat, aktif/pasif |
| `/api/admin/products/bulk-price` | `POST` | Seçili platformda toplu % zam veya % indirim uygulama |
| `/api/admin/products/import` | `POST` | Excel dosyasından parçalı (chunk) toplu ürün içe aktarma |
| `/api/admin/notifications` | `GET`, `POST` | Bildirim loglarını getirme ve manuel/test SMS gönderme |
| `/api/admin/scenarios` | `GET`, `POST` | Dinamik senaryo kuralları (kargo limiti vb.) |
| `/api/admin/ai` | `GET`, `POST` | Aura AI sistem promptu ve kampanya ayarları |
| `/api/admin/reports` | `GET` | Ciro, sipariş ve yapay zeka dönüşüm metrikleri |
| `/api/paytr/token` | `POST` | PayTR 3D Secure iFrame ödeme tokeni oluşturma |
| `/api/paytr/callback` | `POST` | PayTR ödeme onay webhook'u ve SMS tetikleme |
| `/api/affiliate/apply` | `POST` | Müşterinin tek tıkla Marka Elçisi olması |
| `/api/affiliate/wallet-to-coupon` | `POST` | Elçi cüzdan bakiyesini alışveriş kuponuna çevirme |
| `/api/chat` | `POST` | Aura AI Koku Asistanı sohbet ve ürün öneri motoru |
| `/api/user/cart-sync` | `POST` | Canlı sepet içeriğini veritabanına eşitleme |
| `/api/checkout/coupon` | `POST` | Sepette indirim kuponu doğrulama |
| `/api/kasap-image/[file]` | `GET` | Parfüm şişesi ve katalog görsellerini dinamik sunma |

---

## 5. 🔐 Gerekli Ortam Değişkenleri (`.env`)

```env
# Veritabanı (Neon PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:...@ep-....neon.tech/neondb?sslmode=require"

# PayTR Sanal POS Bilgileri
PAYTR_MERCHANT_ID="xxxxxx"
PAYTR_MERCHANT_KEY="xxxxxx"
PAYTR_MERCHANT_SALT="xxxxxx"
PAYTR_TEST_MODE="0" # Canlı: 0, Test: 1
NEXT_PUBLIC_BASE_URL="https://pnparfume.com"

# Netgsm SMS Gateway
NETGSM_USERCODE="xxxxxx"
NETGSM_PASSWORD="xxxxxx"
NETGSM_HEADER="PN PARFUM"

# Yapay Zeka (Aura Assistant)
OPENAI_API_KEY="sk-xxxxxx"
# opsiyonel: GEMINI_API_KEY veya VERCEL_AI_GATEWAY
```

---

## 6. 🚀 Yeni Özellik Geliştirme Önerileri (Future Roadmap)

1. **5'li Discovery Set (Keşif Kutusu):** Müşterilerin 5 adet 10ml deneme boyu seçip tek bir sabit indirimli paket ürün olarak sepete eklemesi.
2. **Mix Engine Stüdyosu:** Kendi koku kombinasyonunu (örneğin %60 Odunsu + %40 Vanilya) oluşturan özel kişiselleştirilmiş şişe siparişi.
3. **Kargo Entegrasyon Webhook'u:** Yurtiçi/Aras/MNG Kargo API'sinden gelen "Teslim Edildi" webhook'u ile anında otomatik teslimat statüsü güncelleme.

---
*Bu doküman PN Parfüm v2.7.0 sürümü temel alınarak hazırlanmıştır.*
