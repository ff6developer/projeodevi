"use client"

import { useRef, useState, type Dispatch, type SetStateAction } from "react"
import { Input } from "@/components/ui"
import {
  maskCardNumber,
  maskCvc,
  maskExpiry,
  validateCard,
  type CardData,
  type CheckoutState,
  type PaymentMethod,
} from "@/lib/checkout"

type Props = {
  state: CheckoutState
  setState: Dispatch<SetStateAction<CheckoutState>>
  showErrors: boolean
}

const ORDER: PaymentMethod[] = ["demo", "kapida"]

const METHODS: { value: PaymentMethod; label: string; desc: string }[] = [
  { value: "demo", label: "Kart ile öde", desc: "Deneme kartıyla — gerçek ödeme alınmaz." },
  { value: "kapida", label: "Kapıda öde", desc: "Teslimatta nakit veya kart." },
]

type CardKey = keyof CardData

export default function PaymentStep({ state, setState, showErrors }: Props) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [touched, setTouched] = useState<Partial<Record<CardKey, boolean>>>({})

  const pick = (payment: PaymentMethod) => setState((s) => ({ ...s, payment }))
  const setCard = (patch: Partial<CardData>) =>
    setState((s) => ({ ...s, card: { ...s.card, ...patch } }))

  const errors = validateCard(state.card)
  const errFor = (k: CardKey) =>
    ((showErrors || touched[k]) && errors[k]) || undefined
  const markTouched = (k: CardKey) => setTouched((t) => ({ ...t, [k]: true }))

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = ORDER.indexOf(state.payment)
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
      <h2>Ödeme</h2>

      <div
        className="odeme-choice-list"
        role="radiogroup"
        aria-label="Ödeme yöntemi"
        onKeyDown={onKeyDown}
      >
        {METHODS.map((o) => {
          const active = state.payment === o.value
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
                <strong>{o.label}</strong>
                <span className="odeme-choice-desc">{o.desc}</span>
              </span>
            </button>
          )
        })}
      </div>

      {state.payment === "demo" && (
        <div className="odeme-card-form">
          <p className="odeme-demo-note" role="note">
            Bu bir deneme ekranı. Kart bilgileri kaydedilmez, hiçbir yere gönderilmez ve
            gerçek bir tahsilat yapılmaz.
          </p>

          <Input
            label="Kart numarası"
            value={state.card.number}
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="0000 0000 0000 0000"
            error={errFor("number")}
            onChange={(e) => setCard({ number: maskCardNumber(e.target.value) })}
            onBlur={() => markTouched("number")}
          />

          <div className="odeme-form-grid">
            <Input
              label="Son kullanma (AA/YY)"
              value={state.card.expiry}
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="AA/YY"
              error={errFor("expiry")}
              onChange={(e) => setCard({ expiry: maskExpiry(e.target.value) })}
              onBlur={() => markTouched("expiry")}
            />
            <Input
              label="CVC"
              value={state.card.cvc}
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
              error={errFor("cvc")}
              onChange={(e) => setCard({ cvc: maskCvc(e.target.value) })}
              onBlur={() => markTouched("cvc")}
            />
          </div>

          <Input
            label="Kart üzerindeki isim"
            value={state.card.name}
            autoComplete="cc-name"
            error={errFor("name")}
            onChange={(e) => setCard({ name: e.target.value })}
            onBlur={() => markTouched("name")}
          />
        </div>
      )}
    </div>
  )
}
