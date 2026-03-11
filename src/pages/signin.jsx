import "../index.css";

export default function Signin() {
  return (
    <div className="login-container">
      <div className="login-card">

        <h2>Kayıt Ol</h2>
        <p className="login-sub">ELMENES COFFEE hesabı oluşturun</p>

        <form className="login-form">

          <div className="input-group">
            <label>Ad Soyad</label>
            <input type="text" placeholder="Adınızı girin" />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="email@example.com" />
          </div>

          <div className="input-group">
            <label>Şifre</label>
            <input type="password" placeholder="Şifre oluşturun" />
          </div>

          <button className="login-button">Kayıt Ol</button>
          <div className="signin-links">
             <a href="#">Zaten hesabınız var mı?</a>
             <a href="/login">Giriş Yap</a>
          </div>
        </form>

      </div>
    </div>
  );
}