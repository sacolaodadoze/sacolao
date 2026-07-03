import { useState } from "react";
import logo from "/img/logo/logo.png";
import SearchIcon from "@mui/icons-material/Search";
import "./Header.css";

import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import TopBar from "./TopBar";
import { useContext } from "react";
import { SettingsContext } from "../context/SettingsContext.jsx";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import { Drawer } from "@mui/material";
import { useCart } from "../context/CartContext.jsx";
import { CartDrawer } from "./Cart.jsx";

export default function Header(/* {settings} */) {
  const settings = useContext(SettingsContext);
  const [openCart, setOpenCart] = useState(false);

  const { cartItems } = useCart(); 

  if (!settings) return null;
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="header">
      <TopBar /*  settings={settings} */ />
      <div className="logo-container">
        <Link to="/">
          {" "}
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
        {settings.business_name || "Sacolão da Doze"}
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Nome do produto..."
          className="search"
        />
        <Button
          sx={{
            backgroundColor: "#f28c28",
            marginTop: "-1px",
            borderRadius: "0 12px 12px 0",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
          variant="contained"
          startIcon={<SearchIcon />}
        >
          Buscar
        </Button>

        {/*  <span className="search-icon">🔍</span> */}
        <p className="whatsapp-notice">🛒{settings.info}</p>
      </div>

      <div className="cart">
        {/* 🛒 (2) */}
        <Badge badgeContent={totalItems} color="error">
          <ShoppingCartIcon onClick={() => setOpenCart(true)} />
        </Badge>
      </div>
      <br />

      <CartDrawer
        open={openCart}
        onClose={() => setOpenCart(false)} 
        totalItems={totalItems}
      />
      {/* <Drawer anchor="right" open={openCart} onClose={() => setOpenCart(false)}>
        <CartDrawer />
      </Drawer> */}
    </header>
  );
}
