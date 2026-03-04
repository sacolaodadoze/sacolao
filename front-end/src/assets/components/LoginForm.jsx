import "./Login.css";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";


export function LoginForm() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const { loadingLogin,loginUser } = useContext(AuthContext);


  const handleSubmit = async (e) => {
    e.preventDefault();  
      await loginUser(user, password);
  }
       
  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-header">
          <i className="fas fa-seedling login-icon"></i>
          <h2>Gestão de Pedidos</h2>
          <p>Por favor, entre com suas credenciais</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-user">Usuário</label>
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
            <label htmlFor="login-password">Senha</label>
            <input
              type="password"
              id="login-password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {/* TODO Cuando haga el registrar user */}
           <div className="forgot-password">
            <button
              type="button"
              onClick={() =>
                alert(
                  "Para redefinir sua senha, por favor, contate o administrador.",
                )
              }
            >
              Esqueceu sua senha?
            </button>
          </div>

          <button type="submit" className="login-button" disabled={loadingLogin}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
