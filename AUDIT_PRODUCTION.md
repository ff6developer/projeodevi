# Elmenes Coffee — Production / Product / Conversion Audit

Tarih: 2026-09-03 · Yöntem: `next build` + `next start` üzerinde 9 kullanıcı gözünden
uçtan uca gezinme (home, menu, builder, cart, 4-adım checkout, sipariş onayı,
sipariş takibi, topluluk, profil, giriş) + mobil (375) + konsol + repo hijyeni.

Bu denetim FAZ 1–10 sonrasıdır (önceki genel skor 87/100). Amaç değişti: "iyi
görünen öğrenci projesi" değil, **Vercel'de yayınlandığında gerçek bir ürün /
işe alınabilir bir frontend developer portföyü** gibi görünmek.

---

## 1. EN ÖNEMLİ SORU

> "Bu site bugün Vercel'de public olarak yayınlansa, profesyonel bir frontend
> developer portföy projesi veya gerçek bir startup MVP'si olarak güven verir mi?"

### Cevap: **ALMOST — bugünkü haliyle bir public deploy için NO'ya yakın.**

**Neden ALMOST (tasarım tarafı hazır):** Bileşen sistemi, token mimarisi,
responsive davranış, erişilebilirlik, 4 adımlı checkout akışı, sipariş takibi —
bunların hepsi gerçekten portföy seviyesinde. Bir tasarımcı/geliştirici *ekranlara
bakarsa* "bu kişi düşünmüş" der.

**Neden NO'ya yakın (ürün/deploy tarafı kırık):**

1. **Kimlik doğrulama production'da tamamen çalışmıyor.** `AuthForm`
   `fetch("${API_BASE_URL}/api/backend/auth/login")` ile var olmayan bir Express
   backend'ine POST atıyor (`vercel.json` içinde `services.backend`,
   `backend/index.js`). Vercel'de bu servis çalışmaz → giriş **ve** kayıt
   `net::ERR_CONNECTION_REFUSED` → toast: *"Şu an işlem tamamlanamadı."*
   Builder ve checkout `requiresAuth` olduğu için, **gerçek bir ziyaretçi hesap
   açamaz, giriş yapamaz, kahve tasarlayamaz, sipariş veremez.** Tek çalışan yol
   bundle içine gömülü `admin@gmail.com / admin123`.
   → Bir recruiter siteyi açar, "Kayıt ol"a basar, hata alır. İlk 30 saniyede
   "bu çalışmıyor" hükmü.

2. **`backend/node_modules` git'e commit edilmiş.** `git ls-files backend/` →
   595 dosya, çoğu `node_modules/accepts/HISTORY.md` türü. `.gitignore` yalnız
   kök `/node_modules`'ı dışlıyor. GitHub'da ilk bakışta git hijyeni kırmızı
   bayrağı.

3. **Production'da `example.com`.** `SITE_URL` env yoksa `https://example.com`'a
   düşüyor → canonical, Open Graph, Twitter card, `sitemap.xml`, `robots.txt`'nin
   tamamı `example.com`. Yayınlanmış bir sitede amatör görünür.

4. **Konsol temiz değil.** Prod'da React **#418** (hydration mismatch) hatası ve
   auth `Failed to fetch` hatası görülüyor. DevTools'u açan bir recruiter bunu
   görür.

5. **`/dev/ui` route'u production'a çıkıyor.** noindex ama `/dev/ui` adresinden
   herkese açık. Public deploy'da `/dev/*` route'u olmaz.

6. **Kullanılmayan bağımlılık** (`html2canvas`) `package.json`'da.

7. **Hero'da görsel çapa yok.** Ana sayfa katlaması tamamen koyu zemin + metin.
   Gerçek bir DTC kahve markası ürün fotoğrafıyla açar; sitede iyi ürün
   fotoğrafları *var* ama hero onları kullanmıyor. "Güzel şablon" hissi veriyor,
   "gerçek mağaza" değil.

Bu 7 madde çözülünce cevap **YES**'e döner. Tasarım borcu değil, **ürün/deploy
borcu** var.

---

## 2. KULLANICI GÖZÜNDEN

