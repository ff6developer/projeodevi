import "./index.css";

function App() {
  return (
    <div className="layout">

      <header className="header">
        <div className="header-left">
          <img src="/logo.png" alt="logo" className="logo" />
          <h1 className="logo-text">ELMENES COFFEE</h1>
        </div>

        <nav className="nav">
          <ul>
            <li><a href="#">coffee Arenası</a></li>
            <li><a href="#">Hakkımızda</a></li>
            <li><a href="#">Menü</a></li>
            <li><a href="#">Kahveni Tasarla</a></li>
            <li><a href="#">Kampanyalar</a></li>
            <li><a href="#">Kayıt Ol</a></li>
            <li><a href="#">Giriş Yap</a></li>
          </ul>
        </nav>
      </header>

      <div className="main">
        <aside className="sidebar">
          <ul>
            <li className="active"><a href="#">Kahve Arenası</a></li>
            <li className="active"><a href="#">Hakkımızda</a></li>
            <li className="active"><a href="#">Menü</a></li>
            <li className="active"><a href="#">Kahveni Tasarla</a></li>
            <li className="active"><a href="#">Kampanyalar</a></li>
            <li className="active"><a href="#">Kayıt Ol</a></li>
            <li className="active"><a href="#">Giriş Yap</a></li>
          </ul>
        </aside>

        <div className="anasayfaicerik">
          
        </div>
      </div>

      <footer className="footer">
        <p>© 2026 ELMENES COFFEE</p>
      </footer>

    </div>
  );
}

export default App;