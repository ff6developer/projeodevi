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
