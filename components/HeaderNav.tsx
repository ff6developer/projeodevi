"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { visibleNavItems } from "../lib/nav"

export default function HeaderNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const checkAuth = () => {
    const user = localStorage.getItem("user")
    setIsLoggedIn(!!user)
  }

  useEffect(() => {
    checkAuth()
    window.addEventListener("authChanged", checkAuth)
    return () => window.removeEventListener("authChanged", checkAuth)
  }, [])

  const items = visibleNavItems(isLoggedIn)

  return (
    <>
      <header className="header">
        <Image
          src="/logo.png"
          alt="Elmenes Coffee"
          width={50}
          height={50}
          priority
          className="logo"
        />

        <div className="header-container">
          {/* Marka adı sayfanın h1'i değildir; her sayfanın kendi h1'i var. */}
          <p className="logo-text">ELMENES COFFEE</p>

          <nav className="nav" aria-label="Ana menü">
            <ul>
              {items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <aside className="iconbar" aria-label="Hızlı erişim">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <div className="icon-item" key={item.href}>
              <Link href={item.href} className="icon-wrapper" aria-label={item.label}>
                <Icon size={28} />
              </Link>
              <span className="icon-label">{item.label}</span>
            </div>
          )
        })}
      </aside>
    </>
  )
}
