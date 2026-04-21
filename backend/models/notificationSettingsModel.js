const mongoose = require("mongoose");

const notificationSettingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  ticket_assigned:    { type: Boolean, default: true },
  ticket_status:      { type: Boolean, default: true },
  sla_warning:        { type: Boolean, default: true },
  new_comment:        { type: Boolean, default: false },
  server_downtime:    { type: Boolean, default: true },
  security_incidents: { type: Boolean, default: true },
  weekly_summary:     { type: Boolean, default: false },
});

module.exports = mongoose.model("NotificationSettings", notificationSettingsSchema);