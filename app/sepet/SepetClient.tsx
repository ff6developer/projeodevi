"use client"

import Image from "next/image"
import { Trash2 } from "lucide-react"
import "@/styles/sepet.css"
import { useCart } from "@/components/CartProvider"
import { computeCartTotals, FREE_SHIPPING_THRESHOLD_KURUS } from "@/lib/pricing"
import { formatPrice } from "@/lib/format"
import {
  Button,
  IconButton,
  Card,
  QuantityStepper,
  Price,
  EmptyState,
} from "@/components/ui"

export default function SepetClient() {
  const { lines, setQty, removeLine } = useCart()
  const totals = computeCartTotals({ lines })

  if (lines.length === 0) {
    return (
      <div className="sepet container container-narrow">
        <h1>Sepet</h1>
        <EmptyState
          title="Sepetin boş"
          description="Menüden bir kahve ekle ya da kendi tarifini tasarla."
          action={<Button href="/menu">Menüye git</Button>}
        />
      </div>
    )
  }

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD_KURUS - totals.subtotalKurus)

  return (
    <div className="sepet container">
      <h1>Sepet</h1>

      <div className="sepet-layout">
        <div className="sepet-lines">
          {lines.map((l) => (
            <Card key={l.lineId} pad="md" className="sepet-line">
              <span className="sepet-line-img">
                {l.image ? (
                  <Image src={l.image} alt={l.name} fill sizes="80px" />
                ) : (
                  <span className="sepet-line-img-ph">{l.name.slice(0, 1)}</span>
                )}
              </span>
              <div className="sepet-line-body">
                <strong>{l.name}</strong>
                {l.kind === "recipe" && <span className="sepet-line-tag">Kendi tarifin</span>}
                <span className="sepet-line-unit">{formatPrice(l.unitKurus)} / adet</span>
              </div>
              <div className="sepet-line-controls">
                <QuantityStepper value={l.qty} onChange={(q) => setQty(l.lineId, q)} />
                <Price value={l.unitKurus * l.qty} className="sepet-line-total" />
                <IconButton
                  label={`${l.name} ürününü sepetten çıkar`}
                  tone="danger"
                  size="sm"
                  icon={<Trash2 size={16} />}
                  onClick={() => removeLine(l.lineId)}
                />
              </div>
            </Card>
          ))}
        </div>

        <aside className="sepet-summary">
          <Card pad="md" elevated>
            <h2>Özet</h2>
            <div className="sepet-summary-row">
              <span>Ara toplam</span>
              <Price value={totals.subtotalKurus} />
            </div>
            <div className="sepet-summary-row sepet-summary-muted">
              <span>Teslimat</span>
              <span>Ödeme adımında hesaplanır</span>
            </div>
            {remaining > 0 && (
              <p className="sepet-shipping-hint">
                {formatPrice(remaining)} daha ekle, standart teslimat ücretsiz olsun.
              </p>
            )}
            <div className="sepet-summary-row sepet-summary-total">
              <span>Toplam</span>
              <Price value={totals.subtotalKurus} />
            </div>
            <Button href="/odeme" block size="lg">
              Ödemeye geç
            </Button>
            <Button href="/menu" block variant="ghost" size="md">
              Alışverişe devam
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  )
}
