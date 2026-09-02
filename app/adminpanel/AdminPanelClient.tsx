"use client"

import { useEffect, useMemo, useState } from "react"
import { Trash2, ShieldCheck } from "lucide-react"
import "@/styles/adminpanel.css"
import AdminSidebar from "@/components/AdminSidebar"
import type { Tab } from "@/components/adminTypes"
import { isAdmin, setAdmin } from "@/lib/session"
import {
  getOrders,
  updateOrderStatus,
  deleteOrder as removeOrder,
  nextStatus,
  STATUS_FLOW,
  STATUS_LABEL,
} from "@/lib/orders"
import { DELIVERY_LABEL } from "@/lib/pricing"
import { formatPrice, formatDateTime, liraToKurus } from "@/lib/format"
import type { Order, OrderStatus } from "@/lib/types"
import {
  Button,
  IconButton,
  Card,
  Badge,
  Input,
  EmptyState,
  useConfirm,
} from "@/components/ui"

type Product = { id: number; name: string; priceKurus: number }
type Coffee = { id: number; name: string; score?: number; total?: number; isFromArena?: boolean }

const STATUS_TONE: Record<OrderStatus, "neutral" | "accent" | "success" | "warning" | "danger"> = {
  alindi: "warning",
  hazirlaniyor: "accent",
  hazir: "success",
  teslim: "success",
  iptal: "danger",
}

