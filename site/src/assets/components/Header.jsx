import logo from "../img/logo.png";

export default function Header() {
  return (
    <header className="header">
      {/*  <button className="menu-btn" onClick={() => setMenuOpen(true)}>
        ☰
      </button> */}

      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo-img" />
        Sacolão da Doze
      </div>

      <input type="text" placeholder="Buscar produtos..." className="search" />

      {/* <div className="cart">🛒 (2)</div>
      <br /> */}
      <div className="delivery-info">
        <p>
          Tempo de entrega entre 90 e 120 min / Taxa de entrega GRÁTIS acima de
          R$ 140,00 / Entregas ate .../ Fechado
        </p>
      </div>
    </header>
  );
}
