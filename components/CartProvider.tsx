"use client"

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import * as cart from "@/lib/cart"
import type { CartLine } from "@/lib/types"

type CartApi = {
  lines: CartLine[]
  count: number
  subtotalKurus: number
  /** true olduğunda sepet tarayıcıdan okunmuştur (ilk client render'ında da). */
  hydrated: boolean
  addProduct: typeof cart.addProduct
  addRecipe: typeof cart.addRecipe
  setQty: (lineId: string, qty: number) => void
  removeLine: (lineId: string) => void
  clear: () => void
}

const CartContext = createContext<CartApi | null>(null)

const serverLines = () => cart.EMPTY_CART as CartLine[]

export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(cart.subscribeCart, cart.getCart, serverLines)
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  const api = useMemo<CartApi>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotalKurus: lines.reduce((n, l) => n + l.unitKurus * l.qty, 0),
      hydrated,
      addProduct: cart.addProduct,
      addRecipe: cart.addRecipe,
      setQty: cart.setQty,
      removeLine: cart.removeLine,
      clear: cart.clearCart,
    }),
    [lines, hydrated],
  )

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

export function useCart(): CartApi {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
