const express = require("express");
const taskController = require("../controllers/taskController");
const authController = require("../controllers/authController");
const baseController = require("../controllers/baseController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(taskController.getAllTasks)
  .post(
    authController.protect,
    baseController.setCreatedBy,
    taskController.setBacklogOrSprintId,
    taskController.createTask
  );

router
  .route("/:id")
  .get(taskController.getTask)
  .patch(authController.protect, taskController.updateTask)
  .delete(authController.protect, taskController.deleteTask);

module.exports = router;
