const Plan = require("../models/Plan");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// ===============================
// ✅ CREATE PLAN
// ===============================
exports.createPlan = catchAsync(async (req, res, next) => {
  const plan = await Plan.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      plan,
    },
  });
});

// ===============================
// ✅ GET ALL PLANS
// ===============================
exports.getAllPlans = catchAsync(async (req, res, next) => {
  const plans = await Plan.find();
  res.status(200).json({
    status: "success",
    results: plans.length,
    data: {
      plans,
    },
  });
});

// ===============================
// ✅ GET ONE PLAN
// ===============================
exports.getPlan = catchAsync(async (req, res, next) => {
  const plan = await Plan.findById(req.params.id);

  if (!plan) {
    return next(new AppError("Plan not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});

// ===============================
// ✅ UPDATE PLAN
// ===============================
exports.updatePlan = catchAsync(async (req, res, next) => {
  const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!plan) {
    return next(new AppError("Plan not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});

// ===============================
// ✅ DELETE PLAN
// ===============================
exports.deletePlan = catchAsync(async (req, res, next) => {
  const plan = await Plan.findByIdAndDelete(req.params.id);

  if (!plan) {
    return next(new AppError("Plan not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
