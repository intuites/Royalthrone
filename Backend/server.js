import dotenv from "dotenv";
dotenv.config(); // 👈 MUST BE FIRST

import express from "express";
import cors from "cors";
import pitchRoutes from "./routes/pitch.js";
import adminRoutes from "./routes/admin.js";
import movieRoutes from "./routes/movies.js";
import uploadRoutes from "./routes/upload.js";
import awardsRoutes from "./routes/awards.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/admin", adminRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/pitch", pitchRoutes);
app.use("/api/awards", awardsRoutes);
app.get("/", (_, res) => res.send("API running"));

app.listen(process.env.PORT, () =>
  console.log(`Backend running on port ${process.env.PORT}`),
);
