// Biçimlendirme yardımcıları. Fiyatlar her zaman kuruş (integer).

const priceFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
})

/** Kuruş → "₺1.234" */
export function formatPrice(kurus: number): string {
  return priceFormatter.format(Math.round(kurus) / 100)
}

/** Lira (kullanıcı girişi) → kuruş */
export function liraToKurus(lira: number | string): number {
  const n = typeof lira === "string" ? parseFloat(lira.replace(",", ".")) : lira
  return Number.isFinite(n) ? Math.round(n * 100) : 0
}

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
})

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return isNaN(d.getTime()) ? "" : dateFormatter.format(d)
}

const dayFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
})

/**
 * Tahmini teslim aralığı — sipariş tarihinden itibaren teslimat yöntemine göre.
 * Standart: 2–3 gün · Hızlı: 1 gün.
 */
export function estimateDelivery(
  iso: string,
  delivery: "standart" | "hizli" | undefined,
): string {
  const base = new Date(iso)
  if (isNaN(base.getTime())) return ""
  const [minDays, maxDays] = delivery === "hizli" ? [1, 1] : [2, 3]
  const from = new Date(base)
  from.setDate(from.getDate() + minDays)
  const to = new Date(base)
  to.setDate(to.getDate() + maxDays)
  if (minDays === maxDays) return dayFormatter.format(from)
  return `${from.getDate()}–${dayFormatter.format(to)}`
}
