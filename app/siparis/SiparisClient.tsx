"use client"

import { useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2, Clock } from "lucide-react"
import "@/styles/siparis.css"
import { getOrder, getOrders, STATUS_LABEL } from "@/lib/orders"
import type { Order } from "@/lib/types"

const fmtTRY = (kurus: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(
    kurus / 100,
  )

const ETA: Record<string, string> = {
  alindi: "Siparişin hazırlanmaya başlanacak. Hazırlık genelde 15–25 dakika sürer.",
  hazirlaniyor: "Kahven şu anda hazırlanıyor.",
  hazir: "Siparişin hazır.",
  teslim: "Siparişin teslim edildi. Afiyet olsun!",
  iptal: "Bu sipariş iptal edildi.",
}

export default function SiparisClient() {
  const router = useRouter()
  const params = useSearchParams()
  const orderId = params.get("o")

  const order = useMemo<Order | null>(
    () => (orderId ? getOrder(orderId) : getOrders()[0]) ?? null,
    [orderId],
  )

  return (
    <div className="siparis-page">
      <div className="siparis-content">
        {order ? (
          <>
            <div className="siparis-confirm-icon" aria-hidden="true">
              <CheckCircle2 size={40} />
            </div>

            <h1 className="siparis-hero">Siparişin alındı</h1>
            <p className="siparis-order-id">Sipariş no: #{order.id}</p>

            <p className="siparis-desc">
              <Clock size={15} aria-hidden="true" />
              <span>{ETA[order.status] ?? ETA.alindi}</span>
            </p>

            <div className="siparis-order-summary">
              {order.items.map((it, i) => (
                <div className="siparis-order-row" key={i}>
                  <span className="siparis-order-label">
                    {it.name}
                    {it.qty > 1 ? ` × ${it.qty}` : ""}
                  </span>
                  <span className="siparis-order-value">{fmtTRY(it.unitKurus * it.qty)}</span>
                </div>
              ))}

              <div className="siparis-order-row">
                <span className="siparis-order-label">Ara toplam</span>
                <span className="siparis-order-value">{fmtTRY(order.subtotalKurus)}</span>
              </div>

              {order.discountKurus > 0 && (
                <div className="siparis-order-row">
                  <span className="siparis-order-label">İndirim</span>
                  <span className="siparis-order-value siparis-order-discount">
                    − {fmtTRY(order.discountKurus)}
                  </span>
                </div>
              )}

              {order.shippingKurus > 0 && (
                <div className="siparis-order-row">
                  <span className="siparis-order-label">Teslimat</span>
                  <span className="siparis-order-value">{fmtTRY(order.shippingKurus)}</span>
                </div>
              )}

              <div className="siparis-order-row siparis-order-total">
                <span className="siparis-order-label">Toplam</span>
                <span className="siparis-order-value">{fmtTRY(order.totalKurus)}</span>
              </div>

              <div className="siparis-order-row">
                <span className="siparis-order-label">Durum</span>
                <span className="siparis-status-badge">{STATUS_LABEL[order.status]}</span>
              </div>
            </div>

            <div className="siparis-actions">
              <button className="siparis-btn siparis-btn-primary" onClick={() => router.push("/profil")}>
                Siparişlerim
              </button>
              <button className="siparis-btn siparis-btn-secondary" onClick={() => router.push("/menu")}>
                Alışverişe devam
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="siparis-hero">Görüntülenecek sipariş bulunamadı</h1>
            <p className="siparis-desc">
              <span>Henüz bir siparişin yok ya da bağlantı geçersiz.</span>
            </p>
            <div className="siparis-actions">
              <button className="siparis-btn siparis-btn-primary" onClick={() => router.push("/menu")}>
                Menüye git
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
