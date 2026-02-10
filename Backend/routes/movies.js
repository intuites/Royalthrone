import express from "express";
import { supabase } from "../config/supabase.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// PUBLIC
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("movies").select("*");
  if (error) return res.status(500).json(error);
  res.json(data);
});

// ADMIN ONLY
router.post("/", verifyAdmin, async (req, res) => {
  const { title, year, description, poster_url, banner_url, trailer_url } =
    req.body;

  const { data, error } = await supabase
    .from("movies")
    .insert([
      { title, year, description, poster_url, banner_url, trailer_url },
    ]);

  if (error) return res.status(500).json(error);
  res.json({ message: "Movie added", data });
});

router.put("/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("movies").update(req.body).eq("id", id);

  if (error) return res.status(500).json(error);
  res.json({ message: "Movie updated" });
});

router.delete("/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("movies").delete().eq("id", id);

  if (error) return res.status(500).json(error);
  res.json({ message: "Movie deleted" });
});

// MOVIE FULL DETAILS
// MOVIE FULL DETAILS
router.get("/:id/details", async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await supabase
      .from("movies")
      .select("*")
      .eq("id", id)
      .single();

    const cast = await supabase
      .from("movie_cast")
      .select("*")
      .eq("movie_id", id);

    const crew = await supabase
      .from("movie_crew")
      .select("*")
      .eq("movie_id", id);

    const director = await supabase
      .from("movie_director")
      .select("*")
      .eq("movie_id", id);

    const music = await supabase
      .from("movie_music")
      .select("*")
      .eq("movie_id", id);

    const production = await supabase
      .from("movie_production")
      .select("*")
      .eq("movie_id", id);

    const photos = await supabase
      .from("movie_photos")
      .select("*")
      .eq("movie_id", id);

    const songs = await supabase
      .from("movie_songs")
      .select("*")
      .eq("movie_id", id);

    // ✅ NEW
    const teasers = await supabase
      .from("movie_teasers")
      .select("*")
      .eq("movie_id", id);

    // ✅ NEW
    const links = await supabase
      .from("movie_links")
      .select("*")
      .eq("movie_id", id);

    res.json({
      ...movie.data,
      cast: cast.data || [],
      crew: crew.data || [],
      director: director.data || [],
      music: music.data || [],
      production: production.data || [],
      photos: photos.data || [],
      songs: songs.data || [],
      teasers: teasers.data || [], // 🎬
      links: links.data || [], // 🔗
    });
  } catch (err) {
    console.error("MOVIE DETAILS ERROR:", err);
    res.status(500).json({ message: "Failed to load movie details" });
  }
});

// ADD CAST
router.post("/:id/cast", verifyAdmin, async (req, res) => {
  const { name, role, photo_url } = req.body;

  const { error } = await supabase.from("movie_cast").insert({
    movie_id: req.params.id,
    name,
    role,
    photo_url,
  });

  if (error) return res.status(500).json(error);
  res.json({ message: "Cast added" });
});

router.put("/cast/:cid", verifyAdmin, async (req, res) => {
  const { name, role, photo_url } = req.body;

  const { error } = await supabase
    .from("movie_cast")
    .update({ name, role, photo_url })
    .eq("id", req.params.cid);

  if (error) return res.status(500).json(error);
  res.json({ message: "Cast updated" });
});

router.delete("/cast/:cid", verifyAdmin, async (req, res) => {
  const { error } = await supabase
    .from("movie_cast")
    .delete()
    .eq("id", req.params.cid);

  if (error) return res.status(500).json(error);
  res.json({ message: "Cast deleted" });
});

// ADD CREW

router.post("/:id/crew", verifyAdmin, async (req, res) => {
  const { name, job, photo_url } = req.body;

  if (!name || !job) {
    return res.status(400).json({ message: "Name and job are required" });
  }

  const { error } = await supabase.from("movie_crew").insert({
    movie_id: req.params.id,
    name,
    job,
    photo_url,
  });

  if (error) {
    console.error("CREW INSERT ERROR:", error);
    return res.status(500).json(error);
  }

  res.json({ message: "Crew added" });
});
//crew extra
router.put("/crew/:cid", verifyAdmin, async (req, res) => {
  const { name, job, photo_url } = req.body;

  const { error } = await supabase
    .from("movie_crew")
    .update({ name, job, photo_url })
    .eq("id", req.params.cid);

  if (error) return res.status(500).json(error);
  res.json({ message: "Crew updated" });
});

