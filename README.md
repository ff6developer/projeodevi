# Elmenes Coffee

Bir kahve markası için Next.js (App Router) uygulaması: menü, kendi kahveni tasarlama
akışı, sepet/checkout ve topluluk seçkisi.

## Çalıştırma

```bash
npm install
npm run dev
```

http://localhost:3000

İsteğe bağlı yerel backend (kimlik doğrulama denemesi için):

```bash
node backend/index.js
```

## Yapı

| Yol | İçerik |
|---|---|
| `app/` | Route'lar. Her route: `page.tsx` (+ `*Client.tsx`). |
| `components/ui/` | Paylaşılan tasarım-sistemi bileşenleri. |
| `components/` | Uygulamaya özel bileşik bileşenler. |
| `lib/` | Veri katmanı + saf yardımcılar (localStorage erişimi burada). |
| `styles/` | `tokens.css` (tek token kaynağı), `base.css`, `typography.css`, sayfa CSS'leri. |

## Dokümantasyon

- `MASTER_TASK_PLAN.md` — profesyonelleştirme yol haritası ve tasklar.
- `WORKLOG.md` — tamamlanan tasklar.
- `docs/CONVENTIONS.md` — kod/stil konvansiyonları ve yasak listesi.

## Ortam değişkenleri

Bkz. `.env.example`. Yayına almadan önce `NEXT_PUBLIC_SITE_URL` ve
`app/site-config.ts` içindeki `BRAND` yer tutucularını gerçek değerlerle doldurun.
