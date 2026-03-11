import React from "react";
import "./App.css";
import Header from "./components/header.jsx";
import Menu from "./components/menu.jsx";

function App() {
  return (
    <div className="layout">
      <Header />
      
      <div className="main">
        <aside className="sidebar">
          <ul>
            <li><a href="#">Kahve Arenası</a></li>
            <li><a href="#">Hakkımızda</a></li>
            <li><a href="#">Menü</a></li>
            <li><a href="#">Kahveni Tasarla</a></li>
            <li><a href="#">Kampanyalar</a></li>
            <li><a href="#">Kayıt Ol</a></li>
            <li><a href="#">Giriş Yap</a></li>
          </ul>
        </aside>

        <div className="content">
          <Menu />
        </div>
      </div>

      <footer className="footer">
        <p>© 2026 ELMENES COFFEE</p>
      </footer>
    </div>
  );
}

export default App;