router.delete("/crew/:cid", verifyAdmin, async (req, res) => {
  const { error } = await supabase
    .from("movie_crew")
    .delete()
    .eq("id", req.params.cid);

  if (error) return res.status(500).json(error);
  res.json({ message: "Crew deleted" });
});

// ADD DIRECTOR
router.post("/:id/director", verifyAdmin, async (req, res) => {
  const { name, photo_url } = req.body;

  await supabase.from("movie_director").insert({
    movie_id: req.params.id,
    name,
    photo_url,
  });

  res.json({ message: "Director added" });
});

//director extra
router.put("/director/:cid", verifyAdmin, async (req, res) => {
  const { name, photo_url } = req.body;

  const { error } = await supabase
    .from("movie_director")
    .update({ name, photo_url })
    .eq("id", req.params.cid);

  if (error) return res.status(500).json(error);
  res.json({ message: "Director updated" });
});

router.delete("/director/:cid", verifyAdmin, async (req, res) => {
  const { error } = await supabase
    .from("movie_director")
    .delete()
    .eq("id", req.params.cid);

  if (error) return res.status(500).json(error);
  res.json({ message: "Director deleted" });
});

//music extra
router.put("/music/:cid", verifyAdmin, async (req, res) => {
  const { name, photo_url } = req.body;

  const { error } = await supabase
    .from("movie_music")
    .update({ name, photo_url })
    .eq("id", req.params.cid);

  if (error) return res.status(500).json(error);
  res.json({ message: "Music updated" });
});

router.delete("/music/:cid", verifyAdmin, async (req, res) => {
  const { error } = await supabase
    .from("movie_music")
    .delete()
    .eq("id", req.params.cid);

  if (error) return res.status(500).json(error);
  res.json({ message: "Music deleted" });
});

// ADD MUSIC
router.post("/:id/music", verifyAdmin, async (req, res) => {
  const { name, photo_url } = req.body;

  await supabase.from("movie_music").insert({
    movie_id: req.params.id,
    name,
    photo_url,
  });

  res.json({ message: "Music added" });
});

// ADD PRODUCTION
router.post("/:id/production", verifyAdmin, async (req, res) => {
  const { name, role, photo_url } = req.body;

  const { error } = await supabase.from("movie_production").insert({
    movie_id: req.params.id,
    name,
    role,
    photo_url,
  });

  if (error) {
    console.error("PRODUCTION INSERT ERROR:", error);
    return res.status(500).json(error);
  }

  res.json({ message: "Production added" });
});

//production extra
router.put("/production/:cid", verifyAdmin, async (req, res) => {
  const { name, role, photo_url } = req.body;

  const { error } = await supabase
    .from("movie_production")
    .update({ name, role, photo_url })
    .eq("id", req.params.cid);

  if (error) return res.status(500).json(error);
  res.json({ message: "Production updated" });
});

router.delete("/production/:cid", verifyAdmin, async (req, res) => {
  const { error } = await supabase
    .from("movie_production")
    .delete()
    .eq("id", req.params.cid);

  if (error) return res.status(500).json(error);
  res.json({ message: "Production deleted" });
});

// ADD PHOTOS
router.post("/:id/photos", verifyAdmin, async (req, res) => {
  const { image_url } = req.body;

  await supabase.from("movie_photos").insert({
    movie_id: req.params.id,
    image_url,
  });

  res.json({ message: "Photo added" });
});
//gallery extra
router.delete("/photos/:cid", verifyAdmin, async (req, res) => {
  const { error } = await supabase
    .from("movie_photos")
    .delete()
    .eq("id", req.params.cid);

  if (error) return res.status(500).json(error);
  res.json({ message: "Photo deleted" });
});

router.post("/:id/songs", verifyAdmin, async (req, res) => {
  const {
    song_title,
    singers,
    chorus_singers,
    music_directors,
    song_url,
    audio_url,
    cover_url,
  } = req.body;

  if (!song_title) {
    return res.status(400).json({ message: "Song title is required" });
  }

  const { error } = await supabase.from("movie_songs").insert({
    movie_id: req.params.id,
    song_title,
    singers,
    chorus_singers,
    music_directors,
    song_url,
    audio_url,
    cover_url,
  });

  if (error) return res.status(500).json(error);

  res.json({ message: "Song added" });
});

router.put("/songs/:sid", verifyAdmin, async (req, res) => {
  const { error } = await supabase
    .from("movie_songs")
    .update(req.body)
    .eq("id", req.params.sid);

  if (error) return res.status(500).json(error);

  res.json({ message: "Song updated" });
});
router.delete("/songs/:sid", verifyAdmin, async (req, res) => {
  const { error } = await supabase
    .from("movie_songs")
    .delete()
    .eq("id", req.params.sid);

  if (error) return res.status(500).json(error);

  res.json({ message: "Song deleted" });
});

