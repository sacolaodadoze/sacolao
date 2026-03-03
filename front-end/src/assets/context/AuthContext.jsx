import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api/apiFetch.js";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

  // login
  const loginUser = async (name, password) => {
    setLoading(true);
  //  console.log("1. Pidiendo cookie...");
    await apiFetch("/sanctum/csrf-cookie"); // cookie CSRF

//console.log("2. Enviando login...");
    const loginRes = await apiFetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ name:name, password }),
    });
//console.log(loginRes);
    if (!loginRes.ok) {
      const errorData = await loginRes.json();
      throw new Error(errorData.message || "Login falló");
    }

//console.log("3. Login exitoso, pidiendo usuario...")
    const userRes  = await apiFetch("/api/user");
     if (!userRes.ok) {
      throw new Error("No se pudo obtener el usuario");
    }
     const loggedUser = await userRes.json();
    setUser(loggedUser);
    setLoading(false);

   // console.log("Redirigiendo a home...");
      navigate("/", { replace: true });
  };
  //console.log("ok",user);

  // logout
  const logoutUser = async () => {
    await apiFetch("/api/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user,loading, loginUser, logoutUser }}>
     {/*  {children} */}
     {!loading ? children : <div className="spinner">Cargando aplicación...</div>}
    </AuthContext.Provider>
  );
};
