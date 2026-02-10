import "../styles/about.css";

import studioImg from "../assets/films/panchali-pancha-patrika.jpeg";
import teamImg from "../assets/films/panchali-pancha-patrika.jpeg";
import btsImg from "../assets/films/panchali-pancha-patrika.jpeg";
import rtplogo from "../assets/rtplogo.png";
import AboutUs from "../assets/AboutUs.png";
import { useEffect, useState } from "react";

export default function About() {
  const [showTop, setShowTop] = useState(false);
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
      <div className="about-page">
        {/* HERO IMAGE */}
        {/* <section className="aboutus-hero">
          <img src={AboutUs} alt="About Banner" className="about-hero-img" />
        </section> */}
        <section className="about-hero">
          <img src={AboutUs} alt="About Banner" className="about-hero-img" />
        </section>

        {/* ABOUT CONTENT */}
        <section className="white-section">
          {/* INTRO */}
          <div className="about-intro">
            <h1>About This Studio</h1>
            <div className="about-divider"></div>
            <p className="about-tagline">
              Crafting cinema with purpose, passion, and timeless storytelling.
            </p>
          </div>

          {/* STORY SECTION */}
          <div className="about-story">
            <div className="about-text">
              <h2>Our Story</h2>
              <p>
                Royal Throne Productions was founded with a singular vision — to
                create cinema that resonates beyond the screen. We believe in
                stories that endure, characters that inspire, and visuals that
                elevate storytelling into an art form.
              </p>
              <p>
                From large-scale epics to intimate narratives, our studio
                focuses on blending strong storytelling with uncompromising
                cinematic quality.
              </p>
            </div>

            <div className="about-image">
              <img src={rtplogo} alt="Royal Throne Studio" />
            </div>
          </div>

          {/* VISION & MISSION */}
          <div className="about-values">
            <div className="value-card">
              <h3>Our Vision</h3>
              <p>
                To become a globally respected film production house known for
                meaningful cinema and visual excellence.
              </p>
            </div>

            <div className="value-card">
              <h3>Our Mission</h3>
              <p>
                To support powerful stories, collaborate with visionary talent,
                and deliver films that leave a lasting cultural impact.
              </p>
            </div>
          </div>

          {/* TEAM / BTS */}
          <div className="about-story reverse">
            <div className="about-text">
              <h2>The Team</h2>
              <p>
                Our strength lies in our people — directors, writers,
                technicians, and creatives who bring years of experience and a
                shared passion for cinema.
              </p>
              <p>
                Every project is treated with the same dedication, whether it is
                a debut film or a large-scale production.
              </p>
            </div>

            <div className="about-image">
              <img src={teamImg} alt="Production Team" />
            </div>
          </div>

          {/* GALLERY */}
          <div className="about-gallery">
            <img src={btsImg} alt="Behind the scenes" />
            <img src={studioImg} alt="Studio work" />
            <img src={teamImg} alt="Creative discussion" />
          </div>
        </section>
      </div>
      {showTop && (
        <button className="scroll-top-btn" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </>
  );
}

// import "../styles/about.css";

// import studioImg from "../assets/films/panchali-pancha-patrika.jpeg";
// import teamImg from "../assets/films/panchali-pancha-patrika.jpeg";
// import btsImg from "../assets/films/panchali-pancha-patrika.jpeg";
// import rtplogo from "../assets/rtplogo.png";
// import AboutUs from "../assets/AboutUs.png";

// export default function About() {
//   return (
//     <>
//       <div className="about-page">
//         {/* HERO IMAGE */}
//         {/* <section className="aboutus-hero">
//           <img src={AboutUs} alt="About Banner" className="about-hero-img" />
//         </section> */}
//         <section className="about-hero">
//           <img src={AboutUs} alt="About Banner" className="about-hero-img" />
//         </section>

//         {/* ABOUT CONTENT */}
//         <section className="white-section">
//           {/* INTRO */}
//           <div className="about-intro">
//             <h1>About Royal Throne Productions</h1>
//             <p className="about-tagline">
//               Crafting cinema with purpose, passion, and timeless storytelling.
//             </p>
//           </div>

//           {/* STORY SECTION */}
//           <div className="about-story">
//             <div className="about-text">
//               <h2>Our Story</h2>
//               <p>
//                 Royal Throne Productions was founded with a singular vision — to
//                 create cinema that resonates beyond the screen. We believe in
//                 stories that endure, characters that inspire, and visuals that
//                 elevate storytelling into an art form.
//               </p>
//               <p>
//                 From large-scale epics to intimate narratives, our studio
//                 focuses on blending strong storytelling with uncompromising
//                 cinematic quality.
//               </p>
//             </div>

//             <div className="about-image">
//               <img src={rtplogo} alt="Royal Throne Studio" />
//             </div>
//           </div>

//           {/* VISION & MISSION */}
//           <div className="about-values">
//             <div className="value-card">
//               <h3>Our Vision</h3>
//               <p>
//                 To become a globally respected film production house known for
//                 meaningful cinema and visual excellence.
//               </p>
//             </div>

//             <div className="value-card">
//               <h3>Our Mission</h3>
//               <p>
//                 To support powerful stories, collaborate with visionary talent,
//                 and deliver films that leave a lasting cultural impact.
//               </p>
//             </div>
//           </div>

//           {/* TEAM / BTS */}
//           <div className="about-story reverse">
//             <div className="about-text">
//               <h2>The Team</h2>
//               <p>
//                 Our strength lies in our people — directors, writers,
//                 technicians, and creatives who bring years of experience and a
//                 shared passion for cinema.
//               </p>
//               <p>
//                 Every project is treated with the same dedication, whether it is
//                 a debut film or a large-scale production.
//               </p>
//             </div>

//             <div className="about-image">
//               <img src={teamImg} alt="Production Team" />
//             </div>
//           </div>

//           {/* GALLERY */}
//           <div className="about-gallery">
//             <img src={btsImg} alt="Behind the scenes" />
//             <img src={studioImg} alt="Studio work" />
//             <img src={teamImg} alt="Creative discussion" />
//           </div>
//         </section>
//       </div>
//     </>
//   );
// }
