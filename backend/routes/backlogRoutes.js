const express = require("express");
const backlogController = require("../controllers/backlogController");
const authController = require("../controllers/authController");
const baseController = require("../controllers/baseController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(backlogController.getAllBacklogs)
  .post(
    authController.protect,
    baseController.setCreatedBy,
    backlogController.setProjectId,
    backlogController.createBacklog
  );

router
  .route("/:id")
  .get(backlogController.getBacklog)
  .patch(authController.protect, backlogController.updateBacklog)
  .delete(authController.protect, backlogController.deleteBacklog);

module.exports = router;
