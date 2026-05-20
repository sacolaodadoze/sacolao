import logo from "/img/logo/logo.png";
import SearchIcon from "@mui/icons-material/Search";
import "./Header.css";

import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import TopBar from "./TopBar";

export default function Header() {
  return (
    <header className="header">
      <TopBar />
      <div className="logo-container">
        <Link to="/">
          {" "}
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
        Sacolão da Doze
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
            marginTop: "-2px",
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
      </div>

      {/* <div className="cart">🛒 (2)</div>
      <br /> */}
    </header>
  );
}
