import React from "react";
import { Outlet ,Route,Routes,BrowserRouter} from "react-router-dom";
import "./App.css";

import { Header } from "./assets/components/Header.jsx";
import { OrderList } from "./assets/components/OrderList.jsx";
import { OrderManage } from "./assets/components/OrderManage.jsx";


// 1. Creamos un Layout para que el Header no se recargue nunca
const Layout = () => {
  return (
    <>
      <Header />
      <main style={{ padding: "20px" }}>
        <Outlet /> {/* Aquí es donde React Router "inyecta" la página actual */}
      </main>
    </>
  );
};
// 2. Componente de ejemplo para el Home
const Home = () => <h1>Bienvenido al Sistema de Gestión</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Usamos el Layout como padre de todas las rutas internas */}
        <Route path="/" element={<Layout />}>
           <Route index element={<Home />} /> 
          <Route path="orders" element={<OrderList />} />
          <Route path="order/manage" element={<OrderManage />} />
          {/* Aquí puedes añadir más rutas: path="clientes", path="perfil", etc. */}
        </Route>

        {/* Ruta para el Login (sin Header) */}
        <Route path="/login" element={<div>Página de Login</div>} />
      </Routes>
    </BrowserRouter>
  );
}

/* function App() {

  return (
    <>
    <Header/>
    <Order/>
    </>
    
  )
}*/

export default App;
