const express = require("express");
const backlogController = require("../controllers/backlogController");
const authController = require("../controllers/authController");
const baseController = require("../controllers/baseController");

const router = express.Router({ mergeParams: true });

// PROTECT ALL ROUTES
router.use(authController.protect);
router.use(authController.checkFeature("Project Management"));

router
  .route("/")
  .get(backlogController.getAllBacklogs)
  .post(
    baseController.setCreatedBy,
    backlogController.setProjectId,
    backlogController.createBacklog
  );

router
  .route("/:id")
  .get(backlogController.getBacklog)
  .patch(backlogController.updateBacklog)
  .delete(backlogController.deleteBacklog);

module.exports = router;
