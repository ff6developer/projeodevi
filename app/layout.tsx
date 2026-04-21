"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Trophy, 
  Info, 
  Menu as MenuIcon, 
  FlaskConical, 
  LogIn, 
  UserPlus, 
  UserCircle 
} from "lucide-react";
import "../styles/layout.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuth = () => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  };

  useEffect(() => {
    checkAuth();

    // 🔥 login/logout sonrası tetiklenecek
    window.addEventListener("authChanged", checkAuth);

    return () => {
      window.removeEventListener("authChanged", checkAuth);
    };
  }, []);

  const navItems = [
    { href: "/kahvearenasii", label: "Kahve Arenası", show: true },
    { href: "/menu", label: "Menü", show: true },
    { href: "/giris", label: "Giriş Yap", show: !isLoggedIn },
    { href: "/kayit", label: "Kayıt Ol", show: !isLoggedIn },
    { href: "/profil", label: "Profil", show: isLoggedIn },
    { href: "/kahveniolustur", label: "Kahveni Oluştur", show: isLoggedIn },
  ];

  const iconItems = [
    { href: "/kahvearenasii", icon: <Trophy size={28} />, label: "Kahve Arenası", show: true },
    { href: "/hakkimizda", icon: <Info size={28} />, label: "Hakkımızda", show: true },
    { href: "/menu", icon: <MenuIcon size={28} />, label: "Menü", show: true },
    { href: "/kahveniolustur", icon: <FlaskConical size={28} />, label: "Kahveni Oluştur", show: isLoggedIn },
    { href: "/giris", icon: <LogIn size={28} />, label: "Giriş Yap", show: !isLoggedIn },
    { href: "/kayit", icon: <UserPlus size={28} />, label: "Kayıt Ol", show: !isLoggedIn },
    { href: "/profil", icon: <UserCircle size={28} />, label: "Profil", show: isLoggedIn },
  ];

  return (
    <html lang="tr">
      <body>
        <div className="layout">

          <header className="header">
            <Image 
              src="/logo.png" 
              alt="Elmenes Coffee Logo" 
              width={50} 
              height={50} 
              priority 
              className="logo"
            />

            <div className="header-container">
              <h1 className="logo-text">ELMENES COFFEE</h1>

              <nav className="nav">
                <ul>
                  {navItems.filter(item => item.show).map(item => (
                    <li key={item.href}>
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </header>

          <aside className="iconbar">
            {iconItems.filter(item => item.show).map((item) => (
              <div className="icon-item" key={item.href}>
                <Link href={item.href} className="icon-wrapper">
                  {item.icon}
                </Link>
                <span className="icon-label">{item.label}</span>
              </div>
            ))}
          </aside>

          <main className="main">
            {children}
          </main>

          <footer className="footer">
            © 2026 ELMENES COFFEE
          </footer>

        </div>
      </body>
    </html>
  );
}