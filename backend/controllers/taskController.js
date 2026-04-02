const Task = require("../models/taskModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Middleware: set backlog_id or sprint_id from params if missing in body
exports.setBacklogOrSprintId = (req, res, next) => {
  if (!req.body.backlog_id && req.params.backlogId)
    req.body.backlog_id = req.params.backlogId;
  if (!req.body.sprint_id && req.params.sprintId)
    req.body.sprint_id = req.params.sprintId;
  next();
};

// CREATE
exports.createTask = catchAsync(async (req, res, next) => {
  // expecting req.body to now include backlog_id or sprint_id if created via nested route
  const task = await Task.create(req.body);

  res.status(201).json({
    status: "success",
    data: { task },
  });
});

// GET ALL (supports optional filtering by backlogId or sprintId via params)
exports.getAllTasks = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.params.backlogId) filter.backlog_id = req.params.backlogId;
  if (req.params.sprintId) filter.sprint_id = req.params.sprintId;

  const tasks = await Task.find(filter);
  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: { tasks },
  });
});

// GET ONE
exports.getTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) return next(new AppError("Task not found", 404));

  res.status(200).json({ status: "success", data: { task } });
});

// UPDATE
exports.updateTask = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!task) return next(new AppError("Task not found", 404));
  res.status(200).json({ status: "success", data: { task } });
});

// DELETE
exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return next(new AppError("Task not found", 404));
  res.status(204).json({ status: "success", data: null });
});
