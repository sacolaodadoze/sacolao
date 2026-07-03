// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(() => {
    try {
      const stored = localStorage.getItem("customer");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") ?? null);

  const login = (customerData, tokenData) => {
    setCustomer(customerData);
    setToken(tokenData);
    localStorage.setItem("customer", JSON.stringify(customerData));
    localStorage.setItem("token", tokenData);
  };

  const logout = () => {
    setCustomer(null);
    setToken(null);
    localStorage.removeItem("customer");
    localStorage.removeItem("token");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ customer, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);