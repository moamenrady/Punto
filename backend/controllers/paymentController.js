const Payment = require("../models/paymentModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.checkout = catchAsync(async (req, res, next) => {
  const { features, paymentMethod } = req.body;

  const pricePerFeature = 50;
  const total = features.length * pricePerFeature;

  const expireDate = new Date();
  expireDate.setMonth(expireDate.getMonth() + 1);

exports.myFeatures = catchAsync(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    status: "success",
    data: {
      features: user.features || []
    }
  });
});

  // حفظ الدفع
  const payment = await Payment.create({
    user_id: req.user.id,
    features,
    amount: total,
    paymentMethod,
    status: "paid",
    expireDate
  });

  // تحديث المستخدم بالمميزات
  await User.findByIdAndUpdate(req.user.id, {
    features: features
  });

  res.status(201).json({
    status: "success",
    data: {
      payment
    }
  });
});