import "./Login.css";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { LANG } from "../constants/languages.js";
import React from "react";
import logo from "../img/logo_loggin.png";

export function LoginForm() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const { loadingLogin, loginUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser(user, password);
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-header">
           <img src={logo} alt="Logo" className="logo-img" />
          <h2>{LANG.LOGGIN.WLOGGIN}</h2>
          <p>{ LANG.LOGGIN.CREDENTIAL}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-user">{LANG.LOGGIN.USER}</label>
            <input
              type="text"
              id="login-user"
              value={user}
              placeholder="Ex: ana.silva"
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">{LANG.LOGGIN.PASSWORD}</label>
            <input
              type="password"
              id="login-password"
              placeholder={LANG.LOGGIN.PLPASSWORD}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {/* TODO Cuando haga el registrar user */}
          <div className="forgot-password">
            <button type="button" onClick={() => alert(LANG.LOGGIN.ALERT)}>
              {LANG.LOGGIN.FORGOT}
            </button>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loadingLogin}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
