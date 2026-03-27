"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import "../../styles/login.css"

export default function Signin() {

  const router = useRouter()

  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [blur,setBlur] = useState(false)

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

 // Eğer sunucu bir JSON dönmüyorsa hata almamak için kontrol
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
    <div className={`login-container ${blur ? "blur-active" : ""}`}>
      
      <div className="login-card">

        <h2>Kayıt Ol</h2>
        <p className="login-sub">
          ELMENES COFFEE hesabı oluşturun
        </p>

        <form className="login-form" onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Ad Soyad</label>
            <input
              type="text"
              placeholder="Adınızı girin"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              onFocus={()=>setBlur(true)}
              onBlur={()=>setBlur(false)}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              onFocus={()=>setBlur(true)}
              onBlur={()=>setBlur(false)}
              required
            />
          </div>

          <div className="input-group">
            <label>Şifre</label>
            <input
              type="password"
              placeholder="Şifre oluşturun"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              onFocus={()=>setBlur(true)}
              onBlur={()=>setBlur(false)}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Kayıt Ol
          </button>

          <div className="login-links">
            <span>Zaten hesabınız var mı?</span>

            
              <div className="login-links">
                <a href="/giris">Giriş Yap</a>
              </div>

          </div>

        </form>

      </div>

    </div>
  )
}