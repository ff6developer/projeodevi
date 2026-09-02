// Sepet veri katmanı (client-side prototip). Tek anahtar: localStorage["elmenes.cart"].
// (TASK-085 için erken oluşturuldu; TASK-109 context/provider ekler.)

import type { CartLine, CoffeeRecipe } from "./types"

const KEY = "elmenes.cart"
const EVENT = "cartChanged"

function read(): CartLine[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as CartLine[]) : []
  } catch {
    return []
  }
}

function write(lines: CartLine[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(KEY, JSON.stringify(lines))
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
  const lines = read()
  const existing = lines.find((l) => l.kind === "product" && l.productId === input.productId)
  if (existing) {
    existing.qty += input.qty ?? 1
  } else {
    lines.push({
      kind: "product",
      lineId: uid(),
      productId: input.productId,
      slug: input.slug,
      name: input.name,
      image: input.image,
      unitKurus: input.unitKurus,
      qty: input.qty ?? 1,
    })
  }
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
  const lines = read()
  lines.push({
    kind: "recipe",
    lineId: uid(),
    name: input.name,
    image: input.image,
    unitKurus: input.unitKurus,
    qty: input.qty ?? 1,
    recipe: input.recipe,
    score: input.score,
    fromArena: input.fromArena,
  })
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
