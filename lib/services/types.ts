// Servis katmanı ortak tipleri. UI yalnız bu tiplere ve servis arayüzlerine
// bağlıdır; hangi adapter'ın (local / http) kullanıldığını bilmez.

export type Ok<T> = { ok: true; data: T }
export type Err = { ok: false; error: string; code?: string }
export type Result<T> = Ok<T> | Err

export function ok<T>(data: T): Ok<T> {
  return { ok: true, data }
}

export function err(error: string, code?: string): Err {
  return { ok: false, error, code }
}

/** Gerçekçi ağ gecikmesi simülasyonu (local adapter'lar için). */
export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

/** Local adapter'ların yapay gecikmesi. Test/hız için env ile kapatılabilir. */
export const MOCK_LATENCY_MS =
  process.env.NEXT_PUBLIC_MOCK_LATENCY === "0" ? 0 : 380
