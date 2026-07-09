import { useState, useContext } from "react";
import logo from "/img/logo/logo.png";
import SearchIcon from "@mui/icons-material/Search";
import "./Header.css";

import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import TopBar from "./TopBar";
import { SettingsContext } from "../context/SettingsContext.jsx";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import Badge from "@mui/material/Badge";
import { Drawer } from "@mui/material";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { CartDrawer } from "./Cart.jsx";

export default function Header(/* {settings} */) {
  const settings = useContext(SettingsContext);
  const [openCart, setOpenCart] = useState(false);

  const { cartItems } = useCart();

  const { isAuthenticated, customer, logout } = useAuth();
  const navigate = useNavigate();

  if (!settings) return null;
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const handleLogout = () => {
    logout(); // limpia el token y los datos del cliente del AuthContext y localStorage
    navigate("/login");
  };

  return (
    <header className="header">
      <TopBar />
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
        {isAuthenticated ? (
          <>
            <Button
              size="small"
              variant="text"
              startIcon={
                <AccountCircleIcon
                  sx={{
                    backgroundColor: "#f5f5f5",
                    color: "#14532d",
                    borderRadius: "12px",
                  }}
                />
              }
              onClick={handleLogout}
              sx={{ ml: 2, whiteSpace: "nowrap", color: "#f5f5f5 !important" }}
            >
              {customer?.name?.split(" ")[0]}{" "}
              {/* muestra solo el primer nombre */}
            </Button>

            <Badge
              badgeContent={totalItems}
              color="white"
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "var(--surface)",
                  color: "var(--primary)",
                },
              }}
            >
              <ShoppingCartIcon
                sx={{ cursor: "pointer" }}
                onClick={() => setOpenCart(true)}
              />
            </Badge>
          </>
        ) : (
          <Button
            size="small"
            variant="outlined"
            component={Link}
            to="/login"
            sx={{ ml: 2, whiteSpace: "nowrap", color: "#f5f5f5 !important" }}
          >
            Entre com seu login <br /> ou registre-se
          </Button>
        )}
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
