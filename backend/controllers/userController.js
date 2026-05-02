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
        400
      )
    );
  }

  // 2) فلترة الحقول المسموح تعديلها
  const filteredBody = filterObj(
    req.body,
    "name",
    "email",
    "phone",
    "dept",
    "location"
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
// ✅ GET ALL USERS (scoped by company)
// ===============================
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  const users = await User.find(filter)
    .select("-photo")
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
    .select("-photo")
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
// ✅ CREATE USER (with company support)
// ===============================
exports.createUser = catchAsync(async (req, res, next) => {
  const userData = { ...req.body };

  if (req.user?.company_id) {
    userData.company_id = req.user.company_id;
  }

  if (req.file) {
    userData.photo = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };
  }

  const newUser = await User.create(userData);

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

// ===============================
// ✅ UPDATE USER
// ===============================
exports.updateUser = catchAsync(async (req, res, next) => {
  const updateData = { ...req.body };

  if (req.file) {
    updateData.photo = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };
  }

  const filter = { _id: req.params.id };
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  const user = await User.findOneAndUpdate(filter, updateData, {
    new: true,
    runValidators: true,
  });

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
