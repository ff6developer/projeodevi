"use client"

import type { Dispatch, SetStateAction } from "react"
import type { PaymentMethod } from "@/lib/checkout"
import type { CheckoutState } from "@/lib/checkout"

type Props = {
  state: CheckoutState
  setState: Dispatch<SetStateAction<CheckoutState>>
}

export default function PaymentStep({ state, setState }: Props) {
  const pick = (payment: PaymentMethod) => setState((s) => ({ ...s, payment }))

  const options: { value: PaymentMethod; label: string; desc: string }[] = [
    { value: "demo", label: "Kart ile öde", desc: "Deneme kartıyla, gerçek ödeme alınmaz." },
    { value: "kapida", label: "Kapıda öde", desc: "Teslimatta nakit veya kart." },
  ]

  return (
    <div className="odeme-step">
      <h2>Ödeme</h2>

      <div className="odeme-choice-list" role="radiogroup" aria-label="Ödeme yöntemi">
        {options.map((o) => {
          const active = state.payment === o.value
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              className={`odeme-choice${active ? " is-active" : ""}`}
              onClick={() => pick(o.value)}
            >
              <span className="odeme-choice-main">
                <strong>{o.label}</strong>
                <span className="odeme-choice-desc">{o.desc}</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
