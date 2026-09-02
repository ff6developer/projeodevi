"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Menu as MenuIcon, ShoppingBag } from "lucide-react"
import { visibleNavItems } from "@/lib/nav"
import { isLoggedIn as sessionLoggedIn, clearSession, subscribe } from "@/lib/session"
import { useCart } from "./CartProvider"
import NavDrawer from "./NavDrawer"

export default function HeaderNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const sync = () => setIsLoggedIn(sessionLoggedIn())
    sync()
    return subscribe(sync)
  }, [])

  // Rota değişince drawer'ı kapat (pathname harici bir sistem — router).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrawerOpen(false)
  }, [pathname])

  const closeDrawer = useCallback(() => setDrawerOpen(false), [])
  const handleLogout = useCallback(() => {
    clearSession()
    router.push("/")
  }, [router])

  const items = visibleNavItems(isLoggedIn)
  const { count } = useCart()

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-brand" aria-label="Elmenes Coffee ana sayfa">
          <Image src="/logo.png" alt="" width={36} height={36} priority className="site-brand-logo" />
          <span className="site-brand-name">Elmenes Coffee</span>
        </Link>

        <nav className="site-nav" aria-label="Ana menü">
          {items.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`site-nav-link${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="site-header-right">
          <Link
            href="/sepet"
            className="site-cart"
            aria-label={count > 0 ? `Sepet, ${count} ürün` : "Sepet"}
          >
            <ShoppingBag size={20} aria-hidden="true" />
            {count > 0 && <span className="site-cart-badge">{count}</span>}
          </Link>

          <button
            type="button"
            className="site-nav-toggle"
            aria-label="Menüyü aç"
            aria-expanded={drawerOpen}
            aria-controls="nav-drawer"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon size={24} />
          </button>
        </div>
      </div>

      <NavDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        items={items}
        currentPath={pathname}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
    </header>
  )
}
