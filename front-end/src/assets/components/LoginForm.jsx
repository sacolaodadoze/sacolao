import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

export function LoginForm() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(user, password);
     // alert("Login exitoso!")
    } catch (err) {
      //TODO manejar el error
      console.error(err);
      //alert("Login falló");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Usuario" value={user} onChange={e => setUser(e.target.value)} required />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  );
}
