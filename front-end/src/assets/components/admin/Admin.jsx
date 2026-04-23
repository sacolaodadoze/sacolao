import React, { useState } from "react";
//import "./admin.css";

const menuItems = [
  { name: "Productos", icon: "📦" },
  { name: "Categorías", icon: "🗂️" },
  { name: "Promoções", icon: "💸" },
 /*  { name: "Configuración", icon: "⚙️" }, */
];

export default function Admin() {
  const [active, setActive] = useState("Productos");

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
       {/*  <div className="logo">Administración</div> */}

        <nav>
          {menuItems.map((item) => (
            <div
              key={item.name}
              className={`menu-item ${active === item.name ? "active" : ""}`}
              onClick={() => setActive(item.name)}
            >
              <span className="icon">{item.icon}</span>
              {item.name}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <h1>{active}</h1>
        <p>Aquí irá el contenido de {active}</p>
      </main>
    </div>
  );
}