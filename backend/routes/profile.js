// routes/profile.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { protect } = require("../controllers/authController");
const ctrl = require("../controllers/profileController");

// ── إعداد multer ──
const storage = multer.diskStorage({
  destination: "uploads/avatars/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.user.id}_${Date.now()}${ext}`);
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

router.get("/", protect, ctrl.getProfile);
router.put("/", protect, ctrl.updateProfile);

router.patch("/avatar", protect, upload.single("photo"), ctrl.uploadAvatar);
router.delete("/avatar", protect, ctrl.removeAvatar);

module.exports = router;
