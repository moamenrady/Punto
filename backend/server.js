const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });
console.log("MONGO_URL =", process.env.MONGO_URL);
const DB = process.env.MONGO_URL.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD || ""
);

// Connect to MongoDB
mongoose
  .connect(DB)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("💥 UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// Load app
const app = require("./app");

// Start server
const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`🚀 App running on port ${port}...`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("💥 UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
