const express = require("express");
const sprintController = require("../controllers/sprintController");
const authController = require("../controllers/authController");
const baseController = require("../controllers/baseController");

const router = express.Router({ mergeParams: true });

// PROTECT ALL ROUTES
router.use(authController.protect);
router.use(authController.checkFeature("Project Management"));

router
  .route("/")
  .get(sprintController.getAllSprints)
  .post(
    sprintController.setProjectId,
    baseController.setCreatedBy,
    sprintController.createSprint
  );

router
  .route("/:id")
  .get(sprintController.getSprint)
  .patch(sprintController.updateSprint)
  .delete(sprintController.deleteSprint);

// ── Sprint Analytics ──
router.get("/analytics/burndown/:sprintId", sprintController.getActiveSprintBurndown);
router.get("/analytics/velocity/:projectId", sprintController.getSprintVelocityAndCompletion);
router.get("/analytics/status-overview", sprintController.getAllSprintsStatusOverview);
router.get("/analytics/global-kpis", sprintController.getFinalGlobalKPIs);

module.exports = router;
