const express = require("express");
const sprintController = require("../controllers/sprintController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(sprintController.getAllSprints)
  .post(sprintController.setProjectId, sprintController.createSprint);

router
  .route("/:id")
  .get(sprintController.getSprint)
  .patch(sprintController.updateSprint)
  .delete(sprintController.deleteSprint);

module.exports = router;
