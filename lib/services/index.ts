// Servis katmanı — tek giriş noktası.
// UI: `import { authService, productService } from "@/lib/services"`
// Her servis bir arayüz + aktif (LOCAL) adapter. Gerçek backend geldiğinde
// yalnız adapter değişir; UI aynı kalır. Sözleşme: docs/BACKEND_CONTRACT.md.

export * from "./types"

export { authService } from "./auth"
export type { AuthService, AuthUser, LoginInput, RegisterInput } from "./auth"

export { productService } from "./catalog"
export type { ProductService } from "./catalog"

export * as cartService from "./cart"
export * as orderService from "./orders"