| Kullanıcı | İlk izlenim | Ne satıyor? | Güven | Ne yapacağını anlıyor mu? | Sorun |
|---|---|---|---|---|---|
| **A) İlk kez giren** | Sıcak, sakin, serifli; sade | Kahve (net değil: dükkân mı, marka mı?) | Orta | Evet, 2 net CTA | Hero'da ürün yok; slogan ("Kahvenin en samimi hali") somut değil |
| **B) Kahve almak isteyen** | Menü düzgün, fotoğraflar iyi | Evet | Orta | Evet | Kart başına 2 aksiyon (İncele+Sepete ekle) kalabalık; ürün detay sayfası yok (sadece modal); ödeme sayfasında ne aldığı (kalemler) görünmüyor |
| **C) Kahvesini özelleştiren** | Builder net, canlı fiyat/özet iyi | Evet | İyi | Evet | Builder **navigasyonda yok** (logged-out); "Yaratıcılık puanı" bir alıcı için anlamsız gürültü |
| **D) Mobil** | Düzgün, tek kolon, dokunmatik hedefler tamam | Evet | Orta | Evet | Drawer arka planı sayfadan zor ayrılıyor; hero katlaması çok boş; lede 5 satır |
| **E) Daha önce sipariş vermiş** | "Siparişlerim" + takip çizgisi var | — | İyi | Evet | Takip sayfasında büyük boş dikey alanlar; onay ekranında adres/teslim tarihi yok |
| **F) İşveren / recruiter** | Ekranlar iyi; ama "Kayıt ol" hata veriyor, konsol kirli, repo'da `backend/node_modules` | — | **Düşük** (deneyince) | — | Blokerler bölümü (1. madde) |
| **G) Potansiyel müşteri** | "Güzel ama bu bir demo mu, gerçek mi?" | Kahve | Orta | Evet | Yasal sayfa yok (KVKK/Mesafeli Satış/İade); footer zayıf; iletişim bilgileri yer tutucu |
| **H) Tasarımcı** | Tipografi, token, ritim iyi; tek accent disiplinli | — | İyi | — | Bazı sayfalarda fazla boşluk ("sparse"), hero kompozisyonu zayıf, footer template-vari |
| **I) Frontend developer** | Component sistemi, `lib/` katmanı, a11y iyi | — | İyi (koda bakarsa) | — | `localStorage`'a doğrudan bağımlı client'lar; `services/` soyutlama katmanı yok; `backend/` ölü kod; hydration hatası |

---

## 3. "5 SANİYE TESTİ" (ana sayfa)

| Öğe | Anlaşılıyor mu? | Not |
|---|---|---|
| Marka | ✅ | "Elmenes Coffee" header + footer, serif logotype |
| Ürün kategorisi | 🟡 | "Kahve" evet; ama e-ticaret mi, kafe mi, marka sitesi mi net değil |
| Ana değer | 🟡 | "Kendi kahveni tasarla" ayırt edici ama eyebrow slogan ("en samimi hali") boş |
| Ana CTA | ✅ | "Menüye göz at" + "Kendi kahveni tasarla" — iki net buton |

→ **P1:** Hero eyebrow'u somut bir değer önermesiyle değiştir ("Taze kavrulmuş
çekirdek, kapına 2 günde" gibi). Hero'ya görsel çapa ekle (işlenmiş ürün
fotoğrafı). Katlamadaki boşluğu azalt.

---

## 4. "İLK 30 SANİYE" — friction haritası

| Adım | Friction | Öncelik |
|---|---|---|
| Ana sayfa → Menü | Yok | — |
| Menü → ürün | Kartta 2 aksiyon; hangisi birincil belirsiz. Ürün detayı ayrı sayfa değil (modal). | P2 |
| Ürün → Sepet | "Sepete ekle" → toast var; ama kullanıcı sepete gitmek için header ikonunu bulmalı ("Sepete git" mini-CTA yok) | P2 |
| Sepet | "Toplam" = "Ara toplam" (kargo ödeme adımında). Eşik üstündeyken "ücretsiz kargo kazandın" pozitif geri bildirimi yok. Kartlarda aşırı iç boşluk. Recipe satırı sadece "S" harfi placeholder. | P2 |
| Sepet → Checkout | Sorun yok | — |
| Checkout (tüm adımlar) | Özet panelinde **kalem listesi yok** — kullanıcı ne satın aldığını 4. adıma kadar göremiyor. Güven şeridi yok. Stepper adımları tıklanamıyor. | P1 |
| Onay | Adres teyidi yok, tahmini teslim tarihi yok. "Demo sipariş" olduğu belirtilmiyor. | P2 |

