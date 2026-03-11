<<<<<<< HEAD
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
=======
import { Routes, Route } from "react-router-dom";
import Genel from "./components/genel";
import Login from "./pages/login";
import Menu from "./pages/menu";
import Signin from "./pages/signin";

function Home() {
  return <h2>Ana Sayfa</h2>;
}

function App() {
  return (
    <Routes>

      <Route path="/" element={<Genel />}>
        <Route index element={<Home />} />
        <Route path="menu" element={<Menu />} />
        <Route path="login" element={<Login />} />
        <Route path="signin" element={<Signin />} />
      </Route>

    </Routes>
>>>>>>> 5a5b4fe399194d0900792cd1275f941a245995da
  );
}

export default App;