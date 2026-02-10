import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "../../styles/adminmovies.css";

// React Icons
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  const loadMovies = async () => {
    const res = await API.get("/movies");
    setMovies(res.data);
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const deleteMovie = async (id) => {
    if (!window.confirm("Delete this movie?")) return;
    await API.delete(`/movies/${id}`);
    loadMovies();
  };

  return (
    <div className="admin-movies-page">
      <div className="admin-movies-panel">
        <div className="admin-movies-header">
          <h2>Manage Movies</h2>

          <button
            className="admin-add-btn"
            onClick={() => navigate("/admin/movies/add")}
          >
            Add Movie
          </button>
        </div>

        <div className="admin-movie-list">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="admin-movie-row"
              onClick={() => navigate(`/admin/movies/${movie.id}`)}
            >
              <div className="admin-movie-info">
                <span className="movie-title">{movie.title}</span>
                <span className="movie-year">{movie.year}</span>
              </div>

              <div className="admin-movie-actions">
                <button
                  className="edit"
                  title="Edit"
                  onClick={() => navigate(`/admin/movies/edit/${movie.id}`)}
                >
                  <FaEdit />
                </button>

                <button
                  className="delete"
                  title="Delete"
                  onClick={() => deleteMovie(movie.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../../services/api";
// import "../../styles/adminmovies.css";

// // React Icons
// import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

// export default function AdminMovies() {
//   const [movies, setMovies] = useState([]);
//   const navigate = useNavigate();

//   const loadMovies = async () => {
//     const res = await API.get("/movies");
//     setMovies(res.data);
//   };

//   useEffect(() => {
//     loadMovies();
//   }, []);

//   const deleteMovie = async (id) => {
//     if (!window.confirm("Delete this movie?")) return;
//     await API.delete(`/movies/${id}`);
//     loadMovies();
//   };

//   return (
//     <div className="admin-movies-page">
//       <div className="admin-movies-panel">
//         <div className="admin-movies-header">
//           <h2>Manage Movies</h2>

//           <button
//             className="admin-add-btn"
//             onClick={() => navigate("/admin/movies/add")}
//           >
//             Add Movie
//           </button>
//         </div>

//         <div className="admin-movie-list">
//           {movies.map((movie) => (
//             <div key={movie.id} className="admin-movie-row">
//               <div className="admin-movie-info">
//                 <span className="movie-title">{movie.title}</span>
//                 <span className="movie-year">{movie.year}</span>
//               </div>

//               <div className="admin-movie-actions">
//                 <button
//                   className="edit"
//                   title="Edit"
//                   onClick={() => navigate(`/admin/movies/edit/${movie.id}`)}
//                 >
//                   <FaEdit />
//                 </button>

//                 <button
//                   className="delete"
//                   title="Delete"
//                   onClick={() => deleteMovie(movie.id)}
//                 >
//                   <FaTrash />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