---

## 5. "GERÇEK BİR E-TİCARET SİTESİ Mİ?"

| Alan | Durum | Not |
|---|---|---|
| Ana sayfa | 🟡 | Çalışıyor ama hero zayıf, güven şeridi var |
| Menü | ✅ | Kategori + sıralama + URL senkron |
| Ürün keşfi | 🟡 | Filtre yok (sadece kategori+sıralama); arama yok — bu ölçekte kabul edilebilir |
| Ürün detayları | 🟡 | Modal; roast/origin/notes var; ayrı sayfa (SEO/paylaşım) yok |
| Ürün özelleştirme | ✅ | Builder iyi; fiyat dökümü şeffaf |
| Sepet | ✅ | Adet ±, kaldır, alt toplam |
| Checkout | 🟡 | 4 adım iyi; özet kalem listesi eksik |
| Teslimat | ✅ | Standart/Hızlı, ücretsiz eşik |
| Ödeme | ✅ | Demo, dürüst uyarı, network yok, kart verisi saklanmıyor |
| Sipariş | ✅ | `createOrder`, sepet temizleniyor, onay ekranı |
| Sipariş geçmişi | ✅ | `/siparislerim` |
| Sipariş detay/takip | 🟡 | Var; ama sayfada aşırı boşluk |
| Profil | 🟡 | Var; "0 0 0" stat ilk izlenimi zayıf; çıkış burada |
| **Yasal** | ❌ | KVKK / Mesafeli Satış Sözleşmesi / İade & Teslimat / Gizlilik sayfaları yok. TR e-ticaret beklentisi. |

---

## 6. BACKEND YOK — AMA BACKEND'E HAZIRLIK

Soru: "Yarın gerçek API gelince frontend'in ne kadarını yeniden yazmam gerekir?"

**Bugünkü cevap: orta-yüksek risk.** UI bileşenleri ve client'lar `lib/*`
fonksiyonlarını çağırıyor (iyi), ama `lib/*` **doğrudan `localStorage`** yapıyor
ve bazı client'lar (`ProfilClient`, `AdminPanelClient`, `MenuClient`,
`ToplulukClient`) hâlâ `localStorage.getItem/setItem`'i **doğrudan** çağırıyor.
Auth ise `fetch` + `API_BASE_URL` ile yarı-backend'e bağlı.

### Hedef mimari

```
components / app (UI)
      │  (yalnız tip + fonksiyon çağrısı, storage bilmez)
      ▼
lib/services/*   ← TİPLİ ARAYÜZ (AuthService, ProductService, CartService,
      │            OrderService, ProfileService)  — backend contract burada
      ▼
lib/services/adapters/local/*   ← şu anki implementasyon (localStorage)
                                   yarın: adapters/http/*  (fetch → gerçek API)
```

- Her serviste `interface` + bir `localAdapter`. UI yalnız interface'e bağlı.
- `docs/BACKEND_CONTRACT.md`: endpoint listesi, istek/yanıt şekilleri, hangi
  adapter dosyasının değişeceği.
- `localStorage` erişimi **sadece** `adapters/local/*` altında.

Bu, "backend geldiğinde bir klasör değiştir" seviyesine indirir.

---

## 7. PRODUCTION FRONTEND READINESS — state matrisi

