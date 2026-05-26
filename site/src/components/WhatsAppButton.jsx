import "./WhatsAppButton.css";

//import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import WhatsApp from "/img/whats.png";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/14998242254"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
    >
      <span className="whatsapp-label">🛒 Faça seu pedido</span>
      <img src={WhatsApp} alt="WhatsApp" />
    </a>
  );
}
