import logo from "/img/logo/logo.png";
import SearchIcon from "@mui/icons-material/Search";
import "./Header.css";

import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import TopBar from "./TopBar";
import { useContext } from "react";
import { SettingsContext } from "../context/SettingsContext.jsx";

export default function Header(/* {settings} */) {
  const settings = useContext(SettingsContext);
  console.log(settings);
  if (!settings) return null;
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

      {/* <div className="cart">🛒 (2)</div>
      <br /> */}
    </header>
  );
}
