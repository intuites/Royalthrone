import express from "express";
import multer from "multer";
import { supabase } from "../config/supabase.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

/* Multer in memory */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

/* Upload image */
// router.post("/image", verifyAdmin, upload.single("file"), async (req, res) => {
//   try {
//     /* Validate file */
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const file = req.file;
//     const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, "")}`;

//     /* Upload to Supabase */
//     const { error } = await supabase.storage
//       .from("movies")
//       .upload(`posters/${fileName}`, file.buffer, {
//         contentType: file.mimetype,
//         upsert: true,
//       });

//     if (error) {
//       console.error("SUPABASE UPLOAD ERROR:", error);
//       return res.status(500).json({ message: "Upload failed" });
//     }

//     /* Get public URL */
//     const { data } = supabase.storage
//       .from("movies")
//       .getPublicUrl(`posters/${fileName}`);

//     if (!data?.publicUrl) {
//       return res.status(500).json({ message: "Failed to get image URL" });
//     }

//     res.json({ url: data.publicUrl });
//   } catch (err) {
//     console.error("UPLOAD CRASH:", err);
//     res.status(500).json({ message: "Server error during upload" });
//   }
// });
router.post("/image", verifyAdmin, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const cleanFileName = req.file.originalname
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9.-]/g, "_");

    const fileName = `${Date.now()}-${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("movies")
      .upload(`posters/${fileName}`, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      console.error("SUPABASE UPLOAD ERROR:", uploadError);
      return res.status(500).json({
        message: "Upload failed",
        details: uploadError.message,
      });
    }

    const { data: publicData } = supabase.storage
      .from("movies")
      .getPublicUrl(`posters/${fileName}`);

    res.json({ url: publicData.publicUrl });
  } catch (err) {
    console.error("UPLOAD CRASH:", err);
    res.status(500).json({ message: "Server error during upload" });
  }
});

export default router;

// import express from "express";
// import multer from "multer";
// import { supabase } from "../config/supabase.js";
// import { verifyAdmin } from "../middleware/auth.js";

// const router = express.Router();
// const upload = multer({ storage: multer.memoryStorage() });

// router.post("/image", verifyAdmin, upload.single("file"), async (req, res) => {
//   const file = req.file;
//   const fileName = `${Date.now()}-${file.originalname}`;

//   const { error } = await supabase.storage
//     .from("movies")
//     .upload(`posters/${fileName}`, file.buffer, {
//       contentType: file.mimetype,
//     });

//   if (error) return res.status(500).json(error);

//   const { data } = supabase.storage
//     .from("movies")
//     .getPublicUrl(`posters/${fileName}`);

//   res.json({ url: data.publicUrl });
// });

// export default router;
