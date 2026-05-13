import "./WhatsAppButton.css";

//import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import WhatsApp from '/img/whats.png';

export default function WhatsAppButton() {

  return (
    <a
      href="https://wa.me/5355555555"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
    >
      <img src={WhatsApp} alt="WhatsApp" />
    </a>
  );
}