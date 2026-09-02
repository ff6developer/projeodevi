"use client"

import { useEffect, useMemo, useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"
import "@/styles/siparislerim.css"
import { getOrders, STATUS_LABEL } from "@/lib/orders"
import { getUser, isLoggedIn, subscribe as subscribeAuth } from "@/lib/session"
import { formatDateTime } from "@/lib/format"
import type { OrderStatus } from "@/lib/types"
import { Package } from "lucide-react"
import { Button, Card, Badge, Price, EmptyState, LoadingState } from "@/components/ui"

const TONE: Record<OrderStatus, "neutral" | "accent" | "success" | "warning" | "danger"> = {
  alindi: "warning",
  hazirlaniyor: "accent",
  hazir: "success",
  teslim: "success",
  iptal: "danger",
}

export default function SiparislerimClient() {
  const router = useRouter()

  const authed = useSyncExternalStore(
    subscribeAuth,
    () => isLoggedIn(),
    () => false,
  )
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  useEffect(() => {
    if (hydrated && !authed) router.replace("/giris?next=/siparislerim")
  }, [hydrated, authed, router])

  const orders = useMemo(() => {
    const email = getUser()?.email
    const all = getOrders()
    return email ? all.filter((o) => !o.userEmail || o.userEmail === email) : all
  }, [])

  if (!hydrated || !authed) {
    return (
      <div className="siparislerim container container-narrow">
        <LoadingState label="Siparişlerin yükleniyor" />
      </div>
    )
  }

  return (
    <div className="siparislerim container container-narrow">
      <h1>Siparişlerim</h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={<Package size={30} />}
          title="Henüz siparişin yok"
          description="İlk siparişini verdiğinde durumu buradan takip edebilirsin."
          action={<Button href="/menu">Menüye git</Button>}
        />
      ) : (
        <div className="siparislerim-list">
          {orders.map((o) => (
            <Card
              key={o.id}
              as="a"
              href={`/siparis/${o.id}`}
              interactive
              pad="md"
              className="siparislerim-item"
            >
              <div className="siparislerim-item-head">
                <strong className="text-mono">#{o.id}</strong>
                <Badge tone={TONE[o.status]}>{STATUS_LABEL[o.status]}</Badge>
              </div>
              <p className="siparislerim-item-body">
                {o.items.map((it) => it.name + (it.qty > 1 ? ` × ${it.qty}` : "")).join(", ")}
              </p>
              <div className="siparislerim-item-foot">
                <span>{formatDateTime(o.createdAt)}</span>
                <Price value={o.totalKurus} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
