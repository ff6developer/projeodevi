"use client"

import { useState, type Dispatch, type SetStateAction } from "react"
import { Input, Textarea } from "@/components/ui"
import type { Address } from "@/lib/types"
import { validateAddress, type CheckoutState } from "@/lib/checkout"

type Props = {
  state: CheckoutState
  setState: Dispatch<SetStateAction<CheckoutState>>
  /** "Devam et" denendi ve adres eksik — tüm hataları göster. */
  showErrors: boolean
}

type FieldKey = "fullName" | "phone" | "city" | "district" | "line"

export default function AddressStep({ state, setState, showErrors }: Props) {
  const a = state.address
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({})
  const errors = validateAddress(a)

  const set = (patch: Partial<Address>) =>
    setState((s) => ({ ...s, address: { ...s.address, ...patch } }))
  const markTouched = (k: FieldKey) => setTouched((t) => ({ ...t, [k]: true }))
  const errFor = (k: FieldKey) => ((showErrors || touched[k]) && errors[k]) || undefined

  return (
    <div className="odeme-step">
      <h2>Teslimat bilgileri</h2>
      <p className="odeme-step-hint">Siparişini nereye getirelim?</p>

      <div className="odeme-form-grid">
        <Input
          label="Ad soyad"
          value={a.fullName}
          autoComplete="name"
          error={errFor("fullName")}
          onChange={(e) => set({ fullName: e.target.value })}
          onBlur={() => markTouched("fullName")}
        />
        <Input
          label="Telefon"
          value={a.phone}
          inputMode="tel"
          autoComplete="tel"
          placeholder="05XX XXX XX XX"
          error={errFor("phone")}
          onChange={(e) => set({ phone: e.target.value })}
          onBlur={() => markTouched("phone")}
        />
        <Input
          label="İl"
          value={a.city}
          autoComplete="address-level1"
          error={errFor("city")}
          onChange={(e) => set({ city: e.target.value })}
          onBlur={() => markTouched("city")}
        />
        <Input
          label="İlçe"
          value={a.district}
          autoComplete="address-level2"
          error={errFor("district")}
          onChange={(e) => set({ district: e.target.value })}
          onBlur={() => markTouched("district")}
        />
      </div>

      <Textarea
        label="Açık adres"
        value={a.line}
        rows={3}
        autoComplete="street-address"
        error={errFor("line")}
        onChange={(e) => set({ line: e.target.value })}
        onBlur={() => markTouched("line")}
      />
      <Textarea
        label="Sipariş notu (isteğe bağlı)"
        value={a.note ?? ""}
        rows={2}
        onChange={(e) => set({ note: e.target.value })}
      />
    </div>
  )
}
