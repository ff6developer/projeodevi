// Elmenes Coffee — paylaşılan veri tipleri.
// Tarayıcı localStorage'ına erişen tüm kod lib/ altında; bileşenler bu tipleri kullanır.

/** Kahve konfigüratöründeki tek bir seçenek. */
export type RecipeOption = {
  name: string
  price: number
  power: number
}

/** "Kahveni Oluştur" ile üretilen tarif — 8 alan. */
export type CoffeeRecipe = {
  milkType: RecipeOption | null
  beanType: RecipeOption | null
  foam: RecipeOption | null
  cupType: RecipeOption | null
  syrup: RecipeOption | null
  spice: RecipeOption | null
  sweetener: RecipeOption | null
  technique: RecipeOption | null
}

/** Menü ürünü. Fiyat her zaman kuruş (integer). */
export type ProductCategory = "sicak" | "soguk" | "tatli"

export type Product = {
  id: number
  slug: string
  name: string
  category: ProductCategory
  priceKurus: number
  image: string
  description?: string
  roast?: 1 | 2 | 3 | 4 | 5
  origin?: string
  intensity?: 1 | 2 | 3 | 4 | 5
  notes?: string[]
}

/** Sepet satırı — hazır ürün veya tasarlanan tarif. */
export type CartLine =
  | {
      kind: "product"
      lineId: string
      productId: number
      slug: string
      name: string
      image?: string
      unitKurus: number
      qty: number
    }
  | {
      kind: "recipe"
      lineId: string
      name: string
      image?: string | null
      unitKurus: number
      qty: number
      recipe: CoffeeRecipe
      score: number
      fromArena?: boolean
    }

/** Teslimat adresi. */
export type Address = {
  fullName: string
  phone: string
  city: string
  district: string
  line: string
  note?: string
}

export type DeliveryMethod = "standart" | "hizli"

/**
 * Sipariş durumu (kanonik). Eski kayıtlardaki Türkçe stringler
 * `legacyStatusToCanonical()` ile bu değerlere çevrilir.
 */
export type OrderStatus = "alindi" | "hazirlaniyor" | "hazir" | "teslim" | "iptal"

/** Bir siparişteki kalem. */
export type OrderItem = {
  kind: "product" | "recipe"
  name: string
  image?: string | null
  unitKurus: number
  qty: number
  recipe?: CoffeeRecipe
  score?: number
  fromArena?: boolean
}

export type Order = {
  /** Okunur kod: "A" + 4 hane, örn. "A1042". */
  id: string
  createdAt: string // ISO
  status: OrderStatus
  items: OrderItem[]
  address?: Address
  delivery?: DeliveryMethod
  payment?: "demo" | "kapida"
  /** Tutarlar — kuruş. */
  subtotalKurus: number
  discountKurus: number
  shippingKurus: number
  totalKurus: number
  /** Sahibi (client-side prototip: e-posta anahtarı). */
  userEmail?: string
}

/** createOrder girişi — id/tarih/durum otomatik atanır. */
export type OrderInput = Omit<Order, "id" | "createdAt" | "status">
