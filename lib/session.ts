// Oturum durumu — AuthService'in LOCAL adapter'ının oturum kısmı.
// Tarayıcı depolamasına yalnızca `services/adapters/local/storage` üzerinden erişir.
// Gerçek backend: httpOnly cookie / token; bu API (getUser/isLoggedIn/subscribe)
// aynı kalır. Sözleşme: docs/BACKEND_CONTRACT.md → AuthService.

import { readRaw, writeRaw, removeRaw, emit, subscribe as sub } from "./services/adapters/local/storage"

export type SessionUser = { name: string; email: string }

const USER_KEY = "user"
const LOGGED_KEY = "isLoggedIn"
const ADMIN_KEY = "isAdmin"
const EVENT = "authChanged"

export function getUser(): SessionUser | null {
  const raw = readRaw(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as SessionUser
  } catch {
    return null
  }
}

export function isLoggedIn(): boolean {
  return getUser() !== null
}

export function isAdmin(): boolean {
  return readRaw(ADMIN_KEY) === "true"
}

export function setUser(user: SessionUser): void {
  writeRaw(USER_KEY, JSON.stringify(user))
  writeRaw(LOGGED_KEY, "true")
  emit(EVENT)
}

export function setAdmin(value: boolean): void {
  if (value) writeRaw(ADMIN_KEY, "true")
  else removeRaw(ADMIN_KEY)
  emit(EVENT)
}

export function clearSession(): void {
  removeRaw(USER_KEY)
  removeRaw(LOGGED_KEY)
  removeRaw(ADMIN_KEY)
  emit(EVENT)
}

/** Oturum değişimlerine abone ol (giriş/çıkış). Cleanup fonksiyonu döner. */
export function subscribe(cb: () => void): () => void {
  return sub(EVENT, cb)
}
