import { Link } from "react-router-dom";
import "./Footer.css";
import {
  InfoOutlined,
  WatchLaterOutlined,
  FmdGoodOutlined,  
  PermPhoneMsgOutlined,
  NoteAltOutlined,
  LocalPhoneOutlined
} from '@mui/icons-material';


export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <h3>Sacolão da Doze</h3>
        {/*  <p c>
          {/* 📍 */}
        {/*  <FmdGoodOutlinedIcon /> Rua Doze de Outubro, 630 <br /> Vila Margarida, Ourinhos- SP
        </p> */}
        <a
          className="icone-tittle"
          href="https://www.google.com/maps?q=-22.9749716,-49.8767675&z=17&hl=pt-BR"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FmdGoodOutlined fontSize="large" className="location-icon" /> Rua
          Doze de Outubro, 630 <br /> Vila Margarida, Ourinhos- SP
        </a>

        <p className="icone-tittle">
          {/* 📞 */}
          <LocalPhoneOutlined /> (14)3322-2152 ou (14)3335-6129  (14) 998242254
        </p>
        <p className="icone-tittle">
          {/* 💬 */}
          <img
            className="icone-tittle"
            src="/img/whatsApp.png"
            alt="WhatsApp"
          />{" "}
          + 55 14 3335-6129
        </p>
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
          <WatchLaterOutlined /* sx={{marginTop: 1}} */ /> Horario
        </h4>
        <p style={{ textDecoration: "solid" }}>Segunda-feira a Sexta-feira</p>
        <p>08:00 às 13:00 - 15:00 às 17:00</p>
        <p style={{ textDecoration: "solid" }}>Sábado</p>
        <p>08:00 às 16:00</p>
        <p style={{ textDecoration: "solid" }}>Domingo</p>
        <p>08:00 às 12:00</p>
      </div>

      <div>
        <h4>
          {" "}
          <NoteAltOutlined /> Agendamento
        </h4>
        <p style={{ textDecoration: "solid" }}>Segunda-feira a Sexta-feira</p>
        <p>09:00 às 12:30 - 15:30 às 17:30</p>
        <p style={{ textDecoration: "solid" }}>Sábado</p>
        <p>09:00 às 12:30</p>
      </div>

      <div>
       <Link to="/about"> <h4>
          {" "}
          <InfoOutlined /> Quem somos
        </h4>
        </Link>
       {/*  <Link to="/about">{/* ℹ️  Nossa historia</Link> */}
        <p>Siga-nos</p>
        <Link
          to="https://www.instagram.com/sacolaodadoze/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="img-redes" src="/img/instagram.png" alt="Instagram" />
        </Link>
        <Link
          to="https://www.facebook.com/sacolaodadoze"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="img-redes" src="/img/facebook.png" alt="Facebook" />
        </Link>
      </div>
    </footer>
  );
}
