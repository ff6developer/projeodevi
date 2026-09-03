# MASTER TASK PLAN V2 — Production / Commercial Readiness

Referans: `AUDIT_PRODUCTION.md`. V1 planı (`MASTER_TASK_PLAN.md`, FAZ 1–10) tamamlandı.
Bu plan "iyi görünen proje" → "Vercel'de gerçek ürün gibi duran, işe alınabilir
frontend portföyü" hedefine götürür.

**Sınır:** Backend YOK — database yok, API server yok, gerçek ödeme yok, gerçek
auth backend yok. Ama frontend gerçek backend'e bağlanmaya hazır olacak (typed
service interface + local adapter). Feature creep yok: eksik olanı yap, kötü
olanı düzelt, tutarsızı birleştir.

**Etiketler:** Öncelik `P0/P1/P2/P3` · Ağırlık `BLOCKER/HIGH/MEDIUM/POLISH`

**Çalışma döngüsü:** TASK-201 → tsc/build/lint → prod smoke → sonraki. Bir task
başkasını bozarsa önce regresyonu çöz. Her task sonrası `WORKLOG_V2.md`.

---

## Faz durum tablosu

| Faz | Konu | Task aralığı | Durum |
|---|---|---|---|
| A | Production blockers | TASK-201 … TASK-212 | ✅ COMPLETE |
| B | Backend-ready data layer | TASK-213 … TASK-222 | ✅ COMPLETE |
| C | Conversion / UX friction | TASK-223 … TASK-236 | ✅ COMPLETE |
| D | Visual professionalism | TASK-237 … TASK-248 | ✅ COMPLETE |
| E | Copy / microcopy | TASK-249 … TASK-254 | ⬜ |
| F | Edge cases / states | TASK-255 … TASK-263 | ⬜ |
| G | Final simülasyon + re-audit | TASK-264 … TASK-270 | ⬜ |

---

## FAZ A — PRODUCTION BLOCKERS

### TASK-201 — `backend/` klasörünü repodan çıkar + `.gitignore` düzelt
- **Öncelik:** P0 · **Ağırlık:** BLOCKER
- **Problem:** `backend/node_modules` git'e commit edilmiş (595 dosya). Express
  backend ölü/kırık, `vercel.json` ona bağlı.
