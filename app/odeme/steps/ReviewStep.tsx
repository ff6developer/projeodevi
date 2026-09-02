"use client"

import { formatPrice } from "@/lib/format"
import { DELIVERY_LABEL } from "@/lib/pricing"
import { Price } from "@/components/ui"
import type { CartLine } from "@/lib/types"
import type { CheckoutState } from "@/lib/checkout"

type Totals = {
  subtotalKurus: number
  shippingKurus: number
  totalKurus: number
}

type Props = {
  state: CheckoutState
  lines: CartLine[]
  totals: Totals
}

export default function ReviewStep({ state, lines, totals }: Props) {
  const { address, delivery, payment } = state
  const last4 = state.card.number.replace(/\D/g, "").slice(-4)

  return (
    <div className="odeme-step">
      <h2>Özet</h2>

      <div className="odeme-review-block">
        <h3>Teslimat</h3>
        <p>
          {address.fullName} · {address.phone}
          <br />
          {address.line}, {address.district} / {address.city}
          {address.note ? (
            <>
              <br />
              Not: {address.note}
            </>
          ) : null}
        </p>
        <p>{DELIVERY_LABEL[delivery]}</p>
      </div>

      <div className="odeme-review-block">
        <h3>Ödeme</h3>
        <p>
          {payment === "kapida"
            ? "Kapıda ödeme"
            : `Kart ile ödeme (deneme)${last4 ? ` · •••• ${last4}` : ""}`}
        </p>
      </div>

      <div className="odeme-review-block">
        <h3>Ürünler</h3>
        <ul className="odeme-review-lines">
          {lines.map((l) => (
            <li key={l.lineId}>
              <span>
                {l.name}
                {l.qty > 1 ? ` × ${l.qty}` : ""}
              </span>
              <span>{formatPrice(l.unitKurus * l.qty)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="odeme-review-block">
        <div className="odeme-summary-row">
          <span>Ara toplam</span>
          <Price value={totals.subtotalKurus} />
        </div>
        <div className="odeme-summary-row">
          <span>Teslimat</span>
          {totals.shippingKurus === 0 ? (
            <span>Ücretsiz</span>
          ) : (
            <Price value={totals.shippingKurus} />
          )}
        </div>
        <div className="odeme-summary-row odeme-summary-total">
          <span>Toplam</span>
          <Price value={totals.totalKurus} />
        </div>
      </div>
    </div>
  )
}
