// CartService — sepet arayüzü.
//
// Aktif adapter: LOCAL (`lib/cart.ts`, depolama = adapters/local/storage).
// CartProvider yalnız bu fonksiyonlara bağlıdır. Gerçek backend geldiğinde
// `addProduct`/`setQty` vb. bir HTTP çağrısına dönüşür; `subscribeCart` yerini
// SSE / websocket / polling alır. Sözleşme: docs/BACKEND_CONTRACT.md.

export {
  getCart,
  getCartCount,
  getSubtotalKurus,
  addProduct,
  addRecipe,
  setQty,
  removeLine,
  clearCart,
  subscribeCart,
  EMPTY_CART,
} from "../cart"
