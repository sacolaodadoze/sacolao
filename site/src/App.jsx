import { useState } from "react";
import "././index.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Site from "./pages/Site.jsx";
import ScrollToTop from "./components/ScrollToTop";
import AboutUs from "./pages/AboutUs.jsx";

function App() {
  return (
    <>
      <HashRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Site />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
