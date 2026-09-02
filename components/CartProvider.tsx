"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import * as cart from "@/lib/cart"
import type { CartLine } from "@/lib/types"

type CartApi = {
  lines: CartLine[]
  count: number
  subtotalKurus: number
  addProduct: typeof cart.addProduct
  addRecipe: typeof cart.addRecipe
  setQty: (lineId: string, qty: number) => void
  removeLine: (lineId: string) => void
  clear: () => void
}

const CartContext = createContext<CartApi | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])

  const sync = useCallback(() => setLines(cart.getCart()), [])

  useEffect(() => {
    sync()
    return cart.subscribeCart(sync)
  }, [sync])

  const api = useMemo<CartApi>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotalKurus: lines.reduce((n, l) => n + l.unitKurus * l.qty, 0),
      addProduct: cart.addProduct,
      addRecipe: cart.addRecipe,
      setQty: cart.setQty,
      removeLine: cart.removeLine,
      clear: cart.clearCart,
    }),
    [lines],
  )

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

export function useCart(): CartApi {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
