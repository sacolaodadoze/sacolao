import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { apiFetch } from "../api/apiFetch.js";
import { useNavigate } from "react-router-dom";

export function GoogleLoginButton() {
  const buttonRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: "100%",
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      const res = await apiFetch("/api/customer/login/google", {
        method: "POST",
        body: JSON.stringify({ credential: response.credential }),
      });

      if (!res.ok) throw new Error("Erro ao entrar com Google");

      const data = await res.json();
      login(data.customer, data.token);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  
  return <div ref={buttonRef} />;
}