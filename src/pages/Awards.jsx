import { useEffect, useState } from "react";
import API from "../services/api";
import awardsBanner from "../assets/awards-hero.png";
import "../styles/awards.css";

export default function Awards() {
  const [awards, setAwards] = useState([]);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    API.get("/awards").then((res) => setAwards(res.data));
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="awards-page">
        {/* HERO – UNCHANGED */}
        <section className="awards-hero">
          <img src={awardsBanner} className="awards-hero-img" alt="Awards" />
        </section>

        {/* AWARDS GRID */}
        <section className="awards-section">
          <div className="awards-grid">
            {awards.map((award) => (
              <div className="award-card" key={award.id}>
                {/* Poster */}
                <img
                  src={award.movies?.poster_url}
                  alt={award.award_name}
                  className="award-poster"
                />

                {/* Overlay */}
                <div className="award-overlay">
                  <span className="award-year">{award.year}</span>

                  <h3 className="award-title">{award.award_name}</h3>

                  <p className="award-movie">{award.movies?.title || ""}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {showTop && (
        <button
          className="scroll-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑
        </button>
      )}
    </>
  );
}
