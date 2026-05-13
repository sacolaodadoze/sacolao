import { useState } from "react";

export default function Banner() {
  const [index, setIndex] = useState(0);

  const images = ["/img/carousel_1.png", "/img/carousel_2.png"];

  const next = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <section>
      <div className="hero-carousel">
        <img src={images[index]} alt="banner" />

        <button className="carousel-btn prev" onClick={prev}>
          ❮
        </button>
        <button className="carousel-btn next" onClick={next}>
          ❯
        </button>
      </div>

      <div className="carousel-dots">
          {images.map((_, index) => (
            <span
              key={index}
              className={`carousel-dot ${
                currentIndex === index ? "active" : ""
              }`}
              onClick={() => currentSlide(index)}
            ></span>
          ))}
        </div>
    </section>
  );
}
