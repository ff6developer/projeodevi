// Merkezi site meta verisi. Tek noktadan yönetilerek metadata tekrarını önler.

/**
 * Kanonik site adresi. Öncelik sırası:
 *  1. NEXT_PUBLIC_SITE_URL  — kendi domain'in (Vercel > Project Settings > Env)
 *  2. Vercel'in otomatik production domain'i (build sırasında enjekte edilir)
 *  3. Vercel preview/branch domain'i
 *  4. Yerel geliştirme
 * Böylece hiçbir env ayarlanmasa bile "example.com" gibi yer tutucu yayınlanmaz.
 */
function resolveSiteUrl(): string {
  const env = process.env
  const candidate =
    env.NEXT_PUBLIC_SITE_URL ||
    // Vercel — server/build ortamında bunlar otomatik enjekte edilir.
    prefixHttps(env.VERCEL_PROJECT_PRODUCTION_URL) ||
    prefixHttps(env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) ||
    prefixHttps(env.VERCEL_URL) ||
    prefixHttps(env.NEXT_PUBLIC_VERCEL_URL)
  return candidate || "http://localhost:3000"
}

function prefixHttps(host?: string): string | undefined {
  if (!host) return undefined
  return host.startsWith("http") ? host : `https://${host}`
}

export const SITE_URL = resolveSiteUrl()

export const SITE_NAME = "Elmenes Coffee"

export const SITE_DESCRIPTION =
  "Nitelikli çekirdek, ustalıkla kavurma. Menüden sipariş ver ya da kendi kahveni tasarla."

/**
 * Marka bilgisi — tek kaynak. Footer, iletişim, metadata buradan beslenir.
 * Bu bir portföy/demo projesidir; iletişim bilgileri örnek amaçlıdır.
 */
export const BRAND = {
  name: SITE_NAME,
  shortName: "Elmenes",
  tagline: "Taze kavrulmuş kahve, kapına gelir",
  description: SITE_DESCRIPTION,
  email: "merhaba@elmenescoffee.com",
  phone: "",
  address: "İstanbul, Türkiye",
  instagram: "",
  currency: "TRY" as const,
  locale: "tr-TR" as const,
  /** Sitenin gerçek bir mağaza değil, bir portföy demosu olduğunu belirtir. */
  isDemo: true,
}
