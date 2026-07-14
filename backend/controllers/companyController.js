const Company = require("../models/companyModel");
const User = require("../models/userModel");
const Plan = require("../models/Plan");
const mongoose = require("mongoose");
const validator = require("validator");
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

  let user;
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    user = await User.findById(identifier);
  } else {
    const emailLower = identifier.toLowerCase();
    user = await User.findOne({ email: emailLower });

    if (!user && validator.isEmail(emailLower)) {
      // Auto-create user
      const name = emailLower.split("@")[0];
      user = await User.create({
        name,
        email: emailLower,
        role: "user",
        isVerified: true,
        password: "Password123!",
        confirmPassword: "Password123!",
        company_id: companyId,
      });
    }
  }

  if (!user) {
    return next(new AppError("User not found or invalid email address", 404));
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

exports.joinCompany = catchAsync(async (req, res, next) => {
  const { companyId } = req.body;

  if (!companyId) {
    return next(new AppError("Please provide a company ID", 400));
  }

  const company = await Company.findById(companyId);
  if (!company) {
    return next(new AppError("Company not found", 404));
  }

  // 1. Add user to the company's company_users list
  await Company.findByIdAndUpdate(companyId, {
    $addToSet: { company_users: req.user._id },
  });

  // 2. Link user to the company and set their role to 'user'
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { company_id: company._id, role: "user" },
    { new: true, runValidators: true },
  );

  res.status(200).json({
    status: "success",
    message: "Joined company successfully",
    data: {
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        company_id: updatedUser.company_id,
      },
    },
  });
});

// ADD DEPARTMENT
exports.addDepartment = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const companyId = req.user.company_id;

  if (!name) return next(new AppError("Please provide a department name", 400));

  const company = await Company.findById(companyId);
  if (!company) return next(new AppError("Company not found", 404));

  const exists = company.departments.some(
    (d) => d.name.toLowerCase() === name.trim().toLowerCase()
  );
  if (exists) return next(new AppError("Department name already exists", 400));

  company.departments.push({ name: name.trim(), users: [] });
  await company.save();

  res.status(200).json({
    status: "success",
    data: { company },
  });
});

// REMOVE DEPARTMENT
exports.removeDepartment = catchAsync(async (req, res, next) => {
  const { deptId } = req.params;
  const companyId = req.user.company_id;

  const company = await Company.findById(companyId);
  if (!company) return next(new AppError("Company not found", 404));

  company.departments = company.departments.filter(
    (d) => !d._id.equals(deptId)
  );
  await company.save();

  res.status(200).json({
    status: "success",
    data: { company },
  });
});

// ADD USER TO DEPARTMENT
exports.addUserToDepartment = catchAsync(async (req, res, next) => {
  const { deptId } = req.params;
  const { userId, email } = req.body;
  const companyId = req.user.company_id;

  if (!userId && !email) {
    return next(new AppError("Please provide a user ID or email", 400));
  }

  const company = await Company.findById(companyId);
  if (!company) return next(new AppError("Company not found", 404));

  const dept = company.departments.id(deptId);
  if (!dept) return next(new AppError("Department not found", 404));

  let user;
  if (userId) {
    user = await User.findById(userId);
  } else if (email) {
    user = await User.findOne({ email: email.toLowerCase().trim() });
  }

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const isUserInCompany = company.company_users.some((uId) =>
    uId.equals(user._id)
  );
  if (!isUserInCompany) {
    return next(new AppError("User does not belong to this company", 400));
  }

  // Remove user from all other departments first to prevent duplicates
  company.departments.forEach((d) => {
    d.users = d.users.filter((uId) => !uId.equals(user._id));
  });

  dept.users.push(user._id);
  await company.save();

  await User.findByIdAndUpdate(user._id, { dept: dept.name });

  const updatedCompany = await Company.findById(companyId);

  res.status(200).json({
    status: "success",
    data: { company: updatedCompany },
  });
});

