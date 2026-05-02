const Sprint = require("../models/sprintModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

// Middleware: set project_id from params if missing in body
exports.setProjectId = (req, res, next) => {
  if (!req.body.project_id && req.params.projectId)
    req.body.project_id = req.params.projectId;
  next();
};

// Use factory for CRUD
exports.createSprint = factory.createOne(Sprint);
exports.getSprint = factory.getOne(Sprint);
exports.updateSprint = factory.updateOne(Sprint);
exports.deleteSprint = factory.deleteOne(Sprint);

// GET ALL
exports.getAllSprints = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.params.projectId) filter.project_id = req.params.projectId;
  
  // Mandatory company scope
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  const sprints = await Sprint.find(filter);

  res.status(200).json({
    status: "success",
    results: sprints.length,
    data: { sprints },
  });
});
