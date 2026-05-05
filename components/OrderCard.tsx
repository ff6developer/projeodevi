interface Props {
  order: any
  isMobile: boolean
  updateStatus: (id: number, status: string) => void
  deleteOrder: (id: number) => void
  getStatusConfig: (status: string) => any
  formatDate: (date: string) => string
  renderOrderDetails: (details: any) => JSX.Element
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
            <h3>
              {order.coffeeName || `Sipariş #${order.id}`}
            </h3>
            <p>{formatDate(order.date)}</p>
          </div>
        </div>

        <div className="order-card-meta">
          <p>₺{order.totalPrice}</p>
          <span>{order.status}</span>
        </div>
      </div>

      <div>
        {renderOrderDetails(order.details)}
      </div>

<div className="order-card-actions">
  <button
    onClick={() => updateStatus(order.id, "Hazırlanıyor")}
    className="action-btn preparing"
  >
    <span>◐</span> Hazırlanıyor
  </button>

  <button
    onClick={() => updateStatus(order.id, "Hazır")}
    className="action-btn ready"
  >
    <span>✓</span> Hazır
  </button>

  <button
    onClick={() => deleteOrder(order.id)}
    className="action-btn delete"
  >
    <span>🗑️</span> Sil
  </button>
</div>

    </div>
  )
}