import { useState } from "react";

export default function Login() {

  const [focused, setFocused] = useState(false);

  return (
    <div className={`login-container ${focused ? "blur-active" : ""}`}>
      <div className="login-card">

        <h2>Giriş Yap</h2>
        <p className="login-sub">ELMENES COFFEE hesabınıza giriş yapın</p>

        <form className="login-form">

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="email@example.com"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </div>

          <div className="input-group">
            <label>Şifre</label>
            <input
              type="password"
              placeholder="Şifrenizi girin"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </div>

          <button className="login-button">Giriş Yap</button>

          <div className="login-links">
            <a href="#">Şifremi Unuttum</a>
            <a href="/signin">Hesap Oluştur</a>
          </div>

        </form>

      </div>
    </div>
  );
}