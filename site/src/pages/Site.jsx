import React, { useState, useEffect, useRef } from "react";
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
import { useQuery } from "@tanstack/react-query";
/* import Banner from "./Banner.jsx"; */

export default function Site({ children }) {
  const stickyHeaderRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // const [settings, setSettings] = useState([]);
  // const [loading, setLoading] = useState(false);

  //Altura del Header para ajustar el scroll de las categorias
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (stickyHeaderRef.current) {
        setHeaderHeight(stickyHeaderRef.current.offsetHeight);
      }
    };

    updateHeaderHeight(); // al cargar

    window.addEventListener("resize", updateHeaderHeight);

    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  const fetchCategories = async () => {
    const res = await apiFetch("/api/store/categories");
    const data = await res.json();
    return data.data ?? data;
  };

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: Infinity,
  });
  //console.log("categories",categories)

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
      <div className="sticky-header" ref={stickyHeaderRef}>
        {/* HEADER */}
        <Header />

        {/* SIDEBAR */}
        <SideBar
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          categories={categories}
        />

        <Categories
          setMenuOpen={setMenuOpen}
          categories={categories}
          onSelectCategory={setSelectedCategory}
        />
      </div>
      {/* MAIN */}
      <main className="main">
        {children || (
          <>
            <Carrusel />
            <Products
              selectedCategory={selectedCategory}
              headerHeight={headerHeight}
            />
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
