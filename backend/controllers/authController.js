const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// don't forget to make createSendToken function later

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordChangedAt: Date.now(),
    confirmPassword: req.body.confirmPassword,
    role: req.body.role, // هنقفله بعدين
    // plan_id: req.body.plan_id,  // optional
    // team_id: req.body.team_id,  // optional
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check email & password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // 2) get user + password
  const user = await User.findOne({ email }).select("+password");
  const isCorrectPassword = await user.correctPassword(password, user.password);
  // 3) check password
  if (!user || !isCorrectPassword) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 4) send token
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // 1) get token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in. Please log in to get access.", 401),
    );
  }

  // 2) verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3) check user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401),
    );
  }

  // 4) check password changed after token
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password. Please log in again.", 401),
    );
  }

  // 5) grant access
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission", 403));
    }
    next();
  };
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // 1) Get user + password
  const user = await User.findById(req.user.id).select("+password");

  // 2) Check current password is correct
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3) Update password
  user.password = newPassword;
  user.confirmPassword = confirmPassword;
  await user.save(); // مهم: save مش update

  // 4) Send new token
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with this email address.", 404));
  }

  // 2) Generate reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send token (placeholder)
  // لاحقًا: sendEmail(user.email, resetURL)
  console.log("RESET TOKEN (dev):", resetToken);

  res.status(200).json({
    status: "success",
    message: "Token sent to email!",
  });
});

const crypto = require("crypto");

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Hash token from params
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // 2) Find user by token + not expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  // 3) Set new password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateBeforeSave: false });

  // 4) Send new JWT
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});
