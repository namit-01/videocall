import express from "express";
import { createServer } from "node:http";

import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { connectToSocket } from "./controllers/socketManager.js";
import userRoutes from "./routes/users.routes.js";
dotenv.config(); // ✅ Load .env file before using process.env

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.use(cors());
app.use(express.json());

// ✅ Read environment variables
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 8000;

// ✅ Check if MONGO_URL exists
if (!MONGO_URL) {
  console.error(
    "❌ MONGO_URL not found. Make sure .env file is in the root directory."
  );
  process.exit(1);
}

// ✅ Connect to MongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Test route
app.use("/api/v1/users", userRoutes);
app.get("/", (req, res) => {
  res.send("hi there");
});

// ✅ Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
