// Oturum (client-side prototip). localStorage["user"] erişimi tek yerden.
// Not: gerçek auth sertleştirme backlog (BL-02/BL-03).

export type SessionUser = { name: string; email: string }

const USER_KEY = "user"
const LOGGED_KEY = "isLoggedIn"
const ADMIN_KEY = "isAdmin"
const EVENT = "authChanged"

export function getUser(): SessionUser | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as SessionUser) : null
  } catch {
    return null
  }
}

export function isLoggedIn(): boolean {
  return getUser() !== null
}

export function isAdmin(): boolean {
  if (typeof window === "undefined") return false
  return window.localStorage.getItem(ADMIN_KEY) === "true"
}

export function setUser(user: SessionUser): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
  window.localStorage.setItem(LOGGED_KEY, "true")
  window.dispatchEvent(new Event(EVENT))
}

export function setAdmin(value: boolean): void {
  if (typeof window === "undefined") return
  if (value) window.localStorage.setItem(ADMIN_KEY, "true")
  else window.localStorage.removeItem(ADMIN_KEY)
  window.dispatchEvent(new Event(EVENT))
}

export function clearSession(): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(USER_KEY)
  window.localStorage.removeItem(LOGGED_KEY)
  window.localStorage.removeItem(ADMIN_KEY)
  window.dispatchEvent(new Event(EVENT))
}

/** Oturum değişimlerine abone ol (giriş/çıkış). Cleanup fonksiyonu döner. */
export function subscribe(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {}
  const handler = () => cb()
  window.addEventListener(EVENT, handler)
  window.addEventListener("storage", handler)
  return () => {
    window.removeEventListener(EVENT, handler)
    window.removeEventListener("storage", handler)
  }
}
