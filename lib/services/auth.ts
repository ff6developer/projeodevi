// AuthService — kimlik doğrulama arayüzü.
//
// Bu proje CLIENT-SIDE PROTOTİP: gerçek auth backend'i yok. Aktif implementasyon
// `adapters/local/auth` (tarayıcı depolaması). Gerçek backend geldiğinde
// `adapters/http/auth` yazılır ve aşağıdaki `authService` export'u değiştirilir;
// UI hiç değişmez. Sözleşme: `docs/BACKEND_CONTRACT.md`.

import type { Result } from "./types"

export type AuthUser = { name: string; email: string }

export type RegisterInput = { name: string; email: string; password: string }
export type LoginInput = { email: string; password: string }

export interface AuthService {
  register(input: RegisterInput): Promise<Result<AuthUser>>
  login(input: LoginInput): Promise<Result<AuthUser>>
  logout(): Promise<void>
  getCurrentUser(): AuthUser | null
  /** Portföy/demo: tek tıkla hazır bir hesapla oturum açar. */
  loginDemo(): Promise<Result<AuthUser>>
}

export { localAuthService as authService } from "./adapters/local/auth"
