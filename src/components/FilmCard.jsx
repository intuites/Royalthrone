import { useNavigate } from "react-router-dom";
import "../styles/films.css";
import personImg from "../assets/person-whity.png";

export default function FilmCard({ id, title, year, image, role }) {
  const navigate = useNavigate();

  return (
    <div className="film-card" onClick={() => navigate(`/films/${id}`)}>
      <div className="film-poster-wrapper">
        <img
          src={
            image && image.trim() !== "" ? image : personImg
          } /*{image || "/no-poster.png"}*/
          alt={title}
          className="film-poster"
        />

        {/* Overlay */}
        <div className="film-overlay">
          <span className="film-year">{year}</span>
          {role && <span className="film-role">{role}</span>}
        </div>
      </div>

      <h3 className="film-title">{title}</h3>
    </div>
  );
}

// import { useNavigate } from "react-router-dom";
// import "../styles/films.css";

// export default function FilmCard({ id, title, year, image }) {
//   const navigate = useNavigate();

//   return (
//     <div className="film-card" onClick={() => navigate(`/films/${id}`)}>
//       <div className="film-poster-wrapper">
//         <img
//           src={image || "/no-poster.png"}
//           alt={title}
//           className="film-poster"
//         />
//         <div className="film-overlay">
//           <span className="film-year">{year}</span>
//         </div>
//       </div>

//       <h3 className="film-title">{title}</h3>
//     </div>
//   );
// }
