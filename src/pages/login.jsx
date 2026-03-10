export default function Login() {
  return (
    <div className="login-container">
      <div className="login-card">

        <h2>Giriş Yap</h2>
        <p className="login-sub">ELMENES COFFEE hesabınıza giriş yapın</p>

        <form className="login-form">

          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="email@example.com" />
          </div>

          <div className="input-group">
            <label>Şifre</label>
            <input type="password" placeholder="Şifrenizi girin" />
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