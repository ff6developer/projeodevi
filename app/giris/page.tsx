"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import "../../styles/login.css"

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Giriş başarısız");
        return;
      }

      // BAŞARILI GİRİŞ: Kullanıcı bilgilerini sakla
      localStorage.setItem("user", JSON.stringify(data.user)); 
      // data.user içinde { name, email, id } olduğunu varsayıyoruz.
      
      alert(`Hoş geldin, ${data.user.name}!`);
      router.push("/profil");

    } catch (err) {
      alert("Bağlantı hatası!");
    }
  };

  return (
    <div className={`login-container ${focused ? "blur-active" : ""}`}>
      <div className="login-card">
        <h2>Giriş Yap</h2>
        <p className="login-sub">ELMENES COFFEE hesabınıza giriş yapın</p>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              required
            />
          </div>

          <div className="input-group">
            <label>Şifre</label>
            <input
              type="password"
              placeholder="Şifrenizi girin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              required
            />
          </div>
          <button type="submit" className="login-button">Giriş Yap</button>

          <div className="login-links">
            <a href="#">Şifremi Unuttum</a>
            <a href="/kayit">Hesap Oluştur</a>
          </div>
        </form>
      </div>
    </div>
  );
}