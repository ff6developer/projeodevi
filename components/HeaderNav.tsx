"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu as MenuIcon } from "lucide-react"
import { visibleNavItems } from "@/lib/nav"
import NavDrawer from "./NavDrawer"

export default function HeaderNav() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const checkAuth = () => setIsLoggedIn(!!localStorage.getItem("user"))
    checkAuth()
    window.addEventListener("authChanged", checkAuth)
    return () => window.removeEventListener("authChanged", checkAuth)
  }, [])

  // Rota değişince drawer'ı kapat
  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  const items = visibleNavItems(isLoggedIn)

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

      <NavDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={items}
        currentPath={pathname}
      />
    </header>
  )
}
