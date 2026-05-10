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
import { ToastProvider } from "../components/ToastProvider";

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
        <ToastProvider>
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

<footer className="footer" style={{
  marginTop: "40px",
  padding: "30px 20px",
  color: "white"
}}>
  <div style={{
    maxWidth: "1000px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "center",
    textAlign: "center"
  }}>
    
    <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
      ELMENES COFFEE
    </h2>

    <p style={{ opacity: 0.7 }}>
      Özel kahve deneyimini dijital dünyaya taşıyoruz.
    </p>

    <div style={{
      display: "flex",
      gap: "20px",
      flexWrap: "wrap",
      justifyContent: "center"
    }}>
      <a href="/menu">Menü</a>
      <a href="/hakkimizda">Hakkımızda</a>
      <a href="/profil">Profil</a>
      <a href="/kahveniolustur">Kahveni Oluştur</a>
    </div>

    <div style={{
      display: "flex",
      gap: "15px"
    }}>
      <span>📧 info@elmenes.com</span>
      <span>📍 Türkiye</span>
    </div>

    <hr style={{ width: "100%", opacity: 0.1 }} />

    <p style={{ fontSize: "14px", opacity: 0.6 }}>
      © 2026 ELMENES COFFEE. Tüm hakları saklıdır.
    </p>

  </div>
</footer>

          </div>
        </ToastProvider>
      </body>
    </html>
  );
}