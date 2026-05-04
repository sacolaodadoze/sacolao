export default function SideBar({ menuOpen, setMenuOpen }) {
  return (
    <>
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <span>Categorías</span>
          <button onClick={() => setMenuOpen(false)}>✕</button>
        </div>

        <nav>
          <p>🥦 Verduras</p>
          <p>🍎 Frutas</p>
          <p>🥤 Bebidas</p>
          <p>🍞 Panadería</p>
          <p>🔥 Ofertas</p>
        </nav>

        {/*  <div className="sidebar-footer">
          <p>📞 Contacto</p>
          <p>ℹ️ Sobre nosotros</p>
        </div> */}
      </aside>
      {/* OVERLAY */}
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}
      
    </>
  );
}
