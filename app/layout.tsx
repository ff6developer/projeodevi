"use client"

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
} from "lucide-react"; // Modern vektörel ikon kütüphanesi
import "../styles/layout.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        <div className="layout">
          {/* --- HEADER --- */}
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
                  <li><Link href="/kahvearenasii">Kahve Arenası</Link></li>
                  <li><Link href="/menu">Menü</Link></li>
                  <li><Link href="/giris">Giriş Yap</Link></li>
                  <li><Link href="/kayit">Kayıt Ol</Link></li>
                </ul>
              </nav>
            </div>
          </header>

          {/* --- SIDEBAR (ICONBAR) --- */}
          <aside className="iconbar">
            {[
              { href: "/kahvearenasii", icon: <Trophy size={28} />, label: "Kahve Arenası" },
              { href: "/hakkimizda", icon: <Info size={28} />, label: "Hakkımızda" },
              { href: "/menu", icon: <MenuIcon size={28} />, label: "Menü" },
              { href: "/kahveniolustur", icon: <FlaskConical size={28} />, label: "Kahveni Oluştur" },
              { href: "/giris", icon: <LogIn size={28} />, label: "Giriş Yap" },
              { href: "/kayit", icon: <UserPlus size={28} />, label: "Kayıt Ol" },
              { href: "/profil", icon: <UserCircle size={28} />, label: "Profil" },
            ].map((item) => (
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