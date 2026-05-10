"use client"

import { useEffect, useState, useMemo } from "react"
import "../../styles/adminpanel.css"
import AdminSidebar from "../../components/AdminSidebar"
import Dashboard from "../../components/Dashboard"
import OrdersPanel from "../../components/OrdersPanel"
import ProductsPanel from "../../components/ProductsPanel"


type OrderDetails = {
  milkType?: { name: string; price: number; power: number } | null
  beanType?: { name: string; price: number; power: number } | null
  foam?: { name: string; price: number; power: number } | null
  cupType?: { name: string; price: number; power: number } | null
  syrup?: { name: string; price: number; power: number } | null
  spice?: { name: string; price: number; power: number } | null
  sweetener?: { name: string; price: number; power: number } | null
  technique?: { name: string; price: number; power: number } | null
}

type Order = {
  id: number
  coffeeName?: string
  details: OrderDetails
  totalPrice: number
  originalPrice?: number
  discountApplied?: number
  isFromArena?: boolean
  score: number
  status: string
  date: string
}

type Coffee = {
  id: number
  name: string
  image?: string | null
  details: OrderDetails
  score: number
  total: number
  originalTotal?: number
  isFromArena?: boolean
  date: string
}

type Product = {
  id: number
  name: string
  price: number
}

type Tab = "dashboard" | "orders" | "products" | "coffees"

