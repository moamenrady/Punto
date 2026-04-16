require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");
// const { pool } = require("./db");

const morgan = require("morgan");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
// const httpStatusCode = require("./utils/httpStatusCode");

// const authRoutes = require("./routes/auth");
const ticketRoutes = require("./routes/ticketRoutes");
const projectRoutes = require("./routes/projectRoutes");
const backlogRoutes = require("./routes/backlogRoutes");
const taskRoutes = require("./routes/taskRoutes");
const sprintRoutes = require("./routes/sprintRoutes");
const userRoutes = require("./routes/userRoutes");
const stockRoutes = require("./routes/stockRoutes");
// Middleware
app.use(express.json());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());

// Attach pool to every request sql server

// app.use((req, res, next) => {
//   req.db = pool;
//   next();
// });

// Routes

// app.use("/api/auth", authRoutes);
app.use("/api/v1/tickets", ticketRoutes);
app.use("/api/v1/projects", projectRoutes);

// app.use("/api/v1/backlogs", backlogRoutes);
app.use("/api/v1/projects/:projectId/backlogs", backlogRoutes);

// app.use("/api/v1/sprints", sprintRoutes);
app.use("/api/v1/projects/:projectId/sprints", sprintRoutes);

// app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/backlogs/:backlogId/tasks", taskRoutes);
app.use("/api/v1/sprints/:sprintId/tasks", taskRoutes);

app.use("/api/v1/stock", stockRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/auth", userRoutes);

app.get("/", (req, res) => {
  res.send("OmniSuite Backend is running! 🚀");
});

//last route for handle error
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
