import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/adminmovieform.css";

export default function AdminMovieForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    year: "",
    description: "",
    poster_url: "",
    banner_url: "",
    trailer_url: "",
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      API.get("/movies").then((res) => {
        const movie = res.data.find((m) => m.id === id);
        if (movie) setForm(movie);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);

    setUploading(true);
    const res = await API.post("/upload/image", data);
    setUploading(false);

    return res.data.url;
  };

  const handlePosterUpload = async (e) => {
    const url = await uploadImage(e.target.files[0]);
    setForm({ ...form, poster_url: url });
  };

  const handleBannerUpload = async (e) => {
    const url = await uploadImage(e.target.files[0]);
    setForm({ ...form, banner_url: url });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (id) {
      await API.put(`/movies/${id}`, form);
    } else {
      await API.post("/movies", form);
    }

    navigate("/admin/movies");
  };

  return (
    <div className="admin-form-page">
      <div className="admin-form-panel">
        <h2>{id ? "Edit Movie" : "Add New Movie"}</h2>

        <form onSubmit={handleSubmit} className="admin-movie-form">
          <div className="form-row">
            <input
              name="title"
              placeholder="Movie Title"
              value={form.title}
              onChange={handleChange}
              required
            />

            <input
              name="year"
              placeholder="Release Year"
              value={form.year}
              onChange={handleChange}
            />
          </div>

          <textarea
            name="description"
            placeholder="Movie Description"
            value={form.description}
            onChange={handleChange}
          />

          {/* Poster */}
          <div className="upload-block">
            <label>Poster Image</label>
            <input type="file" accept="image/*" onChange={handlePosterUpload} />

            {form.poster_url && <img src={form.poster_url} alt="Poster" />}
          </div>

          {/* Banner */}
          <div className="upload-block">
            <label>Banner Image</label>
            <input type="file" accept="image/*" onChange={handleBannerUpload} />

            {form.banner_url && (
              <img
                src={form.banner_url}
                alt="Banner"
                className="banner-preview"
              />
            )}
          </div>

          <input
            name="trailer_url"
            placeholder="YouTube Trailer URL"
            value={form.trailer_url}
            onChange={handleChange}
          />

          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : id ? "Update Movie" : "Create Movie"}
          </button>
        </form>
      </div>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import API from "../../services/api";
// import { useNavigate, useParams } from "react-router-dom";
// import "../../styles/adminmovieform.css";

// export default function AdminMovieForm() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     title: "",
//     year: "",
//     description: "",
//     poster_url: "",
//     banner_url: "",
//     trailer_url: "",
//   });

//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     if (id) {
//       API.get("/movies").then((res) => {
//         const movie = res.data.find((m) => m.id === id);
//         if (movie) setForm(movie);
//       });
//     }
//   }, [id]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const uploadImage = async (file) => {
//     const data = new FormData();
//     data.append("file", file);

//     setUploading(true);
//     const res = await API.post("/upload/image", data);
//     setUploading(false);

//     return res.data.url;
//   };

//   const handlePosterUpload = async (e) => {
//     const url = await uploadImage(e.target.files[0]);
//     setForm({ ...form, poster_url: url });
//   };

//   const handleBannerUpload = async (e) => {
//     const url = await uploadImage(e.target.files[0]);
//     setForm({ ...form, banner_url: url });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (id) {
//       await API.put(`/movies/${id}`, form);
//     } else {
//       await API.post("/movies", form);
//     }

//     navigate("/admin/movies");
//   };

//   return (
//     <div style={{ maxWidth: 600, margin: "40px auto" }}>
//       <h2>{id ? "Edit Movie" : "Add Movie"}</h2>

//       <form onSubmit={handleSubmit}>
//         <input
//           name="title"
//           placeholder="Title"
//           value={form.title}
//           onChange={handleChange}
//           required
//         />
//         <br />
//         <br />

//         <input
//           name="year"
//           placeholder="Year"
//           value={form.year}
//           onChange={handleChange}
//         />
//         <br />
//         <br />

//         <textarea
//           name="description"
//           placeholder="Description"
//           value={form.description}
//           onChange={handleChange}
//         />
//         <br />
//         <br />

//         {/* POSTER UPLOAD */}
//         <label>Poster Image</label>
//         <br />
//         <input type="file" accept="image/*" onChange={handlePosterUpload} />
//         {form.poster_url && (
//           <img
//             src={form.poster_url}
//             alt="poster"
//             style={{ width: 120, marginTop: 10 }}
//           />
//         )}
//         <br />
//         <br />

//         {/* BANNER UPLOAD */}
//         <label>Banner Image</label>
//         <br />
//         <input type="file" accept="image/*" onChange={handleBannerUpload} />
//         {form.banner_url && (
//           <img
//             src={form.banner_url}
//             alt="banner"
//             style={{ width: "100%", marginTop: 10 }}
//           />
//         )}
//         <br />
//         <br />

//         <input
//           name="trailer_url"
//           placeholder="Trailer URL (YouTube)"
//           value={form.trailer_url}
//           onChange={handleChange}
//         />
//         <br />
//         <br />

//         <button type="submit" disabled={uploading}>
//           {uploading ? "Uploading..." : id ? "Update Movie" : "Create Movie"}
//         </button>
//       </form>
//     </div>
//   );
// }
