"use client"

import { useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2, Clock } from "lucide-react"
import "@/styles/siparis.css"
import { getOrder, getOrders, STATUS_LABEL } from "@/lib/orders"
import type { Order } from "@/lib/types"
import { Button, Card, Badge, Price, EmptyState } from "@/components/ui"

const ETA: Record<string, string> = {
  alindi: "Siparişin hazırlanmaya başlanacak. Hazırlık genelde 15–25 dakika sürer.",
  hazirlaniyor: "Kahven şu anda hazırlanıyor.",
  hazir: "Siparişin hazır.",
  teslim: "Siparişin teslim edildi. Afiyet olsun.",
  iptal: "Bu sipariş iptal edildi.",
}

const STATUS_TONE: Record<string, "neutral" | "accent" | "success" | "warning" | "danger"> = {
  alindi: "warning",
  hazirlaniyor: "accent",
  hazir: "success",
  teslim: "success",
  iptal: "danger",
}

export default function SiparisClient() {
  const router = useRouter()
  const params = useSearchParams()
  const orderId = params.get("o")

  const order = useMemo<Order | null>(
    () => (orderId ? getOrder(orderId) : getOrders()[0]) ?? null,
    [orderId],
  )

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

      <p className="siparis-eta">
        <Clock size={15} aria-hidden="true" />
        <span>{ETA[order.status] ?? ETA.alindi}</span>
      </p>

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
        <Button onClick={() => router.push("/profil")}>Siparişlerim</Button>
        <Button variant="secondary" onClick={() => router.push("/menu")}>
          Alışverişe devam
        </Button>
      </div>
    </div>
  )
}
