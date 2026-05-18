import React, { useState } from "react";
import Footer from "../components/Footer.jsx";
import SideBar from "../components/SideBar.jsx";
import Header from "../components/Header.jsx";
import Categories from "../components/Categories.jsx";
import Carrusel from "../components/Carrusel.jsx";
import WhatsAppButton from "../components/WhatsAppButton.jsx";
import Us from "../components/Us.jsx";
/* import Banner from "./Banner.jsx"; */

export default function Site({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="site-container">
      <div className="sticky-header">
        {/* HEADER */}
        <Header />

        {/* SIDEBAR */}
        <SideBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <Categories setMenuOpen={setMenuOpen} />
      </div>
      {/* MAIN */}
      <main className="main">
        {children || (
          <>
            <Carrusel />
             <Us />
          </>
        )}
      </main>

      {/* FOOTER */}
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
