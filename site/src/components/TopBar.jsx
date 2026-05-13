/* import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import SupportAgentIcon from "@mui/icons-material/SupportAgent"; */
import "./TopBar.css";
export default function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-item">
        <span className="topbar-emoji">🚚</span>
        <span>Tempo de entrega entre 90 e 120 min</span>
      </div>

      <div className="topbar-divider"></div>

      <div className="topbar-item">
        <span className="topbar-emoji">🛒</span>
        <span>Taxa de entrega GRÁTIS acima de
          R$ 140,00</span>
      </div>

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
