# Çalışma Konvansiyonları

`MASTER_TASK_PLAN.md` bu dosyaya referans verir. Tüm yeni kod bu kurallara uyar.

## Klasör yapısı

| Yol | İçerik |
|---|---|
| `app/` | Route'lar (App Router). Her route: `page.tsx` (sunucu, metadata) + `*Client.tsx` (gerekiyorsa). |
| `components/ui/` | Paylaşılan tasarım-sistemi component'leri. `Name/Name.tsx` + `Name.module.css` + `index.ts`. |
| `components/` | Uygulamaya özel bileşik component'ler (HeaderNav, SiteFooter, CartProvider…). |
| `lib/` | Veri katmanı ve saf yardımcılar. Tarayıcı `localStorage` erişimi SADECE burada. Tipler `lib/types.ts`. |
| `styles/` | `tokens.css` (tek token kaynağı), `base.css` (reset + element defaultları), `typography.css`, `utilities.css`, sayfa/parça CSS'leri (giderek `*.module.css`'e taşınır). |
| `docs/` | Bu dosya, kararlar. |

## Import

- Cross-directory import → `@/...` alias (`@/components/ui/Button`, `@/lib/orders`).
- Aynı klasör → relatif (`./Name.module.css`).

## Stil

- **Token'lar sadece `styles/tokens.css`.** Yeni `:root` bloğu YOK. Yeni sabit hex/px YOK — `var(--...)` kullan.
- Değer ölçekleri: renk, `--fs-*`, `--s-*` (4px), `--r-*` (sm/md/lg/pill), `--shadow-1|2`, `--z-*`, `--t-fast|base`.
- CSS Modules yeni component'ler için varsayılan. Global CSS sadece `base/tokens/typography/utilities` + geçiş dönemindeki sayfa sheet'leri.
- Sınıf adı çakışması yasak; sayfa-özel sınıflar prefix'li (`menu-…`, `admin-…`) veya module.

## Yasak listesi (Art Direction gereği)

1. `linear-gradient` / `radial-gradient` (arka plan veya metin) — YOK.
2. `backdrop-filter` / `filter: blur()` — YOK (istisna yok).
3. Glow: `box-shadow: 0 0 Npx rgba(...)`, `drop-shadow` glow — YOK.
4. `box-shadow` — sadece `var(--shadow-1)` / `var(--shadow-2)`.
5. `border-radius` — sadece `var(--r-sm|md|lg|pill)` (+ `50%` yuvarlak avatar).
6. `position: fixed` — sadece header, drawer, modal, toast.
7. `100vh` yerine `100dvh` / içerik tabanlı yükseklik; scroll-hijack YOK.
8. Dekoratif animasyon (`float`, `rotateX`, `translate` > 4px hover) — YOK. Motion: 120–180ms, color/opacity/border/≤4px transform.
9. Emoji UI ikonu olarak — YOK. İkon = `lucide-react`, boyut `16 / 20 / 24`. Emoji sadece kullanıcı içeriğinde.
10. Native `alert` / `confirm` / `prompt` — YOK. `Modal` / `ConfirmDialog` kullan.
11. `text-transform: uppercase` — sadece `.eyebrow` (küçük etiket). `font-weight` 400/500/600.
12. `background-clip: text` / gradient metin — YOK.
13. Kullanıcıya görünen metinde: "backend", "server", "terminal", "localStorage", "debug", "API" — YOK.
14. Sahte sayı / sahte kullanıcı / "yakında" özelliği yayında — YOK.
15. Para birimi: her zaman `lib/format.formatPrice()` / `<Price>` — çıplak `TL`/`₺` string YOK. Fiyatlar veride **kuruş (integer)**.
16. `any` mümkün olduğunca yok; `lib/types.ts`.

## Component API kuralı

- Her ui component'i `variant` + `size` prop'larıyla; aynı işin 2. bir stil kopyası yazılmaz.
- `Button`: `variant='primary'|'secondary'|'ghost'|'danger'`, `size='md'|'lg'`.
- Erişilebilirlik component'in parçası: `:focus-visible`, `aria-*`, klavye, `prefers-reduced-motion`. Sonradan eklenmez.

## Task döngüsü

1. Task'ı oku → ilgili dosyaları incele.
2. Değişiklik yap (yasak listesine uy).
3. `npx tsc --noEmit` + `npx next build`.
4. İlgili UX akışını + responsive + a11y etkisini kontrol et.
5. Önceki özellikler bozulmadı mı?
6. Kabul + test kriterleri karşılandı mı?
7. `WORKLOG.md` satırı ekle; `MASTER_TASK_PLAN.md` durum güncelle.
8. Commit: `TASK-XXX: <özet>`.
9. Sonraki task.

Yeni problem bulunursa: mevcut task'ı şişirme → `MASTER_TASK_PLAN.md`'ye yeni TASK olarak ekle, doğru faza koy.
