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

  const updateCustomer = (customerData) => {
  setCustomer(customerData);
  localStorage.setItem("customer", JSON.stringify(customerData));
};

  return (
    <AuthContext.Provider value={{ customer, token, login, logout,updateCustomer, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);