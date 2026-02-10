import express from "express";
import { supabase } from "../config/supabase.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

/* =========================
   PUBLIC
========================= */

// Get all awards (with movie info)
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("awards")
    .select(
      `
      id,
      award_name,
      year,
      created_at,
      movies (
        id,
        title,
        poster_url
      )
    `,
    )
    .order("year", { ascending: false });

  if (error) {
    console.error("AWARDS FETCH ERROR:", error);
    return res.status(500).json(error);
  }

  res.json(data);
});

// Get awards by movie
router.get("/movie/:movieId", async (req, res) => {
  const { movieId } = req.params;

  const { data, error } = await supabase
    .from("awards")
    .select("*")
    .eq("movie_id", movieId);

  if (error) return res.status(500).json(error);
  res.json(data);
});

/* =========================
   ADMIN ONLY
========================= */

// Add award
router.post("/", verifyAdmin, async (req, res) => {
  const { movie_id, award_name, year } = req.body;

  if (!award_name) {
    return res.status(400).json({ message: "Award name is required" });
  }

  const { error } = await supabase.from("awards").insert({
    movie_id,
    award_name,
    year,
  });

  if (error) {
    console.error("AWARD INSERT ERROR:", error);
    return res.status(500).json(error);
  }

  res.json({ message: "Award added successfully" });
});

// Update award
router.put("/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("awards").update(req.body).eq("id", id);

  if (error) return res.status(500).json(error);
  res.json({ message: "Award updated" });
});

// Delete award
router.delete("/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("awards").delete().eq("id", id);

  if (error) return res.status(500).json(error);
  res.json({ message: "Award deleted" });
});

export default router;
