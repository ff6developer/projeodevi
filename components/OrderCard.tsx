import type { ReactElement } from "react"

interface Props {
  order: any
  isMobile: boolean
  updateStatus: (id: number, status: string) => void
  deleteOrder: (id: number) => void
  getStatusConfig: (status: string) => any
  formatDate: (date: string) => string
  renderOrderDetails: (details: any) => ReactElement
}

export default function OrderCard({
  order,
  isMobile,
  updateStatus,
  deleteOrder,
  getStatusConfig,
  formatDate,
  renderOrderDetails
}: Props) {

  const statusConfig = getStatusConfig(order.status)

  return (
    <div className="order-card">

      <div className="order-card-header">
        <div className="order-card-info">
          <div className="order-card-icon" style={{ background: statusConfig.bg }}>
            {statusConfig.icon}
          </div>
          <div>
            <h3 className="order-card-id">
              {order.coffeeName || `Sipariş #${order.id}`}
            </h3>
            <p className="order-card-date">{formatDate(order.date)}</p>
          </div>
        </div>

        <div className="order-card-meta">
          <div className="order-card-price">
            <p className="order-price-value">₺{order.totalPrice}</p>
            {order.originalPrice && order.originalPrice !== order.totalPrice && (
              <p className="order-price-original">₺{order.originalPrice}</p>
            )}
          </div>
          <div className="order-status-pill" style={{ background: statusConfig.bg }}>
            <span>{order.status}</span>
          </div>
        </div>
      </div>

      <div className="order-card-details">
        {renderOrderDetails(order.details)}
      </div>

      {(order.score !== undefined || order.isFromArena) && (
        <div className="order-card-score">
          {order.isFromArena && <span className="arena-badge-large">🏆 Arena</span>}
          {order.score !== undefined && (
            <div className="score-badge">
              <span className="score-value">⭐ {order.score}</span>
            </div>
          )}
        </div>
      )}

<div className="order-card-actions">
  <button
    onClick={() => updateStatus(order.id, "Hazırlanıyor")}
    className={`action-btn preparing ${order.status === "Hazırlanıyor" ? "disabled" : ""}`}
    disabled={order.status === "Hazırlanıyor"}
  >
    <span>◐</span> Hazırlanıyor
  </button>

  <button
    onClick={() => updateStatus(order.id, "Hazır")}
    className={`action-btn ready ${order.status === "Hazır" ? "disabled" : ""}`}
    disabled={order.status === "Hazır"}
  >
    <span>✓</span> Hazır
  </button>

  <button
    onClick={() => deleteOrder(order.id)}
    className="action-btn delete"
    aria-label="Siparişi Sil"
  >
    <span>🗑️</span> Sil
  </button>
</div>

    </div>
  )
}
