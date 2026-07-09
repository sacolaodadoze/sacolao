import "./SideBar.css";
export default function SideBar({ menuOpen, setMenuOpen, categories }) {
  return (
    <>
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <span>Categorías</span>
          <button onClick={() => setMenuOpen(false)}>✕</button>
        </div>

        <nav>        
          {categories.map((categoria) => (
            <p key={categoria.id}>{categoria.name}</p>
          ))}
        </nav>
      </aside>
      {/* OVERLAY-- fondo oscuro/transparente que cubre la pantalla*/}
      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
}
