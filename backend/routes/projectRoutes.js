const express = require("express");
const projectController = require("../controllers/projectController");
const taskController    = require("../controllers/taskController");
const baseController = require("../controllers/baseController");
const authController = require("../controllers/authController");

const router = express.Router();

// PROTECT ALL ROUTES
router.use(authController.protect);

router
  .route("/")
  .get(projectController.getAllProjects)
  .post(
    baseController.setCreatedBy,
    projectController.createProject
  );

router
  .route("/:id")
  .get(projectController.getProject)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);

router
  .route("/:id/members")
  .post(projectController.addMember);

router
  .route("/:id/members/:userId")
  .delete(projectController.removeMember);

// All tasks across every backlog of a project
router
  .route("/:id/tasks")
  .get(taskController.getProjectTasks);

module.exports = router;
