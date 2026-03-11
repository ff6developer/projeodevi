
export default function Menu() {
  return (
    <div className="menu-container">
      <h2>Menümüz</h2>
      <img src="/espresso.png"alt="espresso"className="espresso"/>
      <div className="category">
        <h3>Sıcak Kahveler</h3>
        <div className="menu-item">
          <img src={espressoImg} width="120" alt="Espresso" />
          <p>Espresso</p>
        </div>
        <div className="menu-item">
          <img src={latteImg} width="120" alt="Latte" />
          <p>Latte</p>
        </div>
      </div>

      <div className="category">
        <h3>Tatlılar</h3>
        <div className="menu-item">
          <img src={mocaImg} width="120" alt="Moca" />
          <p>Moca</p>
        </div>
      </div>
    </div>
  );
}