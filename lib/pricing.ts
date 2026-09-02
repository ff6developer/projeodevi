// Fiyatlandırma — tek doğruluk kaynağı. Tüm tutarlar kuruş (integer).

import type { CartLine, CoffeeRecipe, DeliveryMethod } from "./types"

export const BASE_COFFEE_KURUS = 10000 // "Kendi kahveni tasarla" temel fiyat (₺100)
export const ARENA_DISCOUNT = 0.15 // topluluktan gelen kilitli tarif indirimi

export const FREE_SHIPPING_THRESHOLD_KURUS = 30000 // ₺300 üstü ücretsiz
export const SHIPPING_STANDARD_KURUS = 3000 // ₺30
export const SHIPPING_FAST_KURUS = 6000 // ₺60

export const DELIVERY_LABEL: Record<DeliveryMethod, string> = {
  standart: "Standart (2–3 gün)",
  hizli: "Hızlı (1 gün)",
}

type RecipeOptionish = { price?: number } | null | undefined

/** Bir tarifin fiyatı: temel kahve + ücretli seçenekler (kuruş). */
export function priceRecipe(
  recipe: CoffeeRecipe,
  opts?: { arenaLocked?: boolean },
): { subtotalKurus: number; discountKurus: number; totalKurus: number } {
  const addons = (Object.values(recipe) as RecipeOptionish[]).reduce(
    (n, o) => n + Math.round((o?.price ?? 0) * 100),
    0,
  )
  const subtotal = BASE_COFFEE_KURUS + addons
  const discount = opts?.arenaLocked ? Math.round(addons * ARENA_DISCOUNT) : 0
  return { subtotalKurus: subtotal, discountKurus: discount, totalKurus: subtotal - discount }
}

/** Sepet toplamları — sepet, checkout ve onay ekranı hep bunu kullanır. */
export function computeCartTotals(input: {
  lines: CartLine[]
  delivery?: DeliveryMethod
}): {
  subtotalKurus: number
  discountKurus: number
  shippingKurus: number
  totalKurus: number
  freeShippingRemainingKurus: number
} {
  const subtotalKurus = input.lines.reduce((n, l) => n + l.unitKurus * l.qty, 0)

  // Tarif satırlarındaki Arena indirimi zaten unitKurus'a yansımış kabul edilir;
  // sepet düzeyinde ayrı bir indirim yok (kupon vb. backlog).
  const discountKurus = 0

  let shippingKurus = 0
  if (input.delivery === "hizli") {
    shippingKurus = SHIPPING_FAST_KURUS
  } else if (input.delivery === "standart") {
    shippingKurus =
      subtotalKurus >= FREE_SHIPPING_THRESHOLD_KURUS ? 0 : SHIPPING_STANDARD_KURUS
  }

  const totalKurus = subtotalKurus - discountKurus + shippingKurus
  const freeShippingRemainingKurus = Math.max(0, FREE_SHIPPING_THRESHOLD_KURUS - subtotalKurus)

  return { subtotalKurus, discountKurus, shippingKurus, totalKurus, freeShippingRemainingKurus }
}
