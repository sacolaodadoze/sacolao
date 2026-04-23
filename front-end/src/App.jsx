import React from "react";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Outlet, Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";
import loader from "./assets/loader.gif";

import { Header } from "./assets/components/Header.jsx";
import { OrderList } from "./assets/components/OrderList.jsx";
import { OrderManage } from "./assets/components/OrderManage.jsx";
import { LoginForm } from "./assets/components/LoginForm.jsx";
import { AuthContext } from "./assets/context/AuthContext.jsx";
import { showAlert } from "./assets/helpers/alertHelper.js";


//Componente para proteger rutas
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext); 
  //console.log({ user, loading });
  if (loading) {
    //return <div>Cargando sesión...</div>; // O un spinner/esqueleto
     return (
      <div className="flex-center" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
         {/* Aquí puedes poner un spinner de CSS o simplemente texto */}
         {/* <h2>Cargando...</h2>  //TODO: Cambiar por un spinner de CSS */}
         <img src={loader} alt="Carregando..." />;
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
};

// 1. Creamos un Layout para que el Header no se recargue nunca
const Layout = () => {
  return (
    <>
      <Header/>
      <main style={{ padding: "20px" }}>
        <Outlet /> {/* Aquí es donde React Router "inyecta" la página actual */}
      </main>
    </>
  );
};

//Componente de ejemplo para el Home
const Home = () => {
  const { user, loading } = useContext(AuthContext);
  return (
    <h1 className="page-title">
      Bem-vindo ao Sistema de Gestão de Pedidos
    </h1>
  );
};

function App() {
  return (   
      <Routes>
        {/* Usamos el Layout como padre de todas las rutas internas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="orders" element={<OrderList/>} />
          <Route path="order/manage" element={<OrderManage />} />
          {/* Aquí puedes añadir más rutas: path="clientes", path="perfil", etc. */}
        </Route>

        {/* Ruta para el Login (sin Header) */}
        <Route path="/login" element={<LoginForm/>} />
      </Routes>  
 
  );
}

export default App;
