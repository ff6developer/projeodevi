// Navigasyon — tek kaynak. Header metin menüsü ve ikon rayı bu diziden üretilir.

import type { LucideIcon } from "lucide-react"
import {
  Coffee,
  SlidersHorizontal,
  Info,
  Users,
  LogIn,
  UserPlus,
  UserCircle,
} from "lucide-react"

export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  /** Sadece giriş yapmış kullanıcıya gösterilir. */
  requiresAuth?: boolean
  /** Giriş yapmış kullanıcıya gösterilmez (ör. Giriş / Kayıt). */
  hideWhenAuth?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/menu", label: "Menü", icon: Coffee },
  { href: "/kahveniolustur", label: "Kahveni Oluştur", icon: SlidersHorizontal },
  { href: "/topluluk", label: "Topluluk", icon: Users },
  { href: "/hakkimizda", label: "Hakkımızda", icon: Info },
  { href: "/giris", label: "Giriş Yap", icon: LogIn, hideWhenAuth: true },
  { href: "/kayit", label: "Kayıt Ol", icon: UserPlus, hideWhenAuth: true },
  { href: "/profil", label: "Profil", icon: UserCircle, requiresAuth: true },
]

/** Verilen oturum durumuna göre görünecek nav öğeleri. */
export function visibleNavItems(isLoggedIn: boolean): NavItem[] {
  return NAV_ITEMS.filter((item) => {
    if (item.requiresAuth && !isLoggedIn) return false
    if (item.hideWhenAuth && isLoggedIn) return false
    return true
  })
}
