// Merkezi site meta verisi. Tek noktadan yönetilerek metadata tekrarını önler.
//
// ÖNEMLİ: Gerçek üretim alan adı bilinmediği için NEXT_PUBLIC_SITE_URL ortam
// değişkeni kullanılıyor. Canlıya almadan önce bu değişkeni gerçek alan adınızla
// ayarlayın (Vercel > Project Settings > Environment Variables içinde
// NEXT_PUBLIC_SITE_URL=https://sizin-domaininiz.com).
// Ayarlanmazsa metadataBase/sitemap/robots aşağıdaki yer tutucuyu kullanır.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"

export const SITE_NAME = "Elmenes Coffee"

export const SITE_DESCRIPTION =
  "Nitelikli çekirdek, ustalıkla kavurma. Menüden sipariş ver ya da kendi kahveni tasarla."

/**
 * Marka bilgisi — tek kaynak. Footer, iletişim, metadata buradan beslenir.
 * ÖNEMLİ: `email`, `phone`, `instagram` yer tutucudur; yayına almadan önce
 * gerçek değerlerle güncelleyin.
 */
export const BRAND = {
  name: SITE_NAME,
  shortName: "Elmenes",
  tagline: "Kahvenin en samimi hali",
  description: SITE_DESCRIPTION,
  email: "merhaba@elmenescoffee.com", // yer tutucu
  phone: "", // yer tutucu — boşsa gösterilmez
  address: "İstanbul, Türkiye", // yer tutucu
  instagram: "", // yer tutucu — boşsa gösterilmez
  currency: "TRY" as const,
  locale: "tr-TR" as const,
}

// ÖNEMLİ: Bu proje Vercel Services ile deploy ediliyor — frontend (bu Next.js
// uygulaması, root: /) ve backend (/backend, Express) AYNI Vercel projesinde,
// aynı domainde birlikte deploy edilir (bkz. kök dizindeki vercel.json).
// Backend'e /api/backend/* altından, aynı origin üzerinden erişilir; ayrı bir
// backend URL'i GEREKMEZ.
//
// Production (Vercel): NEXT_PUBLIC_API_URL'i BOŞ BIRAKIN (hiç ayarlamayın veya
// boş string girin). Böylece istekler aynı origin'den /api/backend/... olarak
// gider ve vercel.json'daki rewrite kuralı bunları backend servisine yönlendirir.
// Yerel geliştirme: NEXT_PUBLIC_API_URL ayarlanmazsa (undefined) aşağıdaki
// localhost adresi kullanılır — backend'i ayrıca "node backend/index.js" ile
// yerelde çalıştırdığınızda kullanışlıdır. Boş string ("") ile undefined
// kasıtlı olarak ayrılır: boş string "aynı origin" anlamına gelir.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"
