import "./Categories.css";
export default function Categories({ setMenuOpen }) {
  const categorias = [
    { id: 1, nombre: "Prontos para consumo" },
    { id: 2, nombre: "Legumes y ovos" },
    { id: 3, nombre: "Grãos e frutas secas" },
    { id: 4, nombre: "Hortaliças" },
    { id: 5, nombre: "Frutas" },
    { id: 6, nombre: "Massas artesanais" },
    { id: 7, nombre: "Caixas prontas" },
    { id: 8, nombre: "Mercearia-Molhos " },
    { id: 9, nombre: "Mercearia-Snacks " },
    { id: 10, nombre: "Mercearia-Condimentos " },
  ];
  return (
    <div className="categories">
      {/* TODO poner despues las categorias */}
      <button className="menu-btn"/*  onMouseEnter={() => setMenuOpen(true)} */>
        ☰
      </button>

      {categorias.map((categoria) => (
        <p key={categoria.id}>{categoria.nombre}</p>
      ))}
    </div>
  );
}
