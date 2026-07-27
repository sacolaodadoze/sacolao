import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import {
  InfoOutlined,
  WatchLaterOutlined,
  FmdGoodOutlined,
  PermPhoneMsgOutlined,
  NoteAltOutlined,
  LocalPhoneOutlined,
} from "@mui/icons-material";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { apiFetch } from "../api/apiFetch.js";
import { SettingsContext } from "../context/SettingsContext.jsx";

export default function Footer() {
  const settings = useContext(SettingsContext);
  
  const [deliverySettings, setDeliverySettings] = useState([]); 

  const fetchDeliverySettings = async () => {
    try {
      const res = await apiFetch("/api/store/delivery-settings");

      const data = await res.json();
      // console.log(data);
      if (data) {
        setDeliverySettings(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  useEffect(() => {
    //fetchSettings();
    fetchDeliverySettings();
  }, []);

  return (
    <footer className="footer">
      <div>
        <h3>Sacolão da Doze</h3>
        {/* 📍 */}
        <a
          className="icone-tittle"
          href={
            settings.google_maps_url
          } /* "https://www.google.com/maps?q=-22.9749716,-49.8767675&z=17&hl=pt-BR" */
          target="_blank"
          rel="noopener noreferrer"
        >
          <FmdGoodOutlined fontSize="medium" className="location-icon" />
          {settings.address}
        </a>

        <p className="icone-tittle">
          {/* 📞 */}
          <LocalPhoneOutlined fontSize="medium" />+ {settings.phone} <br /> +{" "}
          {settings.secondary_phone}
        </p>

        {/* 💬 */}
        <a
          className="icone-tittle"
          href={settings.whatsapp_url} /* "https://wa.me/14998242254" */
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon fontSize="medium" className="location-icon" />+{" "}
          {settings.whatsapp}
          {/*  +(14) 9982 - 42254 */}
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
        <p>
          {settings.weekday_open_morning} às {settings.weekday_close_morning} -{" "}
          {settings.weekday_open_afternoon} às{" "}
          {settings.weekday_close_afternoon}
        </p>
        <p style={{ textDecoration: "solid" }}>Sábado</p>
        <p>
          {settings.saturday_open} às {settings.saturday_close}
        </p>
        <p style={{ textDecoration: "solid" }}>Domingos e Feriados</p>
        <p>
          {settings.sunday_open} às {settings.sunday_close}
        </p>
      </div>

      <div>
        <h4>
          {/* Agendamento */}
          <NoteAltOutlined /> Agendamento de entrega
        </h4>
        <p style={{ textDecoration: "solid" }}>Segunda-feira a Sexta-feira</p>
        <p>
          {deliverySettings.weekday_delivery_open_morning} às{" "}
          {deliverySettings.weekday_delivery_close_morning}-{" "}
          {deliverySettings.weekday_delivery_open_afternoon} às{" "}
          {deliverySettings.weekday_delivery_close_afternoon}
        </p>
        <p style={{ textDecoration: "solid" }}>Sábado</p>
        <p>
          {deliverySettings.saturday_open_delivery} às{" "}
          {deliverySettings.saturday_close_delivery}
        </p>
      </div>

      <div>
        <h4>
          <Link
            to="/about"
            className="footer-link"
            onClick={() => window.scrollTo(0, 0)}
          >
            <InfoOutlined /> Quem somos
          </Link>
        </h4>
        <p>
          Siga-nos
          <Link
            to={
              settings.instagram
            } /* "https://www.instagram.com/sacolaodadoze/" */
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
