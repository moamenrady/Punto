const NotificationSettings = require("../models/notificationSettingsModel");

const ALLOWED_KEYS = [
  "ticket_assigned", "ticket_status", "sla_warning",
  "new_comment", "server_downtime", "security_incidents", "weekly_summary"
];

// GET — جلب الإعدادات
exports.getNotifications = async (req, res) => {
  try {
    let settings = await NotificationSettings.findOne({ user: req.user.id });

    // لو مفيش إعدادات للـ user ده، اعملها بالـ defaults
    if (!settings) {
      settings = await NotificationSettings.create({ user: req.user.id });
    }

    res.json({ status: "success", data: { doc: settings } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH — تحديث إعداد واحد
exports.updateNotifications = async (req, res) => {
  try {
    const [key] = Object.keys(req.body);

    if (!ALLOWED_KEYS.includes(key)) {
      return res.status(400).json({ message: "Invalid key" });
    }

    const settings = await NotificationSettings.findOneAndUpdate(
      { user: req.user.id },
      { [key]: req.body[key] },
      { new: true, upsert: true }
    );

    res.json({ status: "success", data: { doc: settings } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};