// ADD TEASER
router.post("/:id/teasers", verifyAdmin, async (req, res) => {
  const { title, teaser_url, type } = req.body;

  if (!teaser_url) {
    return res.status(400).json({ message: "Teaser URL required" });
  }

  const { error } = await supabase.from("movie_teasers").insert({
    movie_id: req.params.id,
    title,
    teaser_url,
    type,
  });

  if (error) return res.status(500).json(error);
  res.json({ message: "Teaser added" });
});

// UPDATE TEASER
router.put("/teasers/:tid", verifyAdmin, async (req, res) => {
  await supabase
    .from("movie_teasers")
    .update(req.body)
    .eq("id", req.params.tid);
  res.json({ message: "Teaser updated" });
});

// DELETE TEASER
router.delete("/teasers/:tid", verifyAdmin, async (req, res) => {
  await supabase.from("movie_teasers").delete().eq("id", req.params.tid);
  res.json({ message: "Teaser deleted" });
});
//movie links routes
// ================== MOVIE LINKS ==================

// ADD LINK
router.post("/:id/links", verifyAdmin, async (req, res) => {
  const { title, url, platform } = req.body;

  if (!title || !url) {
    return res.status(400).json({ message: "Title and URL are required" });
  }

  const { error } = await supabase.from("movie_links").insert({
    movie_id: req.params.id,
    title,
    url,
    platform,
  });

  if (error) {
    console.error("MOVIE LINKS INSERT ERROR:", error);
    return res.status(500).json(error);
  }

  res.json({ message: "Link added" });
});

// UPDATE LINK
router.put("/links/:lid", verifyAdmin, async (req, res) => {
  const { error } = await supabase
    .from("movie_links")
    .update(req.body)
    .eq("id", req.params.lid);

  if (error) return res.status(500).json(error);

  res.json({ message: "Link updated" });
});

// DELETE LINK
router.delete("/links/:lid", verifyAdmin, async (req, res) => {
  const { error } = await supabase
    .from("movie_links")
    .delete()
    .eq("id", req.params.lid);

  if (error) return res.status(500).json(error);

  res.json({ message: "Link deleted" });
});

export default router;

// import express from "express";
// import { supabase } from "../config/supabase.js";
// import { verifyAdmin } from "../middleware/auth.js";

// const router = express.Router();

// // PUBLIC
// router.get("/", async (req, res) => {
//   const { data, error } = await supabase.from("movies").select("*");
//   if (error) return res.status(500).json(error);
//   res.json(data);
// });

// // ADMIN ONLY
// router.post("/", verifyAdmin, async (req, res) => {
//   const { title, year, description, poster_url, banner_url, trailer_url } =
//     req.body;

//   const { data, error } = await supabase
//     .from("movies")
//     .insert([
//       { title, year, description, poster_url, banner_url, trailer_url },
//     ]);

//   if (error) return res.status(500).json(error);
//   res.json({ message: "Movie added", data });
// });

// router.put("/:id", verifyAdmin, async (req, res) => {
//   const { id } = req.params;

//   const { error } = await supabase.from("movies").update(req.body).eq("id", id);

//   if (error) return res.status(500).json(error);
//   res.json({ message: "Movie updated" });
// });

// router.delete("/:id", verifyAdmin, async (req, res) => {
//   const { id } = req.params;

//   const { error } = await supabase.from("movies").delete().eq("id", id);

//   if (error) return res.status(500).json(error);
//   res.json({ message: "Movie deleted" });
// });

// // MOVIE FULL DETAILS
// // MOVIE FULL DETAILS
// router.get("/:id/details", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const movie = await supabase
//       .from("movies")
//       .select("*")
//       .eq("id", id)
//       .single();

//     const cast = await supabase
//       .from("movie_cast")
//       .select("*")
//       .eq("movie_id", id);

//     const crew = await supabase
//       .from("movie_crew")
//       .select("*")
//       .eq("movie_id", id);

//     const director = await supabase
//       .from("movie_director")
//       .select("*")
//       .eq("movie_id", id);

//     const music = await supabase
//       .from("movie_music")
//       .select("*")
//       .eq("movie_id", id);

//     const production = await supabase
//       .from("movie_production")
//       .select("*")
//       .eq("movie_id", id);

//     const photos = await supabase
//       .from("movie_photos")
//       .select("*")
//       .eq("movie_id", id);

//     const songs = await supabase
//       .from("movie_songs")
//       .select("*")
//       .eq("movie_id", id);

