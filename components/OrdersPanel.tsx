import type { ReactElement } from "react"
import OrderCard from "./OrderCard"

interface Props {
  filteredOrders: any[]
  isMobile: boolean
  searchTerm: string
  setSearchTerm: (v: string) => void
  statusFilter: string
  setStatusFilter: (v: string) => void
  updateStatus: (id: number, status: string) => void
  deleteOrder: (id: number) => void
  getStatusConfig: (status: string) => any
  formatDate: (date: string) => string
  renderOrderDetails: (details: any) => ReactElement
}

export default function OrdersPanel({
  filteredOrders,
  isMobile,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  updateStatus,
  deleteOrder,
  getStatusConfig,
  formatDate,
  renderOrderDetails
}: Props) {

  return (
    <div>
      {isMobile && (
        <h2 className="page-title-mobile">Siparişler</h2>
      )}

      <div className={`filters-row ${isMobile ? 'mobile' : ''}`}>
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Sipariş numarası ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-tabs">
          {["all", "Bekliyor", "Hazırlanıyor", "Hazır"].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`filter-tab ${statusFilter === status ? 'active' : ''}`}
            >
              {status === "all" ? "Tümü" : status}
            </button>
          ))}
        </div>
      </div>

      <div className="orders-list">
        {filteredOrders.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            isMobile={isMobile}
            updateStatus={updateStatus}
            deleteOrder={deleteOrder}
            getStatusConfig={getStatusConfig}
            formatDate={formatDate}
            renderOrderDetails={renderOrderDetails}
          />
        ))}

        {filteredOrders.length === 0 && (
          <div className="empty-state">
            <p>Sonuç yok</p>
          </div>
        )}
      </div>
    </div>
  )
}