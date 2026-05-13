import "./SideBar.css";
export default function SideBar({ menuOpen, setMenuOpen }) {
  return (
    <>
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <span>Categorías</span>
          <button onClick={() => setMenuOpen(false)}>✕</button>
        </div>

        <nav>
          <p> Prontos para consumo</p>
          <p> Legumes y ovos</p>
          <p> Lácteos</p>
          <p> Hortaliças</p>
          <p> Frutas</p>
          <p> Hortaliças</p>
          <p> Massas artesanais</p>
          <p> Bebidas</p>
          <p> Ofertas</p>
        </nav>

        {/*  <div className="sidebar-footer">
          <p>📞 Contacto</p>
          <p>ℹ️ Sobre nosotros</p>
        </div> */}
      </aside>
      {/* OVERLAY-- fondo oscuro/transparente que cubre la pantalla*/}
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}
      
    </>
  );
}
