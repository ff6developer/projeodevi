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
            <p>{stat.icon}</p>
            <p>{stat.label}</p>
            <p>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* RECENT ORDERS */}
      <div className="recent-orders">
        <div className="recent-orders-header">
          <h3>Son Siparişler</h3>
          <button
            onClick={() => setActiveTab("orders")}
            className="view-all-btn"
          >
            Tümü →
          </button>
        </div>

        {orders.slice(0, 5).map(order => {
          const statusConfig = getStatusConfig(order.status)

          return (
            <div key={order.id} className="recent-order-item">
              <div>
                <div>{statusConfig.icon}</div>
                <div>
                  <p>{order.coffeeName}</p>
                  <p>{formatDate(order.date)}</p>
                </div>
              </div>

              <div>
                <p>₺{order.totalPrice}</p>
                <p>{order.status}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}