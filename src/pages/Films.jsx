import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/films.css";
import FilmCard from "../components/FilmCard";
import filmsHero from "../assets/films.png";

export default function Films() {
  const [films, setFilms] = useState([]);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    API.get("/movies").then((res) => {
      setFilms(res.data);
    });
  }, []);

  // detect scroll
  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="films-page">
        {/* HERO */}
        <section className="films-hero">
          <img src={filmsHero} alt="Our Films" className="films-hero-img" />
        </section>

        {/* MOVIES */}
        <section className="white-section page">
          <div className="films-grid">
            {films.map((film) => (
              <FilmCard
                key={film.id}
                id={film.id}
                title={film.title}
                year={film.year}
                image={film.poster_url}
              />
            ))}
          </div>
        </section>
      </div>
      {/* SCROLL TO TOP */}
      {showTop && (
        <button className="scroll-top-btn" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </>
  );
}
