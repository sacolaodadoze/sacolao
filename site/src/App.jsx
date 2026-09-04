import { useState } from "react";
import "././index.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Site from "./pages/Site.jsx";
import ScrollToTop from "./components/ScrollToTop";
import AboutUs from "./pages/AboutUs.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

function App() {
  return (
    <>
      <HashRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/*  <Route path="/" element={<Site />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/checkout" element={<Checkout />} /> */}
          <Route path="/" element={<Site />} />
          <Route path="/about" element={<AboutUs />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
