const Task    = require("../models/taskModel");
const Backlog = require("../models/backlogModel");
const catchAsync = require("../utils/catchAsync");
const AppError   = require("../utils/appError");
const factory = require("./handlerFactory");

// Middleware: set backlog_id or sprint_id from params if missing in body
exports.setBacklogOrSprintId = (req, res, next) => {
  if (!req.body.backlog_id && req.params.backlogId)
    req.body.backlog_id = req.params.backlogId;
  if (!req.body.sprint_id && req.params.sprintId)
    req.body.sprint_id = req.params.sprintId;
  next();
};

// Use factory for basic CRUD
exports.createTask = factory.createOne(Task);
exports.getTask = factory.getOne(Task);
exports.updateTask = factory.updateOne(Task);
exports.deleteTask = factory.deleteOne(Task);

// GET ALL (supports optional filtering by backlogId or sprintId via params)
exports.getAllTasks = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.params.backlogId) filter.backlog_id = req.params.backlogId;
  if (req.params.sprintId) filter.sprint_id = req.params.sprintId;
  
  // Mandatory company scope
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  const tasks = await Task.find(filter);
  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: { tasks },
  });
});

// GET tasks assigned to the currently logged-in user
exports.getMyTasks = catchAsync(async (req, res, next) => {
  // Scoped by user ID and company
  const filter = { assigned_to: req.user.id };
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  const tasks = await Task.find(filter);
  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: { tasks },
  });
});

// GET all tasks across every backlog of a project
exports.getProjectTasks = catchAsync(async (req, res, next) => {
  const companyScope = req.user?.company_id ? { company_id: req.user.company_id } : {};

  const backlogs = await Backlog.find({ 
    project_id: req.params.id,
    ...companyScope
  });

  const backlogIds  = backlogs.map(b => b._id);
  const tasks = await Task.find({ 
    backlog_id: { $in: backlogIds },
    ...companyScope
  });

  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: { tasks },
  });
});
