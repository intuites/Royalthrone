import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";
import { FaChevronDown } from "react-icons/fa";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [filmsOpen, setFilmsOpen] = useState(false);
  const [films, setFilms] = useState([]);

  useEffect(() => {
    API.get("/movies").then((res) => setFilms(res.data));
  }, []);

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        ROYAL THRONE PRODUCTIONS
      </Link>

      <div
        className={`hamburger ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={`nav-links ${open ? "open" : ""}`}>
        {/* FILMS DROPDOWN */}
        <div className="nav-item films-hover">
          {/* <span className="nav-link">Films</span> */}
          <span className="nav-link films-link">
            Films <FaChevronDown className="dropdown-icon" />
          </span>

          <div className="films-dropdown">
            {films.map((film) => (
              <Link
                key={film.id}
                to={`/films/${film.id}`}
                onClick={() => setOpen(false)}
                className="film-drop-item"
              >
                <img src={film.poster_url} />
                <div>
                  <p>{film.title}</p>
                  <span>{film.year}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <Link to="/awards" onClick={() => setOpen(false)}>
          Awards
        </Link>

        <Link to="/about" onClick={() => setOpen(false)}>
          About
        </Link>

        <Link to="/pitch" className="pitch-btn" onClick={() => setOpen(false)}>
          Pitch Us
        </Link>
      </div>
    </nav>
  );
}
