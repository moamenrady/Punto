const express = require("express");
const planController = require("../controllers/planController");
const authController = require("../controllers/authController");

const router = express.Router();

// Protect all routes
router.use(authController.protect);

router
  .route("/")
  .get(planController.getAllPlans)
  .post(authController.restrictTo("admin"), planController.createPlan);

router
  .route("/:id")
  .get(planController.getPlan)
  .patch(authController.restrictTo("admin"), planController.updatePlan)
  .put(authController.restrictTo("admin"), planController.updatePlan)
  .delete(authController.restrictTo("admin"), planController.deletePlan);

module.exports = router;
