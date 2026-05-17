const Company = require("../models/companyModel");
const User = require("../models/userModel");
const Plan = require("../models/Plan");
const mongoose = require("mongoose");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllCompanies = factory.getAll(Company);
exports.getCompany = factory.getOne(Company);
exports.updateCompany = factory.updateOne(Company);
exports.deleteCompany = factory.deleteOne(Company);

// CREATE COMPANY
exports.createCompany = catchAsync(async (req, res, next) => {
  const { name, industry, website, selectedFeatures } = req.body;

  if (!selectedFeatures || selectedFeatures.length === 0) {
    return next(new AppError("Please select at least one feature for your plan", 400));
  }

  // 1. Find the static plan that matches exactly the selected features
  const sortedFeatures = [...selectedFeatures].sort();
  
  const plan = await Plan.findOne({ 
    features: { $size: sortedFeatures.length, $all: sortedFeatures } 
  });

  if (!plan) {
    return next(new AppError("The selected combination of features does not match any existing plan. Please contact support.", 400));
  }

  // 2. Create the company
  const newCompany = await Company.create({
    name,
    industry,
    website,
    plan_id: plan._id,
    managers: [req.user._id],
    company_users: [req.user._id]
  });

  // 3. Link the creator user to this company and promote to manager
  await User.findByIdAndUpdate(req.user._id, { 
    company_id: newCompany._id,
    role: "manager" 
  });

  res.status(201).json({
    status: "success",
    data: { company: newCompany },
  });
});

// ADD USER TO COMPANY
exports.addUserToCompany = catchAsync(async (req, res, next) => {
  const identifier = (req.body.userId || req.body.email || "").trim();
  const companyId = req.params.id || req.user.company_id;

  if (!identifier) {
    return next(new AppError("Please provide a user id or email", 400));
  }

  const company = await Company.findById(companyId);
  if (!company) return next(new AppError("Company not found", 404));

  const isManager = company.managers.some((managerId) =>
    managerId.equals(req.user._id)
  );

  if (!isManager) {
    return next(new AppError("Only company managers can add users", 403));
  }

  const user = mongoose.Types.ObjectId.isValid(identifier)
    ? await User.findById(identifier)
    : await User.findOne({ email: identifier.toLowerCase() });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  await Company.findByIdAndUpdate(companyId, {
    $addToSet: { company_users: user._id }
  });

  await User.findByIdAndUpdate(user._id, { company_id: companyId });

  res.status(200).json({
    status: "success",
    message: "User added to company successfully"
  });
});

// PROMOTE TO MANAGER
exports.promoteToManager = catchAsync(async (req, res, next) => {
  const { userId } = req.body;
  const companyId = req.user.company_id;

  const company = await Company.findById(companyId);
  
  if (!company.managers.includes(req.user._id)) {
    return next(new AppError("Only company managers can promote others", 403));
  }

  await Company.findByIdAndUpdate(companyId, {
    $addToSet: { managers: userId, company_users: userId }
  });

  res.status(200).json({
    status: "success",
    message: "User promoted to manager successfully"
  });
});

exports.getMyCompany = catchAsync(async (req, res, next) => {
  if (!req.user.company_id) {
    return next(new AppError("You do not belong to a company", 404));
  }

  const company = await Company.findById(req.user.company_id).populate("plan_id");

  res.status(200).json({
    status: "success",
    data: {
      company,
    },
  });
});
