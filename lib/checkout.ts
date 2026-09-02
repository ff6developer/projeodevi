// Ödeme akışı (client-side prototip). Adım durumu bileşende tutulur;
// burada tipler, adım tanımları, doğrulama ve "son adres" kalıcılığı var.

import type { Address, DeliveryMethod } from "./types"

export type PaymentMethod = "demo" | "kapida"

export const CHECKOUT_STEPS = [
  "Teslimat bilgileri",
  "Teslimat yöntemi",
  "Ödeme",
  "Özet",
] as const

export type CheckoutState = {
  address: Address
  delivery: DeliveryMethod
  payment: PaymentMethod
}

export function emptyAddress(): Address {
  return { fullName: "", phone: "", city: "", district: "", line: "", note: "" }
}

export function initialCheckoutState(): CheckoutState {
  return { address: emptyAddress(), delivery: "standart", payment: "demo" }
}

/* --------------------------- doğrulama --------------------------- */

export type AddressErrors = Partial<Record<keyof Address, string>>

const PHONE_RE = /^(\+?90)?[ ]?0?5\d{2}[ ]?\d{3}[ ]?\d{2}[ ]?\d{2}$/

export function validateAddress(a: Address): AddressErrors {
  const e: AddressErrors = {}
  if (!a.fullName.trim()) e.fullName = "Ad soyad zorunludur."
  else if (a.fullName.trim().length < 3) e.fullName = "Ad soyad çok kısa."

  if (!a.phone.trim()) e.phone = "Telefon zorunludur."
  else if (!PHONE_RE.test(a.phone.trim())) e.phone = "Geçerli bir cep telefonu gir (05XX XXX XX XX)."

  if (!a.city.trim()) e.city = "İl zorunludur."
  if (!a.district.trim()) e.district = "İlçe zorunludur."

  if (!a.line.trim()) e.line = "Açık adres zorunludur."
  else if (a.line.trim().length < 10) e.line = "Adresi biraz daha ayrıntılı yaz."

  return e
}

export function isAddressValid(a: Address): boolean {
  return Object.keys(validateAddress(a)).length === 0
}

/** Belirli bir adımın ilerlemeye hazır olup olmadığı. */
export function canAdvance(step: number, state: CheckoutState): boolean {
  switch (step) {
    case 0:
      return isAddressValid(state.address)
    case 1:
      return state.delivery === "standart" || state.delivery === "hizli"
    case 2:
      return state.payment === "demo" || state.payment === "kapida"
    default:
      return true
  }
}

/* ------------------------ son adres kalıcılığı ------------------------ */

const LAST_ADDRESS_KEY = "elmenes.lastAddress"

export function getLastAddress(): Address | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(LAST_ADDRESS_KEY)
    return raw ? (JSON.parse(raw) as Address) : null
  } catch {
    return null
  }
}

export function saveLastAddress(a: Address): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(LAST_ADDRESS_KEY, JSON.stringify(a))
  } catch {
    /* yoksay */
  }
}
