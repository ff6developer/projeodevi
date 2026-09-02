"use client"

import type { Dispatch, SetStateAction } from "react"
import { formatPrice } from "@/lib/format"
import {
  DELIVERY_LABEL,
  SHIPPING_FAST_KURUS,
  SHIPPING_STANDARD_KURUS,
  FREE_SHIPPING_THRESHOLD_KURUS,
} from "@/lib/pricing"
import type { DeliveryMethod } from "@/lib/types"
import type { CheckoutState } from "@/lib/checkout"

type Totals = { subtotalKurus: number }

type Props = {
  state: CheckoutState
  setState: Dispatch<SetStateAction<CheckoutState>>
  totals: Totals
}

export default function DeliveryStep({ state, setState, totals }: Props) {
  const pick = (delivery: DeliveryMethod) => setState((s) => ({ ...s, delivery }))
  const standardFree = totals.subtotalKurus >= FREE_SHIPPING_THRESHOLD_KURUS

  const options: { value: DeliveryMethod; desc: string; priceLabel: string }[] = [
    {
      value: "standart",
      desc: DELIVERY_LABEL.standart,
      priceLabel: standardFree ? "Ücretsiz" : formatPrice(SHIPPING_STANDARD_KURUS),
    },
    {
      value: "hizli",
      desc: DELIVERY_LABEL.hizli,
      priceLabel: formatPrice(SHIPPING_FAST_KURUS),
    },
  ]

  return (
    <div className="odeme-step">
      <h2>Teslimat yöntemi</h2>
      <p className="odeme-step-hint">
        {formatPrice(FREE_SHIPPING_THRESHOLD_KURUS)} ve üzeri siparişlerde standart teslimat
        ücretsiz.
      </p>

      <div className="odeme-choice-list" role="radiogroup" aria-label="Teslimat yöntemi">
        {options.map((o) => {
          const active = state.delivery === o.value
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
                <strong>{o.desc}</strong>
              </span>
              <span className="odeme-choice-price">{o.priceLabel}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
