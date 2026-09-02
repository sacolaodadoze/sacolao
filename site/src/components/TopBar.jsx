/* import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import SupportAgentIcon from "@mui/icons-material/SupportAgent"; */
import { useContext } from "react";
import { SettingsContext } from "../context/SettingsContext";
import "./TopBar.css";
import { useState } from "react";
import Button from "@mui/material/Button";
import { DeliveryRatesModal } from "./DeliveryRatesModal.jsx";

export default function TopBar() {
  const { settings } = useContext(SettingsContext);
  const [ratesModalOpen, setRatesModalOpen] = useState(false);
  // console.log(settings);
  if (!settings) return null;
  return (
    <div className="topbar">
      <div className="topbar-item">
        <span className="topbar-emoji">🚚</span>
        <span>Tempo de entrega entre {settings.delivery_time} </span>
      </div>

      <div className="topbar-divider"></div>

      <div className="topbar-item">
        <span className="topbar-emoji">🛒</span>
        <span>{settings.free_rate}</span>
      </div>

      <div className="topbar-divider"></div>

      <div className="topbar-item">
        <button
          onClick={() => setRatesModalOpen(true)}
          className="topbar-item topbar-link"
        >
          <span className="topbar-emoji">📍</span>
          Taxa de entrega
        </button>
      </div>

      <DeliveryRatesModal
        open={ratesModalOpen}
        onClose={() => setRatesModalOpen(false)}
      />

      {/*  <div className="topbar-item">
          <LocalShippingIcon className="topbar-icon" />
          <span>Entrega en 30 minutos</span>
        </div>

        <div className="topbar-item">
          <ShoppingBagIcon className="topbar-icon" />
          <span>Delivery gratis desde $50</span>
        </div>

        <div className="topbar-item">
          <SupportAgentIcon className="topbar-icon" />
          <span>Atención todos los días</span>
        </div>

        {/* duplicado para loop infinito suave */}
      {/*<div className="topbar-item">
          <LocalShippingIcon className="topbar-icon" />
          <span>Entrega en 30 minutos</span>
        </div>

        <div className="topbar-item">
          <ShoppingBagIcon className="topbar-icon" />
          <span>Delivery gratis desde $50</span>
        </div>

      </div> */}
    </div>
  );
}
