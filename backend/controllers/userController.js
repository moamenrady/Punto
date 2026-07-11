const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Get current user profile
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// Update current user profile
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) منع تغيير الباسورد من هنا
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        "This route is not for password updates. Use /updatePassword.",
        400,
      ),
    );
  }

  // 2) فلترة الحقول المسموح تعديلها
  const filteredBody = filterObj(
    req.body,
    "name",
    "email",
    "phone",
    "dept",
    "location",
  );

  // 3) تحديث اليوزر
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

// Deactivate current user account
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// ===============================
// ✅ GET ALL USERS (scoped by company, with optional search)
// ===============================
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  // Support ?search= for name/email filtering
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, "i");
    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  const users = await User.find(filter)
    .populate("company_id")
    .populate("team_id");

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

// ===============================
// ✅ GET ONE USER
// ===============================
exports.getUser = catchAsync(async (req, res, next) => {
  const filter = { _id: req.params.id };
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  const user = await User.findOne(filter)
    .populate("company_id")
    .populate("team_id");

  if (!user) {
    return next(new AppError("User not found in your company", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// ===============================
// ✅ GET USER PHOTO
// ===============================
exports.getUserPhoto = catchAsync(async (req, res, next) => {
  const filter = { _id: req.params.id };
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  const user = await User.findOne(filter);

  if (!user || !user.photo?.data) {
    return next(new AppError("No image found for this user", 404));
  }

  res.set("Content-Type", user.photo.contentType);
  res.send(user.photo.data);
});

// ===============================
// ✅ CREATE USER (Admin)(with company support)
// ===============================
exports.createUser = catchAsync(async (req, res, next) => {
  const userData = { ...req.body };

  if (req.user?.company_id) {
    userData.company_id = req.user.company_id;
  }

  const newUser = new User(userData);

  if (req.file) {
    const path = require("path");
    const ext = path.extname(req.file.originalname);
    const filename = `avatar_${newUser._id}_${Date.now()}${ext}`;
    const Avatar = require("../models/avatarModel");
    await Avatar.findOneAndUpdate(
      { filename },
      { data: req.file.buffer, contentType: req.file.mimetype },
      { upsert: true, new: true }
    );
    newUser.photo = `/uploads/avatars/${filename}`;
  }

  await newUser.save();

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

// ===============================
// ✅ UPDATE USER (Admin)
// ===============================
exports.updateUser = catchAsync(async (req, res, next) => {
  const updateData = { ...req.body };

  const filter = { _id: req.params.id };
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  const user = await User.findOne(filter);

  if (!user) {
    return next(new AppError("User not found in your company", 404));
  }

  if (req.file) {
    if (user.photo) {
      const oldFilename = user.photo.split("/").pop();
      const Avatar = require("../models/avatarModel");
      await Avatar.deleteOne({ filename: oldFilename });
    }

    const path = require("path");
    const ext = path.extname(req.file.originalname);
    const filename = `avatar_${user._id}_${Date.now()}${ext}`;
    const Avatar = require("../models/avatarModel");
    await Avatar.findOneAndUpdate(
      { filename },
      { data: req.file.buffer, contentType: req.file.mimetype },
      { upsert: true, new: true }
    );
    user.photo = `/uploads/avatars/${filename}`;
  }

  // Update rest of the fields manually
  Object.keys(updateData).forEach((key) => {
    if (key !== "photo" && key !== "avatar_data" && key !== "avatar_contentType") {
      user[key] = updateData[key];
    }
  });

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
// ===============================
// ✅ DELETE USER
// ===============================
exports.deleteUser = catchAsync(async (req, res, next) => {
  const filter = { _id: req.params.id };
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  const user = await User.findOneAndDelete(filter);

  if (!user) {
    return next(new AppError("User not found in your company", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// ===============================
// 📊 USER ANALYTICS
// ===============================

exports.getUserDemographics = catchAsync(async (req, res, next) => {
  const demographics = await User.aggregate([
    {
      $facet: {
        totalUsers: [{ $count: "count" }],
        roleDistribution: [
          {
            $group: {
              _id: "$role",
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              role: "$_id",
              count: 1,
              _id: 0,
            },
          },
          { $sort: { count: -1 } },
        ],
      },
    },
  ]);

  const total = demographics[0].totalUsers[0]?.count || 0;
  const roles = demographics[0].roleDistribution;

  const rolePercentages = roles.map((r) => ({
    role: r.role,
    count: r.count,
    percentage: Math.round((r.count / total) * 100),
  }));

  res.status(200).json({
    status: "success",
    data: {
      totalUsers: total,
      roleDistribution: rolePercentages,
    },
  });
});

exports.getUserGrowthTrend = catchAsync(async (req, res, next) => {
  const growth = await User.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        newUsers: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    {
      $project: {
        period: {
          $concat: [
            { $toString: "$_id.year" },
            "-",
            {
              $cond: [
                { $lt: ["$_id.month", 10] },
                { $concat: ["0", { $toString: "$_id.month" }] },
                { $toString: "$_id.month" },
              ],
            },
          ],
        },
        newUsers: 1,
        _id: 0,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: { growth },
  });
});

exports.getChurnRiskList = catchAsync(async (req, res, next) => {
  const churnThreshold = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  const atRiskUsers = await User.aggregate([
    { $match: { updatedAt: { $lt: churnThreshold }, active: true } },
    {
      $lookup: {
        from: "tasks",
        localField: "_id",
        foreignField: "created_by",
        as: "userTasks",
      },
    },
    {
      $project: {
        custom_id: 1,
        name: 1,
        taskCount: { $size: "$userTasks" },
        daysInactive: {
          $round: [
            {
              $divide: [
                { $subtract: [new Date(), "$updatedAt"] },
                1000 * 60 * 60 * 24,
              ],
            },
            0,
          ],
        },
      },
    },
    {
      $addFields: {
        riskScorePercentage: {
          $min: [99, { $add: [40, { $multiply: ["$daysInactive", 2] }] }],
        },
      },
    },
    {
      $addFields: {
        riskLevel: {
          $cond: [{ $gte: ["$riskScorePercentage", 80] }, "CRITICAL", "HIGH"],
        },
      },
    },
    { $sort: { daysInactive: -1 } },
    { $limit: 10 },
  ]);

  res.status(200).json({
    status: "success",
    data: { atRiskUsers },
  });
});
