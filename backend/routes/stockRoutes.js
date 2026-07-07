const express = require("express");
const stockController = require("../controllers/stockController");
const authController = require("../controllers/authController");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }); // بنستخدم الذاكرة المؤقتة عشان نقدر نقرأ الملف مباشرة بدون ما نحفظه على السيرفر

const router = express.Router();

// All stock routes require login
router.use(authController.protect);
router.use(authController.checkFeature("Stock Management"));

router
  .route("/")
  .get(stockController.getAllStock)
  .post(authController.restrictTo("manager"), stockController.createStock);

router
  .route("/:id")
  .get(stockController.getOneStock)
  .patch(authController.restrictTo("manager"), stockController.updateStock)
  .delete(authController.restrictTo("manager"), stockController.deleteStock);

// اتأكد إنك مستدعي authController عشان الـ protect
router.post(
  "/upload",
  authController.protect,
  upload.single("file"), // 'file' ده اسم الحقل اللي إنت كتبته في الرياكت
  stockController.uploadCSV,
);

module.exports = router;
