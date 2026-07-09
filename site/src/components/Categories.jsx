import "./Categories.css";
export default function Categories({ setMenuOpen, categories,onSelectCategory }) {
  return (
    <div className="categories">
      <button className="menu-btn" onMouseEnter={() => setMenuOpen(true)}>
        ☰
      </button>

      {categories.map((categoria) => (
        <p key={categoria.id} onClick={() => onSelectCategory(categoria.id)}  className="category-item">
          {categoria.name}
         
        </p>
      ))}
    </div>
  );
}
