const express = require("express");
const paymentController = require("../controllers/paymentController");
const authController = require("../controllers/authController");

const router = express.Router();

// Public webhook endpoint called by Paymob servers
router.post("/webhook", paymentController.webhook);

// Verification route
router.post("/verify-status", authController.protect, paymentController.verifyStatus);

// Protect all other routes
router.use(authController.protect);

// Create checkout session
router.post("/checkout", paymentController.checkout);

module.exports = router;