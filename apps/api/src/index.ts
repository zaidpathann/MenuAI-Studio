import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import designRoutes from "./routes/designs.js";
import accessRoutes from "./routes/access.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { seedAdminUser } from "./utils/seedAdminUser.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

const allowedOrigins = process.env.CLIENT_APP_URL
  ? process.env.CLIENT_APP_URL.split(",").map((s) => s.trim())
  : ["http://localhost:5173", "http://localhost:3000", "http://localhost:5000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(origin) ||
        !process.env.CLIENT_APP_URL
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true
  })
);
app.use(express.json({ limit: "20mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "menuai-studio-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/designs", designRoutes);
app.use("/api/access", accessRoutes);
app.use(errorHandler);

async function startServer() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is required");
  }

  await mongoose.connect(mongoUri);
  await seedAdminUser();

  app.listen(port, () => {
    console.log(`MenuAI Studio API running on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start API server", error);
  process.exit(1);
});
