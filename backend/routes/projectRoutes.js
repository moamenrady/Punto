const express = require("express");
const projectController = require("../controllers/projectController");
const baseController = require("../controllers/baseController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(projectController.getAllProjects)
  .post(
    authController.protect,
    baseController.setCreatedBy,
    projectController.createProject
  );

router
  .route("/:id")
  .get(projectController.getProject)
  .patch(authController.protect, projectController.updateProject)
  .delete(authController.protect, projectController.deleteProject);

module.exports = router;
