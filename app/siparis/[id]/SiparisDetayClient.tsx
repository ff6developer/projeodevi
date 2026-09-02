"use client"

import { useMemo } from "react"
import { useParams } from "next/navigation"
import "@/styles/siparislerim.css"
import { getOrder, STATUS_FLOW, STATUS_LABEL } from "@/lib/orders"
import { DELIVERY_LABEL } from "@/lib/pricing"
import { formatDateTime } from "@/lib/format"
import type { Order } from "@/lib/types"
import {
  Button,
  Card,
  Badge,
  Price,
  Stepper,
  EmptyState,
} from "@/components/ui"

export default function SiparisDetayClient() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? ""

  const order = useMemo<Order | null>(() => (id ? getOrder(id) ?? null : null), [id])

  if (!order) {
    return (
      <div className="siparis-detay container container-narrow">
        <EmptyState
          title="Sipariş bulunamadı"
          description="Bu bağlantı geçersiz ya da sipariş kaldırılmış olabilir."
          action={<Button href="/siparislerim">Siparişlerim</Button>}
        />
      </div>
    )
  }

  const stepIndex = STATUS_FLOW.indexOf(order.status)
  const cancelled = order.status === "iptal"

  return (
    <div className="siparis-detay container">
      <p className="siparis-detay-id text-mono">#{order.id}</p>
      <h1>Sipariş takibi</h1>

      <div className="siparis-detay-grid">
        <div className="siparis-detay-main">
          <Card pad="lg" className="siparis-detay-block">
            <h2>Durum</h2>
            {cancelled ? (
              <Badge tone="danger">{STATUS_LABEL.iptal}</Badge>
            ) : (
              <Stepper
                steps={STATUS_FLOW.map((s) => STATUS_LABEL[s])}
                current={stepIndex < 0 ? 0 : stepIndex}
              />
            )}
            <p className="siparis-detay-note">
              Sipariş tarihi: {formatDateTime(order.createdAt)}
            </p>
          </Card>

          {order.address && (
            <Card pad="lg" className="siparis-detay-block">
              <h2>Teslimat</h2>
              <h3>Adres</h3>
              <p>
                {order.address.fullName} · {order.address.phone}
                <br />
                {order.address.line}, {order.address.district} / {order.address.city}
                {order.address.note ? (
                  <>
                    <br />
                    Not: {order.address.note}
                  </>
                ) : null}
              </p>
              {order.delivery && (
                <>
                  <h3 className="siparis-detay-subhead">Yöntem</h3>
                  <p>{DELIVERY_LABEL[order.delivery]}</p>
                </>
              )}
              {order.payment && (
                <>
                  <h3 className="siparis-detay-subhead">Ödeme</h3>
                  <p>{order.payment === "kapida" ? "Kapıda ödeme" : "Kart ile ödeme (deneme)"}</p>
                </>
              )}
            </Card>
          )}

          <Card pad="lg" className="siparis-detay-block">
            <h2>Ürünler</h2>
            <ul className="siparis-detay-lines">
              {order.items.map((it, i) => (
                <li key={i}>
                  <span>
                    {it.name}
                    {it.qty > 1 ? ` × ${it.qty}` : ""}
                  </span>
                  <Price value={it.unitKurus * it.qty} />
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <aside>
          <Card pad="md" elevated className="siparis-detay-summary">
            <h2>Özet</h2>
            <div className="siparis-detay-row">
              <span>Ara toplam</span>
              <Price value={order.subtotalKurus} />
            </div>
            {order.discountKurus > 0 && (
              <div className="siparis-detay-row">
                <span>İndirim</span>
                <span>
                  − <Price value={order.discountKurus} />
                </span>
              </div>
            )}
            <div className="siparis-detay-row">
              <span>Teslimat</span>
              {order.shippingKurus === 0 ? (
                <span>Ücretsiz</span>
              ) : (
                <Price value={order.shippingKurus} />
              )}
            </div>
            <div className="siparis-detay-row siparis-detay-row-total">
              <span>Toplam</span>
              <Price value={order.totalKurus} />
            </div>
          </Card>
        </aside>
      </div>

      <div className="siparis-detay-actions">
        <Button href="/siparislerim" variant="secondary">Siparişlerim</Button>
        <Button href="/menu" variant="ghost">Alışverişe devam</Button>
      </div>
    </div>
  )
}