- **Neden önemli:** GitHub'da git hijyeni kırmızı bayrağı; recruiter ilk bakışta görür.
- **Etkilenen:** `backend/` (sil), `.gitignore`, `vercel.json`, `package.json` (varsa workspace ref)
- **Yapılacak:** `git rm -r backend/`. `.gitignore`'a `**/node_modules` ekle
  (savunma). `vercel.json`: `services` bloğunu kaldır; ya dosyayı tamamen sil
  (Vercel Next'i otomatik algılar) ya da yalnız `{ "framework": "nextjs" }` bırak.
- **Kabul:** `git ls-files backend/` boş; `git ls-files | grep node_modules` boş;
  `next build` yeşil.
- **Test:** Build; `vercel.json` geçerli JSON veya yok.

### TASK-202 — `html2canvas` ve diğer kullanılmayan bağımlılıkları kaldır
- **Öncelik:** P2 · **Ağırlık:** MEDIUM
- **Problem:** `html2canvas` hiçbir yerde import edilmiyor.
- **Yapılacak:** `grep` ile doğrula, `package.json`'dan çıkar, `npm install` ile
  lock güncelle. Başka kullanılmayan dep var mı tara.
- **Kabul:** `package.json` deps = yalnız kullanılan; `next build` yeşil.

### TASK-203 — `lib/services/auth` arayüzü + local (mock) adapter
- **Öncelik:** P0 · **Ağırlık:** BLOCKER
- **Problem:** `AuthForm` var olmayan Express backend'e `fetch` atıyor →
  giriş/kayıt production'da çalışmıyor.
- **Neden önemli:** Builder + checkout `requiresAuth`. Gerçek ziyaretçi hiçbir
  şey yapamıyor.
- **Etkilenen:** `lib/services/auth.ts` (yeni interface), `lib/services/adapters/local/auth.ts` (yeni), `lib/session.ts`, `app/site-config.ts`
- **Yapılacak:**
  - `AuthService` interface: `register(input): Promise<Result>`, `login(input): Promise<Result>`, `logout()`, `getСurrentUser()`.
  - `localAuthAdapter`: `elmenes.users` (localStorage) içine kayıt; parola **hash'lenmeden saklanmaz** — bunun yerine parola hiç saklanmaz, sadece `{name,email}` + basit bir "kayıtlı e-posta" listesi; login herhangi bir kayıtlı e-posta + boş-olmayan parola ile geçer (demo). Gerçekçi gecikme (`await sleep(400)`).
  - Var olan e-posta ile register → "Bu e-posta zaten kayıtlı" hatası (gerçekçi).
  - Kayıtlı olmayan e-posta ile login → "E-posta veya şifre hatalı" (demo mantığı: kayıtlı değilse hata).
  - `API_BASE_URL` / `/api/backend/*` referanslarını kaldır.
- **Kabul:** `/kayit` → hesap oluşur, `/giris`'e yönlenir; `/giris` → oturum açılır,
  `next` param'a gider; hiçbir network isteği YOK; console temiz. Var olan
  e-posta ile kayıt hata verir.
- **Test:** Prod build'de kayıt→giriş→builder→checkout uçtan uca; DevTools Network boş.

### TASK-204 — `AuthForm`'u service'e bağla, `fetch` yolunu kaldır
- **Öncelik:** P0 · **Ağırlık:** BLOCKER · **Bağımlılık:** TASK-203
- **Etkilenen:** `components/AuthForm.tsx`, `app/giris/LoginClient.tsx`, `app/kayit/RegisterClient.tsx`
- **Yapılacak:** `AuthForm`'dan `submitUrl/submitMethod/fetch` mantığını çıkar;
  `onSubmit(formData) => Promise<void>` prop'u al. `LoginClient`/`RegisterClient`
  bu callback'te `authService.login/register` çağırır. Hata mesajları
  service `Result`'ından gelir.
- **Kabul:** Formlar service üzerinden çalışır; `AuthForm` artık `fetch`/URL bilmez.

### TASK-205 — Admin erişimini bundle'dan gömülü paroladan ayır
- **Öncelik:** P1 · **Ağırlık:** HIGH · **Bağımlılık:** TASK-203
- **Problem:** `admin@gmail.com / admin123` client bundle'ında görünür.
- **Yapılacak:** `AuthForm`'daki `adminCheck` prop'unu kaldır. `/adminpanel`
  girişi: sayfada net bir **"Demo yönetici görünümü"** butonu (`session.setAdmin(true)`)
  + kısa açıklama ("Bu panel demo amaçlıdır; gerçek yetkilendirme backend ile
  gelir."). Ya da `/adminpanel`'i `?demo=1` ile aç. Gömülü kimlik yok.
- **Kabul:** Bundle'da `admin123` yok (`grep`); `/adminpanel`'e demo butonuyla girilir;
  giriş yapmamış normal kullanıcı `/adminpanel` → `/giris`.

### TASK-206 — `SITE_URL` production fallback + `.env.example`
- **Öncelik:** P0 · **Ağırlık:** HIGH
- **Problem:** env yoksa `https://example.com` → canonical/OG/sitemap/robots.
- **Etkilenen:** `app/site-config.ts`, `.env.example` (yeni), `README.md`
- **Yapılacak:** `SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || (VERCEL_PROJECT_PRODUCTION_URL ? \`https://${...}\` : VERCEL_URL ? ... : "http://localhost:3000")`.
  `.env.example`: `NEXT_PUBLIC_SITE_URL=https://elmenes-coffee.vercel.app`.
  README'ye 3 satır deploy notu.
- **Kabul:** env'siz prod build'de `sitemap.xml` / `robots.txt` / canonical'da
  `example.com` YOK (Vercel'de otomatik domain, lokalde `localhost`).

### TASK-207 — `themeColor`'ı token değerine hizala
- **Öncelik:** P3 · **Ağırlık:** POLISH
- **Etkilenen:** `app/layout.tsx`
- **Yapılacak:** `themeColor: "#080808"` → `"#17140f"` (`--paper` koyu değeri).
  Açık/koyu için `media` varyantı da eklenebilir.
- **Kabul:** `<meta name="theme-color">` = `#17140f`.

### TASK-208 — OG görseli (1200×630) + OG/Twitter meta düzelt
- **Öncelik:** P2 · **Ağırlık:** MEDIUM
- **Problem:** OG image `logo.png` (kare), OG title = sadece site adı.
- **Yapılacak:** `public/og.png` (1200×630) — mevcut bir ürün fotoğrafı + logo +
  "Elmenes Coffee" ile sade bir kompozisyon (tek seferlik statik asset; Canvas
  script veya elle). `layout.tsx` OG/Twitter `images` → `/og.png`,
  `card: "summary_large_image"`.
- **Kabul:** `og:image` = `/og.png`, boyut 1200×630; Twitter card `summary_large_image`.

### TASK-209 — Hydration #418: tüm route'larda prod'da doğrula ve düzelt
- **Öncelik:** P0 · **Ağırlık:** BLOCKER
- **Problem:** Prod'da React #418 (hydration mismatch) konsolda görüldü (home, /giris).
- **Yapılacak:** `next build && next start`; her route'u temiz konsolla aç
  (home, menu, kahveniolustur, sepet[dolu+boş], odeme, siparis, siparis/[id],
  siparislerim, topluluk, profil, giris, kayit, hakkimizda, adminpanel, 404).
  #418 çıkan yeri izole et (muhtemel: `HeaderNav` isLoggedIn/`useCart` badge,
  `Suspense fallback={null}` + `useSearchParams`, `getFullYear`, tema).
  Çözüm: SSR/ilk-client render eşitliği (deterministik ilk render + effect'te
  güncelle, veya `useSyncExternalStore` `getServerSnapshot`).
- **Kabul:** 15 route'un hepsinde **konsol tamamen temiz** (error + warning).
- **Test:** `read_console_messages` her route'ta boş.

### TASK-210 — `/dev/ui`'yi production'dan çıkar
- **Öncelik:** P1 · **Ağırlık:** HIGH
- **Problem:** `/dev/ui` public deploy'da erişilebilir.
- **Yapılacak:** Seçenek A (tercih): `app/dev/` klasörünü sil (component galerisi
  geliştirici aracı, git geçmişinde kalır). Seçenek B: `notFound()` çağır eğer
  `process.env.NODE_ENV === "production"`. A'yı uygula.
- **Kabul:** `next build` route listesinde `/dev/ui` YOK; `/dev/ui` → 404.

### TASK-211 — robots/sitemap tutarlılığı
- **Öncelik:** P2 · **Ağırlık:** MEDIUM · **Bağımlılık:** TASK-206
- **Yapılacak:** `robots.ts` disallow: `/adminpanel`, `/profil`, `/giris`,
  `/kayit`, `/sepet`, `/odeme`, `/siparis`, `/siparis/`, `/siparislerim`.
  `sitemap.ts`: sadece gerçekten public + değerli sayfalar (`/`, `/menu`,
  `/kahveniolustur`, `/topluluk`, `/hakkimizda` + eklenecek yasal sayfalar).
  `lastModified` ekle.
- **Kabul:** `robots.txt` tüm özel alanları dışlıyor; `sitemap.xml` yalnız public.

### TASK-212 — FAZ A regresyon checkpoint
- **Öncelik:** P0 · **Ağırlık:** BLOCKER
- **Yapılacak:** `next build` + `tsc` + `eslint .` + prod smoke: kayıt→giriş→
  builder→sepet→checkout→sipariş→takip, konsol temiz, `example.com` yok,
  `/dev/ui` yok, repo'da `node_modules` yok.
- **Kabul:** Hepsi ✅. `WORKLOG_V2.md`.

---

## FAZ B — BACKEND-READY DATA LAYER

### TASK-213 — `lib/services/` iskeleti + `types` genişletme
- **Öncelik:** P1 · **Ağırlık:** HIGH
- **Yapılacak:** `lib/services/index.ts` — tüm servisleri tek yerden export.
  `lib/services/types.ts` — ortak `Result<T> = { ok: true; data: T } | { ok: false; error: string; code?: string }`, `Paginated<T>`.
  Her servis için `interface` + `local` adapter dosyası.
- **Kabul:** tsc temiz; `import { authService, productService, ... } from "@/lib/services"`.

### TASK-214 — `ProductService` (interface + local adapter)
- **Öncelik:** P1 · **Ağırlık:** MEDIUM
- **Etkilenen:** `lib/services/products.ts`, `lib/services/adapters/local/products.ts`, `lib/products.ts` (adapter'a taşınır), `app/menu/*`, `app/_home/Home.tsx`
- **Yapılacak:** `ProductService`: `list(filter?)`, `getBySlug(slug)`,
  `getById(id)`, `listByCategory(cat)`. Local adapter statik `PRODUCTS` dizisini
  döndürür (bugün senkron; interface `Promise` döner → yarın HTTP). UI async'e
  hazırlanır (menü zaten client; home server component `await` edebilir).
- **Kabul:** Menü + home ürünleri service'ten; `lib/products.ts` yalnız veri (adapter import eder).

### TASK-215 — `CartService` — `localStorage` erişimini adapter'a kapat
- **Öncelik:** P1 · **Ağırlık:** MEDIUM
- **Etkilenen:** `lib/cart.ts` → `lib/services/adapters/local/cart.ts`, `lib/services/cart.ts`, `components/CartProvider.tsx`
- **Yapılacak:** `CartService` interface (`get`, `addProduct`, `addRecipe`,
  `setQty`, `removeLine`, `clear`, `subscribe`). Local adapter = bugünkü
  `lib/cart.ts` mantığı (snapshot cache + event). `CartProvider` interface'e bağlanır.
- **Kabul:** Sepet davranışı bire bir aynı; `localStorage` sadece adapter'da.

### TASK-216 — `OrderService` — `lib/orders.ts` adapter'a
- **Öncelik:** P1 · **Ağırlık:** MEDIUM
- **Etkilenen:** `lib/orders.ts` → adapter, `lib/services/orders.ts`, `app/odeme/*`, `app/siparis*`, `app/siparislerim/*`, `app/adminpanel/*`, `app/profil/*`
- **Yapılacak:** `OrderService`: `create(input)`, `list(userEmail?)`, `get(id)`,
  `updateStatus(id, status)`, `remove(id)`. Local adapter = bugünkü `lib/orders.ts`.
  Status akışı, legacy migrasyon adapter içinde kalır.
- **Kabul:** Tüm sipariş yüzeyleri service'ten okur; `localStorage.elmenes.orders` sadece adapter.

### TASK-217 — `ProfileService` — profil `localStorage` doğrudan erişimini kapat
- **Öncelik:** P2 · **Ağırlık:** MEDIUM
- **Etkilenen:** `app/profil/ProfilClient.tsx`, `lib/services/profile.ts` + local adapter
- **Yapılacak:** `ProfileService`: `get()`, `updateBio(text)`, `updateAvatar(dataUrl)`,
  `listPosts()`, `addPost(input)`, `removePost(id)`, `listMyCoffees()`.
  `ProfilClient`'taki tüm `localStorage.getItem/setItem` → service.
- **Kabul:** `ProfilClient`'ta `localStorage` referansı 0.

### TASK-218 — `CommunityService` — topluluk `localStorage` erişimini kapat
- **Öncelik:** P2 · **Ağırlık:** MEDIUM
- **Etkilenen:** `app/topluluk/ToplulukClient.tsx`, `lib/community.ts`, `lib/services/community.ts` + adapter
- **Yapılacak:** `CommunityService`: `listPosts()`, `vote(id)`, `unvote(id)`,
  `addComment(id, text)`, `removePost(id)`, `copyRecipe(post)`, `periodInfo()`.
  Client'taki doğrudan `localStorage` → service.
- **Kabul:** `ToplulukClient`'ta `localStorage` referansı 0.

### TASK-219 — `AdminService` — admin `localStorage` erişimini kapat
- **Öncelik:** P2 · **Ağırlık:** MEDIUM
- **Etkilenen:** `app/adminpanel/AdminPanelClient.tsx`, `lib/services/admin.ts` + adapter
- **Yapılacak:** Admin ürün CRUD'u ve `coffees` okuması service'e. Siparişler
  zaten `OrderService`'ten gelecek (TASK-216).
- **Kabul:** `AdminPanelClient`'ta `localStorage` referansı 0.

### TASK-220 — `lib/session.ts` → `SessionService` / `AuthService` altında birleştir
- **Öncelik:** P2 · **Ağırlık:** MEDIUM · **Bağımlılık:** TASK-203
- **Yapılacak:** `session.ts` doğrudan `localStorage` yapıyor. `AuthService`
  altına al veya `lib/services/adapters/local/session.ts`. `getUser/isLoggedIn/
  isAdmin/subscribe` public API korunur ama içerde adapter.
- **Kabul:** Uygulama genelinde `localStorage` sadece `lib/services/adapters/local/*` altında (`grep -rn "localStorage" app/ components/ lib/ | grep -v adapters` = boş).

### TASK-221 — `docs/BACKEND_CONTRACT.md`
- **Öncelik:** P1 · **Ağırlık:** HIGH · **Bağımlılık:** TASK-213…220
- **Yapılacak:** Her servis için: metod imzaları, istek/yanıt tipleri, önerilen
  REST endpoint'i (`POST /api/auth/login` vb.), hata kodları, hangi adapter
  dosyasının `adapters/http/*` olarak yazılacağı. "Mock → API geçiş rehberi"
  bölümü (1 sayfa).
- **Kabul:** Dosya var; her servis kapsanmış; `README`'den link.

### TASK-222 — FAZ B regresyon checkpoint
- **Öncelik:** P1 · **Ağırlık:** HIGH
- **Yapılacak:** Build/tsc/lint; `grep localStorage` sadece adapter'da; tüm
  akışlar bire bir çalışıyor (sepet, sipariş, profil, topluluk, admin).
- **Kabul:** ✅ + `WORKLOG_V2.md`.

---

## FAZ C — CONVERSION / UX FRICTION

### TASK-223 — Builder'ı logged-out kullanıcı için keşfedilebilir yap
- **Öncelik:** P1 · **Ağırlık:** HIGH
- **Problem:** "Kahveni Oluştur" nav'da `requiresAuth` — giriş yapmayan görmez.
  Site'nin ayırt edici özelliği gizli.
- **Etkilenen:** `lib/nav.ts`, `components/HeaderNav.tsx`, `app/kahveniolustur/KahveniOlusturClient.tsx`
- **Yapılacak:** `requiresAuth` kaldır — herkes görsün. Builder'a girildiğinde
  tasarım serbest; **yalnız "Sepete ekle"** giriş ister → `/giris?next=/kahveniolustur`
  (mevcut davranış). İsteğe bağlı: girişe yönlenmeden önce tarifi `copiedRecipe`
  benzeri bir taslağa yaz, dönüşte geri yükle (kayıp önleme).
- **Kabul:** Logged-out kullanıcı nav'dan builder'a gider, tasarlar; "Sepete ekle"
  girişe yönlendirir; giriş sonrası tasarım kaybolmaz.

### TASK-224 — Checkout: yapışkan özet paneline kalem listesi
- **Öncelik:** P1 · **Ağırlık:** HIGH
- **Problem:** Ödeme adım 1–3'te özet paneli yalnız tutar gösteriyor; kullanıcı
  ne aldığını 4. adıma kadar göremiyor.
- **Etkilenen:** `app/odeme/OdemeClient.tsx`, `styles/odeme.css`
- **Yapılacak:** Özet `Card` içine daraltılabilir "Ürünler (N)" bölümü — küçük
  satırlar (ad ×adet · tutar), üstte ara toplam/teslimat/toplam. Mobilde
  varsayılan kapalı, desktop'ta açık.
- **Kabul:** 4 adımın hepsinde özet panelinde kalemler görünür/açılabilir;
  tutarlar `computeCartTotals` ile.

### TASK-225 — Checkout: güven şeridi + adım göstergesi iyileştirme
- **Öncelik:** P2 · **Ağırlık:** MEDIUM
- **Yapılacak:** Özet panelinin altına küçük güven satırı: "Bilgilerin yalnızca
  bu siparişin için kullanılır · Demo ortamı — gerçek ödeme alınmaz". Stepper'da
  tamamlanmış adımlar tıklanınca geri gidilebilsin (opsiyonel, düşük risk).
- **Kabul:** Güven satırı görünür; geri navigasyon çalışır (varsa).

### TASK-226 — Sepet: eşik üstü ücretsiz kargo pozitif geri bildirimi + "Teslimat" satırı
- **Öncelik:** P2 · **Ağırlık:** MEDIUM
- **Problem:** "Toplam" = "Ara toplam"; eşik üstündeyken pozitif mesaj yok.
- **Etkilenen:** `app/sepet/SepetClient.tsx`, `styles/sepet.css`
- **Yapılacak:** Özet: her zaman "Teslimat" satırı — eşik altı `formatPrice(SHIPPING_STANDARD)`
  + "₺X daha ekle, ücretsiz olsun"; eşik üstü **"Ücretsiz — kazandın"** (accent/success).
  "Toplam" satırı bu bilgiyi yansıtır.
- **Kabul:** Eşik altı/üstü iki durum da net; toplam mantıklı.

### TASK-227 — Sepet: kart yoğunluğu + recipe satır görseli
- **Öncelik:** P2 · **Ağırlık:** MEDIUM
- **Problem:** Satır kartlarında aşırı iç boşluk; recipe satırı sadece "S" harfi.
- **Etkilenen:** `app/sepet/SepetClient.tsx`, `styles/sepet.css`, (belki `components/ui/CoffeeSpec` veya küçük bir recipe-thumb)
- **Yapılacak:** Satır dikey padding'i azalt, içerik hizasını sıkılaştır.
  Recipe satırına harf yerine küçük marka placeholder'ı (kahve fincanı lucide
  ikonu + `--tint` zemin, `--r-md`).
- **Kabul:** Sepet daha yoğun/kararlı görünür; recipe satırı jenerik değil.

### TASK-228 — Sipariş onayı: adres + tahmini teslim + sonraki adım netliği
- **Öncelik:** P2 · **Ağırlık:** MEDIUM
- **Etkilenen:** `app/siparis/SiparisClient.tsx`, `styles/siparis.css`, `lib/format.ts` (tarih yardımcı)
- **Yapılacak:** Onay ekranına: "X, Kadıköy adresine hazırlanıyor" + tahmini
  teslim aralığı (bugün + teslimat yöntemine göre 1 veya 2–3 gün, `formatDate`).
  1 satır sade demo notu. CTA hiyerarşisi: "Siparişini takip et" primary.
- **Kabul:** Onay ekranı adres + tarih + net sonraki adım gösterir.

### TASK-229 — Sipariş takibi: dikey boşluk / kompozisyon
- **Öncelik:** P2 · **Ağırlık:** MEDIUM
- **Problem:** `/siparis/[id]` sayfasında kartlar arası ve footer öncesi büyük boş alan.
- **Etkilenen:** `app/siparis/[id]/SiparisDetayClient.tsx`, `styles/siparislerim.css`
- **Yapılacak:** Grid'i ve kart aralıklarını sıkılaştır; ana kolon kısa kalıyorsa
  aside ile hizala; gereksiz `min-height` kaldır.
- **Kabul:** Sayfa "bitmiş" görünür, footer öncesi dev boşluk yok.

### TASK-230 — Menü kartı: tek birincil aksiyon
- **Öncelik:** P2 · **Ağırlık:** MEDIUM
- **Problem:** Kart başına "İncele" + "Sepete ekle" — birincil belirsiz, accent tekrarı yoğun.
- **Etkilenen:** `app/menu/MenuClient.tsx`, `styles/menu.css`
- **Yapılacak:** Kart görseli + başlık → detayı açar (modal veya `/menu/[slug]`,
  bkz. TASK-241). Kartta tek birincil buton "Sepete ekle". "İncele"yi kaldır
  veya görsel üstünde ince bir overlay linkine indir.
- **Kabul:** Kart başına 1 buton; menü ızgarasında accent daha sakin.

### TASK-231 — Empty state'lere ikon + yönlendirici copy
- **Öncelik:** P2 · **Ağırlık:** MEDIUM
- **Etkilenen:** `app/sepet/SepetClient.tsx`, `app/siparislerim/*`, `app/profil/*`, `app/menu/*`, `components/ui/States`
- **Yapılacak:** Sepet boş → `ShoppingBag` ikonu; siparişlerim boş → `Package`;
  menü sonuç yok → `SearchX`. Tek net cümle + tek CTA. Profil stat "0 0 0"
  yerine: içerik yokken stat bloğunu gizle veya "İlk kahveni tasarla" nudge.
- **Kabul:** Her empty state'te ikon + 1 cümle + 1 CTA; profil sıfır-stat çözülmüş.

### TASK-232 — "Sepete git" mikro-CTA (menü + builder toast)
- **Öncelik:** P3 · **Ağırlık:** POLISH
- **Yapılacak:** "Sepete eklendi" toast'ına kısa "Sepete git" aksiyonu (ToastProvider
  aksiyon desteği yoksa: menüde ekleme sonrası kartta 2 sn "Sepette ✓ · Sepete git").
  Basit tut, feature creep yapma.
- **Kabul:** Ekleme sonrası sepete gitmek 1 tık; abartı yok.

### TASK-233 — Profil: stat bloğu + "Siparişlerim" bağını güçlendir
- **Öncelik:** P3 · **Ağırlık:** POLISH
- **Yapılacak:** Stat'ları anlamlı yap (Gönderi / Tasarlanan kahve / Sipariş sayısı);
  0 iken nazik. "Siparişlerim" sekmesi + `/siparislerim` linki net.
- **Kabul:** Profil ilk açılışta "boş ve üzgün" hissi vermez.

### TASK-234 — Header: giriş/çıkış görünürlüğü
- **Öncelik:** P3 · **Ağırlık:** POLISH
- **Yapılacak:** Logged-out'ta header'da "Giriş" görünür (nav'da var ama drawer +
  desktop tutarlılığı kontrol). Logged-in'de drawer'a "Çıkış" ekle (bugün sadece
  /profil'de).
- **Kabul:** Giriş ve çıkış her iki viewport'ta erişilebilir.

### TASK-235 — 5 saniye testi düzeltmeleri (hero netliği — copy tarafı)
- **Öncelik:** P1 · **Ağırlık:** HIGH · **Bağımlılık:** TASK-249
- **Not:** Görsel tarafı TASK-237; burada yalnız CTA/ierarşi. "Menüye göz at"
  birincil, "Kendi kahveni tasarla" ikincil kalsın; lede'yi mobilde kısalt.
- **Kabul:** Mobilde katlamada CTA görünür; lede ≤ 3 satır.

### TASK-236 — FAZ C regresyon checkpoint
- **Öncelik:** P1 · **Ağırlık:** HIGH
- **Yapılacak:** Build/tsc/lint + prod: ilk 30 sn akışı friction taraması;
  builder keşfi; checkout özet kalemleri; sepet/onay iyileştirmeleri.
- **Kabul:** ✅ + `WORKLOG_V2.md`.

---

## FAZ D — VISUAL PROFESSIONALISM

### TASK-237 — Ana sayfa hero: görsel çapa + kompozisyon
- **Öncelik:** P1 · **Ağırlık:** HIGH
- **Problem:** Hero tamamen metin; DTC mağaza hissi yok.
- **Etkilenen:** `app/_home/Home.tsx`, `styles/home.css`
- **Yapılacak:** Asimetrik hero: solda eyebrow + h1 + lede + CTA, sağda tek güçlü
  ürün fotoğrafı (mevcut `espresso.jpg`/`latte.jpg`), tutarlı crop + `--r-lg` +
  ince `--shadow-2` + hafif scrim/vinyet (yeni efekt değil, sadece `object-fit`
  + overlay token). Mobilde görsel h1 altında, kırpılmış yükseklik. Katlama
  boşluğunu azalt (`padding-block` düşür).
- **Kabul:** Desktop + mobilde katlamada hem mesaj hem ürün görünür; "gerçek
  mağaza" hissi; yeni gradient/glow/animasyon YOK.

### TASK-238 — Ana sayfa: bölüm sayısını/ritmini gözden geçir
- **Öncelik:** P2 · **Ağırlık:** MEDIUM
- **Problem:** "Öne çıkanlar / Kendi kahveni tasarla / Topluluk seçkisi" mekanik,
  eşit ağırlıklı — landing template ritmi.
- **Yapılacak:** "Kendi kahveni tasarla" ile "Topluluk seçkisi" bloklarını tek
  bölümde birleştir veya "Topluluk"u küçük bir şeride indir (ikincil). "Öne
  çıkanlar"a "Tümünü gör" + belki 1 satır bağlam. Section aralıklarını token'la
  ritimle. **Yeni bölüm ekleme.**
- **Kabul:** Ana sayfa 3 yerine 2–3 anlamlı, ağırlığı farklı bölüm; daha az "template".

### TASK-239 — Footer: ticari yapı
- **Öncelik:** P2 · **Ağırlık:** MEDIUM · **Bağımlılık:** TASK-240
- **Etkilenen:** `components/SiteFooter.tsx`, `styles/layout.css`, `app/site-config.ts`
- **Yapılacak:** Çok kolonlu, sola hizalı: **Keşfet** (Menü, Kahveni Oluştur,
  Topluluk), **Kurumsal** (Hakkımızda, KVKK, Mesafeli Satış Sözleşmesi, İade &
  Teslimat, Gizlilik), **İletişim** (e-posta, adres, varsa Instagram). Alt satır:
  © + "Bu bir portföy / demo projesidir" küçük not (dürüst). Fraunces marka adı
  header ile aynı font.
- **Kabul:** Footer gerçek bir e-ticaret footer'ı gibi; tüm linkler çalışır.

### TASK-240 — Yasal / kurumsal stub sayfaları
- **Öncelik:** P2 · **Ağırlık:** MEDIUM
- **Problem:** TR e-ticaret için KVKK / Mesafeli Satış / İade & Teslimat / Gizlilik yok.
- **Etkilenen:** `app/kvkk/`, `app/mesafeli-satis/`, `app/iade-teslimat/`, `app/gizlilik/` (yeni), `lib/nav.ts`/footer, `sitemap.ts`
- **Yapılacak:** Her biri gerçek yapı (başlıklar, maddeler) ile doldurulmuş sade
  içerik + üstte net not: "Bu bir portföy/demo projesidir; aşağıdaki metin örnek
  amaçlıdır, bağlayıcı değildir." Ortak basit `legal.css` veya `utilities`.
  Metadata + `robots index` (bunlar public/indekslenebilir).
- **Kabul:** 4 sayfa render olur, footer'dan erişilir, sitemap'te; içerik "lorem"
  değil gerçek yapıda TR metni.

### TASK-241 — Ürün detay: `/menu/[slug]` route (SEO + paylaşılabilir)
- **Öncelik:** P2 · **Ağırlık:** MEDIUM · **Bağımlılık:** TASK-214
- **Problem:** Ürün "detayı" sadece modal — URL yok, SEO yok, paylaşılamaz.
- **Etkilenen:** `app/menu/[slug]/page.tsx` + client (yeni), `app/menu/MenuClient.tsx`, `sitemap.ts`
- **Yapılacak:** `generateStaticParams` ile 23 ürün için statik sayfa: büyük
  görsel, ad (Fraunces), açıklama, `RoastMeter`/`OriginTag`/`TastingNotes`, fiyat,
  `QuantityStepper` + "Sepete ekle", teslimat/kargo notu, altında yorumlar
  (mevcut modal içeriği buraya). Menü kartı → bu sayfaya link. Modal'ı kaldır
  veya "hızlı bak" olarak bırak (karar: kaldır, tek kaynak). Her ürün için
  `metadata` (title, description, OG image = ürün fotoğrafı, canonical).
- **Kabul:** `/menu/latte` çalışır, statik prerender, kendi meta'sı; menüden
  tıklanır; yorum akışı korunur; `next build` route sayısı artar.

### TASK-242 — Nav ikon semantiği
- **Öncelik:** P3 · **Ağırlık:** POLISH
- **Etkilenen:** `lib/nav.ts`
- **Yapılacak:** `Topluluk`: `Trophy` → `Users`. `Kahveni Oluştur`: `FlaskConical`
  → `SlidersHorizontal` veya `Coffee`. (Yarışma/lab çağrışımını kır.)
- **Kabul:** Drawer + varsa ikon rayında ikonlar anlamı yansıtır.

### TASK-243 — Drawer: arka plandan ayrışma
- **Öncelik:** P2 · **Ağırlık:** MEDIUM
- **Etkilenen:** `styles/layout.css` (`.nav-drawer-overlay`, `.nav-drawer`)
- **Yapılacak:** Scrim'i güçlendir (`rgba(0,0,0,.6)`), drawer yüzeyine belirgin
  `border-left` + `--shadow-2` (var ama zayıf). Drawer başlığına ince bir marka
  satırı (logo + ad) ekle → yapı hissi.
- **Kabul:** Mobilde drawer sayfadan net ayrılır.

### TASK-244 — Sayfa dikey ritmi / whitespace denetimi
- **Öncelik:** P2 · **Ağırlık:** MEDIUM
- **Etkilenen:** `styles/*.css` (sepet, siparis, siparislerim, login, hakkimizda), `styles/utilities.css`
- **Yapılacak:** Her sayfada `padding-block` ve `min-height` kullanımını token
  ölçeğine oturt; içerik az olan sayfalarda dev boşluğu azalt (footer'ı yukarı
  çek). Tek bir `.page` ritim yardımcı sınıfı düşün.
- **Kabul:** Boş/kısa sayfalar (sepet-dolu, auth, takip) "bitmemiş" hissi vermez.

### TASK-245 — Menü ürün kartı görsel oranı tutarlılığı
- **Öncelik:** P2 · **Ağırlık:** MEDIUM
- **Problem:** Ürün fotoğrafları farklı oran/crop → kartlar görsel olarak zıplıyor.
- **Etkilenen:** `styles/menu.css`, `styles/home.css`, ürün kartı bileşenleri
- **Yapılacak:** Kart görsel kabına sabit `aspect-ratio` (örn. `4/3` veya `1/1`)
  + `object-fit: cover` + `object-position` merkez. Home + menü + `/menu/[slug]`
  hepsinde tutarlı.
- **Kabul:** Kart ızgaralarında görseller aynı boyutta, hizalı.

### TASK-246 — Kart yoğunluğu / section ritmi mikro düzeltmeler (topluluk, admin, profil)
- **Öncelik:** P3 · **Ağırlık:** POLISH
- **Yapılacak:** "Ödüller" kartları, "Nasıl çalışır" adımları, admin stat/satırları,
  profil kartı için padding/hiza/`tabular-nums` gözden geçir. Clip-art ödül
  ikonlarını lucide ile değiştir (`Gift`, `Ticket`, `Coffee`).
- **Kabul:** Bu sayfalarda "gamification/clip-art" hissi azalır.

### TASK-247 — Buton hiyerarşisi / accent yoğunluğu geçişi
- **Öncelik:** P2 · **Ağırlık:** MEDIUM
- **Problem:** Menü ızgarasında 4 adet dolu accent "Sepete ekle" yan yana; genel
  olarak accent buton sıklığı yüksek.
- **Yapılacak:** Sayfa başına genelde 1 birincil (dolu accent) aksiyon. Liste/
  ızgara tekrarlı aksiyonlarını `secondary`/`ghost` yap, hover'da güçlendir.
  `Button` varyant kullanımını tüm sayfalarda denetle.
- **Kabul:** Hiçbir görünümde 3+ dolu-accent buton yan yana; birincil aksiyon net.

### TASK-248 — FAZ D regresyon checkpoint
- **Öncelik:** P1 · **Ağırlık:** HIGH
- **Yapılacak:** Build/tsc/lint + prod görsel geçiş (home, menu, /menu/[slug],
  footer, drawer, yasal sayfalar) desktop + 375. Efekt denetimi: yeni
  gradient/glow/animasyon 0.
- **Kabul:** ✅ + `WORKLOG_V2.md`.

---

## FAZ E — COPY / MICROCOPY

### TASK-249 — Hero + marka sesi: somut değer önermesi
- **Öncelik:** P1 · **Ağırlık:** HIGH
- **Etkilenen:** `app/_home/Home.tsx`, `app/site-config.ts` (`BRAND.tagline`)
- **Yapılacak:** Eyebrow "Kahvenin en samimi hali" → somut ("İstanbul'da kavrulur,
  2 günde kapında" gibi — gerçekçi ve doğrulanabilir bir vaat; teslimat metniyle
  tutarlı). H1 daha keskin. Lede kısalt, "ustalıkla kavurma" jargonunu sadeleştir.
- **Kabul:** Hero'da her cümle bir şey söylüyor; slogan başka kafeye yapıştırılamaz.

### TASK-250 — Tam microcopy geçişi (buton / empty / error / success / checkout / order)
- **Öncelik:** P2 · **Ağırlık:** MEDIUM
- **Yapılacak:** Tüm kullanıcıya görünen metinleri tara: aktif fiil + net sonuç,
  tek ses, kısa. Öncelik alanları: checkout adım başlıkları/yardım metinleri,
  onay ekranı, sepet özet satırları, tüm empty/error state'leri, form
  placeholder'ları, toast'lar. "63 DD" gibi format bug'ları (DeliveryStep hint
  render'ını doğrula).
- **Kabul:** Bir akış okuması (sepet→onay) doğal, tutarlı; format bug yok.

### TASK-251 — `BRAND` yer tutucularını netleştir
- **Öncelik:** P2 · **Ağırlık:** MEDIUM
- **Etkilenen:** `app/site-config.ts`
- **Yapılacak:** `email`, `address`, `instagram` — ya makul gerçekçi değerler
  (portföy için `merhaba@elmenescoffee.com` kalabilir ama tutarlı), ya da
  footer/iletişimde "portföy demo" notu ile birlikte. `tagline` TASK-249 ile
  güncellenir. Kod içi "yer tutucu" yorumlarını güncel tut.
- **Kabul:** Site genelinde tek e-posta, tek adres, tutarlı marka bilgisi.

### TASK-252 — Checkout onay: demo notu (tek satır, doğru yer)
- **Öncelik:** P3 · **Ağırlık:** POLISH
- **Yapılacak:** `/siparis` onay ekranına diskret 1 satır: "Bu bir demo siparişidir
  — gerçek ödeme veya kargo yoktur." (Kullanıcıyı yanıltmamak; ödeme adımındaki
  uyarıyla tutarlı, ama her yere serpiştirme.)
- **Kabul:** Onayda net ama abartısız demo notu.

### TASK-253 — `hakkimizda` içeriği: jenerikten somuta
- **Öncelik:** P3 · **Ağırlık:** POLISH
- **Yapılacak:** "Topraktan fincana" tarzı ifadeler varsa somutla (kavurma
  yaklaşımı, origin seçimi, teslimat). Portföy demo notu. 4 değer kartı eşit
  uzunlukta (V1'de yapılmıştı — doğrula).
- **Kabul:** Hakkımızda "herhangi bir kafe" metni değil.

### TASK-254 — FAZ E regresyon checkpoint
- **Öncelik:** P2 · **Ağırlık:** MEDIUM
- **Kabul:** Build yeşil; grep ile boş slogan / format bug / developer terimi = 0.

---

## FAZ F — EDGE CASES / STATES

### TASK-255 — Uzun metin dayanıklılığı
- **Öncelik:** P1 · **Ağırlık:** HIGH
- **Yapılacak:** Test verisiyle: 60+ karakter ürün/recipe adı, 40+ karakter
  kullanıcı adı, 120+ karakter adres, `₺99.999` fiyat. Kontrol: menü kartı,
  `/menu/[slug]`, sepet satırı, checkout özet, onay, `/siparis/[id]`, admin satırı,
  profil hero, header (uzun isim). `text-overflow`/`min-width:0`/`word-break`
  eksikleri düzelt.
- **Kabul:** Hiçbir görünümde taşma/kırık layout; uzun metin zarifçe kesilir/sarar.

### TASK-256 — 0 / 1 / çok sayıda öğe
- **Öncelik:** P2 · **Ağırlık:** MEDIUM
- **Yapılacak:** Sepet: 0, 1, 20+ satır (özet yapışkanlığı, scroll). Siparişlerim:
  0, 1, 20+. Menü kategori: 0 sonuç (EmptyState), 1, hepsi. Admin siparişler:
  0, çok. Builder: tüm opt-out seçili minimum fiyat.
- **Kabul:** Her sayıda düzgün; 20+ listede performans/scroll sorunsuz.

### TASK-257 — Mock async: gerçekçi gecikme + loading/skeleton
- **Öncelik:** P2 · **Ağırlık:** MEDIUM · **Bağımlılık:** TASK-213…220
- **Problem:** Service'ler senkron → loading state'leri hiç görünmüyor;
  production'da gerçek API'de görünecek.
- **Yapılacak:** Local adapter'larda `await sleep(300–600ms)` (env ile
  kapatılabilir). UI'da: menü ürün ızgarası + siparişlerim + sipariş detay +
  builder ilk yük için hafif **skeleton** (`components/ui/Skeleton` — küçük, tek
  bileşen; feature creep değil, state parity). Toast/Empty/Error zaten var.
- **Kabul:** Yavaş bağlantı simülasyonunda skeleton → içerik akışı düzgün; layout shift minimum.

### TASK-258 — Network failure simülasyonu (mock hata yolu)
- **Öncelik:** P2 · **Ağırlık:** MEDIUM · **Bağımlılık:** TASK-257
- **Yapılacak:** Adapter'lara `?mockError=1` veya bir dev toggle ile hata
  fırlatma yolu. UI: `ErrorState` + "Tekrar dene" (menü, siparişlerim, sipariş
  detay, checkout `create`). Checkout `create` başarısızsa sepet korunur,
  kullanıcı bilgilendirilir.
- **Kabul:** Hata modunda her veri yüzeyi `ErrorState` + retry; veri kaybı yok.

### TASK-259 — Form validasyon bütünlüğü
- **Öncelik:** P1 · **Ağırlık:** HIGH
- **Yapılacak:** Checkout adres (telefon formatı, il/ilçe zorunlu, adres min
  uzunluk), kart formu (16 hane, AA/YY geçerli, CVC 3–4), auth (e-posta formatı,
  şifre ≥ 8), profil düzenle. Inline hata + `aria-invalid` + submit'te ilk hataya
  odak/scroll. `Field` bileşeni bunları destekliyor — eksik bağlanan yerleri tamamla.
- **Kabul:** Her form: geçersiz submit engellenir, hatalar inline + erişilebilir,
  ilk hataya odaklanır.

### TASK-260 — Checkout state kalıcılığı (yenileme / geri)
- **Öncelik:** P2 · **Ağırlık:** MEDIUM
- **Problem:** `/odeme` yenilenince adım + form state sıfırlanır (kayıtlı adres
  hariç). Kullanıcı 3. adımda yenilerse baştan başlar.
- **Yapılacak:** Checkout state'ini (adım + adres + yöntem) `sessionStorage`'a
  (adapter üstünden) yaz, mount'ta geri yükle. Sipariş oluşunca temizle.
- **Kabul:** 3. adımda yenile → aynı adımda, form dolu; sipariş sonrası temiz.

### TASK-261 — `unoptimized` görseller: boyut/`sizes`/`priority` denetimi
- **Öncelik:** P2 · **Ağırlık:** MEDIUM
- **Problem:** `images.unoptimized:true` → orijinal 60–130KB JPEG'ler her yerde
  tam boyut iniyor. LCP ve mobil veri.
- **Yapılacak:** Ya `unoptimized`'ı kaldırıp Vercel image optimization'a güven
  (asıl neden "404 dönüyordu" — Vercel'de artık sorun değil, doğrula), ya da
  `public/` görsellerini build öncesi 2 boyuta küçült (script) + `sizes` doğru.
  Hero görseline `priority`.
- **Kabul:** Lighthouse-benzeri kontrol: ana sayfa LCP görseli makul; mobilde
  gereksiz büyük indirme yok.

### TASK-262 — `long text` + RTL/locale güvenliği (küçük)
- **Öncelik:** P3 · **Ağırlık:** POLISH
- **Yapılacak:** `Intl.NumberFormat`/`Intl.DateTimeFormat` `tr-TR` her yerde
  `lib/format` üzerinden. Elle tarih/format kalıntısı taraması.
- **Kabul:** Tüm tarih/para `lib/format` üzerinden; tutarlı.

### TASK-263 — FAZ F regresyon checkpoint
- **Öncelik:** P1 · **Ağırlık:** HIGH
- **Kabul:** Build/tsc/lint; edge-case matrisinin tamamı yeşil; `WORKLOG_V2.md`.

---

## FAZ G — FINAL SİMÜLASYON + RE-AUDIT

### TASK-264 — Animation audit (kayıt)
- **Öncelik:** P3 · **Ağırlık:** POLISH
- **Yapılacak:** Tüm `transition`/`@keyframes`/`animation` listesi; her biri için
  "feedback/orientation/hierarchy/state" gerekçesi. Gerekçesiz olan kaldırılır.
- **Kabul:** Gerekçe tablosu `WORKLOG_V2.md`'de; showcase animasyon 0.

### TASK-265 — SEO/meta final: her route metadata + JSON-LD (Organization/Product)
- **Öncelik:** P2 · **Ağırlık:** MEDIUM · **Bağımlılık:** TASK-206, TASK-241
- **Yapılacak:** Ana sayfa `Organization` + `WebSite` JSON-LD; `/menu/[slug]`
  `Product` + `Offer` JSON-LD (fiyat, para birimi, availability). Tüm public
  route'larda benzersiz title/description doğrula. `metadataBase` çalışıyor.
- **Kabul:** `view-source` ile JSON-LD geçerli; rich-results-benzeri kontrol temiz.

### TASK-266 — Prod deployment dry-run (Vercel benzeri)
- **Öncelik:** P1 · **Ağırlık:** HIGH
- **Yapılacak:** Temiz `.next` sil → `next build` → `next start`. Tüm route'lar
  200; her route'ta yenileme sonrası doğru; konsol 15 route'ta temiz; env'siz
  `example.com` yok; `/dev/ui` 404; image/font yükleniyor; 404/error/loading
  sayfaları. `NEXT_PUBLIC_SITE_URL` set ederek de bir kez dene.
- **Kabul:** Checklist tamamen ✅; `WORKLOG_V2.md`.

### TASK-267 — 9 senaryo uçtan uca simülasyon
- **Öncelik:** P0 · **Ağırlık:** BLOCKER
- **Senaryolar:** (1) ilk ziyaret→menü→ürün→sepet · (2) builder→tasarla→sepete
  ekle→checkout · (3) checkout: adres→teslimat→demo ödeme→sipariş · (4) sipariş→
  siparişlerim→detay→status tracking · (5) mobil (375) tüm ana akış · (6) hatalı
  form→validation→düzeltme · (7) boş veri→empty states · (8) yavaş/başarısız
  veri→loading/error states · (9) recruiter 60 sn: aç, kaydol, 1 ürün al, mobil
  bak, konsol aç, GitHub repo'ya bak.
- **Kabul:** Her senaryoda friction/bozukluk bulunmaz VEYA bulunanlar TASK-268+
  olarak eklenip çözülür.

### TASK-268+ — Simülasyondan çıkan yeni tasklar
- Bulunan her sorun ayrı task; çöz; tekrar simüle et.

### TASK-269 — Final visual review (her sayfa "profesyonel geliyor mu?")
- **Öncelik:** P1 · **Ağırlık:** HIGH
- **Yapılacak:** İlk ekran, header, hero, ürün kartları, butonlar, formlar,
  checkout, footer, mobil, empty/error/loading — teknik değil **görsel** kalite.
  Amatör duran her şey için task aç + düzelt.
- **Kabul:** İnceleme notları + düzeltmeler `WORKLOG_V2.md`.

### TASK-270 — FINAL SKOR + RAPOR (`AUDIT_AFTER_V2.md`)
- **Öncelik:** P0 · **Ağırlık:** BLOCKER
- **Yapılacak:** Yeniden skorla (0–100, şişirme yok): Visual Design, UX,
  Consistency, Accessibility, Responsive, Brand Identity, E-commerce UX,
  **Production Readiness**, **Recruiter Impression**, **Commercial Readiness**,
  Overall Professionalism, AI-Generated Feel (düşük=iyi). BEFORE(V2 audit)/AFTER.
  Rapor: kaç task oluşturuldu/tamamlandı, kaç yeni problem, kaç dosya değişti,
  kaç component oluşturuldu/birleştirildi, CSS değişimi, build/tsc/eslint/
  responsive/a11y sonuçları. Sonra:
  - DEPLOYMENT READY? YES/NO + neden
  - COMMERCIAL UI/UX READY? YES/NO + neden
  - BACKEND INTEGRATION READY? YES/NO + neden
  - PORTFOLIO READY? YES/NO + neden
- **Kabul:** `AUDIT_AFTER_V2.md` var; 4 soru net cevaplı; NO varsa gereken task'lar listeli.

---

## SON KURAL

Feature creep yok. Yeni animasyon/gradient/section/card/metin ekleme. Eksik olanı
yap, gereksizi kaldır, kötüyü düzelt, tutarsızı birleştir, zoru sadeleştir.
Hedef: "AI ile yapılmış güzel website" değil — "bir frontend developer gerçek bir
ürün problemi düşünmüş, UX tasarlamış, component sistemi kurmuş, responsive +
accessible + backend-ready bir e-commerce experience geliştirmiş."
