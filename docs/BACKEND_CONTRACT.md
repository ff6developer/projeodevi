# Backend Contract — Mock → API geçiş rehberi

Bu proje **backend'siz** çalışır (client-side prototip). Ama UI hiçbir yerde
`localStorage`'a veya `fetch`'e doğrudan dokunmaz — her şey `lib/` altındaki
**servis katmanından** geçer. Gerçek bir backend geldiğinde yalnızca **adapter
katmanı** değişir; UI, sayfa ve bileşen kodu aynı kalır.

## Katmanlar

```
app/ · components/            UI — yalnız servis fonksiyonlarını + tipleri çağırır
        │
        ▼
lib/services/*.ts             ARAYÜZ — servis sözleşmesi + aktif adapter seçimi
        │
        ▼
lib/*.ts  (cart, orders, …)   AKTİF ADAPTER = LOCAL
        │
        ▼
lib/services/adapters/local/storage.ts   ← tarayıcı depolamasına TEK erişim noktası
```

**Kural:** `grep -rn "localStorage" app/ components/ lib/ | grep -v adapters/local/storage`
→ **boş olmalı**. (Yalnız `storage.ts` `window.localStorage`'a dokunur.)

## Geçiş — 3 adım

1. `lib/services/adapters/http/` altında her servis için bir HTTP adapter yaz
   (`fetch` + JSON). Aynı fonksiyon imzaları, aynı dönüş tipleri.
2. İlgili `lib/services/<servis>.ts` dosyasında export'u LOCAL yerine HTTP
   adapter'a çevir (tek satır).
3. `storage.ts` yalnız gerçekten client-only kalması gereken şeyler için kalır
   (ör. çekmece durumu, sepet için offline cache). Oturum → httpOnly cookie.

Aşağıda her servisin mevcut imzası ve önerilen REST karşılığı.

---

## AuthService — `lib/services/auth.ts`

Aktif adapter: `adapters/local/auth.ts` (`elmenes.users` = yalnız `{name,email}`;
parola saklanmaz — demo). Oturum: `lib/session.ts` (`localStorage["user"]`).

| Metod | İmza | REST |
|---|---|---|
| `register` | `({name,email,password}) → Promise<Result<AuthUser>>` | `POST /api/auth/register` → `201 {user}` \| `409 {error}` |
| `login` | `({email,password}) → Promise<Result<AuthUser>>` | `POST /api/auth/login` → `200 {user}` + `Set-Cookie` \| `401` |
| `logout` | `() → Promise<void>` | `POST /api/auth/logout` |
| `getCurrentUser` | `() → AuthUser \| null` | `GET /api/auth/me` (SSR: cookie) |
| `loginDemo` | `() → Promise<Result<AuthUser>>` | (yalnız demo — API'de kaldırılır) |

Değişecek: `AuthForm` değişmez. `lib/session.ts` → cookie/JWT okuyan bir
adapter; `getUser/isLoggedIn/isAdmin/subscribe` API'si korunur.

## ProductService — `lib/services/catalog.ts`

Aktif adapter: statik `lib/products.ts` (23 ürün). Senkron; interface HTTP'de
`Promise` döner (UI'da `await` eklenir — menü ve `/menu/[slug]` client/server).

| Metod | REST |
|---|---|
| `list()` | `GET /api/products` |
| `listByCategory(cat)` | `GET /api/products?category=` |
| `getBySlug(slug)` | `GET /api/products/:slug` |
| `getById(id)` | `GET /api/products/:id` |

## CartService — `lib/services/cart.ts` (→ `lib/cart.ts`)

Aktif adapter: `localStorage["elmenes.cart"]` + `cartChanged` olayı +
snapshot-cache (`useSyncExternalStore` için).

| Metod | REST |
|---|---|
| `getCart()` | `GET /api/cart` |
| `addProduct(input)` | `POST /api/cart/items` (product) |
| `addRecipe(input)` | `POST /api/cart/items` (recipe) |
| `setQty(lineId, qty)` | `PATCH /api/cart/items/:lineId` |
| `removeLine(lineId)` | `DELETE /api/cart/items/:lineId` |
| `clearCart()` | `DELETE /api/cart` |
| `subscribeCart(cb)` | SSE `/api/cart/stream` veya optimistic + revalidate |

Not: misafir sepeti (localStorage) + giriş sonrası merge senaryosu backend'de
tanımlanmalı.

## OrderService — `lib/services/orders.ts` (→ `lib/orders.ts`)

Aktif adapter: `localStorage["elmenes.orders"]` (+ legacy `orders` migrasyonu).

| Metod | REST |
|---|---|
| `createOrder(input)` | `POST /api/orders` → `{id, status:"alindi", …}` |
| `getOrders(userEmail?)` | `GET /api/orders` (cookie → kullanıcı) |
| `getOrder(id)` | `GET /api/orders/:id` |
| `updateOrderStatus(id, status)` | `PATCH /api/orders/:id` (admin) |
| `deleteOrder(id)` | `DELETE /api/orders/:id` (admin) |

Durum akışı `STATUS_FLOW` sabit; gerçek sistemde webhook / push ile güncellenir.

## ProfileService — `lib/profile.ts`

`userPosts`, `userAvatar` (dataURL — API'de dosya yükleme), `userBio`.

| Fonksiyon | REST |
|---|---|
| `getProfilePosts` / `saveProfilePosts` | `GET/PUT /api/me/posts` |
| `getAvatar` / `saveAvatar` | `GET /api/me` · `POST /api/me/avatar` (multipart) |
| `getBio` / `saveBio` | `PATCH /api/me {bio}` |

## CommunityService — `lib/community.ts`

`arenaPosts`, `userVotes`, `arenaChampion`, dönem (`arenaPeriod`).

| Fonksiyon | REST |
|---|---|
| `listCommunityPosts` | `GET /api/community/posts` |
| `prependCommunityPost` | `POST /api/community/posts` |
| `removeCommunityPost` | `DELETE /api/community/posts/:id` |
| `getVotedPostIds` / `saveVotedPostIds` | `POST/DELETE /api/community/posts/:id/vote` |
| `getChampion` | `GET /api/community/champion` |
| dönem/rollover | sunucu cron işi olur; client sadece okur |

## Galeri & Katalog & Yorumlar & Taslak

| Modül | Anahtar | REST |
|---|---|---|
| `lib/gallery.ts` | `coffees` | `GET/POST/DELETE /api/me/coffees` |
| `lib/catalog.ts` | `products` (admin ekli) | `GET/POST/DELETE /api/admin/products` |
| `lib/reviews.ts` | `menuYorumlar` | `GET/POST /api/products/:id/reviews` |
| `lib/builder-draft.ts` | `copiedRecipe` | client-only kalır (sekmeler arası aktarım) |

## Ortak tipler — `lib/services/types.ts`

`Result<T> = { ok:true; data:T } | { ok:false; error:string; code?:string }`
HTTP adapter'ları `res.ok` → `Result`; hata gövdesi `{error, code}`.
