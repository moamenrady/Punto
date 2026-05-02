const Backlog = require("../models/backlogModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

exports.setProjectId = (req, res, next) => {
  if (!req.body.project_id) {
    req.body.project_id = req.params.projectId;
  }
  next();
};

// Use factory for CRUD
exports.createBacklog = factory.createOne(Backlog);
exports.getBacklog = factory.getOne(Backlog);
exports.updateBacklog = factory.updateOne(Backlog);
exports.deleteBacklog = factory.deleteOne(Backlog);

exports.getAllBacklogs = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.params.projectId) filter.project_id = req.params.projectId;
  
  // Mandatory company scope
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  const backlogs = await Backlog.find(filter);

  res.status(200).json({
    status: "success",
    results: backlogs.length,
    data: { backlogs },
  });
});
