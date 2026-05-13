import React, { useState } from "react";
import "./AboutUs.css";
import Footer from "../components/Footer.jsx";
import SideBar from "../components/SideBar.jsx";
import Header from "../components/Header.jsx";
import Categories from "../components/Categories.jsx";
import Carrusel from "../components/Carrusel.jsx";
/* import Banner from "./Banner.jsx"; */

export default function AboutUs() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="site-container">
      {/* HEADER */}
      <Header />

      {/* SIDEBAR */}
      <SideBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <Categories setMenuOpen={setMenuOpen} />

      {/* MAIN */}
      <div className="about-page">
        {/* Banner */}
        <section className="about-banner">
          <div className="about-overlay">
            <h1>Frescura y calidad todos los días</h1>

            <p>
             Produtos frescos, entrega rápida e o melhor serviço para todos os lares.
            </p>
          </div>
        </section>

        {/* Intro */}
        <section className="about-intro">
          <h2>¿Quem Somos?</h2>

          <p>
            Somos um mercado comprometido em oferecer frutas, verduras e
            produtos frescos da melhor qualidade, levando conveniência e rapidez
            diretamente para sua casa.
          </p>
        </section>

        {/* Cards */}
        <section className="about-cards">
          <div className="about-card">
            <img src="/img/fresh-products.jpg" alt="" />

            <div className="card-content">
              <h3>Produtos Frescos</h3>

              <p>
                Selecionamos frutas e verduras frescas diariamente para garantir
                qualidade e sabor.
              </p>
            </div>
          </div>

          <div className="about-card">
            <img src="/img/cards/prontas_1.jpg" alt="" />

            <div className="card-content">
              <h3>Produtos Prontos</h3>

              <p>Entregamos seus pedidos prontos para seu conforto.</p>
            </div>
          </div>

          <div className="about-card">
            <img src="/img/cards/varidade.jpg" alt="" />

            <div className="card-content">
              <h3>Grande variedade</h3>

              <p>
                Contamos com uma ampla variedade de produtos para atender todas
                as necessidades da sua família.
              </p>
            </div>
          </div>

          <div className="about-card">
            <img src="/img/cards/delivery.jpg" alt="" />

            <div className="card-content">
              <h3>Entrega Rápida</h3>

              <p>
              Entregamos seus pedidos na sua porta com rapidez e segurança, garantindo que seus produtos cheguem frescos e em perfeitas condições.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/*   <main className="main">
        <div className="banner">
           <div className="about-overlay">
            
           </div>
         {/*  <img src="/img/mercado_1.jpg" alt="Mercado" /> */}
      {/*  </div> */}
      {/* <p>Existimos para facilitar a alimentação saudável na vida das pessoas e tornar os produtos acessíveis para nossos clientes.</p>
         <p>Somos um sacolão online dedicado a oferecer frutas, hortaliças e bebidas frescas e de alta qualidade.
             Nosso compromisso é proporcionar uma experiência de compra conveniente e satisfatória para nossos clientes, 
             garantindo que recebam produtos frescos diretamente em suas casas. Valorizamos a qualidade, a sustentabilidade e 
             o atendimento ao cliente, buscando sempre superar as expectativas dos nossos consumidores.</p> */}
      {/*  </main> */}

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
