const Sprint = require("../models/sprintModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Middleware: set project_id from params if missing in body
exports.setProjectId = (req, res, next) => {
  if (!req.body.project_id && req.params.projectId)
    req.body.project_id = req.params.projectId;
  next();
};

// CREATE
exports.createSprint = catchAsync(async (req, res, next) => {
  const sprint = await Sprint.create(req.body);

  res.status(201).json({
    status: "success",
    data: { sprint },
  });
});

// GET ALL
exports.getAllSprints = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.params.projectId) filter.project_id = req.params.projectId;
  const sprints = await Sprint.find(filter);

  res.status(200).json({
    status: "success",
    results: sprints.length,
    data: { sprints },
  });
});

// GET ONE
exports.getSprint = catchAsync(async (req, res, next) => {
  const sprint = await Sprint.findById(req.params.id);

  if (!sprint) return next(new AppError("Sprint not found", 404));

  res.status(200).json({
    status: "success",
    data: { sprint },
  });
});

// UPDATE
exports.updateSprint = catchAsync(async (req, res, next) => {
  const sprint = await Sprint.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!sprint) return next(new AppError("Sprint not found", 404));

  res.status(200).json({
    status: "success",
    data: { sprint },
  });
});

// DELETE
exports.deleteSprint = catchAsync(async (req, res, next) => {
  const sprint = await Sprint.findByIdAndDelete(req.params.id);

  if (!sprint) return next(new AppError("Sprint not found", 404));

  res.status(204).json({
    status: "success",
    data: null,
  });
});
