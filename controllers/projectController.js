const Project = require("../models/projectModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// CREATE
exports.createProject = catchAsync(async (req, res, next) => {
  const project = await Project.create(req.body);

  res.status(201).json({
    status: "success",
    data: { project },
  });
});

// GET ALL
exports.getAllProjects = catchAsync(async (req, res, next) => {
  const projects = await Project.find();

  res.status(200).json({
    status: "success",
    results: projects.length,
    data: { projects },
  });
});

// GET ONE
exports.getProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) return next(new AppError("No project found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: { project },
  });
});

// UPDATE
exports.updateProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!project) return next(new AppError("No project found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: { project },
  });
});

// DELETE
exports.deleteProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByIdAndDelete(req.params.id);

  if (!project) return next(new AppError("No project found with that ID", 404));

  res.status(204).json({
    status: "success",
    data: null,
  });
});
