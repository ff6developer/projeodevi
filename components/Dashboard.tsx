interface Props {
  stats: any
  orders: any[]
  isMobile: boolean
  currentTime: Date
  setActiveTab: (tab: string) => void
  getStatusConfig: (status: string) => any
  formatDate: (date: string) => string
}

export default function Dashboard({
  stats,
  orders,
  isMobile,
  currentTime,
  setActiveTab,
  getStatusConfig,
  formatDate
}: Props) {

  return (
    <div>
      {isMobile && (
        <h2 className="page-title-mobile">Dashboard</h2>
      )}

      {/* CLOCK */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "16px"
        }}
      >
<span>
  {currentTime
    ? currentTime.toLocaleString("tr-TR")
    : ""}
</span>
      </div>

      {/* STATS */}
      <div className={`stats-grid ${isMobile ? "mobile" : ""}`}>
        {[
          { label: "Günlük Gelir", value: `₺${stats.dailyRevenue}`, icon: "💰" },
          { label: "Toplam Gelir", value: `₺${stats.totalRevenue}`, icon: "📈" },
          { label: "Ort. Puan", value: `${stats.avgScore}`, icon: "⭐" },
          { label: "Aktif Ürün", value: stats.totalCoffees, icon: "☕" },
          { label: "Arena Sipariş", value: stats.arenaOrders, icon: "🏆" },
          { label: "Toplam İndirim", value: `₺${stats.totalDiscount}`, icon: "🎁" }
        ].map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card-icon">{stat.icon}</div>
            <p className="stat-card-label">{stat.label}</p>
            <p className="stat-card-value">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* STATUS OVERVIEW */}
      <div className="status-overview">
        <h3 className="section-heading">Sipariş Durumu</h3>

        <div className="status-grid">
          <div
            className="status-box"
            style={{ ["--status-color" as any]: "#6366f1", ["--status-glow" as any]: "rgba(99, 102, 241, 0.15)" }}
          >
            <p className="status-count">{stats.pending}</p>
            <p className="status-label">Bekliyor</p>
          </div>

          <div
            className="status-box"
            style={{ ["--status-color" as any]: "#d97706", ["--status-glow" as any]: "rgba(217, 119, 6, 0.15)" }}
          >
            <p className="status-count">{stats.preparing}</p>
            <p className="status-label">Hazırlanıyor</p>
          </div>

          <div
            className="status-box"
            style={{ ["--status-color" as any]: "#16a34a", ["--status-glow" as any]: "rgba(22, 163, 74, 0.15)" }}
          >
            <p className="status-count">{stats.ready}</p>
            <p className="status-label">Hazır</p>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="recent-orders">
        <div className="recent-orders-header">
          <h3 className="section-heading" style={{ margin: 0 }}>Son Siparişler</h3>
          <button
            onClick={() => setActiveTab("orders")}
            className="view-all-btn"
          >
            Tümü →
          </button>
        </div>

        {orders.length === 0 ? (
          <p style={{ textAlign: "center", padding: "24px 0", color: "var(--text-muted)" }}>
            Henüz sipariş yok.
          </p>
        ) : (
          orders.slice(0, 5).map(order => {
            const statusConfig = getStatusConfig(order.status)

            return (
              <div key={order.id} className="recent-order-item">
                <div className="recent-order-info">
                  <div className="recent-order-icon" style={{ background: statusConfig.bg }}>
                    {statusConfig.icon}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p className="recent-order-id">{order.coffeeName || `Sipariş #${order.id}`}</p>
                    <p className="recent-order-date">{formatDate(order.date)}</p>
                  </div>
                </div>

                <div className="recent-order-meta">
                  <p className="recent-order-price">₺{order.totalPrice}</p>
                  <p className="recent-order-status">{order.status}</p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
