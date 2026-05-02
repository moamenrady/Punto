const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const notificationsController = require("../controllers/notificationsController");

// Protect all routes
router.use(authController.protect);

// ── ACTUAL NOTIFICATIONS ──
router.get("/",   notificationsController.getNotifications);
router.patch("/read-all", notificationsController.markAllAsRead);
router.patch("/:id/read", notificationsController.markAsRead);

// ── SETTINGS ──
router.get("/settings",   notificationsController.getNotificationSettings);
router.patch("/settings", notificationsController.updateNotificationSettings);

module.exports = router;