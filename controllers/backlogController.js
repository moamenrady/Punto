const Backlog = require("../models/backlogModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createBacklog = catchAsync(async (req, res, next) => {
  const backlog = await Backlog.create(req.body);

  res.status(201).json({
    status: "success",
    data: { backlog },
  });
});

exports.getAllBacklogs = catchAsync(async (req, res, next) => {
  const backlogs = await Backlog.find();

  res.status(200).json({
    status: "success",
    results: backlogs.length,
    data: { backlogs },
  });
});

exports.getBacklog = catchAsync(async (req, res, next) => {
  const backlog = await Backlog.findById(req.params.id);

  if (!backlog) return next(new AppError("Backlog not found", 404));

  res.status(200).json({
    status: "success",
    data: { backlog },
  });
});

exports.updateBacklog = catchAsync(async (req, res, next) => {
  const backlog = await Backlog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!backlog) return next(new AppError("Backlog not found", 404));

  res.status(200).json({
    status: "success",
    data: { backlog },
  });
});

exports.deleteBacklog = catchAsync(async (req, res, next) => {
  const backlog = await Backlog.findByIdAndDelete(req.params.id);

  if (!backlog) return next(new AppError("Backlog not found", 404));

  res.status(204).json({ status: "success", data: null });
});
