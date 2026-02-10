import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import "../../styles/adminmoviedetails.css";
import { FaTrash, FaEdit } from "react-icons/fa";
import personImg from "../../assets/person-whity.png";

export default function AdminMovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  const load = () => {
    API.get(`/movies/${id}/details`).then((res) => setMovie(res.data));
  };

  useEffect(() => {
    load();
  }, [id]);

  // if (!movie) return <p style={{ color: "white" }}>Loading...</p>;
  if (!movie) return <AdminMovieLoader />;

  return (
    <div className="movie-details-page">
      <div
        className="movie-banner"
        style={{ backgroundImage: `url(${movie.banner_url})` }}
      />

      <div className="movie-content">
        {/* <img src={movie.poster_url} className="movie-poster" /> */}
        {movie.poster_url && (
          <img src={movie.poster_url} className="movie-poster" />
        )}

        <div className="movie-info">
          <h1>{movie.title}</h1>
          <p className="year">{movie.year}</p>
          <p className="synopsis">{movie.description}</p>
        </div>
      </div>
      <SectionTeasers movieId={id} data={movie.teasers} reload={load} />
      <SectionLinks movieId={id} data={movie.links} reload={load} />

      <Section
        title="Casting"
        api="cast"
        movieId={id}
        data={movie.cast}
        field1="name"
        field2="role"
        reload={load}
      />
      <Section
        title="Crew"
        api="crew"
        movieId={id}
        data={movie.crew}
        field1="name"
        field2="job"
        reload={load}
      />
      <Section
        title="Director"
        api="director"
        movieId={id}
        data={movie.director}
        field1="name"
        reload={load}
        field2="job"
        defaultRole="Director"
      />
      <Section
        title="Music"
        api="music"
        field2="role"
        movieId={id}
        data={movie.music}
        field1="name"
        reload={load}
      />

      <Section
        title="Production Team"
        api="production"
        movieId={id}
        data={movie.production}
        field1="name"
        field2="role"
        reload={load}
      />
      <SectionSongs movieId={id} data={movie.songs} reload={load} />

      <div className="movie-section">
        {/* <h2>Gallery</h2> */}
        <div className="gallery">
          {movie.photos.map((p) => (
            <div key={p.id} className="gallery-item">
              <img src={p.image_url} />
              <button
                onClick={() => API.delete(`/movies/photos/${p.id}`).then(load)}
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- SECTION ---------------- */
function Section({
  title,
  data,
  field1,
  field2,
  movieId,
  api,
  reload,
  defaultRole,
}) {
  const [form, setForm] = useState({
    name: "",
    role: defaultRole || "",
    job: "",
    photo_url: "",
  });
  const [editing, setEditing] = useState(null);

  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await API.post("/upload/image", fd);
    return res.data.url;
  };

  const handleFile = async (e) => {
    const url = await uploadImage(e.target.files[0]);
    setForm({ ...form, photo_url: url });
  };

  const save = async () => {
    if (!form.name) return alert("Name required");

    const payload = {
      name: form.name,
      photo_url: form.photo_url,
      role: field2 === "role" ? form.role : defaultRole || "",
      job: field2 === "job" ? form.job : "",
    };

    if (editing) {
      await API.put(`/movies/${api}/${editing}`, payload);
    } else {
      await API.post(`/movies/${movieId}/${api}`, payload);
    }

    setForm({
      name: "",
      role: defaultRole || "",
      job: "",
      photo_url: "",
    });

    setEditing(null);
    reload();
  };

  const del = async (cid) => {
    if (!confirm("Delete?")) return;
    await API.delete(`/movies/${api}/${cid}`);
    reload();
  };

  return (
    <div className="movie-section">
      <h2>{title}</h2>

      <div className="add-box">
        <input
          placeholder={field1}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {field2 && (
          <input
            placeholder={field2 === "job" ? "Job Title" : "Role"}
            value={field2 === "job" ? form.job : form.role}
            onChange={(e) =>
              setForm({
                ...form,
                [field2 === "job" ? "job" : "role"]: e.target.value,
              })
            }
          />
        )}

        <input type="file" onChange={handleFile} />

        <button onClick={save}>{editing ? "Update" : "Publish"}</button>
      </div>

      <div className="cards">
        {data.map((item) => (
          <div className="card" key={item.id}>
            <div className="card-toolbar">
              <button
                onClick={() => {
                  setEditing(item.id);
                  setForm(item);
                }}
              >
                <FaEdit />
              </button>

              <button onClick={() => del(item.id)}>
                <FaTrash />
              </button>
            </div>

            {/* <img src={item.photo_url} /> */}
            {/* {item.photo_url ? (
              <img src={item.photo_url} />
            ) : (
              <div className="no-image">No Image</div>
            )} */}
            <img
              src={item.photo_url || personImg}
              alt={item.name}
              className="card-image"
            />

            <div className="card-info">
              <p>{item.name}</p>
              <span>{item.role || item.job}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function AdminMovieLoader() {
  return (
    <div className="admin-loader-wrap">
      <div className="admin-loader-ring"></div>
      <p>Loading Movie…</p>
    </div>
  );
}

const getEmbedUrl = (url) => {
  if (!url) return null;

  // YouTube
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const id = url.includes("v=")
      ? url.split("v=")[1]?.split("&")[0]
      : url.split("/").pop();
    return `https://www.youtube.com/embed/${id}`;
  }

  // Spotify
  if (url.includes("spotify.com")) {
    return url.replace("open.spotify.com", "open.spotify.com/embed");
  }

  return null;
};

function SectionSongs({ movieId, data, reload }) {
  const [form, setForm] = useState({
    song_title: "",
    singers: "",
    chorus_singers: "",
    music_directors: "",
    song_url: "",
  });

  const [editing, setEditing] = useState(null);

  const save = async () => {
    if (!form.song_title) {
      alert("Song title is required");
      return;
    }

    if (editing) {
      await API.put(`/movies/songs/${editing}`, form);
    } else {
      await API.post(`/movies/${movieId}/songs`, form);
    }

    setForm({
      song_title: "",
      singers: "",
      chorus_singers: "",
      music_directors: "",
      song_url: "",
    });

    setEditing(null);
    reload();
  };

  const del = async (id) => {
    if (!confirm("Delete this song?")) return;
    await API.delete(`/movies/songs/${id}`);
    reload();
  };

  return (
    <div className="movie-section">
      <h2>Songs / Soundtrack</h2>

      {/* ADD SONG */}
      <div className="add-box">
        <input
          placeholder="Song Title"
          value={form.song_title}
          onChange={(e) => setForm({ ...form, song_title: e.target.value })}
        />
        <input
          placeholder="Singers"
          value={form.singers}
          onChange={(e) => setForm({ ...form, singers: e.target.value })}
        />
        <input
          placeholder="Chorus Singers"
          value={form.chorus_singers}
          onChange={(e) => setForm({ ...form, chorus_singers: e.target.value })}
        />
        <input
          placeholder="Music Director(s)"
          value={form.music_directors}
          onChange={(e) =>
            setForm({ ...form, music_directors: e.target.value })
          }
        />
        <input
          placeholder="Spotify / YouTube Link"
          value={form.song_url}
          onChange={(e) => setForm({ ...form, song_url: e.target.value })}
        />

        <button onClick={save}>{editing ? "Update Song" : "Add Song"}</button>
      </div>

      {/* SONG LIST */}
      <div className="songs-grid">
        {data?.map((song) => {
          const embedUrl = getEmbedUrl(song.song_url);

          return (
            <div className="song-card" key={song.id}>
              <div className="card-toolbar">
                <button
                  onClick={() => {
                    setEditing(song.id);
                    setForm(song);
                  }}
                >
                  <FaEdit />
                </button>
                <button onClick={() => del(song.id)}>
                  <FaTrash />
                </button>
              </div>

              <h3>{song.song_title}</h3>

              <p>
                <b>Singers:</b> {song.singers || "—"}
              </p>
              <p>
                <b>Music:</b> {song.music_directors || "—"}
              </p>

              {/* EMBED PLAYER */}
              {embedUrl ? (
                <div className="song-player">
                  <iframe
                    src={embedUrl}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              ) : (
                song.song_url && (
                  <a
                    href={song.song_url}
                    target="_blank"
                    className="listen-link"
                  >
                    Listen
                  </a>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

//teaser and movie link section
function SectionTeasers({ movieId, data, reload }) {
  const [form, setForm] = useState({
    title: "",
    teaser_url: "",
  });

  const [editing, setEditing] = useState(null);

  const save = async () => {
    if (!form.title || !form.teaser_url) {
      alert("Teaser title and video link are required");
      return;
    }

    if (editing) {
      await API.put(`/movies/teasers/${editing}`, form);
    } else {
      await API.post(`/movies/${movieId}/teasers`, form);
    }

    setForm({ title: "", teaser_url: "" });
    setEditing(null);
    reload();
  };

  const del = async (id) => {
    if (!confirm("Delete teaser?")) return;
    await API.delete(`/movies/teasers/${id}`);
    reload();
  };

  return (
    <div className="movie-section">
      <h2>Teasers</h2>

      <div className="add-box">
        <input
          placeholder="Teaser Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="YouTube / Vimeo Link"
          value={form.teaser_url}
          onChange={(e) => setForm({ ...form, teaser_url: e.target.value })}
        />
        <button onClick={save}>
          {editing ? "Update Teaser" : "Add Teaser"}
        </button>
      </div>

      <div className="songs-grid">
        {data?.map((teaser) => {
          const embedUrl = getEmbedUrl(teaser.teaser_url);

          return (
            <div className="song-card" key={teaser.id}>
              <div className="card-toolbar">
                <button
                  onClick={() => {
                    setEditing(teaser.id);
                    setForm(teaser);
                  }}
                >
                  <FaEdit />
                </button>
                <button onClick={() => del(teaser.id)}>
                  <FaTrash />
                </button>
              </div>

              <h3>{teaser.title}</h3>

              {embedUrl && (
                <div className="song-player">
                  <iframe
                    src={embedUrl}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
//detection....
// const getLinkType = (url = "") => {
//   if (url.includes("spotify.com")) return "spotify";
//   if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
//   return "link";
// };
// 1. Updated detection to include Netflix, IMDb, and Prime
const getLinkType = (url = "") => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("spotify.com")) return "spotify";
  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be"))
    return "youtube";
  if (lowerUrl.includes("imdb.com")) return "imdb";
  if (lowerUrl.includes("netflix.com")) return "netflix";
  if (
    lowerUrl.includes("primevideo.com") ||
    lowerUrl.includes("amazon.com/prime")
  )
    return "prime";
  return "link";
};

// 2. Updated Thumbnail function to return platform-specific images
const getPlatformThumb = (url = "") => {
  const type = getLinkType(url);

  if (type === "youtube") {
    return getYoutubeThumb(url);
  }

  // High-quality Brand Wallpapers for a premium look
  const thumbs = {
    netflix:
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=500&auto=format&fit=crop",
    imdb: "https://m.media-amazon.com/images/G/01/imdb/images/social/imdb_logo.png",
    prime:
      "https://images.unsplash.com/photo-1522865080221-45b99cd44edc?q=80&w=500&auto=format&fit=crop",
    spotify:
      "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=500&auto=format&fit=crop",
    link: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=500&auto=format&fit=crop", // Generic Movie fallback
  };

  return thumbs[type] || thumbs.link;
};

// Detect platform from URL
// const detectPlatform = (url = "") => {
//   if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
//   if (url.includes("spotify.com")) return "spotify";
//   if (url.includes("imdb.com")) return "imdb";
//   if (url.includes("primevideo.com")) return "prime";
//   if (url.includes("netflix.com")) return "netflix";
//   return "link";
// };

// Get YouTube thumbnail (FREE)
const getYoutubeThumb = (url = "") => {
  try {
    let id = "";

    if (url.includes("youtube.com")) {
      id = new URL(url).searchParams.get("v");
    } else if (url.includes("youtu.be")) {
      id = url.split("/").pop()?.split("?")[0];
    }

    if (!id) return null;

    // fallback-safe thumbnail
    return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
  } catch {
    return null;
  }
};

const getSpotifyEmbed = (url = "") => {
  try {
    const u = new URL(url);
    const path = u.pathname; // /track/xxx or /album/xxx
    return `https://open.spotify.com/embed${path}`;
  } catch {
    return null;
  }
};

const getSpotifyThumb = (url = "") => {
  try {
    const id = url.split("/").pop().split("?")[0];
    return `https://i.scdn.co/image/${id}`;
  } catch {
    return null;
  }
};

//Section Links

function SectionLinks({ movieId, data, reload }) {
  const [form, setForm] = useState({
    title: "",
    url: "",
    platform: "",
  });

  const [editing, setEditing] = useState(null);

  const save = async () => {
    if (!form.title || !form.url) {
      alert("Link title and URL are required");
      return;
    }

    if (editing) {
      await API.put(`/movies/links/${editing}`, form);
    } else {
      await API.post(`/movies/${movieId}/links`, form);
    }

    setForm({ title: "", url: "", platform: "" });
    setEditing(null);
    reload();
  };

  const del = async (id) => {
    if (!confirm("Delete link?")) return;
    await API.delete(`/movies/links/${id}`);
    reload();
  };

  return (
    <div className="movie-section">
      <h2>Movie Links</h2>

      <div className="add-box movie-links-grid">
        <input
          placeholder="Link Title (IMDb, Spotify, BookMyShow)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          placeholder="Full URL"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
        />

        <select
          value={form.platform}
          onChange={(e) => setForm({ ...form, platform: e.target.value })}
        >
          <option value="">Platform (optional)</option>
          <option value="imdb">IMDb</option>
          <option value="spotify">Spotify</option>
          <option value="youtube">YouTube</option>
          <option value="prime">Prime Video</option>
          <option value="netflix">Netflix</option>
        </select>

        <button onClick={save}>{editing ? "Update Link" : "Add Link"}</button>
      </div>

      {/* CARDS */}
      <div className="cards movie-links-cards">
        {data?.map((link) => {
          const type = getLinkType(link.url);
          const ytThumb = getYoutubeThumb(link.url);

          return (
            <div
              key={link.id}
              className={`movie-link-card ${type}`}
              onClick={() => window.open(link.url, "_blank")}
            >
              {/* Toolbar */}
              <div className="card-toolbar">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditing(link.id);
                    setForm(link);
                  }}
                >
                  <FaEdit />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    del(link.id);
                  }}
                >
                  <FaTrash />
                </button>
              </div>

              {/* MEDIA (✅ CORRECT PLACE) */}
              <div className="movie-link-media">
                {type === "spotify" ? (
                  <div className="spotify-embed-wrap">
                    <iframe
                      src={getSpotifyEmbed(link.url)}
                      allow="encrypted-media"
                      scrolling="no"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  /* This handles YouTube, IMDb, Netflix, etc. using the new helper */
                  <img
                    src={getPlatformThumb(link.url)}
                    alt={link.title}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x225?text=Movie+Link";
                    }}
                  />
                )}
              </div>

              {/* INFO */}
              <div className="movie-link-info">
                <p>{link.title}</p>
                <span className="platform-tag">{type}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import API from "../../services/api";
// import "../../styles/adminmoviedetails.css";
// import { FaTrash, FaEdit } from "react-icons/fa";
// import personImg from "../../assets/person-whity.png";

// export default function AdminMovieDetails() {
//   const { id } = useParams();
//   const [movie, setMovie] = useState(null);

//   const load = () => {
//     API.get(`/movies/${id}/details`).then((res) => setMovie(res.data));
//   };

//   useEffect(() => {
//     load();
//   }, [id]);

//   // if (!movie) return <p style={{ color: "white" }}>Loading...</p>;
//   if (!movie) return <AdminMovieLoader />;

//   return (
//     <div className="movie-details-page">
//       <div
//         className="movie-banner"
//         style={{ backgroundImage: `url(${movie.banner_url})` }}
//       />

//       <div className="movie-content">
//         {/* <img src={movie.poster_url} className="movie-poster" /> */}
//         {movie.poster_url && (
//           <img src={movie.poster_url} className="movie-poster" />
//         )}

//         <div className="movie-info">
//           <h1>{movie.title}</h1>
//           <p className="year">{movie.year}</p>
//           <p className="synopsis">{movie.description}</p>
//         </div>
//       </div>

//       <Section
//         title="Casting"
//         api="cast"
//         movieId={id}
//         data={movie.cast}
//         field1="name"
//         field2="role"
//         reload={load}
//       />
//       <Section
//         title="Crew"
//         api="crew"
//         movieId={id}
//         data={movie.crew}
//         field1="name"
//         field2="job"
//         reload={load}
//       />
//       <Section
//         title="Director"
//         api="director"
//         movieId={id}
//         data={movie.director}
//         field1="name"
//         reload={load}
//         field2="job"
//         defaultRole="Director"
//       />
//       <Section
//         title="Music"
//         api="music"
//         field2="role"
//         movieId={id}
//         data={movie.music}
//         field1="name"
//         reload={load}
//       />
//       <Section
//         title="Production Team"
//         api="production"
//         movieId={id}
//         data={movie.production}
//         field1="name"
//         field2="role"
//         reload={load}
//       />

//       <div className="movie-section">
//         {/* <h2>Gallery</h2> */}
//         <div className="gallery">
//           {movie.photos.map((p) => (
//             <div key={p.id} className="gallery-item">
//               <img src={p.image_url} />
//               <button
//                 onClick={() => API.delete(`/movies/photos/${p.id}`).then(load)}
//               >
//                 🗑
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ---------------- SECTION ---------------- */
// function Section({
//   title,
//   data,
//   field1,
//   field2,
//   movieId,
//   api,
//   reload,
//   defaultRole,
// }) {
//   const [form, setForm] = useState({
//     name: "",
//     role: defaultRole || "",
//     job: "",
//     photo_url: "",
//   });
//   const [editing, setEditing] = useState(null);

//   const uploadImage = async (file) => {
//     const fd = new FormData();
//     fd.append("file", file);
//     const res = await API.post("/upload/image", fd);
//     return res.data.url;
//   };

//   const handleFile = async (e) => {
//     const url = await uploadImage(e.target.files[0]);
//     setForm({ ...form, photo_url: url });
//   };

//   const save = async () => {
//     if (!form.name) return alert("Name required");

//     const payload = {
//       name: form.name,
//       photo_url: form.photo_url,
//       role: field2 === "role" ? form.role : defaultRole || "",
//       job: field2 === "job" ? form.job : "",
//     };

//     if (editing) {
//       await API.put(`/movies/${api}/${editing}`, payload);
//     } else {
//       await API.post(`/movies/${movieId}/${api}`, payload);
//     }

//     setForm({
//       name: "",
//       role: defaultRole || "",
//       job: "",
//       photo_url: "",
//     });

//     setEditing(null);
//     reload();
//   };

//   const del = async (cid) => {
//     if (!confirm("Delete?")) return;
//     await API.delete(`/movies/${api}/${cid}`);
//     reload();
//   };

//   return (
//     <div className="movie-section">
//       <h2>{title}</h2>

//       <div className="add-box">
//         <input
//           placeholder={field1}
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//         />

//         {field2 && (
//           <input
//             placeholder={field2 === "job" ? "Job Title" : "Role"}
//             value={field2 === "job" ? form.job : form.role}
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 [field2 === "job" ? "job" : "role"]: e.target.value,
//               })
//             }
//           />
//         )}

//         <input type="file" onChange={handleFile} />

//         <button onClick={save}>{editing ? "Update" : "Publish"}</button>
//       </div>

//       <div className="cards">
//         {data.map((item) => (
//           <div className="card" key={item.id}>
//             <div className="card-toolbar">
//               <button
//                 onClick={() => {
//                   setEditing(item.id);
//                   setForm(item);
//                 }}
//               >
//                 <FaEdit />
//               </button>

//               <button onClick={() => del(item.id)}>
//                 <FaTrash />
//               </button>
//             </div>

//             {/* <img src={item.photo_url} /> */}
//             {/* {item.photo_url ? (
//               <img src={item.photo_url} />
//             ) : (
//               <div className="no-image">No Image</div>
//             )} */}
//             <img
//               src={item.photo_url || personImg}
//               alt={item.name}
//               className="card-image"
//             />

//             <div className="card-info">
//               <p>{item.name}</p>
//               <span>{item.role || item.job}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
// function AdminMovieLoader() {
//   return (
//     <div className="admin-loader-wrap">
//       <div className="admin-loader-ring"></div>
//       <p>Loading Movie…</p>
//     </div>
//   );
// }
