# MASTER TASK PLAN — Elmenes Coffee Profesyonelleştirme

> Kaynak: `Elmenes Coffee — UX/UI Denetimi` (artifact) + repo kod analizi (Phase 0).
> Branch: `refactor/professional-overhaul` · Baseline build: ✅ (Next.js 16.2.0, TS temiz).
> Çalışma kuralı: TASK-001'den başlanır, bir task bitmeden sonrakine geçilmez, her task sonunda `WORKLOG.md` güncellenir.

---

## 0. KARARLAR (kullanıcı onaylı)

| Konu | Karar |
|---|---|
| Veri mimarisi | **Client-side prototip + temiz veri katmanı.** Yeni sunucu altyapısı YOK. Dağınık `localStorage` çağrıları `lib/` altında tiplendirilmiş repository modüllerine toplanır. Sepet/checkout/sipariş gerçek akış gibi çalışır; kalıcılık cihaz bazlı. Backend sertleştirme = ertelenmiş backlog (BL-*). |
| Ödeme adımı | **Demo ödeme ekranı.** Kart formu UI'ı, işleme yok, açıkça test. Sipariş "Ödeme alındı (demo)" ile tamamlanır. |
| Marka yönü | Aşağıdaki **Art Direction** planda tanımlıdır; kullanıcı beğenmezse ilgili task revize edilir, gerisi ona göre ilerler. |
| Kapsam dışı | Gerçek ödeme entegrasyonu, gerçek e-posta, gerçek DB, gerçek auth sertleştirme (bunlar BL-* olarak listelenir, bu turda uygulanmaz). |

---

## 1. ART DIRECTION — "Elmenes Coffee"

**Amaç:** SaaS/dashboard/AI-template hissini kırmak; klişe kahve estetiğine (çekirdek makrosu, kahverengi gradient, cam) düşmeden gerçek bir *specialty roaster* kimliği. Ayırt edicilik **efektten değil**: editoryal tipografi + ölçülü sıcak-nötr sistem + tek güçlü mürekkep aksanı + kahveye özgü **bilgi tasarımı** (kavurma seviyesi, origin, yoğunluk, tat notları).

### Renk
Light (bare `:root`):
- `--paper #f5f3ee` (hafif grileşmiş sıcak kâğıt — cream DEĞİL)
- `--surface #ffffff`
- `--ink #1f1c19` · `--ink-2 #57514a` · `--ink-3 #8a8279`
- `--line #e4dfd6` · `--line-strong #d3ccc0`
- `--accent #9c4a2f` ("roast" kızılı — TEK aksan; link, aktif durum, birincil CTA)
- `--accent-weak #b9705a`
- Semantik (aksandan ayrı): `--success #2f7d4f` · `--warning #b4791e` · `--danger #b23b2e` · `--info #3a6b8a`

Dark (`prefers-color-scheme: dark` + `[data-theme="dark"]`):
- `--paper #17150f` · `--surface #211e18` · `--ink #ece6db` · `--ink-2 #b3aa9c` · `--ink-3 #837b6d`
- `--line #322d25` · `--line-strong #443d33`
- `--accent #d5714e` · `--accent-weak #b9705a`
- Semantik tonları aydınlatılır.

**Kural:** başka renk yok. Gradient yok. Glow yok. `backdrop-filter` yok (istisna: yok).

### Tipografi
- **Display: `Fraunces`** (opsz) — h1/h2, ürün adları, fiyatlar, editoryal başlıklar. Playfair Display **kaldırılır**.
- **Metin/UI: `IBM Plex Sans`** — gövde, nav, form, buton, her fonksiyonel metin. Türkçe desteği tam.
- **Mono: `IBM Plex Mono`** — sipariş no, tabloda fiyat, SKU, origin/kavurma metadata çipleri ("spec sheet" dokusu).
- Ağırlıklar: Plex 400/500/600; Fraunces 400/500/600 (+ optik). `font-weight: 800/900` ve `letter-spacing: 10px` gibi ekstremler yasak.
- Tip ölçeği (rem, 1rem=16px): `--fs-caption .8125` · `--fs-sm .875` · `--fs-body 1` · `--fs-lg 1.125` · `--fs-h3 1.375` · `--fs-h2 1.875` · `--fs-h1 2.5` (clamp ile 2.5→3.25). Başka boyut yok.

### Layout & his
- Tek okuma kolonu (~64–72ch), ürün ızgaraları dürüst grid.
- Kart: 1px `--line` border, radius `--r-md` (12px), yükseltilmiş yüzeyler (menü/modal) için TEK `--shadow-1`. Hover = border koyulaşır + aksan; `translateY` teatral hareket YOK.
- Motion: 120–180ms ease, transform ≤4px, sadece color/opacity/border. Scroll efekti / float / tilt YOK. Global `prefers-reduced-motion`.
- Kahve kimliği içerikte: kavurma metre (bar), origin etiketi, yoğunluk noktaları, tat-notu pill'leri, ürün adı altında mono "spec" satırı. Builder = düzgün "tarif kartı".
- Görsel yoksa: emoji değil — ürün adı `Fraunces` ile yazılı düz tint blok (`--tint`).

