const express = require("express");
const paymentController = require("../controllers/paymentController");
const authController = require("../controllers/authController");

const router = express.Router();

// لازم يكون عامل Login
router.use(authController.protect);

// إنشاء عملية دفع
router.post("/checkout", paymentController.checkout);


module.exports = router;