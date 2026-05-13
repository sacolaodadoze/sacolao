import { useEffect, useState } from "react";
import "./Carrusel.css";

export default function Carrusel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    "/img/food/1.jpg",
    "/img/food/2.jpg",
    "/img/food/3.jpg",
    "/img/food/4.jpg",
  ];

  const moveCarousel = (direction) => {
    let newIndex = currentIndex + direction;

    if (newIndex < 0) newIndex = slides.length - 1;
    if (newIndex >= slides.length) newIndex = 0;

    setCurrentIndex(newIndex);
  };

  const currentSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {    
      moveCarousel(1);
    }, 4000);   
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <section className="carrusel-section" style={{ gridColumn: "span 1" }}>
      {/*  <h2 className="section-title">Carousel Immagini</h2> */}

      <div className="carousel-wrapper">
        <div
          className="carousel-inner"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            display: "flex",
            transition: "0.5s",
          }}
        >
          {slides.map((img, index) => (
            <div className="carousel-slide" key={index}>
              <img src={img} alt={`Slide ${index}`} />
            </div>
          ))}
        </div>

        <button className="carousel-btn prev" onClick={() => moveCarousel(-1)}>
          ❮
        </button>

        <button className="carousel-btn next" onClick={() => moveCarousel(1)}>
          ❯
        </button>

        <div className="carousel-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`carousel-dot ${
                currentIndex === index ? "active" : ""
              }`}
              onClick={() => currentSlide(index)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
}
