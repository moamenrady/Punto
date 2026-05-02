const Project = require("../models/projectModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

// Use factory for basic CRUD (automatically scopes by company_id)
exports.createProject = factory.createOne(Project);
exports.getAllProjects = factory.getAll(Project);
exports.getProject = factory.getOne(Project);
exports.updateProject = factory.updateOne(Project);
exports.deleteProject = factory.deleteOne(Project);

// ADD MEMBER
exports.addMember = catchAsync(async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) return next(new AppError("userId is required", 400));

  // Scope the update by company_id
  const filter = { _id: req.params.id };
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  const project = await Project.findOneAndUpdate(
    filter,
    { $addToSet: { members: userId } },
    { new: true, runValidators: false }
  );

  if (!project) return next(new AppError("No project found with that ID in your company", 404));

  res.status(200).json({ status: "success", data: { project } });
});

// REMOVE MEMBER
exports.removeMember = catchAsync(async (req, res, next) => {
  // Scope the update by company_id
  const filter = { _id: req.params.id };
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  const project = await Project.findOneAndUpdate(
    filter,
    { $pull: { members: req.params.userId } },
    { new: true }
  );

  if (!project) return next(new AppError("No project found with that ID in your company", 404));

  res.status(200).json({ status: "success", data: { project } });
});
