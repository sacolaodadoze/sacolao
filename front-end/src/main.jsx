import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { NotificationProvider } from "./assets/context/NotificationContext.jsx";
import { AuthContext, AuthProvider } from "./assets/context/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <NotificationProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </NotificationProvider>
  </BrowserRouter>
);
