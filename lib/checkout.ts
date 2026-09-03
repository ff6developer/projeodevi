// Ödeme akışı (client-side prototip). Adım durumu bileşende tutulur;
// burada tipler, adım tanımları, doğrulama ve "son adres" kalıcılığı var.

import type { Address, DeliveryMethod } from "./types"
import {
  readRaw,
  writeRaw,
  readSessionJSON,
  writeSessionJSON,
  removeSession,
} from "./services/adapters/local/storage"

export type PaymentMethod = "demo" | "kapida"

export const CHECKOUT_STEPS = [
  "Teslimat bilgileri",
  "Teslimat yöntemi",
  "Ödeme",
  "Özet",
] as const

/** Demo kart formu — hiçbir yere gönderilmez, kalıcı yazılmaz. */
export type CardData = {
  number: string
  expiry: string
  name: string
  cvc: string
}

export type CheckoutState = {
  address: Address
  delivery: DeliveryMethod
  payment: PaymentMethod
  card: CardData
}

export function emptyAddress(): Address {
  return { fullName: "", phone: "", city: "", district: "", line: "", note: "" }
}

export function emptyCard(): CardData {
  return { number: "", expiry: "", name: "", cvc: "" }
}

export function initialCheckoutState(): CheckoutState {
  return {
    address: emptyAddress(),
    delivery: "standart",
    payment: "demo",
    card: emptyCard(),
  }
}

/* --------------------------- kart maskeleri --------------------------- */

export function maskCardNumber(raw: string): string {
  return raw
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim()
}

export function maskExpiry(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 4)
  if (d.length <= 2) return d
  return `${d.slice(0, 2)}/${d.slice(2)}`
}

export function maskCvc(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 4)
}

export type CardErrors = Partial<Record<keyof CardData, string>>

export function validateCard(c: CardData): CardErrors {
  const e: CardErrors = {}
  const digits = c.number.replace(/\s/g, "")
  if (!digits) e.number = "Kart numarası zorunludur."
  else if (digits.length < 16) e.number = "Kart numarası 16 haneli olmalı."

  const exp = c.expiry.replace(/\D/g, "")
  if (!exp) e.expiry = "Son kullanma zorunludur."
  else if (exp.length < 4) e.expiry = "AA/YY biçiminde gir."
  else if (Number(exp.slice(0, 2)) < 1 || Number(exp.slice(0, 2)) > 12)
    e.expiry = "Ay 01–12 arası olmalı."

  if (!c.name.trim()) e.name = "Kart üzerindeki isim zorunludur."

  if (!c.cvc) e.cvc = "CVC zorunludur."
  else if (c.cvc.length < 3) e.cvc = "CVC 3 haneli olmalı."

  return e
}

export function isCardValid(c: CardData): boolean {
  return Object.keys(validateCard(c)).length === 0
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
      if (state.payment === "kapida") return true
      return state.payment === "demo" && isCardValid(state.card)
    default:
      return true
  }
}

/* ------------------------ son adres kalıcılığı ------------------------ */

const LAST_ADDRESS_KEY = "elmenes.lastAddress"

export function getLastAddress(): Address | null {
  const raw = readRaw(LAST_ADDRESS_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Address
  } catch {
    return null
  }
}

export function saveLastAddress(a: Address): void {
  writeRaw(LAST_ADDRESS_KEY, JSON.stringify(a))
}

/* --- Checkout taslağı: sekme ömrü (yenileme / geri sonrası kaldığı adım) --- */

const DRAFT_KEY = "elmenes.checkoutDraft"

export type CheckoutDraft = {
  step: number
  address: Address
  delivery: DeliveryMethod
  payment: PaymentMethod
}

export function saveCheckoutDraft(draft: CheckoutDraft): void {
  writeSessionJSON(DRAFT_KEY, draft)
}

export function loadCheckoutDraft(): CheckoutDraft | null {
  const d = readSessionJSON<CheckoutDraft | null>(DRAFT_KEY, null)
  if (!d || typeof d.step !== "number" || !d.address) return null
  return d
}

export function clearCheckoutDraft(): void {
  removeSession(DRAFT_KEY)
}