### Radius / Elevation / Spacing / Z / Transition token'ları
- Radius: `--r-sm 8` · `--r-md 12` · `--r-lg 16` · `--r-pill 999`. Başka değer yok.
- Elevation: `--shadow-1` (kart/menu), `--shadow-2` (modal/popover). Toplam 2.
- Spacing (4px tabanlı): `--s-1 4` … `--s-2 8` `--s-3 12` `--s-4 16` `--s-5 24` `--s-6 32` `--s-7 48` `--s-8 64` `--s-9 96`.
- Z-index: `--z-header 100` · `--z-drawer 200` · `--z-modal 300` · `--z-toast 400`.
- Transition: `--t-fast 120ms` · `--t-base 180ms`, easing `--ease standard`.
- Breakpoints (JS + CSS ortak): `sm 480` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1440`.

### Microcopy
Sakin, kesin, "biz" dili. Türkçe. Developer terimi yok. Hype yok. Örn: "Sepete eklendi", "Siparişin alındı — #A1042", "Bugün kavrulanlar", "Topluluk seçkileri" (eski "Şampiyonlar Ligi").

---

## 2. PROJE ANALİZİ ÖZETİ (Phase 0 bulguları — audit + ek)

**Route'lar (9):** `/` (→redirect /kahvearenasii), `/kahvearenasii`, `/menu`, `/kahveniolustur`, `/siparis`, `/hakkimizda`, `/giris`, `/kayit`, `/profil`, `/adminpanel`. `not-found` default. `loading.tsx`/`error.tsx` yok.

**State/veri:** tamamı `localStorage` — `user`, `isLoggedIn`, `isAdmin`, `orders`, `coffees`, `products`, `arenaPosts`, `userPosts`, `userVotes`, `userAvatar`, `userBio`, `arenaChampion`, `tournamentStart`, `copiedRecipe`, `lastCoffeeDesign`. Dağınık, tipsiz, `JSON.parse` her yerde.

**Backend:** `backend/index.js` — Express, bellekte `users=[]`, düz metin parola, response'ta parola döner, her çağrıda sıfırlanır. Sadece `/api/backend/auth/register` + `/login`.

**Auth:** `HeaderNav` `localStorage.user` okur; `AuthForm` içinde **hardcoded admin** (`admin@gmail.com`/`admin123`). `authChanged` custom event ile senkron.

**CSS:** 9 dosya, ~7.082 satır. 7 ayrı `:root` token seti. `app/globals.css` **hiçbir yerden import edilmiyor (ölü)**. Tailwind v4 kurulu, **hiç kullanılmıyor** (`@tailwind`/`@apply`/utility yok). `.arena-btn` iki dosyada çelişkili. Sınıf çakışmaları: `.product-card`, `.comment-btn`, `.empty-state`, `.score-badge`, `.stat-item`. ~37 radius, 56 shadow, 10 blur değeri, `backdrop-filter` 9 dosyada.

**Bileşen tekrarı:** ortak Button/Input/Card/Modal yok. `window.confirm` 4 yerde. Emoji UI ikonları (Admin baştan sona). `<div onClick>` ile etkileşim (`ConfigSection`, arena, profil, podium). Focus state neredeyse yok. `prefers-reduced-motion` sadece `kahvearenasi.css`.

**E-ticaret:** sepet/checkout/adres/ödeme/sipariş-no/sipariş-geçmişi YOK. Menüden sipariş YOK. `/siparis` sonsuz "Hazırlanıyor…". Builder doğrudan `localStorage.orders`'a yazıp `/siparis`'e atıyor. Fiyatlar `MenuClient` içinde elle string (`'80 TL'`). Para birimi `TL` (26×) vs `₺` (12×). Builder `basePrice=100` gizli; indirim %15 vs Arena vaadi %20.

**Builder:** `CoffeeRight.tsx` `wheel` hijack; `kahveniolustur.css` sol panel tamamı `position:fixed` + `vh` (çakışan `top:65vh`). CTA `allSelected &&` ile gizli.

**Nav:** `HeaderNav` içinde `navItems` (üst bar, `<1024` gizli, hamburger yok) + `iconItems` (sol ray) — iki farklı kaynak, farklı sıra/küme. Tablet 768–1024 "ölü bölge".

**Ek bulgular (audit'te yoktu / detay):**
- E1. `README.md` create-next-app boilerplate ("Geist font", "edit app/page.tsx") — yanıltıcı.
- E2. `.env.example` ve `site-config.ts` `example.com` placeholder → prod SEO/metadata riski; footer `info@elmenes.com` ile çelişik.
- E3. `SiparisClient.tsx` JSX girinti bozuk, dosya `)}` ile bitiyor.
- E4. `robots.ts` `/` allow diyor ama `/` sadece redirect; gerçek homepage gelince güncellenmeli.
- E5. `next.config.ts` `images.unoptimized:true` — Vercel `/_next/image` 404 workaround; tüm `<Image>` faydası kapalı. Not düşülecek, `<img>`/`<Image>` karışıklığı ayrı ele alınacak.
- E6. Admin "Aktif Ürün" statı `totalCoffees` (kullanıcı tasarımı) gösteriyor — yanlış etiket.
- E7. Menü ürün adı yazım/case hataları: "Cappicino", "Macciato", "ispanyol creamy", "cookie", "frambuazlı Cheesecake", "Iced caramel Macchiato".
- E8. `layout.tsx` footer tamamen inline `style={{}}`; her sayfaya `<h2>` enjekte.
- E9. `AuthForm` bağlantı hatası: "Server'a ulaşılamıyor. Lütfen backend terminalini kontrol edin!" — kullanıcıya developer mesajı.
- E10. Arena turnuva sayacı/şampiyon `Date.now()` ile client'ta, her tarayıcıda farklı; "30 gün kaldı" güvenilmez.
- E11. Arena: sahte "+124", 3 sabit avatar, herkes "Master Barista". `ShoppingCart` ikonu "tarifi kopyala" için (yanıltıcı).
- E12. Profil paylaşımı var olan kahve adı/görselini tekrar istiyor.
- E13. `not-found`/`loading`/`error` route dosyaları yok.
- E14. Arena feed/podium boş durumu yok (`posts.length>0` yoksa hiçbir şey render etmiyor).
- E15. `HeaderNav` `Image` `logo.png` `position:fixed` + `.logo-text` gradient-clip.
- E16. `ToastProvider` iyi temel ama `.toast-viewport top:100px` header ile çakışabilir; `role="status"` var, `aria-live` toast item'da `polite` — global bölge `aria-label` var.
- E17. `tsconfig` `@/*` alias var ama import'lar çoğunlukla relatif (`../../components`), karışık.
- E18. `Inter` subset `latin-ext` var (Türkçe OK); `Playfair` de öyle ama kullanılmıyor.
- E19. `vercel.json` Services (frontend+backend) — yapı korunacak; backend'e dokunmuyoruz.
- E20. `kahveniolustur` seçenekleri "İstemiyorum/Yok" bir opt-out'u zorunlu seçim yapıyor.

---

## 3. FAZ HARİTASI & DURUM

| Faz | Ad | Task aralığı | Durum |
|---|---|---|---|
| 0 | Analiz & Plan | TASK-000 | ✅ COMPLETE |
| 1 | Kritik UX & kırık akışlar | TASK-001 … TASK-015 | ⬜ |
| 2 | Bilgi mimarisi | TASK-016 … TASK-027 | ⬜ |
| 3 | Design system | TASK-028 … TASK-042 | ⬜ |
| 4 | Typography & spacing | TASK-043 … TASK-052 | ⬜ |
| 5 | Navigation | TASK-053 … TASK-061 | ⬜ |
| 6 | Ortak componentler | TASK-062 … TASK-083 | ⬜ |
| 7 | Sayfa sayfa refactor | TASK-084 … TASK-106 | ⬜ |
| 8 | E-ticaret | TASK-107 … TASK-127 | ⬜ |
| 9 | Responsive + accessibility | TASK-128 … TASK-141 | ⬜ |
| 10 | Final professional polish | TASK-142 … TASK-151 | ⬜ |
| BL | Backlog (ertelenmiş, backend/data) | BL-01 … BL-07 | ⬜ (bu turda uygulanmaz) |

Her faz sonunda: tüm taskları ✅ · `npx next build` yeşil · TS hatasız · kritik akışlar elle test · responsive kırılma yok → faz COMPLETE.

---

## 4. TASKLAR

### TASK-000
- **Başlık:** Repo analizi + MASTER_TASK_PLAN.md
- **Kategori:** Planlama · **Faz:** 0 · **Öncelik:** P0 · **Bağımlılıklar:** Yok
- **Etkilenen dosyalar:** `MASTER_TASK_PLAN.md`, `WORKLOG.md`
- **Problem:** Dağınık problemler; uygulama sırası belirsiz.
- **Yapılacak:** Tüm route/component/CSS/config/state/auth/order/veri analizini yap; audit ile karşılaştır; ek problemleri (E1–E20) çıkar; art direction tanımla; bağımlılık sıralı task planı yaz; `WORKLOG.md` başlat.
- **Kabul kriterleri:** Plan tüm audit maddelerini + ek bulguları kapsıyor; her task tam formatta; fazlar bağımlılık sırasında.
- **Test kriterleri:** Baseline `npx next build` yeşil (kayıt altında). Plan gözden geçirilebilir.
- **Durum:** ✅ COMPLETE

---

## FAZ 1 — KRİTİK UX & KIRIK AKIŞLAR

> Amaç: davranışı çalışır kılmak. Bu fazda **minimum restyling**; görsel refactor Faz 7, gerçek cart/checkout Faz 8. Builder ve /siparis bu turda "geçici düzgün" hale gelir, sonra yeniden ele alınır.

### TASK-001
- **Başlık:** Çalışma altyapısı — branch, build baseline, WORKLOG, CSS/klasör konvansiyonu
- **Kategori:** Altyapı · **Faz:** 1 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-000
- **Etkilenen dosyalar:** `WORKLOG.md`, `docs/CONVENTIONS.md` (yeni)
- **Problem:** Tutarlı çalışma zemini yok; ileride CSS Modules / `lib/` yapısı gerekecek.
- **Yapılacak:** `refactor/professional-overhaul` branch (✅ yapıldı). `WORKLOG.md` tablo formatı. `docs/CONVENTIONS.md`: (a) yeni component'ler `components/ui/*` + `*.module.css`; (b) veri erişimi `lib/*`; (c) token'lar sadece `styles/tokens.css`; (d) import alias `@/`; (e) ikon = lucide, boyut 16/20/24; (f) yasak listesi (gradient/blur/glow/fixed-vh/emoji-UI/native confirm/dev-terminology).
- **Kabul kriterleri:** İki doküman var; sonraki tasklar bunlara referans veriyor.
- **Test kriterleri:** `npx next build` yeşil (kod değişmedi).

### TASK-002
- **Başlık:** Builder — scroll hijacking'i kaldır
- **Kategori:** UX · **Faz:** 1 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-001
- **Etkilenen dosyalar:** `components/CoffeeRight.tsx`, `styles/kahveniolustur.css`
- **Problem:** `wheel` event handler her tıkta 700ms zorunlu eased scroll; trackpad/klavye/AT bozuk; `.config-section{min-height:100vh}`.
- **Yapılacak:** `CoffeeRight.tsx` içindeki `useEffect` wheel/smoothScroll bloğunu tamamen sil. `.config-section` `min-height:100vh` → normal `padding` bloğu (örn. `--s-7 0`). Doğal dikey scroll.
- **Kabul kriterleri:** Sayfada wheel listener yok; bölümler normal akıyor; klavye ile scroll çalışıyor.
- **Test kriterleri:** Build yeşil; `/kahveniolustur` aç, "Laboratuvarı Aç", tekerlek + ok tuşları + Page Down ile sorunsuz gez; console error yok.
- **Davranış değişikliği notu:** Eski: tam-ekran snap "deneyim". Problem: temel etkileşimi ve erişilebilirliği kırıyor. Yeni: standart scroll.

### TASK-003
- **Başlık:** Builder — sol paneli fixed/vh'den normal akışa çevir
- **Kategori:** UX/Layout · **Faz:** 1 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-002
- **Etkilenen dosyalar:** `styles/kahveniolustur.css`, `app/kahveniolustur/KahveniOlusturClient.tsx`
- **Problem:** `.lab-badge/.hero-title/.hero-sub/.arena-stats-container/.coffee-name-input-wrapper/.hero-btn/.arena-btn` hepsi `position:fixed` + `vh`; `.coffee-name-input-wrapper` ve `.hero-btn` `top:65vh` çakışıyor; küçük ekranda taşıyor.
- **Yapılacak:** Tüm `position:fixed` + `top/left:*vh` kurallarını kaldır. Sol panel `.coffee-left` normal `flex-direction:column; gap`. `.hero-title` `82px` → tip ölçeği placeholder (`clamp(2rem,4vw,2.75rem)`). Stat kutuları ve isim input'u akış içinde. `.arena-btn` sabit-alt yerine akışın sonunda.
- **Kabul kriterleri:** Sayfada `position:fixed` kalmadı (header hariç, o global); 1280/1024/768/390'da eleman çakışması/taşması yok.
- **Test kriterleri:** Build yeşil; 6 genişlikte görsel kontrol; tüm seçimler yapılabiliyor; CTA görünüyor.

### TASK-004
- **Başlık:** Builder — CTA her zaman görünür + disabled + ilerleme göstergesi
- **Kategori:** UX · **Faz:** 1 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-003
- **Etkilenen dosyalar:** `app/kahveniolustur/KahveniOlusturClient.tsx`, `styles/kahveniolustur.css`
- **Problem:** "Siparişi Tamamla" sadece `allSelected &&` ile render; ilerleme yok.
- **Yapılacak:** CTA'yı daima render et, `disabled={!allSelected}`. Üstüne "N / 8 seçim tamamlandı" göstergesi + eksik başlıklara atlayan liste/anchor. `handleSiparis` başında `if(!allSelected) return` kalsın.
- **Kabul kriterleri:** CTA hep görünür; eksikken disabled + sebep görünür; tamamlanınca aktif.
- **Test kriterleri:** Build yeşil; 3 seçim yap → "3 / 8" + disabled CTA; 8 seçim → aktif; tıkla → akış çalışıyor.

### TASK-005
- **Başlık:** Builder — "İstemiyorum/Yok" seçeneklerini varsayılan yap, agresif zorunluluk işaretlerini yumuşat
- **Kategori:** UX · **Faz:** 1 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-004
- **Etkilenen dosyalar:** `components/ConfigSection.tsx`, `app/kahveniolustur/KahveniOlusturClient.tsx`, `styles/kahveniolustur.css`
- **Problem:** Opt-out (`Süt İstemiyorum`, `Köpük Yok`, `Baharat İstemiyorum`, `Değişiklik Yok`) zorunlu seçim gibi dayatılıyor; her bölümde 24px kırmızı `*` + "(Bu kısım zorunludur)".
- **Yapılacak:** `form` başlangıç state'inde opt-out'u olan alanlara (`foam`, `syrup`, `spice`, `sweetener`, `technique`) makul varsayılan ata (fiyat/power 0 olan seçenek). `milkType/beanType/cupType` seçili gelsin veya "seç" kalsın (karar: `beanType` ve `milkType` seçilsin — kahve = varsayılan bir reçete). `required-star` → küçük nötr "gerekli" etiketi, kırmızı `*` `24px` kaldır. `allSelected` mantığı hâlâ çalışır.
- **Kabul kriterleri:** Kullanıcı hiçbir şeye dokunmadan geçerli bir reçete + fiyat görüyor; sadece istediğini değiştiriyor; CTA daha erken aktifleşebiliyor.
- **Test kriterleri:** Build yeşil; sayfayı aç → varsayılan reçete + fiyat görünür; bir alanı değiştir → fiyat/puan güncelleniyor.
- **Davranış notu:** Eski: 8 zorunlu boş seçim. Yeni: mantıklı varsayılan reçete, düzenlenebilir.

### TASK-006
- **Başlık:** Builder — şeffaf fiyat dökümü + "yaratıcılık puanı" açıklaması
- **Kategori:** UX · **Faz:** 1 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-005
- **Etkilenen dosyalar:** `app/kahveniolustur/KahveniOlusturClient.tsx`, `styles/kahveniolustur.css`
- **Problem:** `basePrice=100` gizli; toplam iki gizli sistem (price + power); indirim mantığı belirsiz.
- **Yapılacak:** Fiyatı satır satır göster: "Temel kahve … ₺100", her seçili eklenti "+ ₺X", varsa "Arena indirimi −%15", "Toplam ₺Y". Yaratıcılık puanı için 1 cümle tooltip/altyazı ("Seçimlerinin özgünlüğü — Toplulukta öne çıkmana yardımcı olur"). Para birimi `₺` + `Intl.NumberFormat('tr-TR')` (geçici local util; Faz 8'de merkezîleşecek).
- **Kabul kriterleri:** Kullanıcı toplamın nasıl oluştuğunu görebiliyor; `TL` string'i kalmadı bu sayfada.
- **Test kriterleri:** Build yeşil; seçim değiştir → döküm satırları ve toplam tutarlı.

### TASK-007
- **Başlık:** Sipariş durum modeli + tip tanımları (geçici veri stub)
- **Kategori:** Mimari · **Faz:** 1 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-001
- **Etkilenen dosyalar:** `lib/types.ts` (yeni), `lib/orders.ts` (yeni)
- **Problem:** Sipariş "durumu" string; state machine yok; tipler `AdminPanelClient` içine gömülü.
- **Yapılacak:** `lib/types.ts`: `Order`, `OrderItem`, `OrderStatus = 'alindi'|'hazirlaniyor'|'hazir'|'teslim'|'iptal'`, `CoffeeRecipe`, `Product`, `CartLine`, `Address`. `lib/orders.ts`: `getOrders()/getOrder(id)/createOrder(input)/updateOrderStatus(id,status)/deleteOrder(id)` — şimdilik `localStorage` sarmalayıcı, tarih ISO, `id` = kısa okunur kod (`A` + 4 hane). Status geçiş fonksiyonu `nextStatus()`.
- **Kabul kriterleri:** Modüller import edilebilir, tipli; `AdminPanelClient` ileride bunları kullanacak (bu taskta değil).
- **Test kriterleri:** `npx tsc --noEmit` temiz; build yeşil.

### TASK-008
- **Başlık:** /siparis — gerçek sipariş onay ekranı (sonsuz "Hazırlanıyor…" kaldır)
- **Kategori:** UX · **Faz:** 1 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-007
- **Etkilenen dosyalar:** `app/siparis/SiparisClient.tsx`, `app/siparis/page.tsx`, `styles/siparis.css`
- **Problem:** `setInterval` ile oynayan `…`, hiç çözülmeyen durum; sipariş no/özet/teslim tahmini yok; JSX girinti bozuk (E3).
- **Yapılacak:** Ekranı yeniden yaz: büyük onay başlığı "Siparişin alındı — #A1042", kalem kalem özet (ürün(ler), adet, ara toplam, indirim, toplam), durum rozeti (`alindi`), tahmini süre metni, "Siparişlerim" + "Alışverişe devam" aksiyonları. `dots` animasyonu ve `siparis-hero` "Hazırlanıyor" kaldır. `lib/orders` `getOrder`/son sipariş. Dosya girintisini düzelt.
- **Kabul kriterleri:** Ekran net bir "başarılı" durumu gösteriyor; sipariş no ve özet var; sonsuz animasyon yok.
- **Test kriterleri:** Build yeşil; builder'dan sipariş ver → onay ekranı doğru veriyle; sipariş yoksa uygun boş durum + "Menüye git".
- **Davranış notu:** Eski: sonsuz "Hazırlanıyor". Yeni: gerçek onay + durum. Sipariş takibi Faz 8'de genişler.

### TASK-009
- **Başlık:** Kullanıcıya görünen tüm developer/hata mesajlarını insancıllaştır
- **Kategori:** UX/Copy · **Faz:** 1 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-001
- **Etkilenen dosyalar:** `components/AuthForm.tsx`, `app/giris/LoginClient.tsx`, `app/kayit/RegisterClient.tsx`, genel grep
- **Problem:** "Server'a ulaşılamıyor. Lütfen backend terminalini kontrol edin!" (E9) ve benzeri; "backend/server/localStorage/terminal" kelimeleri.
- **Yapılacak:** Repo genelinde kullanıcıya render edilen string'leri tara. Bağlantı hatası → "Şu an giriş yapılamıyor. Lütfen birazdan tekrar dene." Genel hata → "Bir şeyler ters gitti, tekrar dener misin?". `console.error` mesajları kalabilir (kullanıcı görmez). Toast metinleri gözden geçir.
- **Kabul kriterleri:** Kullanıcı arayüzünde "backend/server/terminal/localStorage/debug" geçen metin yok.
- **Test kriterleri:** `grep -ri "backend\|terminal\|server'a\|localstorage" app components` sadece yorum/değişken adı döndürüyor, JSX metni değil; build yeşil.

### TASK-010
- **Başlık:** Builder — "Laboratuvarı Aç" yapay ön adımını kaldır
- **Kategori:** UX · **Faz:** 1 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-003
- **Etkilenen dosyalar:** `app/kahveniolustur/KahveniOlusturClient.tsx`, `components/CoffeeRight.tsx`, `styles/kahveniolustur.css`
- **Problem:** `started` state'i olmadan sayfa boş; gereksiz tık.
- **Yapılacak:** `started` state'ini kaldır (veya `true` sabitle); seçenekler ve özet ilk render'da görünür. Arena'dan kilitli tarif geldiğinde davranış korunur. "Laboratuvarı Aç" butonu silinir; hero + ilk bölüm birlikte görünür.
- **Kabul kriterleri:** `/kahveniolustur` açılınca içerik hazır; ekstra tık yok.
- **Test kriterleri:** Build yeşil; direkt giriş + arena "Tarifi Kopyala" akışı ikisi de çalışıyor.

### TASK-011
- **Başlık:** Builder → sipariş: geçici köprüyü `lib/orders`'a bağla
- **Kategori:** Mimari · **Faz:** 1 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-007, TASK-008
- **Etkilenen dosyalar:** `app/kahveniolustur/KahveniOlusturClient.tsx`
- **Problem:** `handleSiparis` elle `localStorage.setItem("orders", …)` + `"coffees"` yazıyor; format Admin'in beklediğiyle senkron tutulması zor.
- **Yapılacak:** `handleSiparis` içindeki iki `localStorage` yazımını `createOrder()` + `saveCoffee()` (lib) çağrılarına çevir. Alan adlarını `lib/types` ile hizala. Login kontrolü ve toast korunur. `router.push('/siparis?o=<id>')`.
- **Kabul kriterleri:** Sipariş `lib/orders` üzerinden oluşuyor; Admin paneli eski kayıtları + yenileri okuyabiliyor (geri uyumluluk parse'ı korunur).
- **Test kriterleri:** Build yeşil; sipariş ver → `/siparis` doğru; `/adminpanel` (admin girişli) siparişi listeliyor.
- **Davranış notu:** Eski: dağınık elle yazım. Yeni: tek veri katmanı. Sahte "sipariş ekranına gönderme" Faz 8'de sepet/checkout ile değişecek.

### TASK-012
- **Başlık:** Arena — feed/podium boş durumu ekle
- **Kategori:** UX · **Faz:** 1 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-001
- **Etkilenen dosyalar:** `app/kahvearenasii/KahveArenasiClient.tsx`, `styles/kahvearenasi.css`
- **Problem:** `posts.length>0` değilse podium/feed hiç render edilmiyor; ilk ziyaretçi sayfanın amacını boş görüyor (E14).
- **Yapılacak:** `!isLoading && posts.length===0` durumunda net boş durum: kısa açıklama + "İlk tasarımı sen paylaş" → `/kahveniolustur` CTA. Skeleton mantığı korunur.
- **Kabul kriterleri:** Boş veride anlamlı içerik + tek CTA görünüyor.
- **Test kriterleri:** Build yeşil; `localStorage.arenaPosts` temizle → boş durum; bir post ekle → normal görünüm.

### TASK-013
- **Başlık:** Arena — sahte sosyal kanıt ve tutarsız indirimi düzelt
- **Kategori:** UX/Güven · **Faz:** 1 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-012
- **Etkilenen dosyalar:** `app/kahvearenasii/KahveArenasiClient.tsx`, `styles/kahvearenasi.css`
- **Problem:** Sabit "+124", 3 sabit avatar, herkes "Master Barista" (E11); ödül metni "%20", builder indirimi "%15".
- **Yapılacak:** "+124" ve sahte avatar bloğunu kaldır (veya gerçek `posts.length` / katılımcı sayısına bağla). "Master Barista" rozetini kaldır veya gerçek bir eşiğe bağla (örn. puana göre). Ödül metnindeki indirim oranını tek kaynağa (`%15`) sabitle; `DISCOUNT_ARENA = 0.15` sabiti `lib/pricing` (Faz 8) veya geçici const.
- **Kabul kriterleri:** Ekranda uydurma sayı/rozet yok; indirim oranı her yerde aynı.
- **Test kriterleri:** Build yeşil; grep ile "124" / "Master Barista" / "%20" arena'da yok.

### TASK-014
- **Başlık:** Arena — `ShoppingCart` ikonunu doğru ikon+etiketle değiştir ("Tarifi Kopyala")
- **Kategori:** UX · **Faz:** 1 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-013
- **Etkilenen dosyalar:** `app/kahvearenasii/KahveArenasiClient.tsx`
- **Problem:** Sepet ikonu aslında "tarifi laboratuvara kopyala"yı tetikliyor — yanıltıcı (E11).
- **Yapılacak:** `ShoppingCart` → `ClipboardCopy`/`Beaker` (lucide). Buton `aria-label="Tarifi kahve laboratuvarına kopyala"`. Hover/tooltip metni netleşsin. Toast metni: "Tarif kahve tasarımına aktarıldı — %15 indirim uygulandı."
- **Kabul kriterleri:** İkon eylemi doğru anlatıyor; erişilebilir ad var.
- **Test kriterleri:** Build yeşil; butona bas → `/kahveniolustur` kilitli tarifle açılıyor.

### TASK-015
- **Başlık:** FAZ 1 regression checkpoint
- **Kategori:** QA · **Faz:** 1 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-002…014
- **Etkilenen dosyalar:** `WORKLOG.md`
- **Problem:** —
- **Yapılacak:** `npx next build` + `npx tsc --noEmit`. Kritik akışları elle test: kayıt→giriş→builder→sipariş→(admin) sipariş görünümü; arena boş+dolu; menü hâlâ açılıyor; profil hâlâ açılıyor. 1440/1024/768/390 hızlı görsel tarama. Bulguları `WORKLOG.md`'ye yaz; regresyon varsa alt-task aç.
- **Kabul kriterleri:** Build+TS temiz; hiçbir mevcut sayfa çökmez; console error yok.
- **Test kriterleri:** Checklist `WORKLOG.md`'de işaretli. Faz 1 → COMPLETE.

---

## FAZ 2 — BİLGİ MİMARİSİ

### TASK-016
- **Başlık:** Marka bilgisi tek kaynak (`site-config.ts` genişlet)
- **Kategori:** IA/Config · **Faz:** 2 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-015
- **Etkilenen dosyalar:** `app/site-config.ts`, `.env.example`, `README.md`
- **Problem:** "Elmenes Coffee"/"ELMENES COFFEE"/`elmenes.com`/`example.com` dağınık (E2); README boilerplate (E1).
- **Yapılacak:** `site-config.ts`'e `BRAND = { name, shortName, tagline, email, phone?, address, social?, currency:'TRY', locale:'tr-TR' }` ekle. Placeholder e-posta/domain'i tek belirgin yer tutucu yap + yorumda "yayına almadan doldur". `README.md`'yi projeye özel kısa içerikle değiştir (ne, çalıştırma, yapı, task planı referansı). `.env.example` domain açıklamasını sadeleştir.
- **Kabul kriterleri:** Marka string'leri tek yerden; README artık create-next-app değil.
- **Test kriterleri:** Build yeşil; `grep -rn "example.com" app` sadece config + yorum.

### TASK-017
- **Başlık:** Navigasyon tek kaynak — `lib/nav.ts` (`NAV_ITEMS`)
- **Kategori:** IA · **Faz:** 2 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-016
- **Etkilenen dosyalar:** `lib/nav.ts` (yeni), `components/HeaderNav.tsx`
- **Problem:** `navItems` + `iconItems` iki ayrı dizi, farklı sıra/küme.
- **Yapılacak:** `lib/nav.ts`: `NavItem = { href, label, icon, requiresAuth?, hideWhenAuth?, primary? }`. Tek `NAV_ITEMS` dizisi (Menü, Kahveni Oluştur, Topluluk[arena], Hakkımızda + auth: Profil / Giriş / Kayıt). `HeaderNav` bu tek kaynaktan hem metin hem ikon üretir (görsel refactor Faz 5). Sıra ve görünürlük mantığı tek yerde.
- **Kabul kriterleri:** İki nav render'ı aynı kaynaktan; öğe sırası/kümesi tutarlı.
- **Test kriterleri:** Build yeşil; giriş yapılı/yapılmamış durumda doğru öğeler; mevcut linkler çalışıyor.

### TASK-018
- **Başlık:** `not-found.tsx`, `loading.tsx`, `error.tsx` route dosyaları
- **Kategori:** IA/UX · **Faz:** 2 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-016
- **Etkilenen dosyalar:** `app/not-found.tsx` (yeni), `app/loading.tsx` (yeni), `app/error.tsx` (yeni)
- **Problem:** Default Next.js ekranları (E13); markasız.
- **Yapılacak:** Sade, markalı 404 ("Bu sayfa bulunamadı" + ana sayfa/menü linki), global `loading` (nötr skeleton/spinner — glow yok), `error` ("Bir şeyler ters gitti" + "Tekrar dene"). Token'lar Faz 3'te bağlanacak; şimdilik minimal inline-free CSS.
- **Kabul kriterleri:** 3 dosya var, markalı, developer dili yok.
- **Test kriterleri:** Build yeşil; `/olmayan-sayfa` → özel 404; `error.tsx` bir throw ile denenir.

### TASK-019
- **Başlık:** Ana sayfa mimarisi kararı + iskelet route
- **Kategori:** IA · **Faz:** 2 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-017
- **Etkilenen dosyalar:** `app/page.tsx`, `app/kahvearenasii/*` (rename kararı), `app/sitemap.ts`, `app/robots.ts`
- **Problem:** `/` sadece redirect; gerçek ana sayfa yok (audit #4/#5).
- **Yapılacak:** `app/page.tsx` `redirect` kaldır → gerçek ana sayfa component'i (içerik TASK-020). Arena route'u `/kahvearenasii` → `/topluluk` rename (klasör + tüm linkler + metadata + `HeaderNav`/`nav.ts`); eski slug'dan `redirect` bırak (geri uyum). `sitemap.ts`/`robots.ts` güncelle (`/` indexlenir, `/topluluk` eklenir).
- **Kabul kriterleri:** `/` artık içerik döndürüyor; `/kahvearenasii` → `/topluluk` yönleniyor; ölü link yok.
- **Test kriterleri:** Build yeşil; tüm nav linkleri 200; eski arena URL'i redirect.

### TASK-020
- **Başlık:** Ana sayfa içeriği — hero + ürün vitrini + yönlendirmeler
- **Kategori:** IA/UX · **Faz:** 2 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-019
- **Etkilenen dosyalar:** `app/page.tsx`, `app/_home/*` (yeni sectionlar), `styles/home.css` veya `home.module.css`
- **Problem:** Kullanıcı ne olduğunu/ne yapacağını anlamıyor.
- **Yapılacak:** Bölümler: (1) Hero — marka bir cümle + iki net CTA ("Menüye göz at", "Kendi kahveni tasarla"); dev tipografi/gradient YOK. (2) Öne çıkan ürünler (menü verisinden 3–4). (3) "Kendi kahveni tasarla" tanıtımı → builder. (4) "Topluluk" ikincil tanıtım → /topluluk. (5) Kısa marka/güven şeridi (teslimat, taze kavurma, iletişim). Placeholder görsel = tint blok + ürün adı.
- **Kabul kriterleri:** 3 sn testi: ne satıldığı + iki birincil aksiyon net; arena ikincil.
- **Test kriterleri:** Build yeşil; 1440/768/390 görsel kontrol; tüm CTA'lar doğru route.

### TASK-021
- **Başlık:** Footer'ı gerçek component'e taşı + tek marka kaynağı
- **Kategori:** IA · **Faz:** 2 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-016
- **Etkilenen dosyalar:** `components/SiteFooter.tsx` (yeni), `app/layout.tsx`, `styles/layout.css`
- **Problem:** Footer tamamen inline `style={{}}` (E8); her sayfaya `<h2>` enjekte; iletişim emoji + çelişik.
- **Yapılacak:** `SiteFooter.tsx`: `BRAND`'den isim/tagline/iletişim; link listesi `NAV_ITEMS`'tan türetilmiş küçük alt küme; inline style yok, CSS class. `<h2>` → görsel başlık için `<p>`/`<span>` (veya semantik uygunsa `<h2 class="sr-only-ish">` değil, düz). Emoji → lucide `Mail`/`MapPin`. `layout.tsx`'ten inline footer bloğu sil, `<SiteFooter/>`.
- **Kabul kriterleri:** Footer'da inline style yok; bilgiler `BRAND`'den; her sayfada tutarlı.
- **Test kriterleri:** Build yeşil; birkaç sayfada footer görünümü aynı; heading outline mantıklı.

### TASK-022
- **Başlık:** `metadataBase` / OG / title şablonu marka kaynağına bağla
- **Kategori:** IA/SEO · **Faz:** 2 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-016, TASK-020
- **Etkilenen dosyalar:** `app/layout.tsx`, sayfa `page.tsx` metadata'ları
- **Problem:** `example.com` fallback; OG görsel `/logo.png`; ana sayfa metadata'sı yok.
- **Yapılacak:** `layout.tsx` metadata `BRAND`'den. Ana sayfa `page.tsx`'e uygun `metadata` (title, description, canonical `/`). `themeColor` token'a bağlanacak (Faz 3). OG görsel yer tutucu notu.
- **Kabul kriterleri:** Her sayfanın anlamlı title/description'ı var; fallback domain tek yerde.
- **Test kriterleri:** Build yeşil; `/`, `/menu`, `/topluluk` head'de doğru meta.

### TASK-023
- **Başlık:** `@/` import alias'ını tutarlı uygula (kritik yollar)
- **Kategori:** Kod kalitesi · **Faz:** 2 · **Öncelik:** P3 · **Bağımlılıklar:** TASK-017
- **Etkilenen dosyalar:** `app/**`, `components/**` (import satırları)
- **Problem:** `../../components` ve `@/components` karışık (E17).
- **Yapılacak:** Tüm `../../`/`../` cross-dir import'ları `@/...`'e çevir (aynı klasör importları relatif kalır). Sadece import satırları; mantık değişmez.
- **Kabul kriterleri:** `grep -rn "\.\./\.\." app components` boş (veya sadece asset).
- **Test kriterleri:** `npx tsc --noEmit` + build yeşil.

### TASK-024
- **Başlık:** Arena → "Topluluk" konumlandırma metinleri (gamification dilini yumuşat)
- **Kategori:** IA/Copy · **Faz:** 2 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-019
- **Etkilenen dosyalar:** `app/topluluk/*`, `styles/*` (metin), `lib/nav.ts`
- **Problem:** "Şampiyonlar Ligi", "KAHVE ARENASI", "Sen de Arenada Yerini Al!" — generic gamification (audit #43).
- **Yapılacak:** Sadece **metin/etiket** düzeyinde: "Kahve Arenası" → "Topluluk" / "Topluluk Seçkileri". "Turnuva" → "aylık seçki". "Şampiyon" → "ayın öne çıkanı". "Oy" kavramı korunur ama "puan/oy" farkı 1 cümleyle açıklanır. Kupalar/taçlar görsel refactor Faz 7'de sadeleşecek; burada dil.
- **Kabul kriterleri:** Aşırı yarışma dili yumuşadı; işlev (paylaş/oy/sıralama) korunuyor.
- **Test kriterleri:** Build yeşil; sayfa hâlâ çalışıyor; metinler tutarlı.

### TASK-025
- **Başlık:** Menü ürün adlarını düzelt + tek dil/case
- **Kategori:** İçerik · **Faz:** 2 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-015
- **Etkilenen dosyalar:** `app/menu/MenuClient.tsx` (→ Faz 8'de veri taşınacak)
- **Problem:** "Cappicino"/"Macciato"/"ispanyol creamy"/"cookie"/"frambuazlı Cheesecake"/"Iced caramel Macchiato" (E7).
- **Yapılacak:** "Cappuccino", "Macchiato", "İspanyol Usulü (San Sebastián)", "Cookie", "Frambuazlı Cheesecake", "Iced Caramel Macchiato", "Türk Kahvesi" → Title Case tutarlı. Görsel dosya adları aynı kalır (public). Sadece görünen ad.
- **Kabul kriterleri:** Menüde yazım/case hatası yok.
- **Test kriterleri:** Build yeşil; menü render tam; görseller doğru eşleşiyor.

### TASK-026
- **Başlık:** Turnuva sayacı / şampiyon mantığını netleştir (client-side gerçekçi)
- **Kategori:** UX/Veri · **Faz:** 2 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-024, TASK-007
- **Etkilenen dosyalar:** `app/topluluk/*Client.tsx`, `lib/community.ts` (yeni)
- **Problem:** `Date.now()` tabanlı sayaç her cihazda farklı; "30 gün kaldı" güvenilmez (E10).
- **Yapılacak:** Sabit takvim ayına bağla: "seçki her ayın 1'inde yenilenir" — kalan gün = ay sonuna kadar. `lib/community.ts`: `getCurrentSelectionPeriod()`, `getRemainingDays()`, `rollOverIfNeeded(posts)`. Metin: "Bu ayın seçkisi — N gün kaldı". Şampiyon hesaplama korunur ama period bazlı.
- **Kabul kriterleri:** Sayaç takvimsel ve anlaşılır; "turnuva" jargonundan arınmış.
- **Test kriterleri:** Build yeşil; ay değişimi simülasyonu (tarih mock) mantıklı sonuç.

### TASK-027
- **Başlık:** FAZ 2 regression checkpoint
- **Kategori:** QA · **Faz:** 2 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-016…026
- **Yapılacak:** Build + tsc. `/` yeni ana sayfa; tüm nav linkleri (desktop) 200; eski `/kahvearenasii` redirect; footer her sayfada; 404/loading/error çalışıyor. `WORKLOG.md`.
- **Kabul kriterleri:** Build+TS temiz; kırık link yok; console error yok.
- **Test kriterleri:** Checklist işaretli. Faz 2 → COMPLETE.

---

## FAZ 3 — DESIGN SYSTEM

### TASK-028
- **Başlık:** `styles/tokens.css` — tüm design token'ları
- **Kategori:** Design System · **Faz:** 3 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-027
- **Etkilenen dosyalar:** `styles/tokens.css` (yeni), `app/layout.tsx`
- **Problem:** 7 ayrı `:root`; ölü `globals.css`; ölçek yok (audit #1/#2/#3/#26/#27/#28).
- **Yapılacak:** Art Direction bölümündeki tüm token'lar: renk (light `:root`, `@media(prefers-color-scheme:dark) :root:not([data-theme="light"])`, `:root[data-theme="dark"]`), tip ölçeği + font aileleri değişkenleri, spacing, radius, shadow (2), z-index, transition, breakpoint (CSS custom prop + yorumda JS eşleri), `--container` genişlikleri. `body` arka planı token'dan. `layout.tsx`'te ilk import.
- **Kabul kriterleri:** Tek dosyada ~40 token; light+dark eksiksiz; hiçbir renk yalnızca media/[data-theme] içinde tanımlı değil.
- **Test kriterleri:** Build yeşil; sayfa arka planı/temel renkler token'dan geliyor; dark mode denemesi tutarlı.

### TASK-029
- **Başlık:** `globals.css`'i kaldır / token dosyasıyla birleştir
- **Kategori:** Design System/Temizlik · **Faz:** 3 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-028
- **Etkilenen dosyalar:** `app/globals.css` (sil), `styles/tokens.css`, grep
- **Problem:** `globals.css` import edilmiyor, `:root` + `.glass-card` ölü (audit #3).
- **Yapılacak:** `.glass-card` kullanan yer var mı grep → yoksa sil. `globals.css` sil. İhtiyaç olan hiçbir kural kaybolmadığını doğrula.
- **Kabul kriterleri:** `globals.css` yok; build etkilenmiyor.
- **Test kriterleri:** `grep -rn "globals.css\|glass-card" app components styles` boş; build yeşil.

### TASK-030
- **Başlık:** Global reset + taban element stilleri (`styles/base.css`)
- **Kategori:** Design System · **Faz:** 3 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-028
- **Etkilenen dosyalar:** `styles/base.css` (yeni), `styles/layout.css`, `app/layout.tsx`
- **Problem:** Reset `layout.css` içinde gömülü; `html,body{overflow-x:hidden}` battaniye; scrollbar/selection ad hoc.
- **Yapılacak:** `base.css`: modern reset, `box-sizing`, `body` tipografi taban (Plex Sans, `--fs-body`, `line-height`), `h1–h4`/`p`/`a`/`ul` taban token'lı, `:focus-visible` global stil, `img{max-width:100%}`, `::selection`, `@media(prefers-reduced-motion:reduce)` global. `overflow-x:hidden` KALDIR (gerçek taşmalar Faz 9'da düzeltilecek — geçici not). `layout.css`'ten reset'i çıkar.
- **Kabul kriterleri:** Tek reset kaynağı; global focus halkası var; reduced-motion global.
- **Test kriterleri:** Build yeşil; Tab ile gezince focus görünür; sayfalar bozulmadı (yatay scroll geçici olabilir — TASK-131'de).

### TASK-031
- **Başlık:** Tailwind'i kaldır (kullanılmıyor)
- **Kategori:** Temizlik · **Faz:** 3 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-030
- **Etkilenen dosyalar:** `package.json`, `postcss.config.mjs`, lockfile
- **Problem:** `@tailwindcss/postcss` + `tailwindcss` kurulu, sıfır kullanım (audit).
- **Yapılacak:** `grep` ile hiç utility/`@tailwind`/`@apply` olmadığını teyit et. `postcss.config.mjs`'ten plugin'i çıkar (gerekiyorsa dosyayı sil / boş config). `package.json`'dan iki paketi çıkar. `npm install`.
- **Kabul kriterleri:** Tailwind bağımlılığı yok; build hâlâ çalışıyor.
- **Test kriterleri:** `npx next build` yeşil; `npm ls tailwindcss` boş.

### TASK-032
- **Başlık:** `.arena-btn` çift tanımını ve sınıf çakışmalarını çöz
- **Kategori:** CSS/Temizlik · **Faz:** 3 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-030
- **Etkilenen dosyalar:** `styles/menu.css`, `styles/kahveniolustur.css`, `styles/kahvearenasi.css`, `styles/adminpanel.css`, ilgili TSX
- **Problem:** `.arena-btn` iki farklı tanım; `.product-card`/`.comment-btn`/`.empty-state`/`.score-badge`/`.stat-item` çakışıyor (audit #32).
- **Yapılacak:** Geçici namespace: her sayfa CSS'ine kök prefix ekle (`.menu-page .arena-btn` gibi scope) VEYA çakışan sınıfları sayfa-özel isimlere çevir (`.menu-cta`, `.admin-card`). Not: kalıcı çözüm Faz 6/7'de CSS Modules migration. Bu task sadece çakışmayı kırar.
- **Kabul kriterleri:** Aynı sınıf adı iki farklı görsel sonuç üretmiyor; sayfalar arası sızma yok.
- **Test kriterleri:** Build yeşil; menü + builder + admin görünümleri birbirinden etkilenmiyor (before/after screenshot).

### TASK-033
- **Başlık:** Renk değerlerini token'lara taşı — `layout.css` + `login.css`
- **Kategori:** Design System · **Faz:** 3 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-028, TASK-032
- **Etkilenen dosyalar:** `styles/layout.css`, `styles/login.css`
- **Problem:** Kendi `:root` setleri, hardcoded hex.
- **Yapılacak:** Bu iki dosyadaki `:root` bloklarını sil. Tüm hex/renk değerlerini `var(--…)` token'a çevir (en yakın eşleşme). Gradient/glow/blur bul → sonraki tasklarda kaldırılacak, işaretle (`/* TODO effect */`).
- **Kabul kriterleri:** Bu iki dosyada `:root` yok; renkler token'dan.
- **Test kriterleri:** Build yeşil; header + giriş sayfası görünümü kabul edilebilir (renkler yakın), before/after.

### TASK-034 … TASK-039
- **Başlık:** Renk/token migrasyonu — kalan CSS dosyaları (her biri ayrı task)
  - **TASK-034:** `styles/kahvearenasi.css` → token
  - **TASK-035:** `styles/menu.css` → token (açık tema kararı: sayfayı ana temaya çekmek Faz 7; burada sadece token'a bağla)
  - **TASK-036:** `styles/kahveniolustur.css` → token
  - **TASK-037:** `styles/profil.css` → token
  - **TASK-038:** `styles/siparis.css` → token
  - **TASK-039:** `styles/adminpanel.css` → token (3. palet `--accent-gold` → `--accent`; semantik renkler `--success/--warning/--danger`)
  - **TASK-040:** `styles/hakkimizda.css` → token (kendi clamp ölçeğini genel tip ölçeğiyle değiştir)
- **Kategori:** Design System · **Faz:** 3 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-033
- **Etkilenen dosyalar:** ilgili tek CSS + gerekiyorsa TSX inline
- **Problem:** Her dosyada ayrı `:root` + hardcoded değerler.
- **Yapılacak (her task):** Dosyadaki `:root` bloğunu sil; renk/spacing/radius/shadow değerlerini token'a map et; efekt kurallarını (`backdrop-filter`, `filter: drop-shadow glow`, `linear-gradient` metin/arka, `box-shadow` glow) `/* TODO-EFFECT */` ile işaretle (kaldırma Faz 4/7/10). `!important` fazlalıklarını not et.
- **Kabul kriterleri (her task):** Dosyada `:root` yok; sabit hex minimuma indi; görsel çıktı "yakın" (renkler token'a nazikçe kaydı).
- **Test kriterleri (her task):** Build yeşil; ilgili sayfa açılıyor, çökme yok; before/after görsel.

### TASK-041
- **Başlık:** Radius & shadow değerlerini token'a indir (global tarama)
- **Kategori:** Design System · **Faz:** 3 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-034…040
- **Etkilenen dosyalar:** tüm `styles/*.css`
- **Problem:** ~37 radius, 56 shadow (audit #25/#26).
- **Yapılacak:** Tüm `border-radius` → `var(--r-sm|md|lg|pill)` (en yakın; asimetrik radius'lar tek yöne sadeleşir). Tüm `box-shadow` → `var(--shadow-1|2)` veya kaldır (glow olanlar tamamen silinir). Sonuç: projede en fazla 4 radius + 2 shadow token'ı kullanımda.
- **Kabul kriterleri:** `grep -rhoE "border-radius:[^;]+" styles | sort -u` → sadece token satırları + birkaç `50%`/`inherit`. `box-shadow` → sadece token.
- **Test kriterleri:** Build yeşil; kartlar/butonlar/modallar tutarlı köşe & yükseltme; before/after.

### TASK-042
- **Başlık:** FAZ 3 regression checkpoint
- **Kategori:** QA · **Faz:** 3 · **Bağımlılıklar:** TASK-028…041
- **Yapılacak:** Build + tsc. Tüm sayfaları aç: renkler tutarlı, çökme yok. Dark mode toggle (varsa) veya OS dark ile hızlı bak. `grep` ile ikinci `:root` kalmadığını doğrula. `WORKLOG.md`.
- **Kabul kriterleri:** Tek token kaynağı; build+TS temiz; sayfalar sağlam.
- **Test kriterleri:** Checklist. Faz 3 → COMPLETE.

---

## FAZ 4 — TYPOGRAPHY & SPACING

### TASK-043
- **Başlık:** Fontları düzenle — Fraunces ekle, Playfair kaldır, değişkenleri bağla
- **Kategori:** Typography · **Faz:** 4 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-042
- **Etkilenen dosyalar:** `app/layout.tsx`, `styles/tokens.css`
- **Problem:** Playfair yüklü, tek yerde kullanılıyor (audit #31); display ses jenerik Inter 900.
- **Yapılacak:** `next/font/google`: `Fraunces` (display) + `IBM_Plex_Sans` (text) + `IBM_Plex_Mono` (data) yükle; `Inter` ve `Playfair_Display` kaldır. `--font-display / --font-sans / --font-mono` CSS değişkenleri. `<html>` className güncelle. `tokens.css` font-family token'ları bu değişkenlere.
- **Kabul kriterleri:** 3 font yüklü; Inter/Playfair referansı yok.
- **Test kriterleri:** Build yeşil; sayfalarda yeni fontlar render; Türkçe karakterler (ğ/ş/İ/ı) doğru.

### TASK-044
- **Başlık:** Tip ölçeği utility sınıfları / element defaultları
- **Kategori:** Typography · **Faz:** 4 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-043
- **Etkilenen dosyalar:** `styles/base.css`, `styles/typography.css` (yeni)
- **Problem:** Ölçek yok; px/rem karışık (audit #27).
- **Yapılacak:** `typography.css`: `h1/h2/h3` default (Fraunces, ölçek, `text-wrap:balance`), `.text-lg/.text-sm/.text-caption`, `.eyebrow` (tek uppercase kullanımı — küçük, sınırlı `letter-spacing`), `.text-mono`. Body default Plex Sans `--fs-body/1.6`. Weight sadece 400/500/600.
- **Kabul kriterleri:** Tüm tipografi bu sınıflar/defaultlar üzerinden ifade edilebilir.
- **Test kriterleri:** Build yeşil; örnek sayfada başlık hiyerarşisi net.

### TASK-045
- **Başlık:** Gradient text'i kaldır (logo + arena başlık + varsa diğer)
- **Kategori:** Typography · **Faz:** 4 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-044
- **Etkilenen dosyalar:** `styles/layout.css`, `styles/kahvearenasi.css`/`topluluk`, grep `-webkit-text-fill-color`
- **Problem:** Gradient-clip metin (audit #29); kontrast + AI hero hissi.
- **Yapılacak:** `.logo-text` ve arena `h1` → düz `color: var(--ink)` / `var(--accent)`. `background-clip:text` + `-webkit-text-fill-color:transparent` tüm kuralları sil. Vurgu istenirse ağırlık/boyut.
- **Kabul kriterleri:** `grep -rn "text-fill-color\|background-clip" styles` boş.
- **Test kriterleri:** Build yeşil; logo + başlıklar okunur, kontrast AA.

### TASK-046
- **Başlık:** Aşırı uppercase & letter-spacing temizliği
- **Kategori:** Typography · **Faz:** 4 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-044
- **Etkilenen dosyalar:** tüm `styles/*.css`
- **Problem:** Nav/label/başlık her yerde `text-transform:uppercase` + `letter-spacing` (audit #30).
- **Yapılacak:** `text-transform:uppercase`'i sadece `.eyebrow` rolüne bırak (küçük etiketler). Nav, buton, başlık, kart başlığı → normal case. `letter-spacing` > `.02em` olan yerleri düşür/kaldır (eyebrow hariç). `font-weight: 800/900/950` → 600.
- **Kabul kriterleri:** `grep -rn "uppercase" styles` sadece birkaç eyebrow satırı; `950/900/800` weight yok.
- **Test kriterleri:** Build yeşil; nav ve başlıklar sakin; before/after.

### TASK-047
- **Başlık:** Spacing değerlerini token'a taşı — `layout.css`, `home`, `login.css`, `siparis.css`
- **Kategori:** Spacing · **Faz:** 4 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-044
- **Etkilenen dosyalar:** ilgili CSS
- **Problem:** Magic number padding/gap (audit #28).
- **Yapılacak:** `padding/margin/gap` değerlerini `var(--s-*)`'e map et (en yakın). `100vh`/`vh` bazlı boyutları gözden geçir. `arena-page padding: 140px 40px 60px 110px` gibi "sabit elemandan kaçış" değerlerini `--rail-gap` token'ıyla ifade et.
- **Kabul kriterleri:** Bu dosyalarda çıplak px spacing minimumda.
- **Test kriterleri:** Build yeşil; ilgili sayfalar dengeli; before/after.

### TASK-048 … TASK-051
- **Başlık:** Spacing token migrasyonu — kalan CSS (her biri ayrı task)
  - **TASK-048:** `menu.css` + `kahvearenasi/topluluk.css`
  - **TASK-049:** `kahveniolustur.css` + `profil.css`
  - **TASK-050:** `adminpanel.css`
  - **TASK-051:** `hakkimizda.css` (kendi `--spacing-*` setini genel `--s-*` ile değiştir)
- **Kategori:** Spacing · **Faz:** 4 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-047
- **Yapılacak (her task):** Çıplak spacing → `var(--s-*)`; dosyaya özel spacing token seti varsa sil; `clamp()` gereken responsive yerlerde token aralıklarıyla `clamp`.
- **Kabul/Test (her task):** Build yeşil; ilgili sayfa dengeli; before/after; `grep` ile o dosyada dağınık px spacing azaldı.

### TASK-052
- **Başlık:** FAZ 4 regression checkpoint
- **Kategori:** QA · **Faz:** 4 · **Bağımlılıklar:** TASK-043…051
- **Yapılacak:** Build + tsc. Tüm sayfalarda tipografi hiyerarşisi (H1>H2>H3>body) tutarlı; gradient text yok; uppercase minimal; spacing dengeli. `WORKLOG.md`.
- **Test kriterleri:** Checklist. Faz 4 → COMPLETE.

---

## FAZ 5 — NAVIGATION

### TASK-053
- **Başlık:** `HeaderNav` yeniden yapı — tek kaynak, sade markup
- **Kategori:** Navigation · **Faz:** 5 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-052, TASK-017
- **Etkilenen dosyalar:** `components/HeaderNav.tsx`, `styles/layout.css` (nav kısmı)
- **Problem:** İki nav kaynağı, gradient logo, `position:fixed` logo, blur pill (audit #15/#16).
- **Yapılacak:** `NAV_ITEMS`'tan tek render. Header: sol logo (düz), orta/sağ yatay nav (desktop). Glass/blur pill → düz `--surface` + alt `--line` border (sticky). Logo `position:fixed` kaldır, header flex akışına al.
- **Kabul kriterleri:** Tek nav kaynağı; blur/gradient yok; sticky header düz.
- **Test kriterleri:** Build yeşil; desktop nav çalışıyor; scroll'da header davranışı düzgün.

### TASK-054
- **Başlık:** Tablet & mobil navigasyon — gerçek çözüm (drawer/menu)
- **Kategori:** Navigation · **Faz:** 5 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-053
- **Etkilenen dosyalar:** `components/HeaderNav.tsx`, `components/NavDrawer.tsx` (yeni), `styles/layout.css`
- **Problem:** `<1024` metin nav gizli, hamburger yok; 768–1024 ölü bölge; sol ikon rayı hover-only etiket (audit #15/#16).
- **Yapılacak:** `<lg` (1024) altında: header'da hamburger → erişilebilir `NavDrawer` (focus-trap, ESC, `aria-expanded`, `aria-controls`, arka plan `inert`/scroll-lock). Sol dikey ikon rayı KALDIR (veya sadece `>=lg`'de opsiyonel, etiketler kalıcı/focus'ta görünür). Mobil alt bar kararı: drawer yeterli → alt bar kaldır; ya da 3–4 birincil öğe için alt bar + drawer "daha fazla". Karar: **drawer tek çözüm**, alt bar kaldırılır (sadelik).
- **Kabul kriterleri:** Her genişlikte tek, öngörülebilir gezinme; klavye ile tam kullanılabilir.
- **Test kriterleri:** Build yeşil; 1440/1024/768/390 test; Tab/ESC ile drawer; `axe` temel kontrol.

### TASK-055
- **Başlık:** Aktif / hover / focus durumları
- **Kategori:** Navigation · **Faz:** 5 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-054
- **Etkilenen dosyalar:** `components/HeaderNav.tsx`, `NavDrawer.tsx`, `styles/layout.css`
- **Problem:** Aktif sayfa göstergesi yok; hover `::after` glow'lu; focus yok.
- **Yapılacak:** `usePathname()` ile aktif link (`aria-current="page"` + görsel: aksan alt çizgi/renk, glow YOK). Hover: renk `--ink`→`--accent` veya alt çizgi (transition `--t-fast`). Focus: global `:focus-visible` halkası (token). Glow `box-shadow` alt çizgi kaldır.
- **Kabul kriterleri:** Aktif sayfa belli; 3 durum da tanımlı; glow yok.
- **Test kriterleri:** Build yeşil; her sayfada doğru aktif link; klavye focus görünür.

### TASK-056
- **Başlık:** Mobil touch target & header yüksekliği
- **Kategori:** Navigation/Responsive · **Faz:** 5 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-054
- **Etkilenen dosyalar:** `styles/layout.css`, `HeaderNav.tsx`
- **Problem:** İkon/hedef ~36–44px sınırı; `.logo` mobilde 38px; toast `top:100px` header'la çakışabilir.
- **Yapılacak:** Tüm nav etkileşim hedefleri ≥44×44px. Header yüksekliği token (`--header-h`). Toast viewport `top` = `--header-h + --s-3`. `body` üst padding/scroll-margin `--header-h`.
- **Kabul kriterleri:** Hedefler ≥44px; header ile içerik/toast çakışmıyor.
- **Test kriterleri:** Build yeşil; 390/375'te elle dokunma testi; sticky header içeriği örtmüyor.

### TASK-057
- **Başlık:** Breadcrumb / geri-kapat tutarlılığı (modal & alt sayfalar)
- **Kategori:** Navigation · **Faz:** 5 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-055
- **Etkilenen dosyalar:** ilgili sayfa client'ları
- **Problem:** "Kapat"/"Geri" kimi yerde `×`, kimi `✕`, kimi lucide `X`; drawer/modal davranışı farklı.
- **Yapılacak:** Tüm kapat aksiyonları lucide `X` + `aria-label="Kapat"`. "Geri" gereken yerde (örn. checkout adımları) tutarlı `ArrowLeft` + metin. (Modal component'i Faz 6'da; burada mevcut kapatma butonlarını standardize et.)
- **Kabul kriterleri:** Kapat/geri ikon+etiket tutarlı.
- **Test kriterleri:** Build yeşil; menü modal / profil modal / arena drawer kapatma tutarlı.

### TASK-058
- **Başlık:** `iconbar` kaldırma sonrası layout temizliği
- **Kategori:** Navigation/CSS · **Faz:** 5 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-054
- **Etkilenen dosyalar:** `styles/layout.css`, sayfa CSS'lerindeki `padding-left: 110px` vb.
- **Problem:** Sayfalar sol sabit ray için asimetrik padding varsayıyor (`arena-page padding-left:110px`, `menu.css padding-left:60px`).
- **Yapılacak:** `iconbar` ilgili tüm CSS bloklarını sil. Sayfa container'larında ray-kaçış padding'lerini normal simetrik `--container` + `--s-*` ile değiştir. `body{padding-bottom:75px}` (alt bar) kaldır.
- **Kabul kriterleri:** Ray'a ait CSS yok; sayfa içerikleri ortalı/simetrik.
- **Test kriterleri:** Build yeşil; arena/menu/builder sol boşluğu normal; before/after.

### TASK-059
- **Başlık:** `HeaderNav` auth durumu — `lib/session` üzerinden
- **Kategori:** Navigation/Mimari · **Faz:** 5 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-053, TASK-007
- **Etkilenen dosyalar:** `lib/session.ts` (yeni), `components/HeaderNav.tsx`, `app/giris/*`, `app/profil/*`
- **Problem:** `localStorage.user` doğrudan okunuyor; `authChanged` custom event; dağınık.
- **Yapılacak:** `lib/session.ts`: `getUser()`, `setUser()`, `clearUser()`, `isAdmin()`, `subscribe(cb)` (storage event + custom). `HeaderNav` ve diğerleri bunu kullanır. Davranış aynı (client-side), sadece merkezîleşir. Admin kontrolü hâlâ client (sertleştirme BL-02).
- **Kabul kriterleri:** `localStorage.getItem("user")` sadece `lib/session` içinde.
- **Test kriterleri:** Build yeşil; giriş/çıkış → nav anında güncelleniyor.

### TASK-060
- **Başlık:** `skip to content` linki + landmark'lar
- **Kategori:** Navigation/a11y · **Faz:** 5 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-053
- **Etkilenen dosyalar:** `app/layout.tsx`, `styles/base.css`
- **Problem:** Klavye kullanıcısı her sayfada nav'ı geçmek zorunda; landmark eksik.
- **Yapılacak:** `<a class="skip-link" href="#main">İçeriğe geç</a> (focus'ta görünür)`. `<main id="main">`. `<header>`/`<nav aria-label>`/`<footer>` landmark'ları netleştir.
- **Kabul kriterleri:** Skip link çalışıyor; landmark yapısı temiz.
- **Test kriterleri:** Build yeşil; Tab → ilk odak skip link; Enter → main'e atlıyor.

### TASK-061
- **Başlık:** FAZ 5 regression checkpoint
- **Kategori:** QA · **Faz:** 5 · **Bağımlılıklar:** TASK-053…060
- **Yapılacak:** Build + tsc. Desktop/tablet/mobil nav; aktif state; drawer klavye; skip link; hiçbir sayfa ray padding'i yüzünden bozuk değil. `WORKLOG.md`.
- **Test kriterleri:** Checklist. Faz 5 → COMPLETE.

---

## FAZ 6 — ORTAK COMPONENTLER

> Konvansiyon: `components/ui/<Name>/<Name>.tsx` + `<Name>.module.css` + `index.ts`. Variant/size prop; token'dan beslenir; yeni ad-hoc CSS yok. Her component'in migrasyonu Faz 7'de sayfa bazlı.

### TASK-062
- **Başlık:** `Button` + `IconButton`
- **Kategori:** Component · **Faz:** 6 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-061
- **Etkilenen dosyalar:** `components/ui/Button/*`
- **Problem:** 8+ farklı buton stili (audit #17).
- **Yapılacak:** `Button`: `variant: 'primary'|'secondary'|'ghost'|'danger'`, `size:'md'|'lg'`, `loading`, `disabled`, `as`/`href` (link veya button), ikon slot. `IconButton`: kare, `aria-label` zorunlu (TS ile), size `sm/md`. Focus-visible, reduced-motion, ≥44px lg / ≥40px md. Radius `--r-md`. Hover = renk/border, transform yok.
- **Kabul kriterleri:** Tek component tüm buton ihtiyaçlarını karşılıyor; a11y tam.
- **Test kriterleri:** Build yeşil; geçici bir `/dev` sayfasında (veya Storybook yoksa bir demo) tüm varyantlar görünüyor; tsc temiz.

### TASK-063
- **Başlık:** `Input` + `Textarea` + `FormField` (+ `Select`)
- **Kategori:** Component · **Faz:** 6 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-062
- **Etkilenen dosyalar:** `components/ui/Field/*`
- **Problem:** 4+ farklı input stili; inline style hata metni (audit #18/#33).
- **Yapılacak:** `FormField` (label + hint + error + `htmlFor`/`aria-describedby`/`aria-invalid` bağlama). `Input`/`Textarea`/`Select` kontrolsüz+kontrollü destek. Tek görsel stil (border `--line`, focus `--accent` ring, radius `--r-sm`). Şifre alanı için `Input type=password` + göster/gizle opsiyonu.
- **Kabul kriterleri:** Tek form alanı sistemi; hata/hint tutarlı; inline style yok.
- **Test kriterleri:** Build yeşil; demo formda validasyon + a11y bağlama çalışıyor.

### TASK-064
- **Başlık:** `Card` (+ `CardHeader/Body/Footer` alt parçalar)
- **Kategori:** Component · **Faz:** 6 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-062
- **Etkilenen dosyalar:** `components/ui/Card/*`
- **Problem:** Her sayfada farklı kart (audit #19).
- **Yapılacak:** `Card`: `as`, `interactive` (hover'da border/aksan, transform yok), `elevated` (`--shadow-1`), padding size. Ürün kartı, sipariş kartı, seçki kartı bunun üstüne kurulur.
- **Kabul kriterleri:** Tek kart primitive'i; radius/shadow token'lı.
- **Test kriterleri:** Build yeşil; demo'da varyantlar.

### TASK-065
- **Başlık:** `Badge` / `Tag` / `Pill`
- **Kategori:** Component · **Faz:** 6 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-062
- **Yapılacak:** `Badge`: `tone: 'neutral'|'accent'|'success'|'warning'|'danger'`, `size`. Sipariş durumu, "Arena", indirim, origin/kavurma etiketi için. Gradient/glow yok.
- **Kabul/Test:** Build yeşil; demo varyantlar; kontrast AA.

### TASK-066
- **Başlık:** `Modal` / `Dialog` (erişilebilir) + `ConfirmDialog`
- **Kategori:** Component · **Faz:** 6 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-062
- **Etkilenen dosyalar:** `components/ui/Modal/*`, `components/ui/ConfirmDialog/*`
- **Problem:** Modal davranışları tutarsız; `window.confirm` 4 yerde (audit #20/#12).
- **Yapılacak:** `Modal`: portal, `role="dialog" aria-modal`, focus-trap, ESC, overlay tık kapat (opsiyonel), scroll-lock, `aria-labelledby`. `ConfirmDialog`: `confirm({title, description, confirmText, tone})` → Promise<boolean> (hook veya provider). Native `confirm` yerine geçer.
- **Kabul kriterleri:** Tek erişilebilir modal; `confirm()` API'si hazır.
- **Test kriterleri:** Build yeşil; demo modal klavye/focus; ConfirmDialog Promise akışı.

### TASK-067
- **Başlık:** `Toast` — mevcut `ToastProvider`'ı ui sistemine hizala
- **Kategori:** Component · **Faz:** 6 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-065
- **Etkilenen dosyalar:** `components/ToastProvider.tsx` → `components/ui/Toast/*`
- **Problem:** İyi temel ama stil ad-hoc, blur var, konum header'la çakışabilir.
- **Yapılacak:** Görselini token'a bağla, `backdrop-filter` kaldır, konum `--header-h` ile hizala. API korunur (`useToast`). `tone` renkleri semantik token.
- **Kabul kriterleri:** Toast token'lı, blursuz, header'la çakışmıyor; API aynı.
- **Test kriterleri:** Build yeşil; başarı/hata toast görünümü; mobil konum.

### TASK-068
- **Başlık:** `Tabs`
- **Kategori:** Component · **Faz:** 6 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-062
- **Yapılacak:** Erişilebilir `Tabs` (`role="tablist/tab/tabpanel"`, ok tuşları, `aria-selected`). Profil (Gönderiler/Kahvelerim/Siparişlerim) ve Admin sekmeleri için.
- **Kabul/Test:** Build yeşil; klavye ile sekme gezme; demo.

### TASK-069
- **Başlık:** `Stepper` (checkout adımları)
- **Kategori:** Component · **Faz:** 6 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-062
- **Yapılacak:** Yatay/dikey `Stepper`: adım listesi, aktif/tamamlanmış/bekleyen, `aria-current`. Numaralı işaretçi SADECE gerçek sıra olduğu için uygun (checkout). Glow yok.
- **Kabul/Test:** Build yeşil; demo 4 adım; responsive (mobilde kompakt).

### TASK-070
- **Başlık:** `Progress` (belirli / belirsiz)
- **Kategori:** Component · **Faz:** 6 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-062
- **Yapılacak:** `Progress value max` (`role="progressbar"` + aria). Builder "N/8" ve yükleme durumları. İnce, token renkli, animasyon minimal.
- **Kabul/Test:** Build yeşil; demo; reduced-motion'da statik.

### TASK-071
- **Başlık:** `EmptyState` / `LoadingState` / `ErrorState`
- **Kategori:** Component · **Faz:** 6 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-064
- **Problem:** Boş/yükleme/hata durumları her sayfada farklı veya yok.
- **Yapılacak:** Üç küçük component: ikon (lucide, opsiyonel) + başlık + açıklama + opsiyonel aksiyon (`Button`). `LoadingState`: nötr skeleton/spinner (glow yok). Tutarlı boşluk/hizalama.
- **Kabul/Test:** Build yeşil; demo üç durum; metin developer dili içermiyor.

### TASK-072
- **Başlık:** `Dropdown` / `Menu` (gerekiyorsa)
- **Kategori:** Component · **Faz:** 6 · **Öncelik:** P3 · **Bağımlılıklar:** TASK-066
- **Yapılacak:** Sadece gerçek ihtiyaç varsa (örn. admin sipariş aksiyonları, kategori sıralama). Erişilebilir menü (`role="menu"`, ok tuşları, ESC). İhtiyaç yoksa `Select` yeterli → task NO-OP olarak kapat, notu yaz.
- **Kabul/Test:** Build yeşil; kullanılıyorsa a11y; kullanılmıyorsa gerekçe `WORKLOG`.

### TASK-073
- **Başlık:** `Container` / layout primitive'leri
- **Kategori:** Component · **Faz:** 6 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-028
- **Yapılacak:** `.container` (max-width `--container`, yatay padding `--s-*`, ortalı), `.stack`/`.cluster` (gap tabanlı flex yardımcıları) `styles/utilities.css`. Sayfalar bunları kullanır.
- **Kabul/Test:** Build yeşil; bir sayfada uygulanınca hizalama tutarlı.

### TASK-074
- **Başlık:** `Price` / para birimi formatlayıcı component + util
- **Kategori:** Component/Util · **Faz:** 6 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-016
- **Etkilenen dosyalar:** `lib/format.ts` (yeni), `components/ui/Price/*`
- **Problem:** `TL` vs `₺`, biçim yok (audit #36).
- **Yapılacak:** `formatPrice(n)` = `Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:0})`. `<Price value strike?/>` component. Tüm fiyat gösterimleri bunu kullanacak (migrasyon Faz 7/8).
- **Kabul/Test:** Build yeşil; `formatPrice(1500)` → "₺1.500"; demo.

### TASK-075
- **Başlık:** `RoastMeter` / `IntensityDots` / `OriginTag` — marka bilgi-tasarımı primitive'leri
- **Kategori:** Component/Brand · **Faz:** 6 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-064, TASK-065
- **Problem:** Marka kimliği zayıf, generic (audit #44); kahveye özgü görsel dil yok.
- **Yapılacak:** Küçük, veri-sürücülü göstergeler: `RoastMeter level={1..5}` (bar), `IntensityDots value`, `OriginTag origin`, `TastingNotes notes[]` (pill). Token renkli, dekoratif değil bilgilendirici. Menü ürün kartı, ürün detay, builder özeti kullanacak.
- **Kabul kriterleri:** Bu primitive'ler kahve domain'ine özgü ve fonksiyonel; klişe görsel yok.
- **Test kriterleri:** Build yeşil; demo; light/dark okunur.

### TASK-076 … TASK-082
- **Başlık:** Component demo/QA + erişilebilirlik geçişi (parçalı)
  - **TASK-076:** `components/ui` barrel `index.ts` + tip export'ları
  - **TASK-077:** `/dev/ui` iç demo sayfası (prod'da noindex; sadece geliştirici görsel QA) — veya README tablo
  - **TASK-078:** Button/IconButton a11y & reduced-motion & focus testi + düzeltme
  - **TASK-079:** Field/Select a11y (label/aria/hata) testi + düzeltme
  - **TASK-080:** Modal/ConfirmDialog/Drawer focus-trap & ESC & scroll-lock testi + düzeltme
  - **TASK-081:** Tabs/Stepper/Progress klavye & aria testi + düzeltme
  - **TASK-082:** Toast/EmptyState/LoadingState/ErrorState tutarlılık testi + düzeltme
- **Kategori:** Component/QA · **Faz:** 6 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-062…075
- **Kabul/Test (her task):** İlgili component build+tsc temiz; klavye ile tam kullanılabilir; light/dark; reduced-motion; demo'da görünür.

### TASK-083
- **Başlık:** FAZ 6 regression checkpoint
- **Kategori:** QA · **Faz:** 6 · **Bağımlılıklar:** TASK-062…082
- **Yapılacak:** Build + tsc + lint. Tüm ui component'leri demo'da; hiçbir sayfa henüz migrate edilmedi ama build sağlam. `WORKLOG.md`.
- **Test kriterleri:** Checklist. Faz 6 → COMPLETE.

---

## FAZ 7 — SAYFA SAYFA UI/UX REFACTOR

> Her sayfa: mevcut ad-hoc CSS'i `ui` component'leri + token'lara taşı; layout/hiyerarşi/spacing/empty-loading-error; efekt temizliği (glass/blur/glow/shadow/3D/hover-move); responsive ilk elden. `styles/<sayfa>.css` küçülür veya `*.module.css`'e döner.

### TASK-084 — Ana sayfa refactor
- **Faz:** 7 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-083, TASK-020
- **Etkilenen:** `app/page.tsx`, `app/_home/*`, `styles/home*`
- **Yapılacak:** Hero'yu `Container`+tip ölçeği ile sadeleştir; ürün vitrini `Card`+`Price`+`RoastMeter`; CTA'lar `Button`; görsel yer tutucular tint blok. Efekt yok. 1440/1024/768/390.
- **Kabul/Test:** Build yeşil; 3 sn testi geçer; responsive; before/after.

### TASK-085 — Menü refactor (bölüm 1: layout & kart)
- **Faz:** 7 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-084
- **Etkilenen:** `app/menu/MenuClient.tsx`, `styles/menu.css`
- **Problem:** Ayrı açık tema, fotoğraf-bg + `background-attachment:fixed`, translucent kart, 285px sabit grid, `grid-auto-flow:dense` (audit #7/#14, E5).
- **Yapılacak:** Sayfayı ana temaya al (fotoğraf-bg kaldır veya çok hafif tek görsel + düz zemin; `background-attachment:fixed` kaldır). Ürün ızgarası responsive `auto-fill, minmax(240px,1fr)`. Ürün kartı = `Card` + görsel + ad (Fraunces) + `Price` + `RoastMeter`/`OriginTag` + "Sepete Ekle" (`Button`, işlev Faz 8). `is-expanded` inline-genişleme KALDIR.
- **Kabul/Test:** Build yeşil; menü ana temayla uyumlu; ızgara zıplamıyor; responsive.

### TASK-086 — Menü refactor (bölüm 2: yorum/puan → ürün detay)
- **Faz:** 7 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-085
- **Etkilenen:** `app/menu/MenuClient.tsx`, `app/menu/[slug]/*` (yeni ürün detay route) veya `Modal`
- **Problem:** Kart içinde yorum formu + görsel yükleme + modal + inline iki desen; minik scroll alanı.
- **Yapılacak:** Yorum/puan/görsel-yükleme akışını **ürün detay** görünümüne taşı (route `/menu/[slug]` tercih; alternatif tek `Modal`). Karttan yorum formunu çıkar; kart sade kalır ("İncele" → detay). Detayda: büyük görsel, açıklama, spec (roast/origin/notes), fiyat, "Sepete Ekle", altında yorumlar + yorum formu (`FormField`).
- **Kabul/Test:** Build yeşil; karttan detaya geçiş; yorum ekleme çalışıyor (mevcut localStorage davranışı korunur, sonra `lib`'e); responsive.
- **Davranış notu:** Eski: kartta gömülü yorum + inline expand + modal. Yeni: sade kart + ayrı detay. İşlev korunur, yer değişir.

### TASK-087 — Menü modal/expand temizliği & kategori kontrolü
- **Faz:** 7 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-086
- **Yapılacak:** Kalan `menu-modal`/`is-expanded`/`is-dimmed` CSS'i sil. Kategori butonları → segmented control (`Tabs` veya buton grubu), kontrast token'lı. "Arena şampiyonu" kutusunu sadeleştir (`Card` + `Badge`, dev sarı kutu yok) veya ana sayfaya taşı.
- **Kabul/Test:** Build yeşil; menü CSS belirgin küçüldü; before/after.

### TASK-088 — Kahveni Oluştur refactor (bölüm 1: layout)
- **Faz:** 7 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-085
- **Etkilenen:** `app/kahveniolustur/*`, `components/CoffeeRight.tsx`, `components/ConfigSection.tsx`, `styles/kahveniolustur.css`
- **Problem:** Faz 1'de akış düzeldi ama görsel hâlâ ad-hoc; coffee-bg + overlay + blur kutular.
- **Yapılacak:** İki kolon: sol = yapışkan (sticky, `position:sticky` — `fixed` değil) **tarif özeti kartı** (`Card`): seçili öğeler listesi, `RoastMeter`/`IntensityDots`, fiyat dökümü (`Price`), yaratıcılık puanı + açıklama, CTA (`Button`, `Progress` "N/8"). Sağ = seçim bölümleri normal akış. Arka plan düz `--paper` (coffee-bg + overlay + blur kaldır).
- **Kabul/Test:** Build yeşil; sticky özet çalışıyor; 1024/768/390'da tek kolona iniyor; efekt yok.

### TASK-089 — Kahveni Oluştur refactor (bölüm 2: seçim bölümleri)
- **Faz:** 7 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-088
- **Etkilenen:** `components/ConfigSection.tsx`, `styles/kahveniolustur.css`
- **Problem:** `.milk-item` `<div onClick>`, hover `translateX(5px)`, 24px kırmızı `*`.
- **Yapılacak:** Seçenekleri `role="radiogroup"` + `role="radio"` (veya `<label><input type=radio>`); klavye ok tuşları; seçili durum aksan border + işaret (glow yok); hover renk (transform yok). Fiyat/güç etiketi mono, sağda. Bölüm başlığı `h2` yerine `h3` + "gerekli" küçük etiket (kırmızı `*` yok).
- **Kabul/Test:** Build yeşil; klavye ile tam seçim; ekran okuyucu grupları anlıyor; before/after.

### TASK-090 — /siparis refactor (görsel + component)
- **Faz:** 7 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-088
- **Etkilenen:** `app/siparis/*`, `styles/siparis.css`
- **Yapılacak:** Faz 1'deki onay ekranını `Card` + `Badge`(durum) + `Price` + `Button` ile yeniden kur. `siparis-overlay`/glow/gradient kaldır. Boş durum `EmptyState`. (Sipariş takip detayı Faz 8'de genişler.)
- **Kabul/Test:** Build yeşil; onay ekranı token'lı, sade; responsive.

### TASK-091 — Topluluk (Arena) refactor (bölüm 1: sayfa yapısı)
- **Faz:** 7 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-084
- **Etkilenen:** `app/topluluk/*Client.tsx`, `styles/topluluk.css`
- **Problem:** Kupalar/glow/gradient başlık/float/3D tilt/noise bg; kart başına 6+ aksiyon (audit #43/#24).
- **Yapılacak:** Sayfa başlığı sade (`h1` + kısa açıklama + "bu ayın seçkisi — N gün"). Bölümler: kısa "nasıl çalışır" (3 adım, ikon lucide, glow yok), seçki listesi (`Card` grid), sıralama (podium → sade "ilk 3" listesi/kart, 3D yok, taç → küçük `Badge`). Noise/gradient/overlay bg kaldır.
- **Kabul/Test:** Build yeşil; sayfa sakin; işlev (liste/sıralama) duruyor; responsive.

### TASK-092 — Topluluk refactor (bölüm 2: gönderi kartı & aksiyonlar)
- **Faz:** 7 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-091
- **Etkilenen:** `app/topluluk/*Client.tsx`, `styles/topluluk.css`
- **Problem:** Kartta Oy/Yorum/Kopyala/Sil + kullanıcı satırı + kart tık; turuncu gradient oy butonu.
- **Yapılacak:** Kart aksiyonlarını 2 birincil + taşan menü: "Oy" (`Button secondary`, sayaç), "Yorum" (toggle). "Tarifi kopyala" ve "Sil" → `IconButton` üst köşe veya `Dropdown`. Oy butonu gradient/glow → düz. Kullanıcı satırı tıklanınca drawer (mevcut) — drawer'ı `Modal`/`Drawer` component'ine taşı.
- **Kabul/Test:** Build yeşil; oy/yorum/kopyala/sil çalışıyor; görsel hiyerarşi net; before/after.

### TASK-093 — Topluluk refactor (bölüm 3: user drawer + skeleton)
- **Faz:** 7 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-092
- **Yapılacak:** `user-drawer` → `Drawer` (a11y). Skeleton → `LoadingState`. Kalan `topluluk.css` glow/gradient/`transition-smooth 0.5s` sadeleştir.
- **Kabul/Test:** Build yeşil; drawer klavye; yükleme durumu tutarlı.

### TASK-094 — Profil refactor (bölüm 1: hero & düzen)
- **Faz:** 7 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-084
- **Etkilenen:** `app/profil/ProfilClient.tsx`, `styles/profil.css`
- **Problem:** Yoğun 720px tek kolon; iki avatar yükleme yeri; bio autosave vs modal Kaydet tutarsız (audit #47).
- **Yapılacak:** Hero: avatar (tek yükleme noktası), ad, e-posta, "Profili düzenle" (`Button`), istatistikler (`Card` içinde). `Tabs`: "Gönderiler" / "Kahvelerim" / "Siparişlerim" (sipariş sekmesi Faz 8 verisiyle dolar). Bio düzenlemeyi modal'a al (tek kayıt modeli) veya net "otomatik kaydedildi" göstergesi.
- **Kabul/Test:** Build yeşil; sekmeler çalışıyor; responsive; before/after.

### TASK-095 — Profil refactor (bölüm 2: "Toplulukta Paylaş" akışı)
- **Faz:** 7 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-094
- **Problem:** Kahve seç → adı tekrar yaz → görseli tekrar yükle → metin (E12); `coffee-select-details` 8 "yok" etiketi gösteriyor.
- **Yapılacak:** Kahve seçilince ad + (varsa) görsel **otomatik dolar**, düzenlenebilir. Sadece dolu detay etiketleri gösterilir ("Süt yok" gizli). Form `FormField` + `Button`. `isShareDisabled` mantığı sadeleşir (metin + kahve yeterli; görsel opsiyonel varsayılan).
- **Kabul/Test:** Build yeşil; paylaşım daha az adımda; toplulukta görünüyor; before/after.
- **Davranış notu:** Eski: tüm alanlar zorunlu ve tekrar. Yeni: otomatik doldur + opsiyonel görsel.

### TASK-096 — Profil refactor (bölüm 3: modal & confirm & kart)
- **Faz:** 7 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-095
- **Yapılacak:** "Profili Düzenle" modalını `Modal` component'ine taşı (ESC/focus-trap). `window.confirm` (deletePost, deleteCoffee) → `ConfirmDialog`. `PostCards`/coffee-select `Card`'a. Kalan `profil.css` efekt temizliği.
- **Kabul/Test:** Build yeşil; silme onayı markalı; modal a11y.

### TASK-097 — Giriş refactor
- **Faz:** 7 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-083
- **Etkilenen:** `components/AuthForm.tsx`, `app/giris/*`, `styles/login.css`
- **Problem:** İyi temel ama inline style, `blur-active` gereksiz, ekstrem stiller.
- **Yapılacak:** `AuthForm`'u `FormField`/`Input`/`Button` üstüne kur. Inline style'ları kaldır. `blur-active` (focus'ta kartı bulanıklaştırma) kaldır. "Şifremi unuttum" linki: özellik yoksa gizle (audit #19 — "yakında" gösterme) veya gerçek bir `/sifre-sifirla` iskelet sayfası. Hata metni `FormField` error.
- **Kabul/Test:** Build yeşil; giriş çalışıyor (admin + normal); a11y; inline style yok.

### TASK-098 — Kayıt refactor
- **Faz:** 7 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-097
- **Yapılacak:** `AuthForm` paylaşımıyla otomatik faydalanır. Ek: parola için basit kural/ipucu ("en az 8 karakter"), opsiyonel "parolayı doğrula" alanı, başarı sonrası net yönlendirme. `login.css` paylaşımlı, token'lı.
- **Kabul/Test:** Build yeşil; kayıt akışı; validasyon mesajları anlaşılır.

### TASK-099 — Hakkımızda refactor
- **Faz:** 7 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-084
- **Etkilenen:** `app/hakkimizda/page.tsx`, `styles/hakkimizda.css`
- **Problem:** Generic içerik (audit #45); `<img>` (E5); kendi ölçeği; dengesiz kart (biri 60 kelime).
- **Yapılacak:** İçeriği somutlaştır (kuruluş, konum, kavurma yaklaşımı, ekip) — placeholder ama gerçekçi ve markaya özel; klişe cümleleri azalt. `h1` = "Hakkımızda" (marka tekrarı değil). 4 amaç kartını eşit uzunlukta yaz, `Card` grid. `<img>` → `next/image` veya tint placeholder. Playfair'i display token'ıyla değiştir (Fraunces).
- **Kabul/Test:** Build yeşil; içerik dengeli; SaaS testinde markaya özel; responsive.

### TASK-100 — Admin Panel refactor (bölüm 1: shell & tema)
- **Faz:** 7 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-083
- **Etkilenen:** `app/adminpanel/*`, `components/AdminSidebar.tsx`, `styles/adminpanel.css`
- **Problem:** Generic SaaS dashboard; 3. palet; emoji ikonlar; canlı saat; badge (audit #42/#21).
- **Yapılacak:** Paleti `--accent`/semantik token'a bağla (gold sistem kaldır). Sidebar → `NAV_ITEMS` stilinde sade liste, lucide ikon. Emoji ikonları (`📊📋🛍️☕💰📈⭐🏆🎁🗑️🔍`) lucide ile değiştir. Canlı saat kaldır veya küçült. Masaüstü sayfa başlığı ekle. Gradient status pill → `Badge` (tone).
- **Kabul/Test:** Build yeşil; admin markayla uyumlu; emoji yok; responsive sidebar/drawer.

### TASK-101 — Admin Panel refactor (bölüm 2: dashboard & stat)
- **Faz:** 7 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-100
- **Etkilenen:** `components/Dashboard.tsx`
- **Problem:** Emoji stat kartları; "Aktif Ürün" yanlış etiket `totalCoffees` (E6).
- **Yapılacak:** Stat kartları `Card` + sayı (mono) + doğru etiket ("Aktif Ürün" → "Tasarlanan Kahve" veya gerçek ürün sayısı). İkon lucide veya yok. `Price` ile gelir. "Sipariş Durumu" kutuları `Badge`/sade.
- **Kabul/Test:** Build yeşil; etiketler doğru; before/after.

### TASK-102 — Admin Panel refactor (bölüm 3: orders/products/coffees panelleri)
- **Faz:** 7 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-101
- **Etkilenen:** `components/OrdersPanel.tsx`, `OrderCard.tsx`, `ProductsPanel.tsx`, `AdminPanelClient.tsx` (coffees)
- **Yapılacak:** `OrderCard` → `Card`+`Badge`+`Button`(durum aksiyonları via `lib/orders.updateOrderStatus`). `ProductsPanel` form → `FormField`+`Button`; liste `Card`. Coffees listesi `Card`. Arama/filtre `Input`/`Tabs`. Emoji `🗑️` → `IconButton`+lucide `Trash2`.
- **Kabul/Test:** Build yeşil; sipariş durumu güncelleme çalışıyor; ürün ekle/sil; responsive.

### TASK-103 — `<img>` vs `next/image` tutarlılığı
- **Faz:** 7 · **Öncelik:** P3 · **Bağımlılıklar:** TASK-099, TASK-102
- **Etkilenen:** `app/hakkimizda`, `AdminPanelClient` (coffee img), grep `<img`
- **Problem:** Karışık kullanım; `next.config` `unoptimized:true` (E5).
- **Yapılacak:** Base64/data-URL görseller (`<img>` gereken) hariç hepsini `next/image`'e çevir; `unoptimized` notunu koru (Vercel workaround) ama tutarlı API. Kullanıcı yüklediği base64'ler `<img>` kalır, yorum ekle.
- **Kabul/Test:** Build yeşil; görseller yükleniyor; layout shift yok.

### TASK-104 — Sayfa CSS'lerini modüle/temizliğe indir
- **Faz:** 7 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-084…103
- **Etkilenen:** `styles/*.css`
- **Yapılacak:** Her sayfa CSS dosyasında artık kullanılmayan kuralları sil (ui component'lerine taşınanlar). Mümkün olanları `*.module.css`'e çevir veya net sayfa-prefix'li tut. Hedef: toplam CSS satırı belirgin azalsın, çakışma yok.
- **Kabul/Test:** Build yeşil; `grep` ile ölü sınıflar taranır; sayfalar bozulmadı.

### TASK-105 — Sahte veri / "yakında" / tutarsızlık son taraması (sayfa bazlı)
- **Faz:** 7 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-104
- **Yapılacak:** Tüm sayfalarda: sahte sayı/kullanıcı, "yakında" özelliği, çelişkili indirim, `TL`/`₺` kalıntısı, developer metni son kez tara ve temizle (`Price` component'i + `formatPrice` her yerde).
- **Kabul/Test:** Build yeşil; `grep` temiz; her fiyat `Price`/`formatPrice`.

### TASK-106 — FAZ 7 regression checkpoint
- **Kategori:** QA · **Faz:** 7 · **Bağımlılıklar:** TASK-084…105
- **Yapılacak:** Build + tsc + lint. 10 sayfayı tek tek: layout/hiyerarşi/tipografi/spacing/kart/buton/etkileşim/empty/loading/error/responsive. "Sayfadan sayfaya tema değişiyor mu?" testi. `WORKLOG.md`.
- **Test kriterleri:** Checklist. Faz 7 → COMPLETE.

---

## FAZ 8 — E-TİCARET

### TASK-107 — Ürün veri modeli (merkezî, tipli)
- **Faz:** 8 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-106, TASK-074
- **Etkilenen:** `lib/products.ts` (yeni), `lib/types.ts`, `app/menu/*`
- **Problem:** Ürünler `MenuClient` içinde elle, fiyat string (audit #49, E7).
- **Yapılacak:** `lib/products.ts`: `PRODUCTS: Product[]` (`id, slug, name, category, priceKurus:number, image, roast?, origin?, intensity?, notes?[], description?`). Fiyat **kuruş cinsinden integer**. `getProducts()/getProduct(slug)/getByCategory()`. `MenuClient` bu kaynaktan okur.
- **Kabul/Test:** Build+tsc; menü aynı ürünleri gösteriyor; fiyatlar `formatPrice` ile.

### TASK-108 — Fiyatlandırma çekirdeği (builder + indirim + sepet)
- **Faz:** 8 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-107
- **Etkilenen:** `lib/pricing.ts` (yeni), `app/kahveniolustur/*`
- **Problem:** `basePrice=100` gömülü; indirim oranı dağınık (audit #35).
- **Yapılacak:** `lib/pricing.ts`: `BASE_COFFEE_KURUS`, `ARENA_DISCOUNT=0.15`, `priceRecipe(recipe): {subtotal, discount, total}` (kuruş). Builder bunu kullanır; Arena "tarifi kopyala" indirimi buradan.
- **Kabul/Test:** Build+tsc; builder fiyat dökümü doğru; indirim tutarlı.

### TASK-109 — Sepet veri katmanı + context
- **Faz:** 8 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-107
- **Etkilenen:** `lib/cart.ts` (yeni), `components/CartProvider.tsx` (yeni), `app/layout.tsx`
- **Problem:** Sepet yok (audit #7).
- **Yapılacak:** `CartLine = {kind:'product'|'recipe', ref, name, unitKurus, qty, meta?}`. `lib/cart.ts` localStorage persist (kullanıcıya bağlı anahtar). `CartProvider` + `useCart()` (`addItem, removeItem, setQty, clear, lines, count, subtotalKurus`). `layout.tsx`'e provider.
- **Kabul/Test:** Build+tsc; `useCart` demo; persist çalışıyor; kullanıcı değişince ayrışıyor.

### TASK-110 — Header sepet göstergesi
- **Faz:** 8 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-109, TASK-053
- **Yapılacak:** Header'a `IconButton` (lucide `ShoppingBag`) + `Badge` (count) → `/sepet`. Boşken de görünür.
- **Kabul/Test:** Build yeşil; ekleme sonrası sayaç artıyor; responsive.

### TASK-111 — "Sepete Ekle" — Menü kartı & ürün detay
- **Faz:** 8 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-109, TASK-085, TASK-086
- **Problem:** Menüden sipariş yok (audit #6/#14).
- **Yapılacak:** Menü kartı ve `/menu/[slug]` "Sepete Ekle" → `addItem({kind:'product'})` + toast "Sepete eklendi" + (opsiyonel) mini "Sepete git". Adet detayda seçilebilir.
- **Kabul/Test:** Build yeşil; ekleme çalışıyor; toast; sayaç.

### TASK-112 — Sepet sayfası `/sepet`
- **Faz:** 8 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-110, TASK-111
- **Etkilenen:** `app/sepet/page.tsx` + client (yeni), `styles`/module
- **Yapılacak:** Satır listesi (`Card`): görsel/ad/spec, birim fiyat, adet stepper (`−`/sayı/`+`, min 1), satır toplamı, kaldır (`IconButton`). Özet: ara toplam, indirim, (kargo — sabit/eşik), toplam (`Price`). "Ödemeye geç" (`Button primary`, disabled boşsa). Boş → `EmptyState` + "Menüye git".
- **Kabul/Test:** Build yeşil; adet değişimi fiyatı güncelliyor; kaldır; boş durum; responsive.

### TASK-113 — Adet kontrolü component'i (`QuantityStepper`)
- **Faz:** 8 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-112
- **Yapılacak:** `QuantityStepper value min max onChange` — erişilebilir (`aria-label`, klavye ±), ≥44px hedef. Sepet + ürün detay kullanır.
- **Kabul/Test:** Build yeşil; klavye ile ±; sınırlar.

### TASK-114 — Checkout iskelet + adım yönlendirme (`/odeme`)
- **Faz:** 8 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-112, TASK-069
- **Etkilenen:** `app/odeme/*` (yeni), `lib/checkout.ts` (yeni)
- **Yapılacak:** Tek route + `Stepper` ile 4 adım (client state): 1) Teslimat bilgileri, 2) Teslimat yöntemi, 3) Ödeme (demo), 4) Özet & onay. Adımlar arası ileri/geri, validasyon geçmeden ilerlemez. Giriş yoksa `/giris?next=/odeme`.
- **Kabul/Test:** Build yeşil; adımlar arası gezinme; sepet boşsa `/sepet`'e yönlendir.

### TASK-115 — Checkout adım 1: Teslimat bilgileri (adres)
- **Faz:** 8 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-114, TASK-063
- **Yapılacak:** `FormField` ile ad soyad, telefon, il, ilçe, açık adres, (opsiyonel) not. `Address` tipi. localStorage'a "son adres" kaydet (tekrar girişte otomatik doldur — audit #21 "aynı bilgiyi tekrar isteme"). Zorunlu alan doğrulama.
- **Kabul/Test:** Build yeşil; validasyon; kayıtlı adres otomatik dolar.

### TASK-116 — Checkout adım 2: Teslimat yöntemi
- **Faz:** 8 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-115
- **Yapılacak:** Radyo grup (`role=radiogroup`): "Standart (2–3 gün) — ücretsiz eşik üstü / ₺X", "Hızlı (1 gün) — ₺Y". Seçim özet toplamını etkiler. (Mağazadan al opsiyonel.)
- **Kabul/Test:** Build yeşil; seçim toplamı güncelliyor; klavye.

### TASK-117 — Checkout adım 3: Ödeme (demo)
- **Faz:** 8 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-116
- **Yapılacak:** Kart formu UI (`FormField`: kart no, son kullanma, CVC, kart üzerindeki isim) — **hiçbir şey işlemez, hiçbir yere gönderilmez**. Görünür "Demo — gerçek ödeme alınmaz" bilgisi (developer dili değil, sade). Basit format maskesi (client). "Kapıda ödeme" alternatifi de sunulabilir.
- **Kabul/Test:** Build yeşil; form validasyonu; hiçbir network isteği yok; demo notu görünür.

### TASK-118 — Checkout adım 4: Özet & sipariş oluştur
- **Faz:** 8 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-117, TASK-007
- **Yapılacak:** Tüm bilgilerin özeti (adres, yöntem, kalemler, tutarlar). "Siparişi onayla" → `createOrder({items, address, delivery, totals, payment:'demo'})` → sepeti temizle → `/siparis?o=<id>`. Hata durumunda kullanıcı-dostu mesaj.
- **Kabul/Test:** Build yeşil; uçtan uca: menü→sepet→ödeme→onay→/siparis; sipariş `lib/orders`'da; sepet temiz.

### TASK-119 — Builder'ı sepete bağla (sahte sipariş yolunu kaldır)
- **Faz:** 8 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-118, TASK-011
- **Etkilenen:** `app/kahveniolustur/KahveniOlusturClient.tsx`
- **Problem:** Builder doğrudan sipariş "veriyor" (audit #14 / brief).
- **Yapılacak:** "Siparişi Tamamla" → `addItem({kind:'recipe', ...priceRecipe})` + toast + "Sepete git" / "Tasarlamaya devam". Doğrudan `createOrder` çağrısı kaldır. Giriş yoksa `/giris?next=/kahveniolustur` (mevcut davranış korunur ama sepet hedefli).
- **Kabul/Test:** Build yeşil; builder'dan sepete ekleme; checkout'tan sipariş; recipe kalemi sipariş özetinde doğru.

### TASK-120 — Sipariş takip sayfası `/siparislerim` + `/siparis/[id]`
- **Faz:** 8 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-118
- **Problem:** Sipariş geçmişi yok (audit #48).
- **Yapılacak:** `/siparislerim`: kullanıcının siparişleri (`Card` liste: no, tarih, tutar, durum `Badge`). `/siparis/[id]`: tek sipariş detayı + durum çizgisi (`Stepper` benzeri: alındı→hazırlanıyor→hazır→teslim). Profil "Siparişlerim" sekmesi buraya bağlanır.
- **Kabul/Test:** Build yeslil; sipariş sonrası `/siparislerim`'de görünüyor; detay doğru.

### TASK-121 — `/siparis` onay ekranını nihai akışa bağla
- **Faz:** 8 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-120
- **Yapılacak:** `/siparis?o=<id>` gerçek siparişi `getOrder`'dan çeker; "Siparişini takip et" → `/siparis/[id]`. Faz 1'deki geçici versiyonu bununla değiştir.
- **Kabul/Test:** Build yeşil; onay → takip geçişi; yanlış id → `EmptyState`.

### TASK-122 — Admin siparişleri ortak veri katmanına bağla
- **Faz:** 8 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-118, TASK-102
- **Etkilenen:** `app/adminpanel/AdminPanelClient.tsx`, `components/OrdersPanel.tsx`, `OrderCard.tsx`
- **Yapılacak:** Admin `lib/orders` kullanır (elle `localStorage.orders` parse kaldır; geri uyum parse'ı `lib/orders` içine taşındı). Durum güncelleme `updateOrderStatus`. Yeni sipariş alanları (adres, teslimat) admin detayında görünür.
- **Kabul/Test:** Build yeşil; müşteri sipariş verince admin'de görünüyor; durum değişince müşteri `/siparis/[id]`'de görüyor.

### TASK-123 — Menü ürün fiyatlarını kuruş modeline taşı + `Price` her yerde
- **Faz:** 8 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-107
- **Yapılacak:** `MenuClient` string fiyat kalıntılarını `PRODUCTS.priceKurus` + `Price`/`formatPrice`. Admin "yeni ürün" formu kuruş/lira girişini netleştir (kullanıcı lira girer, kuruşa çevrilir).
- **Kabul/Test:** Build yeşil; tüm fiyatlar `₺1.234` formatı; `grep "TL"` sadece yorum.

### TASK-124 — Kargo/eşik/indirim kurallarını merkezîleştir
- **Faz:** 8 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-112, TASK-116
- **Yapılacak:** `lib/pricing.ts`: `FREE_SHIPPING_THRESHOLD_KURUS`, `SHIPPING_STANDARD_KURUS`, `SHIPPING_FAST_KURUS`, `computeCartTotals({lines, delivery, arenaDiscount})`. Sepet + checkout + onay hep bunu kullanır (tek doğ­ruluk kaynağı).
- **Kabul/Test:** Build yeşil; sepet ve onay toplamları birebir aynı.

### TASK-125 — Güven şeridi & teslimat bilgisi (mağaza vitrin)
- **Faz:** 8 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-084, TASK-107
- **Problem:** Güven sinyalleri yok (audit e-ticaret).
- **Yapılacak:** Ana sayfa + ürün detayda kısa, dürüst bilgi: teslimat süresi, ücretsiz kargo eşiği, taze kavurma, iletişim. `Badge`/`Card`, ikon lucide. Abartı/rozet enflasyonu yok.
- **Kabul/Test:** Build yeşil; bilgiler `BRAND`/`pricing` sabitlerinden; responsive.

### TASK-126 — Ürün keşfi: kategori + sıralama (+ arama opsiyonel)
- **Faz:** 8 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-107, TASK-085
- **Problem:** Filtre/sıralama yok (audit #49).
- **Yapılacak:** Menüde kategori segmented control (mevcut) + basit sıralama (`Select`: "Önerilen", "Fiyat ↑", "Fiyat ↓", "İsim"). URL query senkron (`?kategori=&sirala=`). Arama gerçekten gerekliyse basit client filtre.
- **Kabul/Test:** Build yeşil; sıralama/kategori çalışıyor; URL paylaşılabilir; boş sonuç `EmptyState`.

### TASK-127 — FAZ 8 regression checkpoint
- **Kategori:** QA · **Faz:** 8 · **Bağımlılıklar:** TASK-107…126
- **Yapılacak:** Build + tsc + lint. Uçtan uca satın alma (ürün + recipe), sepet düzenleme, checkout 4 adım, onay, takip, admin görünüm/durum. Fiyat tutarlılığı (sepet=onay=admin). `WORKLOG.md`.
- **Test kriterleri:** Checklist. Faz 8 → COMPLETE.

---

## FAZ 9 — RESPONSIVE + ACCESSIBILITY

### TASK-128 — Responsive sweep: 1440 / 1280
- **Faz:** 9 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-127
- **Yapılacak:** Her sayfa 1440 ve 1280: container max-width, grid kolon sayıları, hero ölçek, boşluk. Overflow yok. Düzeltmeleri uygula.
- **Test:** Build yeşil; iki genişlikte tüm sayfalar; `WORKLOG` notları.

### TASK-129 — Responsive sweep: 1024 (tablet)
- **Faz:** 9 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-128
- **Yapılacak:** Nav drawer eşiği, iki-kolon → tek-kolon geçişleri (builder, profil, checkout, ürün detay), kart grid, tablo/liste. 768–1024 "ölü bölge" yok.
- **Test:** Build yeşil; 1024 + 900px kontrol.

### TASK-130 — Responsive sweep: 768
- **Faz:** 9 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-129
- **Yapılacak:** Tüm çok-kolon tek kolona; sticky özet (builder) üstte/altta konumu; modal/drawer tam ekran davranışı; footer.
- **Test:** Build yeşil; 768 tüm sayfalar.

### TASK-131 — Responsive sweep: 390 / 375 + `overflow-x` battaniyesini kaldır
- **Faz:** 9 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-130
- **Problem:** `overflow-x:hidden` gerçek taşmaları maskeliyordu (TASK-030'da kaldırıldı/işaretlendi).
- **Yapılacak:** 390 ve 375'te her sayfa: metin taşması, buton genişliği, form alanları, görsel, fiyat satırları, tablo → `overflow-x:auto` kendi kapsayıcısında. Gerçek taşma kaynaklarını düzelt (sabit genişlikler, uzun kelime, grid min). Sadece kaçınılmaz yerlerde container-scoped `overflow`.
- **Test:** Build yeşil; 375'te hiçbir sayfada yatay body scroll yok.

### TASK-132 — Sticky/fixed eleman denetimi
- **Faz:** 9 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-131
- **Yapılacak:** Header (sticky), builder özet (sticky), toast, drawer, modal — z-index token'ları, üst üste binme, `scroll-margin-top`, iOS `100vh`/`dvh`. `position:fixed` sadece header/drawer/modal/toast'ta.
- **Test:** Build yeşil; sticky header içerik örtmüyor; anchor scroll doğru.

### TASK-133 — Klavye navigasyonu & focus (global)
- **Faz:** 9 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-132
- **Problem:** `<div onClick>` (audit #38), focus eksik (audit #39).
- **Yapılacak:** Kalan tüm etkileşimli `<div>`/`<span>` → `<button>` veya uygun `role`+`tabIndex`+`onKeyDown`. Global `:focus-visible` görünür her yerde. Tab sırası mantıklı. Drawer/modal focus-trap doğrula.
- **Test:** Build yeşil; her sayfa yalnız klavye ile kullanılabilir; `WORKLOG` akış notları.

### TASK-134 — Semantik HTML & başlık hiyerarşisi
- **Faz:** 9 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-133
- **Problem:** Sayfa konusu `h1` değil (menü/hakkımızda); footer `<h2>` enjekte; builder 8×`h2`.
- **Yapılacak:** Her sayfada tek anlamlı `h1` = sayfa konusu. Alt bölümler `h2/h3` sıralı, atlama yok. Footer başlıksız veya `h2` "sr-only" değil düz. `section`/`nav`/`main`/`article` doğru.
- **Test:** Build yeşil; her sayfada heading outline gözden geçirildi.

### TASK-135 — ARIA & form etiketleri
- **Faz:** 9 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-134
- **Yapılacak:** Tüm inputlar `label`/`aria-label`; hata `aria-describedby`+`aria-invalid` (FormField zaten); ikon-only butonlar `aria-label`; `aria-current` aktif nav; `aria-live` toast; radyo grupları `role=radiogroup`+`aria-labelledby`; `aria-expanded/controls` drawer/accordion.
- **Test:** Build yeşil; temel `axe`/manuel kontrol; `WORKLOG`.

### TASK-136 — Kontrast (token seviyesi) & renk-dışı sinyal
- **Faz:** 9 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-028
- **Problem:** Nav/menü/gradient kontrastları sınırda (audit #37).
- **Yapılacak:** Tüm metin/arka çiftlerini WCAG AA'ya çıkar (gerekirse `--ink-2/--ink-3` ve `--accent` dark/light değerlerini ayarla — token'da tek yerde). Durum yalnız renkle anlatılmıyor (metin/ikon de var).
- **Test:** Build yeşil; anahtar çiftler ≥4.5:1 (küçük), ≥3:1 (büyük); `WORKLOG` tablo.

### TASK-137 — `prefers-reduced-motion` (global) & animasyon envanteri
- **Faz:** 9 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-030
- **Problem:** Sadece bir dosyada; float/tilt/translateX kalıntıları (audit #40).
- **Yapılacak:** Global `@media (prefers-reduced-motion: reduce)` tüm `transition`/`animation`/`scroll-behavior`'ı kısar. Kalan `@keyframes float`/`rotateX`/`translateX(5px)` hover → kaldır veya renk/opacity'e indir.
- **Test:** Build yeşil; OS reduced-motion ile hareket yok; `grep @keyframes` minimal.

### TASK-138 — Alt metinler & dekoratif görseller
- **Faz:** 9 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-103
- **Yapılacak:** Anlamlı `alt` (ürün adı, kişi adı); dekoratif → `alt=""`. "User"/"Winner"/"coffee" gibi jenerik alt'ları düzelt.
- **Test:** Build yeşil; grep `alt="` gözden geçir.

### TASK-139 — Modal/Drawer/Toast erişilebilirlik son kontrol
- **Faz:** 9 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-066, TASK-133
- **Yapılacak:** Focus-trap, ilk odak, kapanışta odağı tetikleyene döndür, `aria-modal`, arka plan `inert`, ESC. Tüm kullanım yerlerinde (checkout, profil, admin, topluluk, menü).
- **Test:** Build yeşil; her modal/drawer klavye senaryosu.

### TASK-140 — Dokunma hedefleri & mobil form ergonomisi
- **Faz:** 9 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-130
- **Yapılacak:** Tüm etkileşim hedefleri ≥44×44px. `input` `inputmode`/`autocomplete` (tel, postal, name, cc-*). Mobilde yeterli `font-size` (≥16px input, iOS zoom önleme).
- **Test:** Build yeşil; 390'da form doldurma; `WORKLOG`.

### TASK-141 — FAZ 9 regression checkpoint
- **Kategori:** QA · **Faz:** 9 · **Bağımlılıklar:** TASK-128…140
- **Yapılacak:** Build + tsc + lint. 6 genişlikte 10+ sayfa; klavye tam tur; kontrast tablo; reduced-motion. `WORKLOG.md`.
- **Test kriterleri:** Checklist. Faz 9 → COMPLETE.

---

## FAZ 10 — FINAL PROFESSIONAL POLISH

### TASK-142 — Efekt envanteri & son temizlik (glass/blur/glow/gradient/shadow)
- **Faz:** 10 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-141
- **Yapılacak:** `grep -rn "backdrop-filter\|blur(\|linear-gradient\|radial-gradient\|drop-shadow\|0 0 .*px .*rgba"` tüm styles. Kalan her biri: gerekçesi var mı? Yoksa kaldır. Hedef: `backdrop-filter` = 0 (veya 1 bilinçli), gradient = 0, glow = 0, shadow = sadece `--shadow-1/2`.
- **Test:** Build yeşil; grep çıktısı ~boş; before/after birkaç sayfa.

### TASK-143 — Border-radius & shadow son denetim
- **Faz:** 10 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-142
- **Yapılacak:** `grep` ile kullanımdaki tüm radius/shadow değerleri = token. Aykırı olan düzeltilir. 3D/`perspective`/`rotateX` kalıntısı yok.
- **Test:** Build yeşil; grep tablo `WORKLOG`.

### TASK-144 — Microcopy & ton birleştirme (tüm site)
- **Faz:** 10 · **Öncelik:** P1 · **Bağımlılıklar:** TASK-142
- **Yapılacak:** Tüm buton/label/toast/empty/error metinleri tek ses (Art Direction "Microcopy"). Aktif fiil ("Sepete Ekle" → toast "Sepete eklendi"). Developer terimi yok. "Arena"/"turnuva"/"şampiyon" kalıntıları "topluluk/seçki/öne çıkan". Türkçe tutarlı (İ/ı).
- **Test:** Build yeşil; grep terim listesi; birkaç akış okuması.

### TASK-145 — Görsel ritim & hizalama mikro düzeltmeleri
- **Faz:** 10 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-143
- **Yapılacak:** Kart oranları, 2px kaymalar, tutarsız padding, baseline hizalama, `tabular-nums` fiyat/sayı kolonları, buton içi ikon-metin boşluğu. Sayfa sayfa göz.
- **Test:** Build yeşil; before/after; `WORKLOG`.

### TASK-146 — Empty / loading / error / success görsel paritesi
- **Faz:** 10 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-144
- **Yapılacak:** Tüm bu durumlar aynı component'ler + aynı boşluk/hizalama. Her liste/veri sayfasında dört durum da tanımlı (sepet, siparişlerim, topluluk, menü arama, admin listeleri, profil sekmeleri).
- **Test:** Build yeşil; her durum tetiklenip görülür.

### TASK-147 — Görsel/asset denetimi
- **Faz:** 10 · **Öncelik:** P3 · **Bağımlılıklar:** TASK-145
- **Yapılacak:** `public/` kullanılmayan asset tespiti (grep). Tint-placeholder tutarlılığı. `favicon`/`apple-touch`/OG yer tutucu notu. `logo.png` kullanımının tutarlılığı.
- **Test:** Build yeşil; kullanılmayan asset listesi `WORKLOG` (silme opsiyonel).

### TASK-148 — Kod kalitesi: lint temiz, ölü kod, `any` azalt
- **Faz:** 10 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-142
- **Yapılacak:** `npx eslint .` uyarılarını gider. Kullanılmayan import/state/prop temizle. `any` (özellikle eski client'larda) `lib/types` ile daralt. `console.log` kalıntısı sil.
- **Test:** `npx eslint .` temiz; `npx tsc --noEmit` temiz; build yeşil.

### TASK-149 — CSS son konsolidasyon & ölçüm
- **Faz:** 10 · **Öncelik:** P2 · **Bağımlılıklar:** TASK-148
- **Yapılacak:** `styles/` toplam satır sayısını ölç (before ~7.082). Ölü kural, tekrar eden blok, kullanılmayan selector tara ve sil. Dosya yapısını dokümante et (`docs/CONVENTIONS.md`).
- **Test:** Build yeşil; CSS satır sayısı belirgin düştü; sayfalar sağlam.

### TASK-150 — "SaaS testi" & AI-signal son geçiş
- **Faz:** 10 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-142…149
- **Yapılacak:** Her sayfada sor: "Kahveyi çıkarsam SaaS gibi mi?" Fazla generic olan sayfalara markaya özel dokunuş (roast/origin/notes bilgi tasarımı, Fraunces başlık, microcopy) ekle — yeni efekt DEĞİL. Audit'teki 10 AI-signal maddesini tek tek doğrula (glass yok, gradient text yok, glow yok, floating/tilt yok, scroll-jack yok, emoji-dashboard yok, generic gamification yumuşadı, aşırı radius yok, dev hero typografi yok, tekrar eden efekt yok).
- **Test:** 10 madde ✅; `WORKLOG` tablo.

### TASK-151 — FINAL FULL AUDIT & BEFORE/AFTER SKOR
- **Faz:** 10 · **Öncelik:** P0 · **Bağımlılıklar:** TASK-001…150
- **Etkilenen:** `AUDIT_AFTER.md` (yeni), güncel artifact
- **Yapılacak:** Baştaki denetimi tekrar uygula. Her kategori 100 üzerinden yeniden puanla: Visual Design, UX, Consistency, Accessibility, Responsive Design, Brand Identity, E-commerce UX, Professionalism, AI-Generated Feel. BEFORE/AFTER tablosu. Kalan/yeni sorunları task olarak ekle (TASK-152+), onları da bitir, sonra tekrar full regression.
- **Kabul kriterleri:** `AUDIT_AFTER.md` var; BEFORE/AFTER net; hedef bandları (genel 80+, AI-Feel düşük) değerlendirilmiş.
- **Test kriterleri:** Build + tsc + lint + eldeki tüm akışlar; final regression checklist `WORKLOG.md`.

---

## BACKLOG — ERTELENMİŞ (bu turda UYGULANMAZ, kullanıcı onayı gerekir)

| ID | Başlık | Not |
|---|---|---|
| BL-01 | Kalıcı veri backend'i (DB) | Client-side prototip kararı gereği ertelendi. Sipariş/kullanıcı gerçek kalıcılığı. |
| BL-02 | Admin auth sunucu tarafına | Şu an `localStorage.isAdmin` + hardcoded kimlik. En az env tabanlı + sunucu kontrolü. |
| BL-03 | Parola hash'leme + güvenli auth | Backend düz metin parola; response'ta parola dönüyor. |
| BL-04 | Sipariş durumları sunucu state machine | Şu an client. Gerçek zamanlı/paylaşımlı durum. |
| BL-05 | Gerçek ödeme entegrasyonu | Demo ödeme yerine sağlayıcı (iyzico/Stripe vb.) — ayrı proje kararı. |
| BL-06 | E-posta bildirimleri (sipariş onayı) | Transaksiyonel e-posta altyapısı. |
| BL-07 | Görsel optimizasyonu / gerçek fotoğraf çekimleri | `next/image unoptimized` + tint placeholder → gerçek marka görselleri. |

---

## WORKLOG REFERANSI

Her task tamamlandığında `WORKLOG.md`'ye satır: `TASK-XXX | tarih | özet değişiklik | build:✅ tsc:✅ | regresyon notu`.
Yeni keşfedilen problemler `MASTER_TASK_PLAN.md`'ye TASK-152, TASK-153 … olarak eklenir, doğru faza yerleştirilir.
