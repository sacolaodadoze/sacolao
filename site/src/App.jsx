import { useState } from "react";
import "././index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Site from "./pages/Site.jsx";
import ScrollToTop from "./components/ScrollToTop";
import AboutUs from "./pages/AboutUs.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Site />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
