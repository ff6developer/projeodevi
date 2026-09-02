"use client"

import type { Dispatch, SetStateAction } from "react"
import { Input, Textarea } from "@/components/ui"
import type { Address } from "@/lib/types"
import type { CheckoutState } from "@/lib/checkout"

type Props = {
  state: CheckoutState
  setState: Dispatch<SetStateAction<CheckoutState>>
}

export default function AddressStep({ state, setState }: Props) {
  const a = state.address
  const set = (patch: Partial<Address>) =>
    setState((s) => ({ ...s, address: { ...s.address, ...patch } }))

  return (
    <div className="odeme-step">
      <h2>Teslimat bilgileri</h2>
      <p className="odeme-step-hint">Siparişini nereye getirelim?</p>

      <div className="odeme-form-grid">
        <Input
          label="Ad soyad"
          value={a.fullName}
          autoComplete="name"
          onChange={(e) => set({ fullName: e.target.value })}
        />
        <Input
          label="Telefon"
          value={a.phone}
          inputMode="tel"
          autoComplete="tel"
          placeholder="05XX XXX XX XX"
          onChange={(e) => set({ phone: e.target.value })}
        />
        <Input
          label="İl"
          value={a.city}
          autoComplete="address-level1"
          onChange={(e) => set({ city: e.target.value })}
        />
        <Input
          label="İlçe"
          value={a.district}
          autoComplete="address-level2"
          onChange={(e) => set({ district: e.target.value })}
        />
      </div>

      <Textarea
        label="Açık adres"
        value={a.line}
        rows={3}
        autoComplete="street-address"
        onChange={(e) => set({ line: e.target.value })}
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
