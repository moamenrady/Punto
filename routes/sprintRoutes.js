const express = require("express");
const sprintController = require("../controllers/sprintController");
const authController = require("../controllers/authController");
const baseController = require("../controllers/baseController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(sprintController.getAllSprints)
  .post(
    authController.protect,
    sprintController.setProjectId,
    baseController.setCreatedBy,
    sprintController.createSprint
  );

router
  .route("/:id")
  .get(sprintController.getSprint)
  .patch(authController.protect, sprintController.updateSprint)
  .delete(authController.protect, sprintController.deleteSprint);

module.exports = router;
