import React, { useState } from "react";
import "./AboutUs.css";
import Footer from "../components/Footer.jsx";
import SideBar from "../components/SideBar.jsx";
import Header from "../components/Header.jsx";
import Categories from "../components/Categories.jsx";
import Carrusel from "../components/Carrusel.jsx";
import Site from "./Site.jsx";
/* import Banner from "./Banner.jsx"; */

export default function AboutUs() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Site>
      <div className="about-page">
        {/* Banner */}
        <section className="about-banner">
          <div className="about-overlay">
            <h1>Frescor e qualidade todos os dias</h1>

            <p>
              Produtos frescos, entrega rápida e o melhor serviço para todos os
              lares.
            </p>
          </div>
        </section>

        {/* Intro */}
        {/*  <section className="about-intro">
          <h2>Nossa história</h2>

          <p>
            Somos um mercado comprometido em oferecer frutas, verduras e
            produtos frescos da melhor qualidade, levando conveniência e rapidez
            diretamente para sua casa.
          </p>
        </section> */}

        <section className="market-history">
          {/*  <h2 className="about-intro-title">Nossa história</h2> */}

          <div className="history-block">
            <div className="history-image">
              <img src="/img/history/1.jpeg" alt="Uma porta aberta por Deus" />
            </div>

            <div className="history-text">
              <h3>Uma porta aberta por Deus</h3>

              <p>
                Tudo começou em 1992, em uma pequena quitanda na Rua Doze de
                Outubro, na cidade de Ourinhos/SP. Val e Elias, um casal jovem e
                muito trabalhador, viram naquela oportunidade uma “porta aberta
                por Deus”, como costuma contar Val sobre esse início. O começo
                foi duro: às 5h da manhã, Val já saia com a filha mais velha
                para abrir a loja, enquanto Elias cuidava das compras, dividindo
                o frete dos produtos com o Tio Arnaldo, que os ajudou muito
                naquela época.
              </p>
            </div>
          </div>

          <div className="history-block reverse">
            <div className="history-image">
              <img src="/img/history/2.jpeg" alt="Tijolo por tijolo" />
            </div>

            <div className="history-text">
              <h3>Tijolo por tijolo</h3>

              <p>
                Com muito esforço e a medida que a quitanda crescia, eles
                contrataram os primeiros colaboradores e se mudaram para um novo
                prédio, onde se fixaram por 10 anos. O segundo prédio, onde o
                Sacolão está instalado até hoje, veio aos dezoito anos de
                história. Nesta época, a equipe já havia crescido para oito
                pessoas, e o time segue aumentando. Cada colaborador que passou
                e passa por essa casa deixa um pedaço da sua história aqui
                dentro. O segredo desse crescimento? Uma resposta simples:
                Dedicação, qualidade e atendimento. Foi dessa base sólida que
                surgiu um sonho simples que revolucionou o hortifrúti local na
                época: vender verduras já limpas, lavadas e prontas. O que
                começou com a alface, a rúcula e o agrião, virou padrão. Um
                cuidado que nasceu simples, mas que reflete um propósito
                gigante: a nossa missão de facilitar a alimentação saudável na
                vida das pessoas com excelência e praticidade.
              </p>
            </div>
          </div>
   
   <div className="history-block">
            <div className="history-image">
              <img
                src="/img/history/nova_geracao.png"
                alt="Uma nova geração, um novo impulso"
              />
            </div>

            <div className="history-text">
              <h3>Uma nova geração, um novo impulso</h3>

              <p>
                Depois de anos tocando o negócio com garra e tradição, o futuro
                ganhou um novo impulso com a chegada da Mayara, a filha que
                testemunhou os momentos duros de dedicação e trabalho dos pais.
                Ela trouxe modernidade, gestão e tecnologia para uma operação
                que já era sólida. “A gente veio tocando”, lembra Val, “mas a
                modernidade… a gente já não estava preparado. Ficamos mais
                seguros com alguém que entende”. Não foi uma ruptura, foi
                evolução. O Sacolão da Doze é, hoje, uma referência que vai além
                do comércio; representa uma família que apostou com coragem,
                cuidou com amor e soube se reinventar sem perder a essência. “É
                gratificante olhar para trás”, reflete Val. Uma linda história
                que continua sendo escrita...
              </p>
            </div>
          </div>
        </section>

        <h2 className="about-intro-title">Por que Sacolão da Doze ? </h2>
        {/* Cards */}
        <section className="about-cards">
          <div className="about-card">
            <img src="/img/cards/prontos.jpeg" alt="" />

            <div className="card-content">
              <h3>Produtos Prontos</h3>

              <p>Entregamos seus pedidos prontos para seu conforto.</p>
            </div>
          </div>

          <div className="about-card">
            <img src="/img/cards/massa_post.png" alt="" />
            <div className="card-content">
              <h3>Massas</h3>

              <p>Sinta o verdadeiro sabor da massa fresca.Preparadas todos os dias com ingredientes de alta qualidade.</p>
            </div>
          </div>

          <div className="about-card">
            <img src="/img/cards/frescos.png" alt="" />
            <div className="card-content">
              <h3>Produtos Frescos</h3>

              <p>
                Selecionamos frutas e verduras frescas diariamente para garantir
                qualidade e sabor.
              </p>
            </div>
          </div>

          <div className="about-card">
            <img src="/img/cards/variedade.jpeg" alt="" />

            <div className="card-content">
              <h3>Grande variedade</h3>

              <p>
                Contamos com uma ampla variedade de produtos para atender todas
                as necessidades da sua família.
              </p>
            </div>
          </div>

          {/*    <div className="about-card">
            <img src="/img/cards/delivery.jpg" alt="" />

            <div className="card-content">
              <h3>Entrega Rápida</h3>

              <p>
                Entregamos seus pedidos na sua porta com rapidez e segurança,
                garantindo que seus produtos cheguem frescos e em perfeitas
                condições.
              </p>
            </div>
          </div> */}
        </section>
      </div>
    </Site>
  );
}
