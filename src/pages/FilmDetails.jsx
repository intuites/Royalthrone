import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import "../styles/filmdetails.css";
import personImg from "../assets/person-whity.png";
import { Music, Mic2, Users, Disc3, PlayCircle } from "lucide-react";

export default function FilmDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    API.get(`/movies/${id}/details`).then((res) => {
      setMovie(res.data);
    });
  }, [id]);

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
  if (!movie) return <p style={{ color: "white" }}>Loading movie...</p>;

  return (
    <>
      <div className="film-details-page">
        {/* HERO BANNER */}
        <div
          className="film-hero"
          style={{ backgroundImage: `url(${movie.banner_url})` }}
        >
          <div className="hero-overlay" />
        </div>

        {/* MAIN INFO */}
        <div className="film-main">
          <img src={movie.poster_url} className="film-poster" />

          <div className="film-info">
            <h1>{movie.title}</h1>
            <p className="year">{movie.year}</p>
            <p className="desc">{movie.description}</p>
          </div>
        </div>

        {/* SECTIONS */}
        {/* <PeopleSection title="Cast" data={movie.cast} field="role" />
      <PeopleSection title="Crew" data={movie.crew} field="job" />
      <PeopleSection title="Director" data={movie.director} />
      <PeopleSection title="Music" data={movie.music} />
      <PeopleSection
        title="Production Team"
        data={movie.production}
        field="role"
      /> */}

        {/* //// */}
        <TrailerSection trailerUrl={movie.trailer_url} />
        <TeaserSection teasers={movie.teasers} />
        <MovieLinksSection links={movie.links} />

        <PeopleSection title="Cast" data={movie.cast} field="role" />

        <PeopleSection title="Crew" data={movie.crew} field="job" />

        <PeopleSection
          title="Director"
          data={movie.director}
          defaultRole="Director"
        />

        <PeopleSection
          title="Music"
          data={movie.music}
          defaultRole="Music Director"
        />

        <PeopleSection
          title="Production Team"
          data={movie.production}
          field="role"
        />

        <SongsSection songs={movie.songs} />

        {/* GALLERY */}
        {/* <div className="film-section">
        <h2>Gallery</h2>
        <div className="gallery">
          {movie.photos.map((p) => (
            <img key={p.id} src={p.image_url} />
          ))}
        </div>
      </div> */}
      </div>
      {/* SCROLL TO TOP */}
      {showTop && (
        <button className="scroll-top-btn" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </>
  );
}

/* ---------------- COMPONENTS ---------------- */

// function PeopleSection({ title, data, field }) {
//   return (
//     <div className="film-section">
//       <h2>{title}</h2>

//       <div className="people-grid">
//         {data.map((p) => (
//           <div className="person-card" key={p.id}>
//             {p.photo_url && <img src={p.photo_url} />}
//             <h4>{p.name}</h4>
//             {field && <span>{p[field]}</span>}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

function PeopleSection({ title, data, field, defaultRole }) {
  return (
    <div className="film-section">
      <h2>{title}</h2>

      <div className="people-grid">
        {data.map((p) => (
          <div className="person-card" key={p.id}>
            <img
              src={
                p.photo_url && p.photo_url.trim() !== ""
                  ? p.photo_url
                  : personImg
              }
              alt={p.name}
            />
            {/* {p.photo_url && <img src={p.photo_url} />} */}
            <h4>{p.name}</h4>

            {/* Role / Job */}
            <span>{field && p[field] ? p[field] : defaultRole || ""}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
//trailer
const getTrailerEmbedUrl = (url) => {
  if (!url) return null;

  // YouTube
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const id = url.includes("v=")
      ? url.split("v=")[1]?.split("&")[0]
      : url.split("/").pop();
    return `https://www.youtube.com/embed/${id}`;
  }

  return null;
};

function TrailerSection({ trailerUrl }) {
  const embedUrl = getTrailerEmbedUrl(trailerUrl);
  if (!embedUrl) return null;

  return (
    <div className="film-section trailer-section">
      <h2 className="trailer-title">Trailer</h2>

      <div className="trailer-wrapper">
        <iframe
          src={embedUrl}
          title="Movie Trailer"
          frameBorder="0"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}

//songs
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

function SongsSection({ songs }) {
  if (!songs || songs.length === 0) return null;

  return (
    <div className="film-section">
      <h2 className="songs-title">
        <Music size={22} /> Songs & Soundtrack
      </h2>

      <div className="songs-grid">
        {songs.map((song, index) => {
          const embedUrl = getEmbedUrl(song.song_url);

          return (
            <div
              className="song-card"
              key={song.id}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* HEADER */}
              <div className="song-header">
                <div className="song-index">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="song-main">
                  <h3>{song.song_title}</h3>
                  <span className="song-meta">{song.singers || "—"}</span>
                </div>
              </div>

              {/* CREATORS */}
              <div className="song-creators">
                {song.singers && (
                  <div className="creator-chip">
                    <Mic2 size={14} />
                    <span className="label">Singers</span>
                    <span>{song.singers}</span>
                  </div>
                )}

                {song.chorus_singers && (
                  <div className="creator-chip">
                    <Users size={14} />
                    <span className="label">Chorus</span>
                    <span>{song.chorus_singers}</span>
                  </div>
                )}

                {song.music_directors && (
                  <div className="creator-chip">
                    <Disc3 size={14} />
                    <span className="label">Music</span>
                    <span>{song.music_directors}</span>
                  </div>
                )}
              </div>

              {/* PLAYER */}
              {embedUrl ? (
                <div className="song-player">
                  <iframe
                    src={embedUrl}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              ) : (
                song.song_url && (
                  <a
                    href={song.song_url}
                    target="_blank"
                    rel="noreferrer"
                    className="listen-btn"
                  >
                    <PlayCircle size={18} />
                    <span>Listen</span>
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

/* ---------------- MOVIE LINKS INTERNAL COMPONENTS ---------------- */

const getLinkType = (url = "") => {
  const u = url.toLowerCase();
  if (u.includes("spotify.com")) return "spotify";
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if (u.includes("imdb.com")) return "imdb";
  if (u.includes("netflix.com")) return "netflix";
  if (u.includes("amazon.com") || u.includes("primevideo.com")) return "prime";
  return "link";
};

const getPlatformThumb = (url = "") => {
  const type = getLinkType(url);

  // 1. YouTube Dynamic Thumbnail
  if (type === "youtube") {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[7].length === 11 ? match[7] : null;
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : null;
  }

  // 2. Official Brand Assets
  const thumbs = {
    netflix:
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=500&auto=format&fit=crop",
    imdb: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/575px-IMDB_Logo_2016.svg.png",
    prime:
      "https://m.media-amazon.com/images/G/01/digital/video/web/logo/PV_Logo_Profile_Tall.png",
    spotify:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_with_text.svg/1024px-Spotify_logo_with_text.svg.png",
    link: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=500&auto=format&fit=crop",
  };

  return thumbs[type] || thumbs.link;
};

function MovieLinksSection({ links }) {
  if (!links || links.length === 0) return null;

  return (
    <div className="film-section">
      <h2 className="section-title">Available On</h2>
      <div className="movie-links-cards">
        {links.map((link) => {
          const type = getLinkType(link.url);
          const thumbUrl = getPlatformThumb(link.url);

          return (
            <div
              key={link.id}
              className={`movie-link-card ${type}`}
              onClick={() => window.open(link.url, "_blank")}
            >
              <div className="movie-link-media">
                {/* Check if it's Spotify to show player, otherwise show brand image */}
                {type === "spotify" ? (
                  <iframe
                    src={link.url.replace(
                      "open.spotify.com",
                      "open.spotify.com/embed",
                    )}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allow="encrypted-media"
                    title="Spotify"
                  />
                ) : (
                  <img
                    src={thumbUrl}
                    alt={link.title}
                    onError={(e) =>
                      (e.target.src =
                        "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=500&auto=format&fit=crop")
                    }
                  />
                )}
                {type === "youtube" && <div className="play-overlay">▶</div>}
              </div>
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
/* ---------------- TEASER SECTION COMPONENTS ---------------- */

const getTeaserThumb = (url = "") => {
  try {
    let id = "";
    if (url.includes("youtube.com")) {
      id = new URL(url).searchParams.get("v");
    } else if (url.includes("youtu.be")) {
      id = url.split("/").pop()?.split("?")[0];
    }
    // Returns high-quality thumbnail
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  } catch {
    return null;
  }
};

const getTeaserEmbed = (url = "") => {
  if (!url) return null;
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const id = url.includes("v=")
      ? url.split("v=")[1]?.split("&")[0]
      : url.split("/").pop();
    return `https://www.youtube.com/embed/${id}`;
  }
  return null;
};

function TeaserSection({ teasers }) {
  if (!teasers || teasers.length === 0) return null;

  return (
    <div className="film-section">
      <h2 className="section-title">Teasers & Promos</h2>
      <div className="teasers-grid">
        {teasers.map((teaser) => {
          const thumb = getTeaserThumb(teaser.teaser_url);
          const embed = getTeaserEmbed(teaser.teaser_url);

          return (
            <div key={teaser.id} className="teaser-card">
              <div className="teaser-video-wrap">
                {/* We show the actual iframe for teasers so users can play them immediately */}
                <iframe
                  src={embed}
                  title={teaser.title}
                  frameBorder="0"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className="teaser-info">
                <h4>{teaser.title}</h4>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// import { useParams } from "react-router-dom";

// export default function FilmDetails() {
//   const { id } = useParams();

//   return (
//     <section className="white-section page">
//       <h1>Film Details</h1>
//       <p>Film ID: {id}</p>
//     </section>
//   );
// }
