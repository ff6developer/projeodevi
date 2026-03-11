export default function Menu() {
  return (
    <div className="menu-container">
      <h2>Menümüz</h2>

      <div className="category">
        <h3>Sıcak Kahveler</h3>

        <div className="menu-item">
          <img src="./public/espresso.jpg" width="120" alt="Espresso" />
          <p>Espresso</p>
        </div>

        <div className="menu-item">
          <img src="./public/latte.jpg" width="120" alt="Latte" />
          <p>Latte</p>
        </div>
      </div>

      <div className="category">
        <h3>Tatlılar</h3>

        <div className="menu-item">
          <img src="./public/tramisu.jpg" width="120" alt="Tiramisu" />
          <p>Tiramisu</p>
        </div>
      </div>
    </div>
  );
}