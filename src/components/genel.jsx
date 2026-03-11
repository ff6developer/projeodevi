import "../index.css";
import { Link, Outlet } from "react-router-dom";

export default function Genel() {
  return (
    <div className="layout">

      <header className="header">
        <div className="header-left">
          <img src="/logo.png" alt="logo" className="logo" />
          <h1 className="logo-text">ELMENES COFFEE</h1>
        </div>

        <nav className="nav">
          <ul>
            <li><Link to="/">Kahve Arenası</Link></li>
            <li><Link to="/menu">Menü</Link></li>
            <li><Link to="/login">Giriş Yap</Link></li>
            <li><Link to="/signin">Kayıt Ol</Link></li>
          </ul>
        </nav>
      </header>

      <div className="main">
        <aside className="sidebar">
          <ul>
            <li><Link to="/">Kahve Arenası</Link></li>
            <li><Link to="/menu">Menü</Link></li>
            <li><Link to="/login">Giriş Yap</Link></li>
            <li><Link to="/signin">Kayıt Ol</Link></li>
          </ul>
        </aside>

        <div className="anasayfaicerik">
          <Outlet />
        </div>
      </div>

      <footer className="footer">
        <p>© 2026 ELMENES COFFEE</p>
      </footer>

    </div>
  );
}