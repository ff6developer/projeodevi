// OrderService — sipariş arayüzü.
//
// Aktif adapter: LOCAL (`lib/orders.ts`, depolama = adapters/local/storage).
// Checkout, /siparis*, /siparislerim, admin ve profil yalnız bu fonksiyonlara
// bağlıdır. Gerçek backend: REST + webhook (durum güncellemeleri). Legacy
// migrasyon local adapter içinde kalır. Sözleşme: docs/BACKEND_CONTRACT.md.

export {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  nextStatus,
  legacyStatusToCanonical,
  parseOrderDate,
  STATUS_FLOW,
  STATUS_LABEL,
} from "../orders"
