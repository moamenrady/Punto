require("dotenv").config();
const express = require("express");
// const { pool } = require("./db");

const morgan = require("morgan");
const app = express();

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
// const httpStatusCode = require("./utils/httpStatusCode");
//

// const authRoutes = require("./routes/auth");
const ticketRoutes = require("./routes/ticketRoutes");
const projectRoutes = require("./routes/projectRoutes");
const backlogRoutes = require("./routes/backlogRoutes");
const taskRoutes = require("./routes/taskRoutes");

// Middleware
app.use(express.json());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Attach pool to every request sql server

// app.use((req, res, next) => {
//   req.db = pool;
//   next();
// });

// Routes

// app.use("/api/auth", authRoutes);
app.use("/api/v1/tickets", ticketRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/backlogs", backlogRoutes);
app.use("/api/v1/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("OmniSuite Backend is running! 🚀");
});

//last route for handle error
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
