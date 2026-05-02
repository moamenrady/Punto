const express = require("express");
const sprintController = require("../controllers/sprintController");
const authController = require("../controllers/authController");
const baseController = require("../controllers/baseController");

const router = express.Router({ mergeParams: true });

// PROTECT ALL ROUTES
router.use(authController.protect);

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

module.exports = router;
