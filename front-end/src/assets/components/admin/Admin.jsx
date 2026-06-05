import React, { useState } from "react";
import {SettingsForm} from "./SettingsForm";
import { DeliverySettingsForm } from "./DeliverySettingsForm";
import {DeliveryRatesForm} from "./DeliveryRates";
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import { Categories } from "./Categories";
//import "./admin.css";

const menuItems = [
  { name: "Produtos", icon:<InventoryIcon/> /* "📦" */ },
  { name: "Categorias", icon: <CategoryIcon /> /* "🗂️" */ },
  { name: "Promoções", icon:<ShoppingCartCheckoutIcon/> /* "💸" */ },
  { name: "Taxa", icon: "💱" },
  { name: "Agendamento", icon: <CalendarMonthIcon /> /* "📅"  */},
   { name: "Configuração", icon: <SettingsIcon /> /* "⚙️" */ },
];

export default function Admin() {
  const [active, setActive] = useState("Produtos");

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
       {/*  <div className="logo">Administración</div> */}

        <nav>
          {menuItems.map((item) => (
            <div
              key={item.name}
              className={`menu-item ${active === item.name ? "active" : ""}`}
              onClick={() => setActive(item.name)}
            >
              <span className="icon">{item.icon}</span>
              {item.name}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="main-content">
      {/*   <h1>{active}</h1>     */} 
        {active === "Configuração" && (
          <SettingsForm />
        )} 
          {active === "Agendamento" && (
          <DeliverySettingsForm />
        )} 
         {active === "Taxa" && (
          <DeliveryRatesForm />
        )}
          {active === "Categorias" && ( 
            <Categories />
          )}
      </main>
    </div>
  );
}