import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/adminawards.css";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function AdminAwards() {
  const [movies, setMovies] = useState([]);
  const [awards, setAwards] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");

  const [form, setForm] = useState({
    award_name: "",
    year: "",
  });

  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadMovies();
    loadAwards();
  }, []);

  const loadMovies = async () => {
    const res = await API.get("/movies");
    setMovies(res.data);
  };

  const loadAwards = async () => {
    const res = await API.get("/awards");
    setAwards(res.data);
  };

  const save = async () => {
    if (!form.award_name) return alert("Award name required");

    const payload = {
      movie_id: selectedMovie || null,
      award_name: form.award_name,
      year: form.year,
    };

    editing
      ? await API.put(`/awards/${editing}`, payload)
      : await API.post("/awards", payload);

    setForm({ award_name: "", year: "" });
    setEditing(null);
    loadAwards();
  };

  const del = async (id) => {
    if (!confirm("Delete award?")) return;
    await API.delete(`/awards/${id}`);
    loadAwards();
  };

  return (
    <div className="admin-awards-page">
      <div className="admin-awards-container">
        <h1 className="admin-title">Awards Management</h1>

        {/* ADD BOX */}
        <div className="awards-add-box">
          <select
            value={selectedMovie}
            onChange={(e) => setSelectedMovie(e.target.value)}
          >
            <option value="">Select Movie (optional)</option>
            {movies.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>

          <input
            placeholder="Oscar Award / Best Special Effects"
            value={form.award_name}
            onChange={(e) => setForm({ ...form, award_name: e.target.value })}
          />

          <input
            placeholder="Year"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          />

          <button onClick={save}>
            {editing ? "Update Award" : "Add Award"}
          </button>
        </div>

        {/* CARDS */}
        <div className="awards-cards">
          {awards.map((award) => (
            <div className="award-link-card" key={award.id}>
              {/* TOOLBAR */}
              <div className="card-toolbar">
                <button
                  onClick={() => {
                    setEditing(award.id);
                    setSelectedMovie(award.movies?.id || "");
                    setForm({
                      award_name: award.award_name,
                      year: award.year || "",
                    });
                  }}
                >
                  <FaEdit />
                </button>

                <button onClick={() => del(award.id)}>
                  <FaTrash />
                </button>
              </div>

              {/* IMAGE */}
              <div className="award-media">
                <img
                  src={
                    award.movies?.poster_url ||
                    "https://via.placeholder.com/600x900?text=Award"
                  }
                  alt={award.award_name}
                />
              </div>

              {/* INFO */}
              <div className="award-info">
                <p className="award-title">{award.award_name}</p>

                {award.year && (
                  <span className="award-badge">{award.year}</span>
                )}

                {award.movies && (
                  <p className="award-movie">{award.movies.title}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