export default function AdminPanelClient() {
  const confirm = useConfirm()

  const [authorized, setAuthorized] = useState(false)
  const [ready, setReady] = useState(false)
  const [tab, setTab] = useState<Tab>("dashboard")
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [coffees, setCoffees] = useState<Coffee[]>([])
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")
  const [search, setSearch] = useState("")
  const [newName, setNewName] = useState("")
  const [newPrice, setNewPrice] = useState("")

  // Mount: yetki kontrolü + tarayıcıdan veri hidrasyonu (SSR sonrası, tek sefer).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setReady(true)
    if (!isAdmin()) return
    setAuthorized(true)
    setOrders(getOrders())
    try {
      const p = JSON.parse(localStorage.getItem("products") || "[]")
      setProducts(
        p.map((x: { id: number; name: string; price?: number; priceKurus?: number }) => ({
          id: x.id,
          name: x.name,
          priceKurus: x.priceKurus ?? (x.price ?? 0) * 100,
        })),
      )
      setCoffees(JSON.parse(localStorage.getItem("coffees") || "[]"))
    } catch {
      /* yoksay */
    }
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  const enterDemoAdmin = () => {
    setAdmin(true)
    setAuthorized(true)
    setOrders(getOrders())
    try {
      const p = JSON.parse(localStorage.getItem("products") || "[]")
      setProducts(
        p.map((x: { id: number; name: string; price?: number; priceKurus?: number }) => ({
          id: x.id,
          name: x.name,
          priceKurus: x.priceKurus ?? (x.price ?? 0) * 100,
        })),
      )
      setCoffees(JSON.parse(localStorage.getItem("coffees") || "[]"))
    } catch {
      /* yoksay */
    }
  }

  const stats = useMemo(() => {
    const todayStr = new Date().toDateString()
    const todayRevenue = orders
      .filter((o) => new Date(o.createdAt).toDateString() === todayStr)
      .reduce((n, o) => n + o.totalKurus, 0)
    const totalRevenue = orders.reduce((n, o) => n + o.totalKurus, 0)
    const byStatus = (s: OrderStatus) => orders.filter((o) => o.status === s).length
    return {
      todayRevenue,
      totalRevenue,
      todayOrders: orders.filter((o) => new Date(o.createdAt).toDateString() === todayStr).length,
      alindi: byStatus("alindi"),
      hazirlaniyor: byStatus("hazirlaniyor"),
      hazir: byStatus("hazir"),
      designs: coffees.length,
    }
  }, [orders, coffees])

  const filteredOrders = useMemo(
    () =>
      orders.filter(
        (o) =>
          (statusFilter === "all" || o.status === statusFilter) &&
          (search === "" || o.id.toLowerCase().includes(search.toLowerCase())),
      ),
    [orders, statusFilter, search],
  )

  const advance = (id: string, current: OrderStatus) => {
    const ns = nextStatus(current)
    updateOrderStatus(id, ns)
    setOrders(getOrders())
  }

  const delOrder = async (id: string) => {
    if (!(await confirm({ title: "Siparişi sil", confirmText: "Sil", tone: "danger" }))) return
    removeOrder(id)
    setOrders(getOrders())
  }

  const addProduct = () => {
    if (!newName.trim() || !newPrice) return
    const next = [...products, { id: Date.now(), name: newName.trim(), priceKurus: liraToKurus(newPrice) }]
    setProducts(next)
    localStorage.setItem("products", JSON.stringify(next))
    setNewName("")
    setNewPrice("")
  }

  const delProduct = (id: number) => {
    const next = products.filter((p) => p.id !== id)
    setProducts(next)
    localStorage.setItem("products", JSON.stringify(next))
  }

  const delCoffee = async (id: number) => {
    if (!(await confirm({ title: "Kahveyi sil", confirmText: "Sil", tone: "danger" }))) return
    const next = coffees.filter((c) => c.id !== id)
    setCoffees(next)
    localStorage.setItem("coffees", JSON.stringify(next))
  }

  if (!authorized) {
    return (
      <div className="admin container">
        <div className="admin-gate">
          <EmptyState
            icon={<ShieldCheck size={28} />}
            title="Yönetici paneli — demo"
            description="Bu panel bir portföy demosudur. Gerçek yönetici yetkilendirmesi backend ile gelir; burada demo veriler üzerinde sipariş durumu, ürün ve tasarım yönetimini görebilirsin."
            action={
              ready ? (
                <Button onClick={enterDemoAdmin}>Demo yönetici görünümüne gir</Button>
              ) : null
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="admin container">
      <header className="admin-head">
        <p className="eyebrow">Yönetim</p>
        <h1>{tab === "dashboard" ? "Genel bakış" : tab === "orders" ? "Siparişler" : tab === "products" ? "Ürünler" : "Tasarlanan kahveler"}</h1>
      </header>

      <AdminSidebar activeTab={tab} setActiveTab={setTab} pending={stats.alindi} />

      <div className="admin-body">
        {tab === "dashboard" && (
          <>
            <div className="admin-stats">
              {[
                { label: "Bugünkü gelir", value: formatPrice(stats.todayRevenue) },
                { label: "Toplam gelir", value: formatPrice(stats.totalRevenue) },
                { label: "Bugünkü sipariş", value: String(stats.todayOrders) },
                { label: "Tasarlanan kahve", value: String(stats.designs) },
              ].map((s) => (
                <Card key={s.label} pad="md">
                  <p className="admin-stat-label">{s.label}</p>
                  <p className="admin-stat-value">{s.value}</p>
                </Card>
              ))}
            </div>

            <Card pad="md" className="admin-status-summary">
              <h2>Sipariş durumu</h2>
              <div className="admin-status-row">
                <span><Badge tone="warning">Alındı</Badge> {stats.alindi}</span>
                <span><Badge tone="accent">Hazırlanıyor</Badge> {stats.hazirlaniyor}</span>
                <span><Badge tone="success">Hazır</Badge> {stats.hazir}</span>
              </div>
            </Card>

            <Card pad="md">
              <div className="admin-section-head">
                <h2>Son siparişler</h2>
                <Button variant="ghost" size="md" onClick={() => setTab("orders")}>
                  Tümü
                </Button>
              </div>
              {orders.length === 0 ? (
                <EmptyState title="Henüz sipariş yok" />
              ) : (
                <ul className="admin-recent">
                  {orders.slice(0, 5).map((o) => (
                    <li key={o.id}>
                      <span className="text-mono">#{o.id}</span>
                      <span className="admin-recent-name">
                        {o.items.map((i) => i.name).join(", ")}
                      </span>
                      <span className="admin-recent-meta">{formatDateTime(o.createdAt)}</span>
                      <Badge tone={STATUS_TONE[o.status]}>{STATUS_LABEL[o.status]}</Badge>
                      <span className="admin-recent-price">{formatPrice(o.totalKurus)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </>
        )}

        {tab === "orders" && (
          <>
            <div className="admin-filters">
              <Input
                label="Sipariş no ara"
                placeholder="#A1042"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="admin-filter-tabs" role="tablist" aria-label="Durum filtresi">
                {(["all", ...STATUS_FLOW] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="tab"
                    aria-selected={statusFilter === s}
                    className={`admin-filter-tab${statusFilter === s ? " is-active" : ""}`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s === "all" ? "Tümü" : STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <EmptyState title="Sonuç yok" />
            ) : (
              <div className="admin-orders">
                {filteredOrders.map((o) => (
                  <Card key={o.id} pad="md">
                    <div className="admin-order-head">
                      <div>
                        <strong className="text-mono">#{o.id}</strong>
                        <span className="admin-recent-meta">{formatDateTime(o.createdAt)}</span>
                      </div>
                      <div className="admin-order-head-right">
                        <Badge tone={STATUS_TONE[o.status]}>{STATUS_LABEL[o.status]}</Badge>
                        <span className="admin-order-price">{formatPrice(o.totalKurus)}</span>
                      </div>
                    </div>
                    <p className="admin-order-items">
                      {o.items.map((i) => `${i.name}${i.qty > 1 ? ` ×${i.qty}` : ""}`).join(", ")}
                    </p>
                    {o.address && (
                      <p className="admin-order-address">
                        {o.address.fullName} · {o.address.phone} · {o.address.line}, {o.address.district}/{o.address.city}
                        {o.delivery ? ` · ${DELIVERY_LABEL[o.delivery]}` : ""}
                      </p>
                    )}
                    <div className="admin-order-actions">
                      {o.status !== "teslim" && o.status !== "iptal" && (
                        <Button size="md" onClick={() => advance(o.id, o.status)}>
                          {STATUS_LABEL[nextStatus(o.status)]} yap
                        </Button>
                      )}
                      <IconButton
                        label="Siparişi sil"
                        tone="danger"
                        size="sm"
                        icon={<Trash2 size={16} />}
                        onClick={() => delOrder(o.id)}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "products" && (
          <>
            <Card pad="md" className="admin-add-product">
              <h2>Yeni ürün</h2>
              <div className="admin-add-row">
                <Input
                  label="Ad"
                  placeholder="Ürün adı"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <Input
                  label="Fiyat (₺)"
                  type="number"
                  inputMode="decimal"
                  placeholder="0"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                />
                <Button onClick={addProduct} disabled={!newName.trim() || !newPrice}>
                  Ekle
                </Button>
              </div>
            </Card>

            {products.length === 0 ? (
              <EmptyState title="Henüz ürün eklenmemiş" />
            ) : (
              <div className="admin-products">
                {products.map((p) => (
                  <Card key={p.id} pad="md" className="admin-product">
                    <div>
                      <strong>{p.name}</strong>
                      <span>{formatPrice(p.priceKurus)}</span>
                    </div>
                    <IconButton
                      label={`${p.name} ürününü sil`}
                      tone="danger"
                      size="sm"
                      icon={<Trash2 size={16} />}
                      onClick={() => delProduct(p.id)}
                    />
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "coffees" && (
          <>
            {coffees.length === 0 ? (
              <EmptyState title="Henüz kahve tasarlanmamış" />
            ) : (
              <div className="admin-products">
                {coffees.map((c) => (
                  <Card key={c.id} pad="md" className="admin-product">
                    <div>
                      <strong>{c.name}</strong>
                      {c.isFromArena && <Badge tone="accent">Topluluk</Badge>}
                      {typeof c.total === "number" && <span>{formatPrice(c.total * 100)}</span>}
                    </div>
                    <IconButton
                      label={`${c.name} kahvesini sil`}
                      tone="danger"
                      size="sm"
                      icon={<Trash2 size={16} />}
                      onClick={() => delCoffee(c.id)}
                    />
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
