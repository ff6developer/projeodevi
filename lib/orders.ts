// Sipariş veri katmanı (client-side prototip).
// Tek yetkili kaynak: localStorage["elmenes.orders"]. Bileşenler doğrudan
// localStorage'a dokunmaz, bu modülü kullanır.

import type { CoffeeRecipe, Order, OrderInput, OrderStatus } from "./types"

const KEY = "elmenes.orders"
const LEGACY_KEY = "orders"

/* ----------------------------- durum akışı ----------------------------- */

export const STATUS_FLOW: OrderStatus[] = ["alindi", "hazirlaniyor", "hazir", "teslim"]

export const STATUS_LABEL: Record<OrderStatus, string> = {
  alindi: "Alındı",
  hazirlaniyor: "Hazırlanıyor",
  hazir: "Hazır",
  teslim: "Teslim edildi",
  iptal: "İptal edildi",
}

/** Bir sonraki mantıklı durum (akışın sonundaysa aynısını döndürür). */
export function nextStatus(s: OrderStatus): OrderStatus {
  const i = STATUS_FLOW.indexOf(s)
  if (i === -1 || i === STATUS_FLOW.length - 1) return s
  return STATUS_FLOW[i + 1]
}

/** Eski Türkçe durum stringlerini kanonik değerlere çevirir. */
export function legacyStatusToCanonical(raw: unknown): OrderStatus {
  const s = String(raw || "").toLowerCase()
  if (s.includes("hazırlan") || s.includes("hazirlan")) return "hazirlaniyor"
  if (s.includes("hazır") || s === "hazir") return "hazir"
  if (s.includes("teslim")) return "teslim"
  if (s.includes("iptal")) return "iptal"
  return "alindi" // "Bekliyor" ve bilinmeyenler
}

/* --------------------------- tarih yardımcı --------------------------- */

/**
 * Sipariş tarihleri hem ISO hem de eski "GG.AA.YYYY SS:dd:ss" formatında
 * gelebilir. Tek noktadan parse edilir.
 */
export function parseOrderDate(dateStr: string): Date | null {
  if (!dateStr) return null
  let date: Date
  if (dateStr.includes("T")) {
    date = new Date(dateStr)
  } else {
    const [datePart, timePart] = dateStr.split(" ")
    const [day, month, year] = datePart.split(".")
    if (!day || !month || !year) return null
    date = new Date(
      `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${timePart || "00:00:00"}`,
    )
  }
  return isNaN(date.getTime()) ? null : date
}

/* ------------------------------ depolama ------------------------------ */

function read(): Order[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Order[]
  } catch {
    /* yoksay */
  }
  // İlk okumada eski kayıtları taşı.
  const migrated = migrateLegacy()
  if (migrated.length) write(migrated)
  return migrated
}

function write(orders: Order[]) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(KEY, JSON.stringify(orders))
  } catch {
    /* yoksay */
  }
}

/** Eski "orders" anahtarındaki kayıtları kanonik şekle çevirir (kopya bırakır). */
function migrateLegacy(): Order[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(LEGACY_KEY)
    if (!raw) return []
    const legacy = JSON.parse(raw) as Array<Record<string, unknown>>
    if (!Array.isArray(legacy)) return []
    return legacy.map((o, i): Order => {
      const total = Number(o.totalPrice ?? o.total ?? 0)
      const original = Number(o.originalPrice ?? o.originalTotal ?? total)
      const discount = Math.max(0, original - total)
      const created =
        parseOrderDate(String(o.date ?? ""))?.toISOString() ?? new Date().toISOString()
      return {
        id: typeof o.id === "string" ? o.id : `A${1000 + (Number(o.id) % 9000 || i)}`,
        createdAt: created,
        status: legacyStatusToCanonical(o.status),
        items: [
          {
            kind: "recipe",
            name: (o.coffeeName as string) || "İsimsiz Kahve",
            image: (o.image as string | null) ?? null,
            unitKurus: Math.round(total * 100),
            qty: 1,
            recipe: o.details as CoffeeRecipe | undefined,
            score: Number(o.score ?? 0),
            fromArena: Boolean(o.isFromArena),
          },
        ],
        subtotalKurus: Math.round(original * 100),
        discountKurus: Math.round(discount * 100),
        shippingKurus: 0,
        totalKurus: Math.round(total * 100),
      }
    })
  } catch {
    return []
  }
}

/* ------------------------------- API -------------------------------- */

function makeOrderId(existing: Order[]): string {
  const taken = new Set(existing.map((o) => o.id))
  let id = ""
  do {
    id = `A${Math.floor(1000 + Math.random() * 9000)}`
  } while (taken.has(id))
  return id
}

export function getOrders(): Order[] {
  return read().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function getOrder(id: string): Order | undefined {
  return read().find((o) => o.id === id)
}

export function createOrder(input: OrderInput): Order {
  const orders = read()
  const order: Order = {
    ...input,
    id: makeOrderId(orders),
    createdAt: new Date().toISOString(),
    status: "alindi",
  }
  write([order, ...orders])
  return order
}

export function updateOrderStatus(id: string, status: OrderStatus): void {
  write(read().map((o) => (o.id === id ? { ...o, status } : o)))
}

export function deleteOrder(id: string): void {
  write(read().filter((o) => o.id !== id))
}
