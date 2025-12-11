const express = require("express");
const taskController = require("../controllers/taskController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(taskController.getAllTasks)
  .post(taskController.setBacklogOrSprintId, taskController.createTask);

router
  .route("/:id")
  .get(taskController.getTask)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