export default function AdminPanel() {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [coffees, setCoffees] = useState<Coffee[]>([])
  const [newProduct, setNewProduct] = useState("")
  const [newPrice, setNewPrice] = useState("")
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderDetailOpen, setOrderDetailOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Ekran boyutu kontrolü
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setSidebarOpen(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem("orders")
    if (stored) {
      const parsed = JSON.parse(stored)
      const sorted = parsed.sort((a: Order, b: Order) => {
        const getTime = (dateStr: string) => {
          if (!dateStr) return 0
          if (dateStr.includes("T")) return new Date(dateStr).getTime()
          const [day, month, yearTime] = dateStr.split(".")
          const [year, time] = yearTime.split(" ")
          return new Date(`${year}-${month}-${day}T${time || "00:00:00"}`).getTime()
        }
        return getTime(b.date) - getTime(a.date)
      })
      setOrders(sorted)
    }

    const storedProducts = localStorage.getItem("products")
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts))
    }

    const storedCoffees = localStorage.getItem("coffees")
    if (storedCoffees) {
      const parsedCoffees = JSON.parse(storedCoffees)
      const sortedCoffees = parsedCoffees.sort((a: Coffee, b: Coffee) => {
        const getTime = (dateStr: string) => {
          if (!dateStr) return 0
          // ISO format
          if (dateStr.includes("T")) return new Date(dateStr).getTime()
          // Turkish locale: "1.05.2026 23:26:00"
          const [day, month, yearTime] = dateStr.split(".")
          const [year, time] = yearTime.split(" ")
          return new Date(`${year}-${month}-${day}T${time || "00:00:00"}`).getTime()
        }
        return getTime(b.date) - getTime(a.date)
      })
      setCoffees(sortedCoffees)
    }
  }, [])

  const stats = useMemo(() => {
    const today = new Date()
    const todayDay = today.getDate().toString().padStart(2, "0")
    const todayMonth = (today.getMonth() + 1).toString().padStart(2, "0")
    const todayYear = today.getFullYear()
    const todayStr = `${todayDay}.${todayMonth}.${todayYear}`

    const todayOrders = orders.filter(o => {
      const dateStr = o.date
      if (!dateStr) return false

      let orderDatePart: string

      // Check if it's ISO format (contains 'T')
      if (dateStr.includes("T")) {
        const isoDate = new Date(dateStr)
        const d = isoDate.getDate().toString().padStart(2, "0")
        const m = (isoDate.getMonth() + 1).toString().padStart(2, "0")
        const y = isoDate.getFullYear()
        orderDatePart = `${d}.${m}.${y}`
      } else {
        // Turkish locale format: "1.05.2026 23:26:00" or "01.05.2026 23:26:00"
        orderDatePart = dateStr.split(" ")[0]
      }

      // Normalize both to DD.MM.YYYY for comparison
      const [orderDay, orderMonth, orderYear] = orderDatePart.split(".")
      const normalizedOrder = `${orderDay.padStart(2, "0")}.${orderMonth.padStart(2, "0")}.${orderYear}`

      return normalizedOrder === todayStr
    })

    const dailyRevenue = todayOrders.reduce((acc, o) => acc + o.totalPrice, 0)
    const totalRevenue = orders.reduce((acc, o) => acc + o.totalPrice, 0)
    const avgScore = orders.length > 0 
      ? (orders.reduce((acc, o) => acc + o.score, 0) / orders.length).toFixed(1)
      : "0"

    const pending = orders.filter(o => o.status === "Bekliyor").length
    const preparing = orders.filter(o => o.status === "Hazırlanıyor").length
    const ready = orders.filter(o => o.status === "Hazır").length
    const arenaOrders = orders.filter(o => o.isFromArena).length
    const totalDiscount = orders.reduce((acc, o) => acc + (o.discountApplied || 0), 0)

    return { 
      dailyRevenue, 
      totalRevenue, 
      avgScore, 
      pending, 
      preparing, 
      ready, 
      todayOrders: todayOrders.length,
      arenaOrders,
      totalDiscount,
      totalCoffees: coffees.length
    }
  }, [orders, coffees])

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter
      const matchesSearch = order.id.toString().includes(searchTerm)
      return matchesStatus && matchesSearch
    })
  }, [orders, statusFilter, searchTerm])

  const updateStatus = (id: number, newStatus: string) => {
    const updated = orders.map(order =>
      order.id === id ? { ...order, status: newStatus } : order
    )
    setOrders(updated)
    localStorage.setItem("orders", JSON.stringify(updated))
  }

  const deleteOrder = (id: number) => {
    const updated = orders.filter(o => o.id !== id)
    setOrders(updated)
    localStorage.setItem("orders", JSON.stringify(updated))
  }

  const addProduct = () => {
    if (!newProduct.trim() || !newPrice) return

    const newItem: Product = {
      id: Date.now(),
      name: newProduct.trim(),
      price: Number(newPrice)
    }

    const updated = [...products, newItem]
    setProducts(updated)
    localStorage.setItem("products", JSON.stringify(updated))
    setNewProduct("")
    setNewPrice("")
  }

  const deleteProduct = (id: number) => {
    const updated = products.filter(p => p.id !== id)
    setProducts(updated)
    localStorage.setItem("products", JSON.stringify(updated))
  }

  const deleteCoffee = (id: number) => {
    const updated = coffees.filter(c => c.id !== id)
    setCoffees(updated)
    localStorage.setItem("coffees", JSON.stringify(updated))
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Hazır":
        return { bg: "linear-gradient(135deg, #10b981, #059669)", icon: "✓", color: "#ecfdf5" }
      case "Hazırlanıyor":
        return { bg: "linear-gradient(135deg, #f59e0b, #d97706)", icon: "◐", color: "#fffbeb" }
      default:
        return { bg: "linear-gradient(135deg, #6366f1, #4f46e5)", icon: "◷", color: "#eef2ff" }
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Tarih yok"

    let date: Date

    // Check if it's ISO format (contains 'T')
    if (dateStr.includes("T")) {
      date = new Date(dateStr)
    } else {
      // Turkish locale format: "1.05.2026 23:26:00" or "01.05.2026 23:26:00"
      // Format: DD.MM.YYYY HH:mm:ss
      const [datePart, timePart] = dateStr.split(" ")
      const [day, month, year] = datePart.split(".")
      // Construct ISO format: YYYY-MM-DDTHH:mm:ss
      const isoStr = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${timePart || "00:00:00"}`
      date = new Date(isoStr)
    }

    if (isNaN(date.getTime())) {
      return dateStr
    }

    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date)
  }

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order)
    setOrderDetailOpen(true)
  }

  const closeOrderDetail = () => {
    setOrderDetailOpen(false)
    setSelectedOrder(null)
  }

  const renderOrderDetails = (details: OrderDetails) => {
    const items = [
      { label: "Süt", value: details.milkType?.name, icon: "🥛" },
      { label: "Çekirdek", value: details.beanType?.name, icon: "☕" },
      { label: "Köpük", value: details.foam?.name, icon: "🫧" },
      { label: "Bardak", value: details.cupType?.name, icon: "🥤" },
      { label: "Şurup", value: details.syrup?.name, icon: "🍯" },
      { label: "Baharat", value: details.spice?.name, icon: "🌶️" },
      { label: "Tatlandırıcı", value: details.sweetener?.name, icon: "🍬" },
      { label: "Teknik", value: details.technique?.name, icon: "⚙️" }
    ].filter(item => item.value)

    return (
      <div className="detail-grid">
        {items.map((item, i) => (
          <div key={i} className="detail-item">
            <span className="detail-icon">{item.icon}</span>
            <span className="detail-label">{item.label}</span>
            <span className="detail-value">{item.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="admin-container">
      <div className="admin-inner">
        <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />


        {/* Main Content */}
        <main className="main-content">

          {activeTab === "dashboard" && (
            <Dashboard
              stats={stats}
              orders={orders}
              isMobile={isMobile}
              currentTime={currentTime}
              setActiveTab={setActiveTab}
              getStatusConfig={getStatusConfig}
              formatDate={formatDate}
            />
          )}

          {activeTab === "orders" && (
            <OrdersPanel
              filteredOrders={filteredOrders}
              isMobile={isMobile}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              updateStatus={updateStatus}
              deleteOrder={deleteOrder}
              getStatusConfig={getStatusConfig}
              formatDate={formatDate}
              renderOrderDetails={renderOrderDetails}
            />
          )}

          {activeTab === "products" && (
            <ProductsPanel
              products={products}
              isMobile={isMobile}
              newProduct={newProduct}
              setNewProduct={setNewProduct}
              newPrice={newPrice}
              setNewPrice={setNewPrice}
              addProduct={addProduct}
              deleteProduct={deleteProduct}
            />
          )}

          {/* Coffees Tab */}
          {activeTab === "coffees" && (
            <div>
              {isMobile && (
                <h2 className="page-title-mobile">Kahveler</h2>
              )}

              <div className="coffees-list">
                {coffees.map(coffee => (
                  <div key={coffee.id} className="coffee-card">
                    <div className="coffee-card-header">
                      <div className="coffee-card-info">
                        <div className="coffee-card-icon">
                          {coffee.image ? (
                            <img src={coffee.image} alt={coffee.name} className="coffee-image" />
                          ) : (
                            "☕"
                          )}
                        </div>
                        <div>
                          <h3 className="coffee-card-name">
                            {coffee.name}
                            {coffee.isFromArena && <span className="arena-tag">🏆 Arena</span>}
                          </h3>
                          <p className="coffee-card-date">{formatDate(coffee.date)}</p>
                        </div>
                      </div>

                      <div className="coffee-card-meta">
                        <div className="coffee-price">
                          <p className="coffee-price-value">₺{coffee.total}</p>
                          {coffee.originalTotal && coffee.originalTotal !== coffee.total && (
                            <p className="coffee-price-original">₺{coffee.originalTotal}</p>
                          )}
                        </div>
                        <div className="coffee-score-badge">
                          <span>⭐</span>
                          <span>{coffee.score}</span>
                        </div>
                      </div>
                    </div>

                    <div className="coffee-card-details">
                      {renderOrderDetails(coffee.details)}
                    </div>

                    <div className="coffee-card-actions">
                      <button
                        onClick={() => deleteCoffee(coffee.id)}
                        className="action-btn delete"
                      >
                        <span>🗑️</span> Sil
                      </button>
                    </div>
                  </div>
                ))}

                {coffees.length === 0 && (
                  <div className="empty-state large">
                    <p className="empty-icon">☕</p>
                    <p>Henüz kahve oluşturulmamış</p>
                    <p className="empty-hint">Kahveni Oluştur sayfasından kahve tasarlayın</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}