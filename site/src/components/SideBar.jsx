import { useRef, useEffect, useState } from "react";
import "./SideBar.css";
export default function SideBar({
  menuOpen,
  setMenuOpen,
  categories,
  headerHeight,
  onSelectCategory,
}) {
  const categoryRefs = useRef({});
  const getOffsetTop = (element) => {
    let top = 0;
    while (element) {
      top += element.offsetTop;
      element = element.offsetParent;
    }
    return top;
  };

  return (
    <>
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <span>Categorías</span>
          <button onClick={() => setMenuOpen(false)}>✕</button>
        </div>

        <nav>
          {categories.map((category) => (
            <div key={category.id} className="sidebar-category">
              {/* Categoría principal */}
              <p
                className="parent-category"
                onClick={() => {
                  onSelectCategory(category.id);
                  setMenuOpen(false);
                }}
              >
                {category.name}
              </p>

              {/* Subcategorías */}
              {category.children?.length > 0 && (
                <div className="subcategory-list">
                  {category.children.map((child) => (
                    <p
                      key={child.id}
                      className="subcategory"
                      onClick={() => {
                        onSelectCategory(child.id);
                        setMenuOpen(false);
                      }}
                    >
                      {child.name}
                    </p>
                  ))}
                </div>
              )}
            </div>
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
