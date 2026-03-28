import Link from "next/link"
import "../styles/layout.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>
        <div className="layout">

          <header className="header">
            <img src="/logo.png" alt="logo" className="logo" />

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

          <aside className="iconbar">


            <div className="icon-item">
              <Link href="/kahvearenasii">
                <img src="/kahvearenasiikon.png" className="icon" />
              </Link>
              <span className="icon-label">Kahve Arenası</span>
            </div>

            <div className="icon-item">
              <Link href="/hakkimizda">
                <img src="/hakkimizdaikon.png" className="icon" />
              </Link>
              <span className="icon-label">Hakkımızda</span>
            </div>

            <div className="icon-item">
              <Link href="/menu">
                <img src="/menuikon.png" className="icon" />
              </Link>
              <span className="icon-label">Menü</span>
            </div>

            <div className="icon-item">
              <Link href="/kahveniolustur">
                <img src="/kahveniolusturikon.png" className="icon" />
              </Link>
              <span className="icon-label">Kahveni Oluştur</span>
            </div>

            <div className="icon-item">
              <Link href="/giris">
                <img src="/loginikon.png" className="icon" />
              </Link>
              <span className="icon-label">Giriş Yap</span>
            </div>

            <div className="icon-item">
              <Link href="/kayit">
                <img src="/kayitikon.png" className="icon" />
              </Link>
              <span className="icon-label">Kayıt Ol</span>
            </div>

            <div className="icon-item">
              <Link href="/profil">
                <img src="/profilikon.png" className="icon" />
              </Link>
              <span className="icon-label">Profil</span>
            </div>

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
  )
}