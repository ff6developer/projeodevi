"use client"

import { useMemo, useSyncExternalStore } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, MapPin, Truck } from "lucide-react"
import "@/styles/siparis.css"
import { getOrder, getOrders, STATUS_LABEL } from "@/lib/orders"
import { estimateDelivery } from "@/lib/format"
import type { Order } from "@/lib/types"
import { Button, Card, Badge, Price, EmptyState, LoadingState } from "@/components/ui"

const STATUS_TONE: Record<string, "neutral" | "accent" | "success" | "warning" | "danger"> = {
  alindi: "warning",
  hazirlaniyor: "accent",
  hazir: "success",
  teslim: "success",
  iptal: "danger",
}

export default function SiparisClient() {
  const params = useSearchParams()
  const orderId = params.get("o")

  // Sipariş verisi tarayıcı depolamasından gelir; SSR'da yok. Hidrasyon
  // uyuşmazlığını (#418) önlemek için istemci bağlanana kadar iskelet göster.
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  const order = useMemo<Order | null>(
    () => (orderId ? getOrder(orderId) : getOrders()[0]) ?? null,
    [orderId],
  )

  if (!hydrated) {
    return (
      <div className="siparis-page container container-narrow">
        <LoadingState label="Sipariş yükleniyor" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="siparis-page container container-narrow">
        <EmptyState
          title="Görüntülenecek sipariş bulunamadı"
          description="Henüz bir siparişin yok ya da bağlantı geçersiz."
          action={<Button href="/menu">Menüye git</Button>}
        />
      </div>
    )
  }

  return (
    <div className="siparis-page container container-narrow">
      <div className="siparis-confirm-icon" aria-hidden="true">
        <CheckCircle2 size={36} />
      </div>
      <h1 className="siparis-hero">Siparişin alındı</h1>
      <p className="siparis-order-id text-mono">#{order.id}</p>
      <p className="siparis-lede">
        Hazırlığa başlıyoruz. Durumu istediğin zaman takip edebilirsin.
      </p>

      {order.address && (
        <div className="siparis-facts">
          <p>
            <MapPin size={15} aria-hidden="true" />
            <span>
              {order.address.district} / {order.address.city} adresine
            </span>
          </p>
          <p>
            <Truck size={15} aria-hidden="true" />
            <span>
              Tahmini teslim: {estimateDelivery(order.createdAt, order.delivery)}
            </span>
          </p>
        </div>
      )}

      <Card pad="md" className="siparis-summary">
        {order.items.map((it, i) => (
          <div className="siparis-row" key={i}>
            <span>
              {it.name}
              {it.qty > 1 ? ` × ${it.qty}` : ""}
            </span>
            <Price value={it.unitKurus * it.qty} />
          </div>
        ))}
        <div className="siparis-row">
          <span>Ara toplam</span>
          <Price value={order.subtotalKurus} />
        </div>
        {order.discountKurus > 0 && (
          <div className="siparis-row siparis-row-discount">
            <span>İndirim</span>
            <span>− <Price value={order.discountKurus} /></span>
          </div>
        )}
        {order.shippingKurus > 0 && (
          <div className="siparis-row">
            <span>Teslimat</span>
            <Price value={order.shippingKurus} />
          </div>
        )}
        <div className="siparis-row siparis-row-total">
          <span>Toplam</span>
          <Price value={order.totalKurus} />
        </div>
        <div className="siparis-row">
          <span>Durum</span>
          <Badge tone={STATUS_TONE[order.status] ?? "neutral"}>{STATUS_LABEL[order.status]}</Badge>
        </div>
      </Card>

      <div className="siparis-actions">
        <Button href={`/siparis/${order.id}`}>Siparişini takip et</Button>
        <Button variant="secondary" href="/menu">
          Alışverişe devam
        </Button>
      </div>

      <p className="siparis-demo-note">
        Bu bir demo siparişidir — gerçek ödeme alınmaz, kargo çıkışı yapılmaz.
      </p>
    </div>
  )
}
