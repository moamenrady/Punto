require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const morgan = require("morgan");

const authRoutes = require("./routes/auth");
const ticketRoutes = require("./routes/tickets");

const app = express();

// Middleware
app.use(express.json());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Database pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Attach pool to every request
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

//// Test DB connection // //  comment until connect to database
// pool
//   .connect()
//   .then(() => console.log("✅ Connected to PostgreSQL database"))
//   .catch((err) => console.error("❌ Database connection error:", err.stack));

// Routes

// app.use("/api/auth", authRoutes);
// app.use("/api/tickets", ticketRoutes);

app.get("/", (req, res) => {
  res.send("OmniSuite Backend is running! 🚀");
});

module.exports = app;
