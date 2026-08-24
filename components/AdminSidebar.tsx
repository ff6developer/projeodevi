import type { Tab } from "./adminTypes"

interface Props {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
  stats: any
  isMobile: boolean
  sidebarOpen: boolean
  setSidebarOpen: (val: boolean) => void
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  stats,
  isMobile,
  sidebarOpen,
  setSidebarOpen
}: Props) {

  const tabs = [
    { id: "dashboard" as Tab, label: "Dashboard", icon: "📊" },
    { id: "orders" as Tab, label: "Siparişler", icon: "📋", badge: stats.pending },
    { id: "products" as Tab, label: "Ürünler", icon: "🛍️" },
    { id: "coffees" as Tab, label: "Kahveler", icon: "☕" }
  ]

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab)
    if (isMobile) setSidebarOpen(false)
  }

  return (
    <>
      {/* MOBILE HEADER */}
      {isMobile && (
        <header className="mobile-header">
          <div className="mobile-header-brand">
            <div className="mobile-logo">☕</div>
            <span className="mobile-title">Admin Panel</span>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mobile-menu-btn"
            aria-label={sidebarOpen ? "Menüyü Kapat" : "Menüyü Aç"}
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>
        </header>
      )}

      {/* MOBILE OVERLAY */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="mobile-overlay"
        />
      )}

      {/* MOBILE NAV */}
      {isMobile && (
        <nav className={`mobile-nav ${sidebarOpen ? "open" : ""}`}>
          <div className="mobile-nav-items">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`mobile-nav-btn ${activeTab === tab.id ? "active" : ""}`}
              >
                <span className="nav-btn-icon">{tab.icon}</span>
                {tab.label}

                {tab.badge && tab.badge > 0 && (
                  <span className="nav-badge">{tab.badge}</span>
                )}
              </button>
            ))}
          </div>

          <div className="mobile-stats-summary">
            <p className="mobile-stats-title">Bugün</p>

            <div className="mobile-stats-row">
              <div>
                <p className="mobile-stats-value green">
                  ₺{stats.dailyRevenue}
                </p>
                <p className="mobile-stats-label">Gelir</p>
              </div>

              <div style={{ textAlign: "right" }}>
                <p className="mobile-stats-value purple">
                  {stats.todayOrders}
                </p>
                <p className="mobile-stats-label">Sipariş</p>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* DESKTOP SIDEBAR */}
      {!isMobile && (
        <aside className="desktop-sidebar">
          <div className="sidebar-sticky">

            <div className="sidebar-logo">
              <div className="logo-icon">☕</div>
              <div>
                <h1 className="logo-title">Kahve Admin</h1>
                <p className="logo-subtitle">Yönetim Paneli</p>
              </div>
            </div>

            <nav className="sidebar-nav">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`sidebar-nav-btn ${activeTab === tab.id ? "active" : ""}`}
                >
                  <span className="nav-btn-icon">{tab.icon}</span>
                  {tab.label}

                  {tab.badge && tab.badge > 0 && (
                    <span className="nav-badge">{tab.badge}</span>
                  )}
                </button>
              ))}
            </nav>

            <div className={`status-alert ${stats.pending > 0 ? "warning" : "success"}`}>
              <div className="status-alert-header">
                <span className={`status-dot ${stats.pending > 0 ? "red" : "green"}`} />
                <span className="status-alert-title">
                  {stats.pending > 0 ? "Bekleyen Sipariş" : "Tümü İşlendi"}
                </span>
              </div>

              <p className="status-alert-text">
                {stats.pending > 0
                  ? `${stats.pending} sipariş bekliyor`
                  : "Tüm siparişler tamamlandı"}
              </p>
            </div>

          </div>
        </aside>
      )}
    </>
  )
}