//     // ✅ NEW
//     const teasers = await supabase
//       .from("movie_teasers")
//       .select("*")
//       .eq("movie_id", id);

//     // ✅ NEW
//     const links = await supabase
//       .from("movie_links")
//       .select("*")
//       .eq("movie_id", id);

//     res.json({
//       ...movie.data,
//       cast: cast.data || [],
//       crew: crew.data || [],
//       director: director.data || [],
//       music: music.data || [],
//       production: production.data || [],
//       photos: photos.data || [],
//       songs: songs.data || [],
//       teasers: teasers.data || [], // 🎬
//       links: links.data || [], // 🔗
//     });
//   } catch (err) {
//     console.error("MOVIE DETAILS ERROR:", err);
//     res.status(500).json({ message: "Failed to load movie details" });
//   }
// });

// // ADD CAST
// router.post("/:id/cast", verifyAdmin, async (req, res) => {
//   const { name, role, photo_url } = req.body;

//   const { error } = await supabase.from("movie_cast").insert({
//     movie_id: req.params.id,
//     name,
//     role,
//     photo_url,
//   });

//   if (error) return res.status(500).json(error);
//   res.json({ message: "Cast added" });
// });

// router.put("/cast/:cid", verifyAdmin, async (req, res) => {
//   const { name, role, photo_url } = req.body;

//   const { error } = await supabase
//     .from("movie_cast")
//     .update({ name, role, photo_url })
//     .eq("id", req.params.cid);

//   if (error) return res.status(500).json(error);
//   res.json({ message: "Cast updated" });
// });

// router.delete("/cast/:cid", verifyAdmin, async (req, res) => {
//   const { error } = await supabase
//     .from("movie_cast")
//     .delete()
//     .eq("id", req.params.cid);

//   if (error) return res.status(500).json(error);
//   res.json({ message: "Cast deleted" });
// });

// // ADD CREW

// router.post("/:id/crew", verifyAdmin, async (req, res) => {
//   const { name, job, photo_url } = req.body;

//   if (!name || !job) {
//     return res.status(400).json({ message: "Name and job are required" });
//   }

//   const { error } = await supabase.from("movie_crew").insert({
//     movie_id: req.params.id,
//     name,
//     job,
//     photo_url,
//   });

//   if (error) {
//     console.error("CREW INSERT ERROR:", error);
//     return res.status(500).json(error);
//   }

//   res.json({ message: "Crew added" });
// });
// //crew extra
// router.put("/crew/:cid", verifyAdmin, async (req, res) => {
//   const { name, job, photo_url } = req.body;

//   const { error } = await supabase
//     .from("movie_crew")
//     .update({ name, job, photo_url })
//     .eq("id", req.params.cid);

//   if (error) return res.status(500).json(error);
//   res.json({ message: "Crew updated" });
// });

// router.delete("/crew/:cid", verifyAdmin, async (req, res) => {
//   const { error } = await supabase
//     .from("movie_crew")
//     .delete()
//     .eq("id", req.params.cid);

//   if (error) return res.status(500).json(error);
//   res.json({ message: "Crew deleted" });
// });

// // ADD DIRECTOR
// router.post("/:id/director", verifyAdmin, async (req, res) => {
//   const { name, photo_url } = req.body;

//   await supabase.from("movie_director").insert({
//     movie_id: req.params.id,
//     name,
//     photo_url,
//   });

//   res.json({ message: "Director added" });
// });

// //director extra
// router.put("/director/:cid", verifyAdmin, async (req, res) => {
//   const { name, photo_url } = req.body;

//   const { error } = await supabase
//     .from("movie_director")
//     .update({ name, photo_url })
//     .eq("id", req.params.cid);

//   if (error) return res.status(500).json(error);
//   res.json({ message: "Director updated" });
// });

// router.delete("/director/:cid", verifyAdmin, async (req, res) => {
//   const { error } = await supabase
//     .from("movie_director")
//     .delete()
//     .eq("id", req.params.cid);

//   if (error) return res.status(500).json(error);
//   res.json({ message: "Director deleted" });
// });

// //music extra
// router.put("/music/:cid", verifyAdmin, async (req, res) => {
//   const { name, photo_url } = req.body;

//   const { error } = await supabase
//     .from("movie_music")
//     .update({ name, photo_url })
//     .eq("id", req.params.cid);

//   if (error) return res.status(500).json(error);
//   res.json({ message: "Music updated" });
// });

// router.delete("/music/:cid", verifyAdmin, async (req, res) => {
//   const { error } = await supabase
//     .from("movie_music")
//     .delete()
//     .eq("id", req.params.cid);

