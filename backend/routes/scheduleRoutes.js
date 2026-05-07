const express = require("express");
const scheduleController = require("../controllers/scheduleController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router.use(authController.checkFeature("Project Management"));

// Current user's own schedule
router.get("/me", scheduleController.getMySchedule);

// Team schedules for a project (any authenticated user in that project can read)
router.get("/project/:projectId", scheduleController.getProjectSchedules);

// Admin-only: create / update / delete
router.post(
  "/",
  authController.restrictTo("admin", "manager"),
  scheduleController.upsertSchedule
);
router.patch(
  "/:id/entry",
  authController.restrictTo("admin", "manager"),
  scheduleController.updateScheduleEntry
);
router.delete(
  "/:id",
  authController.restrictTo("admin", "manager"),
  scheduleController.deleteSchedule
);

module.exports = router;
