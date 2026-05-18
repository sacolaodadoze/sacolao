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
                Tudo começou em 1992 com coragem, pouca condição e muita vontade
                de trabalhar. Val e Elias eram um casal jovem, recém-casados,
                dispostos a construir algo com as próprias mãos. Antes do
                Sacolão, tentaram a sorte com uma pastelaria. Havia empenho,
                havia conhecimento — mas o negócio deu muito trabalho e pouco
                retorno. Quando surgiu a oportunidade de comprar um pequeno
                comércio de hortifruti, a decisão foi tomada com fé. “Foi uma
                porta aberta por Deus”, conta Val. “Deu tão certo que foi muito
                gostoso — a gente foi prosperando, foi fazendo junto.” E deu
                certo. Muito certo.
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
                Os primeiros anos foram duros. Acordar às cinco da manhã era
                rotina — e às vezes era preciso levar a filha mais velha junto
                para o trabalho. A primeira filha nasceu naquele mesmo ano de
                1992, a segunda em 2000. O Sacolão cresceu junto com a família.
                Elias assumiu as compras desde o início. Nos primeiros tempos, o
                tio Arnaldo — que tinha caminhão próprio — fazia o frete junto
                com Elias, como parceiro nessa logística inicial. A equipe
                interna foi se formando aos poucos: começaram apenas os dois
                fundadores, depois quatro colaboradores, depois seis, depois dez
                — e segue crescendo. O negócio foi crescendo, e chegou o dia em
                que compraram o próprio caminhão. Começaram num ponto alugado.
                Por volta de oito anos depois, compraram o primeiro prédio
                próprio. O segundo prédio próprio — onde o Sacolão está
                instalado até hoje — veio aos dezoito anos de história. Três
                endereços. Três saltos de confiança. E por trás de cada um
                desses saltos, pessoas. O Sacolão não chegou até aqui sozinho —
                cada colaborador que passou por essa casa deixou um pedaço da
                sua história aqui dentro. São eles que, dia após dia, carregam
                os valores da família para o atendimento, para a gôndola, para a
                mesa de cada cliente. O crescimento do Sacolão é, também, o
                crescimento deles.
              </p>
            </div>
          </div>

          <div className="history-block">
            <div className="history-image">
              <img src="/img/history/market-front.jpg" alt="A essência que nunca mudou" />
            </div>

            <div className="history-text">
              <h3>A essência que nunca mudou</h3>

              <p>
                O que fez o Sacolão crescer? Val tem uma resposta simples e
                honesta: **dedicação, qualidade e atendimento**. Ao longo dos
                anos, clientes se tornaram amigas. Pessoas que acompanharam o
                crescimento da família, que viram as filhas crescerem, que estão
                presentes até hoje. “Além dos clientes, a gente tem como grandes
                amigas”, diz Val. “Pessoas que visitaram minhas filhas, que a
                gente está junto até hoje. Isso pra mim é muito gratificante — é
                uma benção.”
              </p>
            </div>
          </div>

          <div className="history-block reverse">
            <div className="history-image">
              <img src="/img/history/fresh-products.jpg" alt="O sonho do produto limpo" />
            </div>

            <div className="history-text">
              <h3>'O sonho do produto limpo'</h3>

              <p>
                Em algum momento, surgiu um sonho simples e revolucionário para
                o setor: vender verdura limpa, lavada, pronta. Começaram com
                alface, rúcula e agrião. A ideia foi aceita pelos clientes de
                imediato. O que era um sonho virou padrão — e hoje o Sacolão
                oferece praticamente todos os produtos higienizados, com legumes
                picados e muito mais. Um detalhe que parece pequeno, mas conta
                uma história grande: **a família sempre pensou no cliente antes
                de pensar no processo.**
              </p>
            </div>
          </div>
          <div className="history-block">
            <div className="history-image">
              <img src="/img/history/market-front.jpg" alt="Uma nova geração, um novo impulso" />
            </div>

            <div className="history-text">
              <h3>Uma nova geração, um novo impulso</h3>

              <p>
                Depois de anos tocando o negócio com garra e tradição, uma nova
                força entrou em cena: Mayara, filha de Val e Elias, trouxe
                modernidade, gestão e tecnologia para uma operação que já era
                sólida. “A gente veio tocando”, lembra Val. “Mas depois que ela
                chegou — a modernidade, as tecnologias — isso a gente já não
                estava mais preparado para fazer. Ficamos mais seguros com
                alguém que entende.” Não foi ruptura. Foi evolução. A base
                construída com amor e suor pelos fundadores encontrou na filha o
                olhar estratégico para ir além.
              </p>
            </div>
          </div>

          <div className="history-block reverse">
            <div className="history-image">
              <img src="/img/history/fresh-products.jpg" alt="" />
            </div>

            <div className="history-text">
              <h3>Trinta e poucos anos depois</h3>

              <p>
                O Sacolão da Doze é hoje uma referência em Ourinhos. Não apenas
                pelo que vende, mas pelo que representa: uma família que apostou
                em algo com coragem, cuidou com amor e soube se reinventar sem
                perder a essência. “É gratificante você olhar pra trás e ver
                tudo que passou, e como foi”, reflete Val. Essa história ainda
                está sendo escrita…
              </p>
            </div>
          </div>
        </section>

        <h2 className="about-intro-title">Porque Sacolão da Doze </h2>
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

              <p></p>
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
