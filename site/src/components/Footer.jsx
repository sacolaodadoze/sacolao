import React, { useEffect, useState } from "react";
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
import { apiFetch } from "../api/apiFetch.js";

export default function Footer() {
  const [settings, setSettings] = useState([]);
  const [deliverySettings, setDeliverySettings] = useState([]);
  //const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
    //setLoading(true);
    try {
      const res = await apiFetch("/api/settings");
      const data = await res.json();     

      if (data) {
        setSettings(data[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      //setLoading(false);
    }
  };

  const fetchDeliverySettings = async () => {   
    try {
      const res = await apiFetch("/api/delivery-settings");

      const data = await res.json();
      //console.log(data[0]);

      if (data) {
        setDeliverySettings(data[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      
    }
  };

  useEffect(() => {
    fetchSettings();
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
          <FmdGoodOutlined fontSize="large" className="location-icon" />
          {settings.address}
        </a>

        <p className="icone-tittle">
          {/* 📞 */}
          <LocalPhoneOutlined /> {settings.phone} <br />{" "}
          {settings.secondary_phone}
        </p>

        {/* 💬 */}
        <a
          className="icone-tittle"
          href={settings.whatsapp_url} /* "https://wa.me/14998242254" */
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="location-icon"
            src="/img/whatsApp.png"
            alt="WhatsApp"
          />
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
        <p>{deliverySettings.weekday_delivery_open_morning} às {deliverySettings.weekday_delivery_close_morning} 
          - {deliverySettings.weekday_delivery_open_afternoon} às {deliverySettings.weekday_delivery_close_afternoon}</p>
        <p style={{ textDecoration: "solid" }}>Sábado</p>
        <p>{deliverySettings.saturday_open_delivery} às {deliverySettings.saturday_close_delivery}</p>
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