//   if (error) return res.status(500).json(error);
//   res.json({ message: "Music deleted" });
// });

// // ADD MUSIC
// router.post("/:id/music", verifyAdmin, async (req, res) => {
//   const { name, photo_url } = req.body;

//   await supabase.from("movie_music").insert({
//     movie_id: req.params.id,
//     name,
//     photo_url,
//   });

//   res.json({ message: "Music added" });
// });

// // ADD PRODUCTION
// router.post("/:id/production", verifyAdmin, async (req, res) => {
//   const { name, role, photo_url } = req.body;

//   const { error } = await supabase.from("movie_production").insert({
//     movie_id: req.params.id,
//     name,
//     role,
//     photo_url,
//   });

//   if (error) {
//     console.error("PRODUCTION INSERT ERROR:", error);
//     return res.status(500).json(error);
//   }

//   res.json({ message: "Production added" });
// });

// //production extra
// router.put("/production/:cid", verifyAdmin, async (req, res) => {
//   const { name, role, photo_url } = req.body;

//   const { error } = await supabase
//     .from("movie_production")
//     .update({ name, role, photo_url })
//     .eq("id", req.params.cid);

//   if (error) return res.status(500).json(error);
//   res.json({ message: "Production updated" });
// });

// router.delete("/production/:cid", verifyAdmin, async (req, res) => {
//   const { error } = await supabase
//     .from("movie_production")
//     .delete()
//     .eq("id", req.params.cid);

//   if (error) return res.status(500).json(error);
//   res.json({ message: "Production deleted" });
// });

// // ADD PHOTOS
// router.post("/:id/photos", verifyAdmin, async (req, res) => {
//   const { image_url } = req.body;

//   await supabase.from("movie_photos").insert({
//     movie_id: req.params.id,
//     image_url,
//   });

//   res.json({ message: "Photo added" });
// });
// //gallery extra
// router.delete("/photos/:cid", verifyAdmin, async (req, res) => {
//   const { error } = await supabase
//     .from("movie_photos")
//     .delete()
//     .eq("id", req.params.cid);

//   if (error) return res.status(500).json(error);
//   res.json({ message: "Photo deleted" });
// });

// router.post("/:id/songs", verifyAdmin, async (req, res) => {
//   const {
//     song_title,
//     singers,
//     chorus_singers,
//     music_directors,
//     song_url,
//     audio_url,
//     cover_url,
//   } = req.body;

//   if (!song_title) {
//     return res.status(400).json({ message: "Song title is required" });
//   }

//   const { error } = await supabase.from("movie_songs").insert({
//     movie_id: req.params.id,
//     song_title,
//     singers,
//     chorus_singers,
//     music_directors,
//     song_url,
//     audio_url,
//     cover_url,
//   });

//   if (error) return res.status(500).json(error);

//   res.json({ message: "Song added" });
// });

// router.put("/songs/:sid", verifyAdmin, async (req, res) => {
//   const { error } = await supabase
//     .from("movie_songs")
//     .update(req.body)
//     .eq("id", req.params.sid);

//   if (error) return res.status(500).json(error);

//   res.json({ message: "Song updated" });
// });
// router.delete("/songs/:sid", verifyAdmin, async (req, res) => {
//   const { error } = await supabase
//     .from("movie_songs")
//     .delete()
//     .eq("id", req.params.sid);

//   if (error) return res.status(500).json(error);

//   res.json({ message: "Song deleted" });
// });

// // ADD TEASER
// router.post("/:id/teasers", verifyAdmin, async (req, res) => {
//   const { title, teaser_url, type } = req.body;

//   if (!teaser_url) {
//     return res.status(400).json({ message: "Teaser URL required" });
//   }

//   const { error } = await supabase.from("movie_teasers").insert({
//     movie_id: req.params.id,
//     title,
//     teaser_url,
//     type,
//   });

//   if (error) return res.status(500).json(error);
//   res.json({ message: "Teaser added" });
// });

// // UPDATE TEASER
// router.put("/teasers/:tid", verifyAdmin, async (req, res) => {
//   await supabase
//     .from("movie_teasers")
//     .update(req.body)
//     .eq("id", req.params.tid);
//   res.json({ message: "Teaser updated" });
// });

// // DELETE TEASER
// router.delete("/teasers/:tid", verifyAdmin, async (req, res) => {
//   await supabase.from("movie_teasers").delete().eq("id", req.params.tid);
//   res.json({ message: "Teaser deleted" });
// });

// export default router;
