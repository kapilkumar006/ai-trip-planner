
// LOAD ENVIRONMENT VARIABLES FIRST
import "./config/env.js";

// IMPORTS
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../dist");

import tripRoutes from "./routes/tripRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

import db from "./config/db.js";
import connectMongoDB from "./config/mongodb.js";
import initDatabase from "./config/initDb.js";
import verifyToken from "./middleware/authMiddleware.js";

// CREATE EXPRESS APP
const app = express();
const PORT = process.env.PORT || 5000;

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      // or if origin is allowed or in development mode
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== "production"
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

// MIDDLEWARE
app.use(express.json());

// ROUTES
app.use("/api/destinations", destinationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/contact", contactRoutes);

// TEST MYSQL CONNECTION
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT 1 AS connected"
    );

    res.json({
      success: true,
      message: "MySQL database connected successfully",
      result: rows,
    });
  } catch (error) {
    console.error("MySQL connection error:", error);

    res.status(500).json({
      success: false,
      message: "MySQL database connection failed",
    });
  }
});

// PROTECTED TEST ROUTE
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    success: true,
    message: "You accessed a protected route.",
    user: req.user,
  });
});

// HEALTH & TEST SERVER ROUTE
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    message: "AI Trip Planner Express Server is running",
    timestamp: new Date().toISOString(),
  });
});

// SERVE PRODUCTION FRONTEND BUILD IF AVAILABLE
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // SPA Fallback for client-side routing (compatible with Express 4 and 5)
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      return res.sendFile(path.join(distPath, "index.html"));
    }
    next();
  });
} else {
  app.get("/", (req, res) => {
    res.json({
      message: "AI Trip Planner Express Server is running. Frontend build not detected in /dist.",
    });
  });
}

// START SERVER
const startServer = async () => {
  // Bind explicitly to 0.0.0.0 for containerized platforms (Railway, Render, Docker)
  app.listen(PORT, "0.0.0.0", async () => {
    console.log(`Server running on port ${PORT}`);

    try {
      // Connect MongoDB
      await connectMongoDB();

      // Verify and initialize MySQL tables
      await initDatabase();
      console.log("All database connections and tables verified.");
    } catch (error) {
      console.error("Database initialization notice:", error.message);
    }
  });
};

startServer();
