import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import pitchRoutes from "../Backend/routes/pitch.js";
import adminRoutes from "../Backend/routes/admin.js";
import movieRoutes from "../Backend/routes/movies.js";
import uploadRoutes from "../Backend/routes/upload.js";
import awardsRoutes from "../Backend/routes/awards.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/pitch", pitchRoutes);
app.use("/api/awards", awardsRoutes);

app.get("/api", (req, res) => {
  res.send("API running");
});

export default app;
