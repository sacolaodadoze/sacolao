import "./Categories.css";
export default function Categories({
  setMenuOpen,
  categories,
  onSelectCategory,
  onSelectParent,
}) {
  return (
    <div className="categories">
      <button className="menu-btn" onMouseEnter={() => setMenuOpen(true)}>
        ☰
      </button>

      {categories.map((categoria) => (
        <p
          className="category-item"
          key={categoria.id}
          onClick={() => {
           // console.log(categoria.children);
            if (categoria.children?.length > 0) {
              // Ir al bloque Merceria o a la primera hija
             //onSelectCategory(categoria.children[0].id);
             onSelectParent(categoria);
            } else {
              onSelectCategory(categoria.id);
            }
          }}
        >
          {categoria.name}
        </p>
      ))}
    </div>
  );
}
