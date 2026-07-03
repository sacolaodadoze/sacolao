import React, { useState, useEffect } from "react";
import Footer from "../components/Footer.jsx";
import SideBar from "../components/SideBar.jsx";
import Header from "../components/Header.jsx";
import Categories from "../components/Categories.jsx";
import Carrusel from "../components/Carrusel.jsx";
import { Products } from "./Products.jsx";
import WhatsAppButton from "../components/WhatsAppButton.jsx";
import Us from "../components/Us.jsx";
import { apiFetch } from "../api/apiFetch.js";
import { Loader } from "../components/Loader.jsx";
/* import Banner from "./Banner.jsx"; */

export default function Site({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
 // const [settings, setSettings] = useState([]);
 // const [loading, setLoading] = useState(false);

/*   useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await apiFetch("/api/settings");
        const data = await res.json();
        console.log(data);
        if (data) {
          setSettings(data[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []); */

 /*  if (!loading) {
    return <Loader />;
  } */

  return (
    <div className="site-container">
      <div className="sticky-header">
        {/* HEADER */}
        <Header /* settings={settings} */ />

        {/* SIDEBAR */}
        <SideBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <Categories setMenuOpen={setMenuOpen} />
      </div>
      {/* MAIN */}
      <main className="main">
        {children || (
          <>
            <Carrusel />
            <Products/>
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
