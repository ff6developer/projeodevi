// Admin ürün kataloğu düzenlemeleri (client-side prototip).
// Not: menü/vitrin ürünleri `lib/products.ts` (statik). Bu modül yalnız admin
// panelinin eklediği/düzenlediği ürünleri tutar.
// Depolama: services/adapters/local/storage. Backend: GET/POST/DELETE /api/admin/products.

import { readJSON, writeJSON } from "./services/adapters/local/storage"

const KEY = "products"

export type CatalogProduct = { id: number; name: string; priceKurus: number }

type StoredProduct = { id: number; name: string; price?: number; priceKurus?: number }

export function listCatalogProducts(): CatalogProduct[] {
  return readJSON<StoredProduct[]>(KEY, []).map((x) => ({
    id: x.id,
    name: x.name,
    priceKurus: x.priceKurus ?? (x.price ?? 0) * 100,
  }))
}

export function saveCatalogProducts(products: CatalogProduct[]): void {
  writeJSON(KEY, products)
}
