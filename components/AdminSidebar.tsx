import { LayoutDashboard, ClipboardList, ShoppingBag, Coffee } from "lucide-react"
import type { Tab } from "./adminTypes"

interface Props {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
  pending: number
}

const TABS: { id: Tab; label: string; icon: typeof Coffee }[] = [
  { id: "dashboard", label: "Genel bakış", icon: LayoutDashboard },
  { id: "orders", label: "Siparişler", icon: ClipboardList },
  { id: "products", label: "Ürünler", icon: ShoppingBag },
  { id: "coffees", label: "Kahveler", icon: Coffee },
]

export default function AdminSidebar({ activeTab, setActiveTab, pending }: Props) {
  return (
    <nav className="admin-nav" aria-label="Yönetim menüsü">
      {TABS.map((tab) => {
        const Icon = tab.icon
        const active = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            className={`admin-nav-btn${active ? " is-active" : ""}`}
            aria-current={active ? "page" : undefined}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon size={18} aria-hidden="true" />
            <span>{tab.label}</span>
            {tab.id === "orders" && pending > 0 && (
              <span className="admin-nav-badge">{pending}</span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