// REMOVE USER FROM DEPARTMENT
exports.removeUserFromDepartment = catchAsync(async (req, res, next) => {
  const { deptId, userId } = req.params;
  const companyId = req.user.company_id;

  const company = await Company.findById(companyId);
  if (!company) return next(new AppError("Company not found", 404));

  const dept = company.departments.id(deptId);
  if (!dept) return next(new AppError("Department not found", 404));

  dept.users = dept.users.filter((uId) => !uId.equals(userId));
  await company.save();

  const user = await User.findById(userId);
  if (user && user.dept === dept.name) {
    await User.findByIdAndUpdate(userId, { dept: "" });
  }

  const updatedCompany = await Company.findById(companyId);

  res.status(200).json({
    status: "success",
    data: { company: updatedCompany },
  });
});

exports.getAuthorizationCheck = catchAsync(async (req, res, next) => {
  const companyId = req.user.company_id;
  if (!companyId) return next(new AppError("You are not associated with a company", 400));

  const Project = require("../models/projectModel");
  const Team = require("../models/teamModel");
  const Chat = require("../models/chatModel");
  const ChatMember = require("../models/ChatMember");
  const Table = require("../models/tableModel");

  // Fetch all users in the company
  const users = await User.find({ company_id: companyId }).select("name email role photo dept");

  // Fetch all resources in the company
  const projects = await Project.find({ company_id: companyId });
  const teams = await Team.find({ company_id: companyId });
  const chats = await Chat.find({ company_id: companyId });
  const tables = await Table.find({ company_id: companyId });
  const chatMembers = await ChatMember.find({ company_id: companyId });

  const getAuthUsers = (item, type) => {
    return users
      .map(user => {
        const userIdStr = user._id.toString();
        const reasons = [];

        const isAdminOrManager = user.role === "admin" || user.role === "manager";
        const isITDept = user.dept?.toLowerCase() === "it" || user.dept?.toLowerCase() === "it department";

        if (isAdminOrManager) reasons.push("Admin/Manager");
        if (isITDept) reasons.push("IT Department");

        if (type === "project") {
          const isCreator = item.created_by?.toString() === userIdStr;
          const isMember = Array.isArray(item.members) && item.members.some(m => {
            const mId = m?._id || m;
            return mId.toString() === userIdStr;
          });
          if (isCreator) reasons.push("Creator");
          if (isMember) reasons.push("Member");
        } else if (type === "team") {
          const isCreator = item.created_by?.toString() === userIdStr;
          const isMember = Array.isArray(item.members) && item.members.some(m => {
            const mId = m.user?._id || m.user || m;
            return mId.toString() === userIdStr;
          });
          if (isCreator) reasons.push("Creator");
          if (isMember) reasons.push("Member");
        } else if (type === "chat") {
          const isCreator = item.created_by?.toString() === userIdStr;
          const isMember = chatMembers.some(cm => {
            return cm.chat?.toString() === item._id.toString() && cm.user?.toString() === userIdStr && !cm.left_at;
          });
          if (isCreator) reasons.push("Creator");
          if (isMember) reasons.push("Chat Member");
        } else if (type === "table") {
          const isCreator = item.user_id?.toString() === userIdStr;
          if (isCreator) reasons.push("Creator");
        }

        if (reasons.length > 0) {
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            photo: user.photo,
            dept: user.dept,
            reasons: [...new Set(reasons)]
          };
        }
        return null;
      })
      .filter(Boolean);
  };

  const responseProjects = projects.map(p => ({
    _id: p._id,
    name: p.name,
    description: p.description || "",
    authorizedUsers: getAuthUsers(p, "project")
  }));

  const responseTeams = teams.map(t => ({
    _id: t._id,
    name: t.name,
    description: t.description || "",
    authorizedUsers: getAuthUsers(t, "team")
  }));

  const allChats = chats.map(c => ({
    _id: c._id,
    name: c.name || (c.type === "private" ? "Direct Message" : "Unnamed Group"),
    description: c.description || "",
    type: c.type,
    authorizedUsers: getAuthUsers(c, "chat")
  }));

  const responseGroupChats = allChats.filter(c => c.type === "group");
  const responseChats = allChats.filter(c => c.type === "private");

  const responsePages = tables.map(tbl => ({
    _id: tbl._id,
    name: tbl.filename || "Unnamed Page",
    description: `Uploaded sheet with ${tbl.data?.length || 0} rows`,
    authorizedUsers: getAuthUsers(tbl, "table")
  }));

  res.status(200).json({
    status: "success",
    data: {
      projects: responseProjects,
      teams: responseTeams,
      chats: responseChats,
      groupChats: responseGroupChats,
      pages: responsePages
    }
  });
});
