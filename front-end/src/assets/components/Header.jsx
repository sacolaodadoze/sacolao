import logo from "../img/logo.png";
import { LANG } from "../constants/languages.js";
import { NavLink } from "react-router-dom";
import { Import } from "./Import.jsx";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import UserMenu from "./UserMenu.jsx";

export function Header() {
  const { user, logoutUser } = useContext(AuthContext);

  /*  const logout = async () => {
    try {
      await apiFetch("/logout", { method: "POST" });
      onLogout(); // limpiar estado de usuario global
      console.log("Logout exitoso");
    } catch (error) {
      console.error("Error al hacer logout:", error);
    }
  }; */

  return (
    <>
      <header className="main-header">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-img" />
          <span>{LANG.HEADER.SITE}</span>
        </div>
        {user && (
          <div className="header-right">
            {/*  <select className="language-select">
                <option value="it">🇮🇹 Italiano</option>
                <option value="en">🇬🇧 English</option>
                <option value="es">🇪🇸 Español</option>
           </select> */}

            {/* <a href="#" className="btn-login">
            {LANG.HEADER.LOGGIN}
          </a> */}

            {/* <button className="btn-login" onClick={logoutUser}>
              <UserIcon/> {user.name} <br />
              Cerrar sesión
            </button> */}

            <UserMenu />
          </div>
        )}
      </header>

      <nav className="sub-menu">
        <div className="nav-links">
          <NavLink to="/" end className="nav-link">
            {" "}
            {/* prop 'end' en la ruta raíz para que no esté siempre activo */}
            Inicio
          </NavLink>
          <NavLink to="/orders" className="nav-link">
            {" "}
            {LANG.NAV.PEDIDOS}
          </NavLink>
          <NavLink to="/order/manage" className="nav-link">
            {LANG.NAV.MANAGE}
          </NavLink>
          <NavLink
            to="https://app.vuupt.com/login"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            {LANG.NAV.VUUPT}
          </NavLink>
          <NavLink
            to="https://cardapio.wifire.me/sacolaodadoze?utm_source=INSTAGRAM#"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
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
