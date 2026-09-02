// ProductService — menü / ürün verisi arayüzü.
//
// Aktif adapter: LOCAL (statik `lib/products.ts`). Gerçek backend geldiğinde
// `adapters/http/catalog` yazılır; `getProducts`/`getProduct` imzaları aynı
// kalır (bugün senkron; interface Promise'e taşınabilir). Menü ve ana sayfa
// yalnız bu fonksiyonları çağırır. Sözleşme: docs/BACKEND_CONTRACT.md.

import type { Product, ProductCategory } from "../types"
import {
  PRODUCTS,
  CATEGORY_LABEL,
  getProducts,
  getByCategory,
  getProduct,
  getProductById,
} from "../products"

export interface ProductService {
  list(): Product[]
  listByCategory(cat: ProductCategory): Product[]
  getBySlug(slug: string): Product | undefined
  getById(id: number): Product | undefined
}

export const productService: ProductService = {
  list: getProducts,
  listByCategory: getByCategory,
  getBySlug: getProduct,
  getById: getProductById,
}

export { PRODUCTS, CATEGORY_LABEL }
