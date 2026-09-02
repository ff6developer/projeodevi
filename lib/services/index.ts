// Servis katmanı — tek giriş noktası.
// UI: `import { authService } from "@/lib/services"`
// Her servis bir arayüz + aktif adapter. Bkz. docs/BACKEND_CONTRACT.md

export * from "./types"
export { authService } from "./auth"
export type {
  AuthService,
  AuthUser,
  LoginInput,
  RegisterInput,
} from "./auth"