| State | Durum | Not |
|---|---|---|
| Loading | 🟡 | `LoadingState` var; ama async op'lar senkron olduğu için çoğu yerde görünmüyor. Mock'a yapay gecikme + skeleton yok. |
| Empty | 🟡 | `EmptyState` var; ikon çoğu yerde geçilmemiş; profil "0 0 0" |
| Error | 🟡 | `ErrorState` + toast var; form inline hataları kısmi |
| Success | ✅ | toast + onay ekranı |
| Disabled | ✅ | Button/QuantityStepper |
| Hover / Focus / Active | ✅ | token'lı, global `:focus-visible` |
| Skeleton | ❌ | Hiç yok |
| Uzun metin (ürün adı / kullanıcı adı / adres) | ⚠️ Test edilmedi | Recipe adı 6+ kelime sepette sarıyor (OK); menü kartı, onay ekranı, admin satırı test edilmeli |
| Çok yüksek fiyat (₺99.999) | ⚠️ Test edilmedi | `formatPrice` kuruş; kolon taşması kontrol edilmeli |
| 0 / 1 / 20 ürün | ⚠️ Kısmi | 20+ sepet satırı, 20+ sipariş listesi test edilmeli |

---

## 8. GÖRSEL PROFESYONELLİK

| # | Problem | Neden | Kullanıcı etkisi | Marka etkisi | Çözüm | Öncelik |
|---|---|---|---|---|---|---|
| V1 | Hero'da görsel yok, katlama boş | DTC kahve markaları görselle açar | "Şablon" hissi, düşük duygusal bağ | Zayıf ilk izlenim | İşlenmiş ürün fotoğrafı (scrim + kompozisyon), katlama boşluğunu azalt | P1 |
| V2 | Footer zayıf/template-vari | Tek kolon ortalı, 4 link, yer tutucu iletişim | Güven düşük | "Gerçek mağaza değil" | Çok kolonlu ticari footer: keşfet / kurumsal (yasal) / iletişim; sosyal (varsa) | P2 |
| V3 | Bazı sayfalar aşırı boş (sepet, sipariş, auth, takip) | `min-height` + az içerik | "Bitmemiş" hissi | Özensizlik | Dikey ritmi sıkılaştır, kart yoğunluğunu artır, boş alanı içerikle/görselle dengele | P2 |
| V4 | Menü kartı 2 eşit aksiyon | Birincil belirsiz | Karar yükü | — | Kart → tek "Sepete ekle" (primary); görsel/başlık detaya link | P2 |
| V5 | Checkout özet paneli kalemsiz | Standart e-ticaret deseni eksik | "Ne alıyorum?" belirsizliği | Güven düşük | Yapışkan özete daraltılabilir kalem listesi | P1 |
| V6 | Nav ikon anlamı | "Topluluk" = Trophy (yarışma), "Kahveni Oluştur" = flask (lab) | Yanlış çağrışım | Gamification/lab klişesi | Trophy→Users; flask→Coffee/SlidersHorizontal | P2 |
| V7 | Drawer arka plandan ayrışmıyor | `--surface` ≈ `--paper`, scrim zayıf | Mobilde kafa karışıklığı | — | Daha güçlü scrim veya drawer yüzeyi + gölge | P2 |
| V8 | "Yaratıcılık puanı" gürültüsü | Alıcı için anlamsız sayı | Dikkat dağınıklığı | Gamification hissi | De-emphasize et; sadece "toplulukta paylaş" bağlamında göster | P3 |
| V9 | `themeColor:#080808` token değil | `--paper` = `#17140f` | Tema çubuğu uyumsuz | — | Token değerine hizala | P3 |

---

## 9. RECRUITER'IN DİKKAT EDECEĞİ 20 NOKTA

