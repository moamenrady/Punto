const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { protect, getMe } = require("../controllers/authController");
const multer = require("multer");
const path = require("path");

// const upload = multer({ storage: multer.memoryStorage() });

const storage = multer.diskStorage({
  destination: "uploads/avatars/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `admin_upload_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("صور فقط: jpg, png, webp"));
  },
});

const Router = express.Router();

Router.post("/signup", authController.signup);
Router.post("/login", authController.login);
Router.post("/forgotPassword", authController.forgetPassword);
Router.patch("/resetPassword/:token", authController.resetPassword);
Router.get("/verifyEmail/:token", authController.verifyEmail);

Router.get("/test-email", async (req, res) => {
  try {
    const sendEmail = require("../utils/email");
    const testEmail = req.query.email || "mon0995020@gmail.com";
    console.log(`🧪 Running test-email endpoint for: ${testEmail}`);
    await sendEmail({
      email: testEmail,
      subject: "Test Email from Punto",
      message: "If you receive this, it means your SMTP configuration is working perfectly on Railway!",
    });
    res.json({ status: "success", message: `Test email sent successfully to ${testEmail}!` });
  } catch (err) {
    console.error("🧪 test-email failed:", err);
    res.status(500).json({ 
      status: "error", 
      message: err.message, 
      stack: err.stack,
      env: {
        EMAIL_USERNAME: process.env.EMAIL_USERNAME ? "configured" : "missing",
        EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? "configured" : "missing"
      }
    });
  }
});

Router.get("/debug-env", (req, res) => {
  res.json({
    NODE_ENV: process.env.NODE_ENV || "not set",
    PORT: process.env.PORT || "not set",
    FRONTEND_URL: process.env.FRONTEND_URL || "not set",
    EMAIL_USERNAME: process.env.EMAIL_USERNAME || "not set",
    HAS_EMAIL_PASSWORD: !!process.env.EMAIL_PASSWORD,
    HAS_BREVO_API_KEY: !!process.env.BREVO_API_KEY,
    BREVO_API_KEY_PREFIX: process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.substring(0, 15) : "none"
  });
});

// Google Login
Router.get(
  "/google",
  (req, res, next) => {
    console.log("🚀 Google Auth flow started!");
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// Google Callback
Router.get(
  "/google/callback",
  (req, res, next) => {
    console.log("📥 Google Callback reached!");
    next();
  },
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5175"}/login`,
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5175"}/auth/google/success?token=${token}`,
    );
  },
);
// protect all routes after this middleware
Router.use(authController.protect);

Router.patch("/updatePassword/", authController.updatePassword);
Router.get("/me", authController.getMe);
Router.patch("/updateMe", userController.updateMe);
Router.delete("/deleteMe", userController.deleteMe);

Router.use(authController.restrictTo("admin", "manager"));
Router.route("/")
  .get(userController.getAllUsers)
  .post(upload.single("photo"), userController.createUser);

Router.route("/:id")
  .get(userController.getUser)
  .patch(upload.single("photo"), userController.updateUser)
  .delete(userController.deleteUser);

Router.get("/:id/photo", userController.getUserPhoto);

// ── User Analytics (admin/manager) ──
Router.get("/analytics/demographics", userController.getUserDemographics);
Router.get("/analytics/growth", userController.getUserGrowthTrend);
Router.get("/analytics/churn-risk", userController.getChurnRiskList);

module.exports = Router;
