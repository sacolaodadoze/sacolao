import React, { useState } from "react";
import Footer from "./Footer";
import SideBar from "./SideBar";
import Header from "./Header";
import Categories from "./Categories";

export default function Site({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="site-container">
      {/* HEADER */}

      <Header/>
      {/* SIDEBAR */}
      <SideBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <Categories setMenuOpen={setMenuOpen}  />

      {/* MAIN */}
      <main className="main">{children || <p>Contenido aquí</p>}</main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
