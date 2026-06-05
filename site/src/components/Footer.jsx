import { Link } from "react-router-dom";
import "./Footer.css";
import {
  InfoOutlined,
  WatchLaterOutlined,
  FmdGoodOutlined,
  PermPhoneMsgOutlined,
  NoteAltOutlined,
  LocalPhoneOutlined,
  WhatsApp,
} from "@mui/icons-material";

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <h3>Sacolão da Doze</h3>
        {/* 📍 */}
        <a
          className="icone-tittle"
          href="https://www.google.com/maps?q=-22.9749716,-49.8767675&z=17&hl=pt-BR"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FmdGoodOutlined /* fontSize="medium" */ className="location-icon" /> Rua
          Doze de Outubro, 630 <br /> Vila Margarida, Ourinhos- SP
        </a>

        <p className="icone-tittle">
          {/* 📞 */}
          <LocalPhoneOutlined /* fontSize="medium" */ /> +(14) 3322 - 2152 <br /> +(14) 3335 - 6129
        </p>

        {/* 💬 */}
        <a
          className="icone-tittle"
          href="https://wa.me/14998242254"
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className="location-icon">
           <WhatsApp  /* fontSize="medium" */  /* className="whatsapp-icon" */ />
          </p>
            
            {/* src="/img/whatsApp.png"
            alt="WhatsApp" */}
         
          +(14) 99824 - 2254
        </a>
      </div>

      {/* TODO: poner luego las categorias */}

      {/*    <div>
        <h4>Categorías</h4>
        <p>Frutas</p>
        <p>Hortaliças</p>
        <p>Bebidas</p>
        
      </div> */}

      <div>
        <h4>
          {" "}
          <WatchLaterOutlined /* sx={{marginTop: 1}} */ /> Horário
        </h4>
        <p style={{ textDecoration: "solid" }}>Segunda-feira a Sexta-feira</p>
        <p>08:00 às 13:00 - 15:00 às 18:30</p>
        <p style={{ textDecoration: "solid" }}>Sábado</p>
        <p>08:00 às 16:00</p>
        <p style={{ textDecoration: "solid" }}>Domingos e Feriados</p>
        <p>08:00 às 12:00</p>
      </div>

      <div>
        <h4>
          {" "}
          <NoteAltOutlined /> Agendamento de entrega
        </h4>
        <p style={{ textDecoration: "solid" }}>Segunda-feira a Sexta-feira</p>
        <p>09:00 às 12:30 - 15:30 às 17:30</p>
        <p style={{ textDecoration: "solid" }}>Sábado</p>
        <p>09:00 às 12:30</p>
         <p style={{ textDecoration: "solid" }}>Domingos</p>
        <p>Não fazemos entregas</p>
      </div>

      <div>
        <h4 >
          <Link to="/about" className="footer-link"  onClick={() => window.scrollTo(0, 0)}>
            <InfoOutlined /> Quem somos
          </Link>
        </h4>
        <p>
          Siga-nos
          <Link
            to="https://www.instagram.com/sacolaodadoze/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="img-redes"
              src="/img/instagram.png"
              alt="Instagram"
            />
          </Link>
        </p>

        {/*  <Link
          to="https://www.facebook.com/sacolaodadoze"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="img-redes" src="/img/facebook.png" alt="Facebook" />
        </Link> */}
      </div>
    </footer>
  );
}
