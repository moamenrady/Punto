const express = require("express");
const taskController = require("../controllers/taskController");
const authController = require("../controllers/authController");
const baseController = require("../controllers/baseController");

const router = express.Router({ mergeParams: true });

// PROTECT ALL ROUTES
router.use(authController.protect);

// Standalone route — must be before /:id to avoid conflict
router.get("/my", taskController.getMyTasks);

router
  .route("/")
  .get(taskController.getAllTasks)
  .post(
    baseController.setCreatedBy,
    taskController.setBacklogOrSprintId,
    taskController.createTask
  );

router
  .route("/:id")
  .get(taskController.getTask)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
