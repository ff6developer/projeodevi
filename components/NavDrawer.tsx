"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { LogOut, X } from "lucide-react"
import type { NavItem } from "@/lib/nav"
import { BRAND } from "@/app/site-config"

type Props = {
  open: boolean
  onClose: () => void
  items: NavItem[]
  currentPath: string
  isLoggedIn: boolean
  onLogout: () => void
}

export default function NavDrawer({
  open,
  onClose,
  items,
  currentPath,
  isLoggedIn,
  onLogout,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const opener = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
        return
      }
      if (e.key !== "Tab") return
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      )
      if (!focusables || focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
      // Kapanışta odağı menüyü açan öğeye geri ver.
      opener?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="nav-drawer-overlay" onClick={onClose}>
      <div
        ref={panelRef}
        id="nav-drawer"
        className="nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menü"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className="nav-drawer-close"
          onClick={onClose}
          aria-label="Menüyü kapat"
        >
          <X size={22} />
        </button>

        <p className="nav-drawer-brand">{BRAND.name}</p>

        <nav className="nav-drawer-list" aria-label="Ana menü">
          {items.map((item) => {
            const active = currentPath === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-drawer-link${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={onClose}
              >
                <Icon size={20} aria-hidden="true" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {isLoggedIn && (
          <button
            type="button"
            className="nav-drawer-logout"
            onClick={() => {
              onClose()
              onLogout()
            }}
          >
            <LogOut size={20} aria-hidden="true" />
            Çıkış yap
          </button>
        )}
      </div>
    </div>
  )
}
