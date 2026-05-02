const Notification = require("../models/notificationModel");
const NotificationSettings = require("../models/notificationSettingsModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

// ==========================================
// 1. ACTUAL NOTIFICATIONS (Real-time alerts)
// ==========================================

// Get all notifications for the current user in their company
exports.getNotifications = catchAsync(async (req, res, next) => {
  const filter = { recipient: req.user.id };
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  const notifications = await Notification.find(filter).sort("-createdAt");

  res.status(200).json({
    status: "success",
    results: notifications.length,
    data: { notifications },
  });
});

// Mark notification as read
exports.markAsRead = catchAsync(async (req, res, next) => {
  const filter = { _id: req.params.id };
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  const notification = await Notification.findOneAndUpdate(
    filter,
    { read: true },
    { new: true }
  );

  if (!notification) {
    return next(new AppError("Notification not found in your company", 404));
  }

  res.status(200).json({ status: "success", data: { notification } });
});

// Mark all notifications as read
exports.markAllAsRead = catchAsync(async (req, res, next) => {
  const filter = { recipient: req.user.id };
  if (req.user?.company_id) filter.company_id = req.user.company_id;

  await Notification.updateMany(filter, { read: true });

  res.status(200).json({ status: "success", message: "All notifications marked as read" });
});

// ==========================================
// 2. NOTIFICATION SETTINGS
// ==========================================

const ALLOWED_KEYS = [
  "ticket_assigned", "ticket_status", "sla_warning",
  "new_comment", "server_downtime", "security_incidents", "weekly_summary"
];

// Get Settings
exports.getNotificationSettings = catchAsync(async (req, res, next) => {
  let settings = await NotificationSettings.findOne({ 
    user: req.user.id,
    company_id: req.user.company_id 
  });

  if (!settings) {
    settings = await NotificationSettings.create({ 
      user: req.user.id,
      company_id: req.user.company_id
    });
  }

  res.json({ status: "success", data: { doc: settings } });
});

// Update Settings
exports.updateNotificationSettings = catchAsync(async (req, res, next) => {
  const [key] = Object.keys(req.body);

  if (!ALLOWED_KEYS.includes(key)) {
    return next(new AppError("Invalid settings key", 400));
  }

  const settings = await NotificationSettings.findOneAndUpdate(
    { user: req.user.id, company_id: req.user.company_id },
    { [key]: req.body[key] },
    { new: true, upsert: true }
  );

  res.json({ status: "success", data: { doc: settings } });
});