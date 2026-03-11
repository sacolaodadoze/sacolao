import { createContext, useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api/apiFetch.js";
import { LANG } from "../constants/languages.js";
import { useNotification } from "../context/NotificationContext.jsx";
import { showAlert } from "../helpers/alertHelper.js";
import Swal from "sweetalert2";
import { set } from "zod";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false); // para login / acciones
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  //validar si hay algun user logeado
  useEffect(() => {
    const checkAuth = async () => {
      const res = await apiFetch("/api/user");
     
      if(res.status === 401){
        setUser(null);
        setLoading(false);
        return;
      } 
      if (res.ok) {
         console.log("Respuesta de /api/user:", res);
        const data = await res.json();
        setUser(data);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // login
  const loginUser = async (name, password) => {
    try {
      setLoading(true);
      setProcessing(true);
      //  console.log("1. Pidiendo cookie...");
      await apiFetch("/sanctum/csrf-cookie"); // cookie CSRF

      //console.log("2. Enviando login...");
      const loginRes = await apiFetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ name: name, password }),
      });
      //console.log(loginRes);
      if (!loginRes.ok) {
        const errorData = await loginRes.json();
        throw new Error(errorData.message || "Login falló");
      }

      //console.log("3. Login exitoso, pidiendo usuario...")
      const userRes = await apiFetch("/api/user");
      if (!userRes.ok) {
        throw new Error(LANG.LOGGIN.ERROR);
        setLoading(false);
      }
      const loggedUser = await userRes.json();
      setUser(loggedUser);
      setLoading(false);
      // console.log("Redirigiendo a home...");
      navigate("/", { replace: true });
    } catch (error) {
      showNotification(error.message || LANG.LOGGIN.ERROR, "error"); // tu sistema de notificaciones
    } finally {
      setLoading(false);
      setProcessing(false);
    }
  };

  // logout
  const logoutUser = async () => {
    await apiFetch("/api/logout", { method: "POST" });
    setUser(null);
  };

  //Saber si el usuario tiene alguno de los roles necesarios para acceder a cierta función o ruta
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

//Carga inicial
  useEffect(() => {
    if (processing) {
      showAlert({
        title: LANG.LOGGIN.LOAD,
        text: LANG.LOGGIN.PREPARE,
        allowOutsideClick: false,
        showConfirmButton: false, 
        showLoading: true, 
      });
    } else {
      Swal.close();
    }
  }, [processing]);

  return (
    <AuthContext.Provider
      value={{ user, loading, loginUser, logoutUser, hasAnyRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};
