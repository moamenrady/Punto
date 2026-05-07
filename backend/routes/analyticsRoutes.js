const express = require("express");
const analyticsController = require("../controllers/analyticsController");
const authController = require("../controllers/authController");

const router = express.Router();

// PROTECT ALL ROUTES — admin/manager only
router.use(authController.protect);
router.use(authController.restrictTo("admin", "manager"));

// ── Work / Activity Analytics ──
router.get("/activity-heatmap", analyticsController.getActivityHeatmapFromWork);
router.get("/team-output", analyticsController.getTeamOutputComparison);
router.get("/member-workload", analyticsController.getMemberWorkload);

// ── Shift Analytics ──
router.get("/attendance-trend", analyticsController.getWeeklyAttendanceTrend);
router.get("/shift-analytics", analyticsController.getShiftAnalytics);

module.exports = router;
