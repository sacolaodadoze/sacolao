import React, { useState } from "react";
import Footer from "../components/Footer.jsx";
import SideBar from "../components/SideBar.jsx";
import Header from "../components/Header.jsx";
import Categories from "../components/Categories.jsx";
import Carrusel from "../components/Carrusel.jsx";
import WhatsAppButton from "../components/WhatsAppButton.jsx";
/* import Banner from "./Banner.jsx"; */

export default function Site({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="site-container">
      {/* HEADER */}
      <Header />

      {/* SIDEBAR */}
      <SideBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <Categories setMenuOpen={setMenuOpen} />

      {/* MAIN */}
      <main className="main">{children || <Carrusel />}</main>

      {/* FOOTER */}
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
