const express = require("express");
const router = express.Router();
const { protect } = require("../controllers/authController");
const ctrl = require("../controllers/notificationsController");

router.get("/",   protect, ctrl.getNotifications);
router.patch("/", protect, ctrl.updateNotifications);

module.exports = router;