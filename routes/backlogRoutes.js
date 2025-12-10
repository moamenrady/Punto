const express = require("express");
const backlogController = require("../controllers/backlogController");

const router = express.Router();

router
  .route("/")
  .get(backlogController.getAllBacklogs)
  .post(backlogController.createBacklog);

router
  .route("/:id")
  .get(backlogController.getBacklog)
  .patch(backlogController.updateBacklog)
  .delete(backlogController.deleteBacklog);

module.exports = router;
