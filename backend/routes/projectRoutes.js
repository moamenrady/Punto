const express = require("express");
const projectController = require("../controllers/projectController");
const taskController    = require("../controllers/taskController");
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

router
  .route("/:id/members")
  .post(authController.protect, projectController.addMember);

router
  .route("/:id/members/:userId")
  .delete(authController.protect, projectController.removeMember);

// All tasks across every backlog of a project
router
  .route("/:id/tasks")
  .get(authController.protect, taskController.getProjectTasks);

module.exports = router;
