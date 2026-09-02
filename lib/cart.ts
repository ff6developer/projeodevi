// Sepet veri katmanı (client-side prototip). Tek anahtar: localStorage["elmenes.cart"].
// (TASK-085 için erken oluşturuldu; TASK-109 context/provider ekler.)

import type { CartLine, CoffeeRecipe } from "./types"

const KEY = "elmenes.cart"
const EVENT = "cartChanged"

/** Boş sepet için sabit referans — useSyncExternalStore döngüye girmesin. */
export const EMPTY_CART: readonly CartLine[] = Object.freeze([])

// Snapshot önbelleği: localStorage string'i değişmedikçe aynı dizi referansı döner.
let cacheRaw: string | null = null
let cache: CartLine[] = EMPTY_CART as CartLine[]

function read(): CartLine[] {
  if (typeof window === "undefined") return EMPTY_CART as CartLine[]
  try {
    const raw = window.localStorage.getItem(KEY)
    if (raw === cacheRaw) return cache
    cacheRaw = raw
    cache = raw ? (JSON.parse(raw) as CartLine[]) : (EMPTY_CART as CartLine[])
    return cache
  } catch {
    return EMPTY_CART as CartLine[]
  }
}

function write(lines: CartLine[]) {
  if (typeof window === "undefined") return
  const raw = JSON.stringify(lines)
  window.localStorage.setItem(KEY, raw)
  // Snapshot önbelleğini hemen güncelle: useSyncExternalStore aynı referansı görsün.
  cacheRaw = raw
  cache = lines
  window.dispatchEvent(new Event(EVENT))
}

const uid = () => `l_${Date.now().toString(36)}_${Math.random().toString(16).slice(2, 8)}`

export function getCart(): CartLine[] {
  return read()
}

export function getCartCount(): number {
  return read().reduce((n, l) => n + l.qty, 0)
}

export function getSubtotalKurus(): number {
  return read().reduce((n, l) => n + l.unitKurus * l.qty, 0)
}

type AddProductInput = {
  productId: number
  slug: string
  name: string
  image?: string
  unitKurus: number
  qty?: number
}

export function addProduct(input: AddProductInput): void {
  const current = read()
  const add = input.qty ?? 1
  const hasLine = current.some(
    (l) => l.kind === "product" && l.productId === input.productId,
  )
  const lines: CartLine[] = hasLine
    ? current.map((l) =>
        l.kind === "product" && l.productId === input.productId
          ? { ...l, qty: l.qty + add }
          : l,
      )
    : [
        ...current,
        {
          kind: "product",
          lineId: uid(),
          productId: input.productId,
          slug: input.slug,
          name: input.name,
          image: input.image,
          unitKurus: input.unitKurus,
          qty: add,
        },
      ]
  write(lines)
}

type AddRecipeInput = {
  name: string
  image?: string | null
  unitKurus: number
  recipe: CoffeeRecipe
  score: number
  fromArena?: boolean
  qty?: number
}

export function addRecipe(input: AddRecipeInput): void {
  const lines: CartLine[] = [
    ...read(),
    {
      kind: "recipe",
      lineId: uid(),
      name: input.name,
      image: input.image,
      unitKurus: input.unitKurus,
      qty: input.qty ?? 1,
      recipe: input.recipe,
      score: input.score,
      fromArena: input.fromArena,
    },
  ]
  write(lines)
}

export function setQty(lineId: string, qty: number): void {
  const lines = read()
    .map((l) => (l.lineId === lineId ? { ...l, qty: Math.max(1, qty) } : l))
  write(lines)
}

export function removeLine(lineId: string): void {
  write(read().filter((l) => l.lineId !== lineId))
}

export function clearCart(): void {
  write([])
}

export function subscribeCart(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {}
  const h = () => cb()
  window.addEventListener(EVENT, h)
  window.addEventListener("storage", h)
  return () => {
    window.removeEventListener(EVENT, h)
    window.removeEventListener("storage", h)
  }
}
