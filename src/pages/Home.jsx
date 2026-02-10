import "../styles/home.css";
import logo from "../assets/rtplogo.png";
import panchali from "../assets/films/panchali-pancha-patrika.jpeg";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import "../styles/awards.css";
import API from "../services/api";
import pstr from "../assets/psterimg.png";

import { Trophy, Globe, Film, Award } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const dragMoved = useRef(false);

  const sliderRef = useRef(null);

  // Drag state
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Auto-slide pause control
  const isPaused = useRef(false);
  const [showTop, setShowTop] = useState(false);
  const [awards, setAwards] = useState([]);

  useEffect(() => {
    API.get("/awards").then((res) => {
      setAwards(res.data);
    });
  }, []);

  // Real films data
  // const films = [
  //   { title: "Panchali Pancha Patrika", year: "2026", image: panchali },
  //   { title: "Baahubali The Epic", year: "2025", image: panchali },
  //   { title: "KGF", year: "2023", image: panchali },
  //   { title: "RRR", year: "2022", image: panchali },
  //   { title: "EEE", year: "2027", image: pstr },
  // ];
  const [films, setFilms] = useState([]);
  //here is useffect
  useEffect(() => {
    API.get("/movies").then((res) => {
      setFilms(res.data);
    });
  }, []);

  //another...
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 400) {
        setShowTop(true);
      } else {
        setShowTop(false);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Infinite loop slides:
  // [lastClone, ...films, firstClone]
  // const infiniteFilms = [films[films.length - 1], ...films, films[0]];
  const infiniteFilms =
    films.length > 0 ? [films[films.length - 1], ...films, films[0]] : [];

  // activeIndex refers to REAL films index (0..films.length-1)
  const [activeIndex, setActiveIndex] = useState(0);

  // Helper: get slide width
  const getSlideWidth = () => {
    const el = sliderRef.current;
    if (!el) return 0;
    return el.clientWidth; // because each slide = 100%
  };

  // Jump to real first slide on load (index = 1 in infinite array)
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const slideWidth = getSlideWidth();
    el.scrollLeft = slideWidth; // start at first real slide
  }, []);

  // Infinite loop scroll correction
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const onScroll = () => {
      const slideWidth = getSlideWidth();
      if (!slideWidth) return;

      const maxIndex = infiniteFilms.length - 1;
      const currentIndex = Math.round(el.scrollLeft / slideWidth);

      // If user reached the clone at the start (index 0)
      if (currentIndex === 0) {
        el.scrollLeft = slideWidth * (maxIndex - 1); // jump to last real slide
      }

      // If user reached the clone at the end (last index)
      if (currentIndex === maxIndex) {
        el.scrollLeft = slideWidth * 1; // jump to first real slide
      }

      // Update active dot (real index)
      let realIndex = currentIndex - 1;

      if (realIndex < 0) realIndex = films.length - 1;
      if (realIndex >= films.length) realIndex = 0;

      setActiveIndex(realIndex);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [infiniteFilms.length, films.length]);

  // Scroll to a real slide (dot click)
  const scrollToRealIndex = (realIndex) => {
    const el = sliderRef.current;
    if (!el) return;

    const slideWidth = getSlideWidth();
    el.scrollTo({
      left: slideWidth * (realIndex + 1), // +1 because of first clone
      behavior: "smooth",
    });
  };

  // ✅ AUTO SLIDE every 3 seconds
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const interval = setInterval(() => {
      if (isDown.current) return; // if dragging, don't auto-slide
      if (isPaused.current) return;

      const slideWidth = getSlideWidth();
      if (!slideWidth) return;

      // move to next slide
      el.scrollTo({
        left: el.scrollLeft + slideWidth,
        behavior: "smooth",
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Desktop + Mobile drag swipe
  // const onPointerDown = (e) => {
  //   const el = sliderRef.current;
  //   if (!el) return;

  //   isDown.current = true;
  //   isPaused.current = true; // pause auto slide while dragging
  //   el.classList.add("dragging");

  //   startX.current = e.pageX || e.touches?.[0]?.pageX || 0;
  //   scrollLeft.current = el.scrollLeft;
  // };
  const onPointerDown = (e) => {
    const el = sliderRef.current;
    if (!el) return;

    isDown.current = true;
    isPaused.current = true;
    dragMoved.current = false;

    el.classList.add("dragging");

    startX.current = e.pageX || e.touches?.[0]?.pageX || 0;
    scrollLeft.current = el.scrollLeft;
  };

  // const onPointerUp = () => {
  //   const el = sliderRef.current;
  //   if (!el) return;

  //   isDown.current = false;
  //   el.classList.remove("dragging");

  //   // Snap to nearest slide after drag end
  //   const slideWidth = getSlideWidth();
  //   const nearest = Math.round(el.scrollLeft / slideWidth);
  //   el.scrollTo({ left: nearest * slideWidth, behavior: "smooth" });

  //   // resume auto slide after 1 sec
  //   setTimeout(() => {
  //     isPaused.current = false;
  //   }, 1000);
  // };

  const onPointerUp = () => {
    const el = sliderRef.current;
    if (!el) return;

    isDown.current = false;
    el.classList.remove("dragging");

    const slideWidth = getSlideWidth();
    const nearest = Math.round(el.scrollLeft / slideWidth);
    el.scrollTo({ left: nearest * slideWidth, behavior: "smooth" });

    setTimeout(() => {
      isPaused.current = false;
    }, 800);
  };

  const onPointerLeave = () => {
    const el = sliderRef.current;
    if (!el) return;

    if (isDown.current) onPointerUp();
  };

  // const onPointerMove = (e) => {
  //   const el = sliderRef.current;
  //   if (!el) return;
  //   if (!isDown.current) return;

  //   const x = e.pageX || e.touches?.[0]?.pageX || 0;
  //   const walk = (x - startX.current) * 1.5;
  //   el.scrollLeft = scrollLeft.current - walk;
  // };
  const onPointerMove = (e) => {
    const el = sliderRef.current;
    if (!el || !isDown.current) return;

    const x = e.pageX || e.touches?.[0]?.pageX || 0;
    const walk = (x - startX.current) * 1.5;

    if (Math.abs(walk) > 6) {
      dragMoved.current = true; // user is dragging
    }

    el.scrollLeft = scrollLeft.current - walk;
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <img
          src={logo}
          alt="Royal Throne Productions Logo"
          className="hero-logo"
        />

        <div className="about-divider">
          <span className="divider-star"></span>
        </div>

        <h1>ROYAL THRONE PRODUCTIONS</h1>
        <p>Where Cinema Becomes Legacy</p>

        <div className="hero-buttons">
          <button className="primary">Book Tickets</button>

          <button className="outline" onClick={() => navigate("/films")}>
            Our Films
          </button>
        </div>
      </section>

      {/* FILMS CAROUSEL */}
      <section className="films-section white-section">
        <h2>Our Films</h2>
        <div className="about-divider"></div>

        <div className="films-carousel-wrap">
          <div
            className="films-carousel"
            ref={sliderRef}
            onMouseDown={onPointerDown}
            onMouseMove={onPointerMove}
            onMouseUp={onPointerUp}
            onMouseLeave={onPointerLeave}
            onTouchStart={onPointerDown}
            onTouchMove={onPointerMove}
            onTouchEnd={onPointerUp}
          >
            {infiniteFilms.map((film, index) => (
              <div className="home-film-slide" key={index}>
                <div className="home-film-card">
                  {/* <img
                    src={film.image}
                    alt={film.title}
                    className="home-film-poster"
                    draggable="false"
                  /> */}
                  <img
                    src={film.banner_url || film.poster_url}
                    alt={film.title}
                    className="home-film-poster"
                    draggable="false"
                    // onClick={() => navigate(`/films/${film.id}`)}
                    onClick={() => {
                      if (!dragMoved.current) {
                        navigate(`/films/${film.id}`);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DOTS */}
        {/* <div className="films-dots">
          {films.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === activeIndex ? "active" : ""}`}
              onClick={() => scrollToRealIndex(i)}
            />
          ))}
        </div> */}
      </section>

      {/* AWARDS */}
      {/* AWARDS */}
      {/* AWARDS */}
      <section className="white-section page awards-section">
        <h2>Awards</h2>
        <div className="about-divider"></div>

        <div className="home-awards-grid">
          {awards.map((award) => (
            <div className="home-award-card" key={award.id}>
              <img
                src={award.movies?.poster_url}
                alt={award.award_name}
                className="home-award-poster"
              />

              <div className="home-award-overlay">
                {award.year && (
                  <span className="home-award-year">{award.year}</span>
                )}

                <h3 className="home-award-title">{award.award_name}</h3>

                {award.movies?.title && (
                  <p className="home-award-movie">{award.movies.title}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {showTop && (
        <button className="scroll-top-btn" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </>
  );
}

// import "../styles/home.css";
// import logo from "../assets/rtplogo.png";
// import panchali from "../assets/films/panchali-pancha-patrika.jpeg";
// import { useNavigate } from "react-router-dom";
// import { useRef, useState, useEffect } from "react";
// import "../styles/awards.css";
// import pstr from "../assets/psterimg.png";
// import { Trophy, Globe, Film, Award } from "lucide-react";

// export default function Home() {
//   const navigate = useNavigate();

//   const sliderRef = useRef(null);

//   // Drag state
//   const isDown = useRef(false);
//   const startX = useRef(0);
//   const scrollLeft = useRef(0);

//   // Auto-slide pause control
//   const isPaused = useRef(false);

//   // Real films data
//   const films = [
//     { title: "Panchali Pancha Patrika", year: "2026", image: panchali },
//     { title: "Baahubali The Epic", year: "2025", image: panchali },
//     { title: "KGF", year: "2023", image: panchali },
//     { title: "RRR", year: "2022", image: panchali },
//     { title: "EEE", year: "2027", image: pstr },
//   ];

//   // Infinite loop slides:
//   // [lastClone, ...films, firstClone]
//   const infiniteFilms = [films[films.length - 1], ...films, films[0]];

//   // activeIndex refers to REAL films index (0..films.length-1)
//   const [activeIndex, setActiveIndex] = useState(0);

//   // Helper: get slide width
//   const getSlideWidth = () => {
//     const el = sliderRef.current;
//     if (!el) return 0;
//     return el.clientWidth; // because each slide = 100%
//   };

//   // Jump to real first slide on load (index = 1 in infinite array)
//   useEffect(() => {
//     const el = sliderRef.current;
//     if (!el) return;

//     const slideWidth = getSlideWidth();
//     el.scrollLeft = slideWidth; // start at first real slide
//   }, []);

//   // Infinite loop scroll correction
//   useEffect(() => {
//     const el = sliderRef.current;
//     if (!el) return;

//     const onScroll = () => {
//       const slideWidth = getSlideWidth();
//       if (!slideWidth) return;

//       const maxIndex = infiniteFilms.length - 1;
//       const currentIndex = Math.round(el.scrollLeft / slideWidth);

//       // If user reached the clone at the start (index 0)
//       if (currentIndex === 0) {
//         el.scrollLeft = slideWidth * (maxIndex - 1); // jump to last real slide
//       }

//       // If user reached the clone at the end (last index)
//       if (currentIndex === maxIndex) {
//         el.scrollLeft = slideWidth * 1; // jump to first real slide
//       }

//       // Update active dot (real index)
//       let realIndex = currentIndex - 1;

//       if (realIndex < 0) realIndex = films.length - 1;
//       if (realIndex >= films.length) realIndex = 0;

//       setActiveIndex(realIndex);
//     };

//     el.addEventListener("scroll", onScroll, { passive: true });
//     return () => el.removeEventListener("scroll", onScroll);
//   }, [infiniteFilms.length, films.length]);

//   // Scroll to a real slide (dot click)
//   const scrollToRealIndex = (realIndex) => {
//     const el = sliderRef.current;
//     if (!el) return;

//     const slideWidth = getSlideWidth();
//     el.scrollTo({
//       left: slideWidth * (realIndex + 1), // +1 because of first clone
//       behavior: "smooth",
//     });
//   };

//   // ✅ AUTO SLIDE every 3 seconds
//   useEffect(() => {
//     const el = sliderRef.current;
//     if (!el) return;

//     const interval = setInterval(() => {
//       if (isDown.current) return; // if dragging, don't auto-slide
//       if (isPaused.current) return;

//       const slideWidth = getSlideWidth();
//       if (!slideWidth) return;

//       // move to next slide
//       el.scrollTo({
//         left: el.scrollLeft + slideWidth,
//         behavior: "smooth",
//       });
//     }, 3000);

//     return () => clearInterval(interval);
//   }, []);

//   // Desktop + Mobile drag swipe
//   const onPointerDown = (e) => {
//     const el = sliderRef.current;
//     if (!el) return;

//     isDown.current = true;
//     isPaused.current = true; // pause auto slide while dragging
//     el.classList.add("dragging");

//     startX.current = e.pageX || e.touches?.[0]?.pageX || 0;
//     scrollLeft.current = el.scrollLeft;
//   };

//   const onPointerUp = () => {
//     const el = sliderRef.current;
//     if (!el) return;

//     isDown.current = false;
//     el.classList.remove("dragging");

//     // Snap to nearest slide after drag end
//     const slideWidth = getSlideWidth();
//     const nearest = Math.round(el.scrollLeft / slideWidth);
//     el.scrollTo({ left: nearest * slideWidth, behavior: "smooth" });

//     // resume auto slide after 1 sec
//     setTimeout(() => {
//       isPaused.current = false;
//     }, 1000);
//   };

//   const onPointerLeave = () => {
//     const el = sliderRef.current;
//     if (!el) return;

//     if (isDown.current) onPointerUp();
//   };

//   const onPointerMove = (e) => {
//     const el = sliderRef.current;
//     if (!el) return;
//     if (!isDown.current) return;

//     const x = e.pageX || e.touches?.[0]?.pageX || 0;
//     const walk = (x - startX.current) * 1.5;
//     el.scrollLeft = scrollLeft.current - walk;
//   };

//   return (
//     <>
//       {/* HERO */}
//       <section className="hero">
//         <img
//           src={logo}
//           alt="Royal Throne Productions Logo"
//           className="hero-logo"
//         />

//         <div className="about-divider">
//           <span className="divider-star"></span>
//         </div>

//         <h1>ROYAL THRONE PRODUCTIONS</h1>
//         <p>Where Cinema Becomes Legacy</p>

//         <div className="hero-buttons">
//           <button className="primary">Watch Showreel</button>

//           <button className="outline" onClick={() => navigate("/films")}>
//             Our Films
//           </button>
//         </div>
//       </section>

//       {/* FILMS CAROUSEL */}
//       <section className="films-section white-section">
//         <h2>Our Films</h2>
//         <div className="about-divider"></div>

//         <div className="films-carousel-wrap">
//           <div
//             className="films-carousel"
//             ref={sliderRef}
//             onMouseDown={onPointerDown}
//             onMouseMove={onPointerMove}
//             onMouseUp={onPointerUp}
//             onMouseLeave={onPointerLeave}
//             onTouchStart={onPointerDown}
//             onTouchMove={onPointerMove}
//             onTouchEnd={onPointerUp}
//           >
//             {infiniteFilms.map((film, index) => (
//               <div className="home-film-slide" key={index}>
//                 <div className="home-film-card">
//                   <img
//                     src={film.image}
//                     alt={film.title}
//                     className="home-film-poster"
//                     draggable="false"
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* DOTS */}
//         {/* <div className="films-dots">
//           {films.map((_, i) => (
//             <button
//               key={i}
//               className={`dot ${i === activeIndex ? "active" : ""}`}
//               onClick={() => scrollToRealIndex(i)}
//             />
//           ))}
//         </div> */}
//       </section>

//       {/* AWARDS */}
//       {/* AWARDS */}
//       <section className="white-section page awards-section">
//         <h2>Awards</h2>
//         <div className="about-divider"></div>
//         <div className="awards-grid">
//           <div className="award-item">
//             <div className="award-icon">
//               <Trophy size={26} />
//             </div>
//             <div className="award-text">
//               <h4>Best Film</h4>
//               <p>Royal Throne Productions</p>
//             </div>
//           </div>

//           <div className="award-item">
//             <div className="award-icon">
//               <Globe size={26} />
//             </div>
//             <div className="award-text">
//               <h4>Official Selection</h4>
//               <p>International Film Festival</p>
//             </div>
//           </div>

//           <div className="award-item">
//             <div className="award-icon">
//               <Film size={26} />
//             </div>
//             <div className="award-text">
//               <h4>Festival Screening</h4>
//               <p>Featured Cinema Showcase</p>
//             </div>
//           </div>

//           <div className="award-item">
//             <div className="award-icon">
//               <Award size={26} />
//             </div>
//             <div className="award-text">
//               <h4>Best Direction</h4>
//               <p>Honored Achievement</p>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }
