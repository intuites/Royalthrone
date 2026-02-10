// import "../styles/footerBanner.css";
// import { Link } from "react-router-dom";

// export default function FooterBanner() {
//   return (
//     <footer className="footer-banner">
//       <div className="footer-inner">
//         {/* LEFT TEXT */}
//         <div className="footer-about">
//           <p>
//             Royal Throne Productions brings stories to life through bold, cinematic storytelling. We are dedicated to pushing creative boundaries, exploring new narrative horizons, and shaping the future of cinema with fresh perspectives on screen.
//           </p>
//         </div>

//         {/* DIVIDER */}
//         <div className="footer-divider" />

//         {/* LINKS */}
//         <div className="footer-links">
//           <div className="footer-col">
//             <Link to="/">HOME</Link>
//             <Link to="/films">OUR WORK</Link>
//             <Link to="/Awards">Awards</Link>
//           </div>

//           <div className="footer-col">
//             {/* <Link to="/films">OUR WORK</Link> */}
//             <Link to="/about">ABOUT</Link>
//             <Link to="/pitch">Pitch Us</Link>
//             {/* <Link to="/news">NEWS</Link> */}
//           </div>
//         </div>

//         {/* DIVIDER */}
//         <div className="footer-divider" />

//         {/* SOCIAL + COPYRIGHT */}
//         <div className="footer-right">
//           <div className="footer-social">
//             <a href="#" aria-label="Facebook">f</a>
//             <a href="#" aria-label="X">x</a>
//             <a href="#" aria-label="Instagram">◎</a>
//             <a href="#" aria-label="YouTube">▶</a>
//           </div>

//           <div className="footer-copy">
//             <p>Copyright © {new Date().getFullYear()}</p>
//             <p>@ ROYAL THRONE PRODUCTIONS</p>
//             <p>Designed By Team Royal Throne</p>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }
import "../styles/footerBanner.css";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";

export default function FooterBanner() {
  return (
    <footer className="footer-banner">
      <div className="footer-inner">
        {/* LEFT TEXT */}
        <div className="footer-about">
          <p>
            Royal Throne Productions brings stories to life through bold,
            cinematic storytelling. We are dedicated to pushing creative
            boundaries, exploring new narrative horizons, and shaping the future
            of cinema with fresh perspectives on screen.
          </p>
        </div>

        {/* DIVIDER */}
        {/* <div className="footer-divider" /> */}
        <div className="footer-vertical-divider">
          <span className="vertical-divider-star"></span>
        </div>

        {/* LINKS */}
        <div className="footer-links">
          <div className="footer-col">
            <Link to="/">HOME</Link>
            <Link to="/films">OUR WORK</Link>
            <Link to="/awards">AWARDS</Link>
          </div>

          <div className="footer-col">
            <Link to="/about">ABOUT</Link>
            <Link to="/pitch">PITCH US</Link>
          </div>
        </div>

        {/* DIVIDER */}
        {/* <div className="footer-divider" /> */}
        <div className="footer-vertical-divider">
          <span className="vertical-divider-star"></span>
        </div>

        {/* SOCIAL + COPYRIGHT */}
        <div className="footer-right">
          <div className="footer-social">
            <a
              href="https://www.facebook.com/royalthroneproductions"
              aria-label="Facebook"
            >
              <Facebook size={16} />
            </a>

            <a
              href="https://www.instagram.com/royalthroneproductions?igsh=NmZuYWVuYWUwdnZy"
              aria-label="Instagram"
            >
              <Instagram size={16} />
            </a>

            <a
              href="https://youtube.com/@royalthroneproductions?si=mnktXxWCL7R4ELUw"
              aria-label="YouTube"
            >
              <Youtube size={16} />
            </a>
          </div>

          <div className="footer-copy">
            <p>Copyright © {new Date().getFullYear()}</p>
            <p>@ ROYAL THRONE PRODUCTIONS</p>
            <p>Designed By Team Royal Throne</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
