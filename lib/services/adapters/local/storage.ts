// Güvenli localStorage sarmalayıcı — tarayıcı depolamasına erişen TEK yer.
// Uygulama genelinde `localStorage.*` doğrudan çağrılmaz; her şey buradan geçer.
// Yarın gerçek backend gelince bu dosyanın yerini `adapters/http/*` alır.

const isBrowser = typeof window !== "undefined"

export function readRaw(key: string): string | null {
  if (!isBrowser) return null
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeRaw(key: string, value: string): void {
  if (!isBrowser) return
  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* kota / gizli mod — sessizce geç */
  }
}

export function removeRaw(key: string): void {
  if (!isBrowser) return
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* yoksay */
  }
}

export function readJSON<T>(key: string, fallback: T): T {
  const raw = readRaw(key)
  if (raw == null) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJSON(key: string, value: unknown): void {
  writeRaw(key, JSON.stringify(value))
}

/** Basit yayın: aynı sekmede değişiklikleri dinlemek için. */
export function emit(eventName: string): void {
  if (!isBrowser) return
  window.dispatchEvent(new Event(eventName))
}

export function subscribe(eventName: string, cb: () => void): () => void {
  if (!isBrowser) return () => {}
  const handler = () => cb()
  window.addEventListener(eventName, handler)
  window.addEventListener("storage", handler)
  return () => {
    window.removeEventListener(eventName, handler)
    window.removeEventListener("storage", handler)
  }
}
