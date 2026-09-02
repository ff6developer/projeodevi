"use client"

import { useRef, type Dispatch, type SetStateAction } from "react"
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

const ORDER: DeliveryMethod[] = ["standart", "hizli"]

export default function DeliveryStep({ state, setState, totals }: Props) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  const pick = (delivery: DeliveryMethod) => setState((s) => ({ ...s, delivery }))
  const standardFree = totals.subtotalKurus >= FREE_SHIPPING_THRESHOLD_KURUS

  const options: { value: DeliveryMethod; desc: string; note: string; priceLabel: string }[] = [
    {
      value: "standart",
      desc: DELIVERY_LABEL.standart,
      note: standardFree
        ? "Ücretsiz kargo eşiğini geçtin."
        : `${formatPrice(FREE_SHIPPING_THRESHOLD_KURUS)} üzerinde ücretsiz.`,
      priceLabel: standardFree ? "Ücretsiz" : formatPrice(SHIPPING_STANDARD_KURUS),
    },
    {
      value: "hizli",
      desc: DELIVERY_LABEL.hizli,
      note: "Ertesi gün elinde.",
      priceLabel: formatPrice(SHIPPING_FAST_KURUS),
    },
  ]

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = ORDER.indexOf(state.delivery)
    let next = i
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % ORDER.length
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + ORDER.length) % ORDER.length
    else if (e.key === "Home") next = 0
    else if (e.key === "End") next = ORDER.length - 1
    else return
    e.preventDefault()
    pick(ORDER[next])
    refs.current[ORDER[next]]?.focus()
  }

  return (
    <div className="odeme-step">
      <h2>Teslimat yöntemi</h2>
      <p className="odeme-step-hint">
        {formatPrice(FREE_SHIPPING_THRESHOLD_KURUS)} ve üzeri siparişlerde standart teslimat
        ücretsiz.
      </p>

      <div
        className="odeme-choice-list"
        role="radiogroup"
        aria-label="Teslimat yöntemi"
        onKeyDown={onKeyDown}
      >
        {options.map((o) => {
          const active = state.delivery === o.value
          return (
            <button
              key={o.value}
              ref={(el) => {
                refs.current[o.value] = el
              }}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              className={`odeme-choice${active ? " is-active" : ""}`}
              onClick={() => pick(o.value)}
            >
              <span className="odeme-choice-main">
                <strong>{o.desc}</strong>
                <span className="odeme-choice-desc">{o.note}</span>
              </span>
              <span className="odeme-choice-price">{o.priceLabel}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
