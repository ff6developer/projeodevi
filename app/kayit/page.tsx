"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link" // Standart <a> yerine Link kullanımı Performans artırır
import "../../styles/login.css"

export default function Signin() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [blur, setBlur] = useState(false)

  // Fonksiyonu memoize ederek gereksiz yeniden oluşturmaları önlüyoruz
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Bir hata oluştu");
        return;
      }

      alert("Kayıt başarılı ✔");
      router.push("/giris");

    } catch (err) {
      console.error("Bağlantı Hatası:", err);
      alert("Server'a ulaşılamıyor. Lütfen backend terminalini kontrol edin!");
    }
  };

  return (
    // Performans için "blur" sınıfı sadece gerekli olduğunda eklenir
    <div className={`login-container ${blur ? "blur-active" : ""}`}>
      
      <div className="login-card">
        {/* SEO ve Erişilebilirlik için H1 kullanımı (Lighthouse tavsiyesi) */}
        <h1>Kayıt Ol</h1>
        <p className="login-sub">
          ELMENES COFFEE hesabı oluşturun
        </p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>

          <div className="input-group">
            <label htmlFor="fullName">Ad Soyad</label>
            <input
              id="fullName"
              type="text"
              autoComplete="name" // Tarayıcı hızlandırması için autocomplete eklendi
              placeholder="Adınızı girin"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setBlur(true)}
              onBlur={() => setBlur(false)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setBlur(true)}
              onBlur={() => setBlur(false)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Şifre</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Şifre oluşturun"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setBlur(true)}
              onBlur={() => setBlur(false)}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Kayıt Ol
          </button>

          <div className="login-links">
            <span>Zaten hesabınız var mı?</span>
            <div className="login-links">
              {/* Performans için Link bileşeni kullanıldı */}
              <Link href="/giris" className="login-link-anchor">Giriş Yap</Link>
            </div>
          </div>

        </form>
      </div>
    </div>
  )
}