| # | Nokta | Durum |
|---|---|---|
| 1 | Site açılıyor mu, hızlı mı | ✅ |
| 2 | İlk ekran ne olduğunu anlatıyor mu | 🟡 |
| 3 | **Kayıt / giriş çalışıyor mu** | ❌ **BLOKER** |
| 4 | Sepete ekleme → checkout uçtan uca | 🟡 (auth'a takılıyor) |
| 5 | Mobil gerçekten mobil mi | ✅ |
| 6 | Konsol temiz mi | ❌ (#418 + fetch hatası) |
| 7 | Network sekmesi (başarısız istek) | ❌ (ERR_CONNECTION_REFUSED) |
| 8 | Klavye ile gezilebiliyor mu | ✅ |
| 9 | Focus görünür mü | ✅ |
| 10 | Component tekrarı / sistem var mı | ✅ (`components/ui/*`) |
| 11 | Tekrarlı ölçek / token | ✅ (`tokens.css`) |
| 12 | Loading/empty/error state'leri | 🟡 |
| 13 | 404 / error page | ✅ |
| 14 | URL yapısı temiz mi | 🟡 (`/kahvearenasii` redirect kalıntısı, `/dev/ui`) |
| 15 | SEO temeli (title, meta, OG, sitemap) | 🟡 (`example.com`) |
| 16 | Repo hijyeni (GitHub) | ❌ (`backend/node_modules` commit) |
| 17 | Ölü kod / kullanılmayan dep | 🟡 (`backend/`, `html2canvas`) |
| 18 | Gerçek product thinking | ✅ (builder, takip, güven şeridi) |
| 19 | Tasarım generic mi / AI mi | 🟡 (hero + footer generic; gövde iyi) |
| 20 | Yasal / kurumsal sayfalar | ❌ |

**Skor: 20 üzerinden ~10 net ✅.** Blokerler (3, 6, 7, 16) çözülünce ~17.

---

## 10. "AI TARAFINDAN YAPILMIŞ GİBİ Mİ?"

Efekt tarafı temiz (glass/gradient/glow/tilt yok — FAZ 10'da doğrulandı). Kalan
AI/şablon sinyalleri **içerik ve kompozisyon** düzeyinde:

- Hero: eyebrow slogan ("Kahvenin en samimi hali") + genel h1 — herhangi bir
  kafeye yapıştırılabilir. **Somut değil.**
- "Öne çıkanlar / Kendi kahveni tasarla / Topluluk seçkisi" 3 blok — mekanik,
  eşit ağırlıklı, "landing template" ritmi.
- Footer: ortalı, jenerik.
- "Yaratıcılık puanı", "ödül kutusu" ikonları — hafif gamification/clip-art.
- `BRAND.tagline = "Kahvenin en samimi hali"`, `BRAND.email` yer tutucu.

→ Çözüm efekt azaltmak değil: **somut marka sesi + gerçek ürün sunumu + daha az
ama daha anlamlı bölüm.**

---

## 11. MARKA / ART DIRECTION

Test: "Logoyu başka bir kahve markasıyla değiştirsem aynı görünür mü?" →
**Büyük ölçüde evet.** Sıcak-koyu palet + serif ayırt edici ama tek başına
yeterli değil.

Güçlendirme (daha fazla kahverengi/grain değil):
- **Ürün sunumu**: roast/origin/notes primitifleri zaten var — hero'da ve ürün
  detayında öne çıkar.
- **Ton**: builder ve checkout microcopy'sini markanın sesi yap (kısa, sıcak,
  net — "ustalık" jargonu değil).
- **Fotoğraf işleme**: mevcut ürün fotoğraflarına tutarlı bir crop/oran/scrim.
- **Kompozisyon**: hero'da asimetrik bir düzen (metin + tek güçlü görsel).

---

## 12. COPY / MICROCOPY

| Alan | Sorun | Örnek |
|---|---|---|
| Hero eyebrow | Boş slogan | "Kahvenin en samimi hali" → somut fayda |
| Hero lede | Mobilde 5 satır, uzun | Kısalt |
| `BRAND` | Yer tutucu değerler | `merhaba@elmenescoffee.com`, adres "İstanbul, Türkiye" |
| Sepet | "Toplam" = "Ara toplam" (kafa karıştırıcı) | Kargo satırını her zaman göster ("Ücretsiz") |
| Onay | Sonraki adım belirsiz | "Siparişini X adresine hazırlıyoruz, 15–25 dk" |
| Boş durumlar | Bazıları çok kısa ("Sonuç yok") | Yönlendirici tek cümle + ikon |
| Checkout demo | Adım 3'te net (iyi) | Onay ekranında da 1 satır demo notu |

Türkçe/İngilizce karışıklığı ve developer terminolojisi: **temiz** (FAZ 7/10'da
çözülmüştü).

---

## 13. MOBILE-FIRST (375/390)

FAZ 9'da yatay taşma = 0 doğrulandı, hâlâ geçerli. Kalanlar:
- Hero katlaması çok boş (P1 — hero revizyonuyla çözülür)
- Drawer arka plandan ayrışmıyor (P2)
- Lede uzunluğu (P2)
- Checkout özet paneli mobilde kalemsiz (P1 — V5 ile aynı)
- Klavye açılınca form: `Field` `font-size:16px` var (iOS zoom yok) ✅

---

## 14. ANIMATION AUDIT

Mevcut animasyonlar: `toast-in` (kayma, feedback — meşru), `:focus-visible` /
hover renk geçişleri (`--t-fast`, meşru), `Stepper`/`Progress` yok. Global
`prefers-reduced-motion` var. **Sorun yok** — showcase animasyon yok. Yeni
animasyon eklenmeyecek.

---

## 15. SEO / PUBLIC WEBSITE READINESS

| Öğe | Durum | Aksiyon |
|---|---|---|
| `<title>` / template | ✅ | — |
| description | ✅ | — |
| Open Graph | 🟡 | `example.com` + OG görseli `logo.png` (1200×630 değil) |
| favicon | ✅ | — |
| semantic headings | ✅ (FAZ 9) | — |
| image alt | ✅ (FAZ 9) | — |
| canonical | ❌ | `example.com` |
| robots | 🟡 | `/siparislerim`, `/dev/ui` listede yok |
| sitemap | 🟡 | `example.com` |
| 404 / loading / error | ✅ | — |
| `NEXT_PUBLIC_SITE_URL` | ❌ | Vercel env fallback (`VERCEL_PROJECT_PRODUCTION_URL`) + `.env.example` |

---

## 16. VERCEL DEPLOYMENT READINESS

| Kontrol | Durum |
|---|---|
| `next build` | ✅ 20 route |
| `vercel.json` `services.backend` (Express) | ❌ Standart Vercel Next deploy'una uymuyor; auth'u kırıyor — kaldır/sadeleştir |
| `backend/` + committed `node_modules` | ❌ Repo'dan çıkar |
| env var beklentisi | ❌ `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL` — dokümante değil |
| client/server boundary | ✅ |
| hydration | ❌ prod'da #418 — tüm route'larda temizlenmeli |
| console errors | ❌ (#418 + fetch) |
| image loading | ✅ (`unoptimized:true` — Vercel'de `/_next/image` sorunları için bilinçli) |
| font loading | ✅ (`next/font`, `display:swap`) |
| asset paths | ✅ |
| `/dev/ui` public | ❌ |

---

## 17. DEMO ÖDEME

Mevcut durum **doğru**: adım 3'te net "deneme ekranı" uyarısı, hiçbir network
isteği yok, kart verisi saklanmıyor, sahte "ödemeniz çekildi" YOK. Tek ekleme:
onay ekranında 1 satırlık sade demo notu (P3).

---

## 18–24 → `MASTER_TASK_PLAN_V2.md`

Tüm bulgular oradaki task listesine bölündü (P0/P1/P2/P3 + BLOCKER/HIGH/MEDIUM/
POLISH). Fazlar:

- **FAZ A — Production blockers** (auth mock + services soyutlaması, repo hijyeni,
  SITE_URL, hydration, /dev/ui, robots/sitemap)
- **FAZ B — Backend-ready data layer** (`lib/services/*` interface + local adapter;
  `localStorage` sadece adapter'da; `BACKEND_CONTRACT.md`)
- **FAZ C — Conversion / UX friction** (builder keşfi, checkout özet kalemleri,
  sepet/onay iyileştirmeleri, empty state ikonları, 5-sn testi)
- **FAZ D — Visual professionalism** (hero kompozisyonu, footer, sayfa ritmi,
  menü kartı aksiyonu, nav ikonları, drawer ayrışması)
- **FAZ E — Copy / microcopy** (hero sloganı, tam microcopy geçişi, BRAND
  değerleri)
- **FAZ F — Edge cases / states** (uzun metin, yüksek fiyat, 0/1/20, skeleton,
  form validasyonu)
- **FAZ G — Final simülasyon + re-audit** (9 senaryo, recruiter 60 sn, skorlar)

## 25 → final rapor `MASTER_TASK_PLAN_V2.md` sonunda + `AUDIT_AFTER_V2.md`
