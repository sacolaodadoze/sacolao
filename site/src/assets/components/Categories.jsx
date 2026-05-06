export default function Categories({ setMenuOpen }) {
  const categorias = [
    { id: 1, nombre: "Prontos para consumo" },
    { id: 2, nombre: "Legumes y ovos" },
    { id: 3, nombre: "Grãos e frutas secas" },
    { id: 4, nombre: "Hortaliças" },
    { id: 5, nombre: "Frutas" },
    { id: 6, nombre: "Massas artesanais" },
    { id: 7, nombre: "Bebidas" },
  ];
  return (
    <div className="categories">
      <button className="menu-btn" onMouseEnter={() => setMenuOpen(true)}>
        ☰
      </button>

      {categorias.map((categoria) => (
        <p key={categoria.id}>{categoria.nombre}</p>
      ))}
    </div>
  );
}
