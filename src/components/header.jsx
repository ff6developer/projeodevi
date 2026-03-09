export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <img src="/logo.png" alt="logo" className="logo" />
        <h1 className="logo-text">ELMENES COFFEE</h1>
      </div>

      <nav className="nav">
        <ul>
          <li><a href="#">Kahve Arenası</a></li>
          <li><a href="#">Hakkımızda</a></li>
          <li><a href="#">Menü</a></li>
          <li><a href="#">Kahveni Tasarla</a></li>
          <li><a href="#">Kampanyalar</a></li>
          <li><a href="#">Kayıt Ol</a></li>
          <li><a href="#">Giriş Yap</a></li>
        </ul>
      </nav>
    </header>
  );
}