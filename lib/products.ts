// Menü ürünleri — tek kaynak. Fiyatlar kuruş (integer).
// (TASK-085 için erken oluşturuldu; TASK-107 doğrular/genişletir.)

import type { Product, ProductCategory } from "./types"

export const CATEGORY_LABEL: Record<ProductCategory, string> = {
  sicak: "Sıcaklar",
  soguk: "Soğuklar",
  tatli: "Tatlılar",
}

export const PRODUCTS: Product[] = [
  // --- Sıcaklar ---
  { id: 1, slug: "espresso", name: "Espresso", category: "sicak", priceKurus: 8000, image: "/espresso.jpg", roast: 4, intensity: 5, origin: "Brezilya", notes: ["Kakao", "Fındık"], description: "Yoğun, kısa ve keskin. Gününü sert başlatmak isteyenler için." },
  { id: 2, slug: "latte", name: "Latte", category: "sicak", priceKurus: 11000, image: "/latte.jpg", roast: 3, intensity: 2, origin: "Kolombiya", notes: ["Süt", "Karamel"], description: "Bol sütlü, yumuşak ve dengeli. En sevilen günlük seçim." },
  { id: 3, slug: "cappuccino", name: "Cappuccino", category: "sicak", priceKurus: 10000, image: "/cappicino.jpg", roast: 3, intensity: 3, origin: "Kolombiya", notes: ["Süt köpüğü", "Kakao"], description: "Eşit oranda espresso, süt ve köpük. Klasik." },
  { id: 4, slug: "americano", name: "Americano", category: "sicak", priceKurus: 9500, image: "/amerikano.jpg", roast: 4, intensity: 3, origin: "Brezilya", notes: ["Kakao"], description: "Espressonun sıcak suyla açılmış hali. Sade içiciler için." },
  { id: 5, slug: "filtre-kahve", name: "Filtre Kahve", category: "sicak", priceKurus: 9500, image: "/Filtre.jpg", roast: 2, intensity: 2, origin: "Etiyopya", notes: ["Yasemin", "Bergamot"], description: "Günün demi. Aromatik, temiz ve hafif." },
  { id: 6, slug: "mocha", name: "Mocha", category: "sicak", priceKurus: 9500, image: "/mocha.jpg", roast: 4, intensity: 3, origin: "Kolombiya", notes: ["Çikolata", "Süt"], description: "Espresso, süt ve çikolata. Tatlı bir mola." },
  { id: 7, slug: "macchiato", name: "Macchiato", category: "sicak", priceKurus: 9500, image: "/macciato.jpg", roast: 4, intensity: 4, origin: "Brezilya", notes: ["Süt köpüğü"], description: "Bir dokunuş sütle 'lekelenmiş' espresso." },
  { id: 8, slug: "turk-kahvesi", name: "Türk Kahvesi", category: "sicak", priceKurus: 9500, image: "/türk kahvesi.jpg", roast: 5, intensity: 4, origin: "Harman", notes: ["Kakao", "Baharat"], description: "Cezvede, köpüğüyle. Yanında lokum." },
  { id: 9, slug: "flat-white", name: "Flat White", category: "sicak", priceKurus: 9500, image: "/Flat White.jpg", roast: 3, intensity: 3, origin: "Kolombiya", notes: ["Süt", "Karamel"], description: "İnce mikroköpük, güçlü kahve tabanı." },

  // --- Soğuklar ---
  { id: 10, slug: "iced-latte", name: "Iced Latte", category: "soguk", priceKurus: 12000, image: "/Iced Latte.jpg", roast: 3, intensity: 2, origin: "Kolombiya", notes: ["Süt", "Buz"], description: "Buz üzerine espresso ve soğuk süt." },
  { id: 11, slug: "cold-brew", name: "Cold Brew", category: "soguk", priceKurus: 11500, image: "/cod brew.jpg", roast: 2, intensity: 3, origin: "Etiyopya", notes: ["Meyvemsi", "Yumuşak"], description: "12 saat soğuk demleme. Düşük asit, tatlı bitiş." },
  { id: 12, slug: "frappe", name: "Frappe", category: "soguk", priceKurus: 13000, image: "/frappe.jpg", roast: 4, intensity: 2, origin: "Brezilya", notes: ["Buz", "Çikolata"], description: "Blenderdan çıkma, köpüklü ve serin." },
  { id: 13, slug: "iced-americano", name: "Iced Americano", category: "soguk", priceKurus: 10000, image: "/Iced Americano.jpg", roast: 4, intensity: 3, origin: "Brezilya", notes: ["Kakao", "Buz"], description: "Buzlu su ve espresso. Sade ve ferahlatıcı." },
  { id: 14, slug: "iced-caramel-macchiato", name: "Iced Caramel Macchiato", category: "soguk", priceKurus: 12500, image: "/Caramel Macchiato.jpg", roast: 3, intensity: 3, origin: "Kolombiya", notes: ["Karamel", "Vanilya"], description: "Vanilyalı süt, espresso ve karamel şurubu." },
  { id: 15, slug: "iced-mocha", name: "Iced Mocha", category: "soguk", priceKurus: 11500, image: "/ıceMocha.jpg", roast: 4, intensity: 3, origin: "Kolombiya", notes: ["Çikolata", "Buz"], description: "Soğuk çikolatalı kahve keyfi." },
  { id: 16, slug: "white-mocha", name: "White Mocha", category: "soguk", priceKurus: 12000, image: "/white mocha.jpg", roast: 3, intensity: 2, origin: "Kolombiya", notes: ["Beyaz çikolata", "Süt"], description: "Beyaz çikolatalı, kremsi ve tatlı." },

  // --- Tatlılar ---
  { id: 18, slug: "sufle", name: "Sufle", category: "tatli", priceKurus: 8000, image: "/sufle.jpg", notes: ["Sıcak çikolata"], description: "İçi akışkan sıcak çikolatalı kek." },
  { id: 19, slug: "limonlu-cheesecake", name: "Limonlu Cheesecake", category: "tatli", priceKurus: 8000, image: "/lmchasecake.jpg", notes: ["Limon", "Bisküvi"], description: "Ferah limonlu, kremsi cheesecake." },
  { id: 20, slug: "ispanyol-usulu-cheesecake", name: "İspanyol Usulü Cheesecake", category: "tatli", priceKurus: 8000, image: "/San Sebastian.jpg", notes: ["Karamelize", "Kremsi"], description: "San Sebastián usulü, üstü yanık cheesecake." },
  { id: 21, slug: "frambuazli-cheesecake", name: "Frambuazlı Cheesecake", category: "tatli", priceKurus: 8000, image: "/frcheesecake.jpg", notes: ["Frambuaz", "Bisküvi"], description: "Meyveli sos ile klasik cheesecake." },
  { id: 22, slug: "cookie", name: "Cookie", category: "tatli", priceKurus: 8000, image: "/Cookies.jpg", notes: ["Tereyağı", "Çikolata parçacık"], description: "Dışı çıtır, içi yumuşak çikolatalı kurabiye." },
  { id: 23, slug: "cikolatali-donat", name: "Çikolatalı Donat", category: "tatli", priceKurus: 8000, image: "/donat.jpg", notes: ["Çikolata glaze"], description: "Üstü bol çikolata kaplı donut." },
  { id: 24, slug: "brownie", name: "Brownie", category: "tatli", priceKurus: 8000, image: "/Brownie.jpg", notes: ["Bitter çikolata", "Ceviz"], description: "Yoğun bitter çikolatalı, ıslak brownie." },
]

export function getProducts(): Product[] {
  return PRODUCTS
}

export function getByCategory(cat: ProductCategory): Product[] {
  return PRODUCTS.filter((p) => p.category === cat)
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function getProductById(id: number): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}
