import logo from "../img/logo.png";
import { LANG } from "../constants/languages.js";
import { NavLink } from "react-router-dom";
import { Import } from "./Import.jsx";

export function Header() {
  return (
    <>
      <header className="main-header">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-img" />
          <span>{LANG.HEADER.SITE}</span>
        </div>

        <div className="header-right">
          {/*  <select className="language-select">
                <option value="it">🇮🇹 Italiano</option>
                <option value="en">🇬🇧 English</option>
                <option value="es">🇪🇸 Español</option>
           </select> */}
          <a href="#" className="btn-login">
            {LANG.HEADER.LOGGIN}
          </a>
        </div>
      </header>

      <nav className="sub-menu">
        <div className="nav-links">
          <NavLink to="/" end className="nav-link"> {/* prop 'end' en la ruta raíz para que no esté siempre activo */}
            Inicio
          </NavLink>
          <NavLink to="/orders" className="nav-link"> {LANG.NAV.PEDIDOS}</NavLink>
          <NavLink to="/order/manage" className="nav-link">
           {LANG.NAV.MANAGE}
          </NavLink>
          <NavLink to="https://app.vuupt.com/login" target="_blank" rel="noopener noreferrer" className="nav-link">
             {LANG.NAV.VUUPT}
          </NavLink>
          <NavLink to="/cardapio" className="nav-link">
              {LANG.NAV.CARDAPIO}
          </NavLink>
        </div>
        <div style={{ marginLeft: "auto", marginRight: "-1.5rem" }}>
          <Import />
        </div>
      </nav>
    </>
  );
}
