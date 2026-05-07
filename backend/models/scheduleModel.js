const mongoose = require("mongoose");

const shiftEntrySchema = new mongoose.Schema({
  day: { 
    type: String, 
    required: true,
    enum: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  },
  date: { type: Date, required: true },
  shift_type: { 
    type: String, 
    enum: ["morning", "afternoon", "night", "off", "arrived", "timeout"],
    default: "off"
  }
}, { _id: false });

const scheduleSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: false // Can be global or project-specific
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },
  week_start: {
    type: Date,
    required: true
  },
  entries: [shiftEntrySchema]
}, { timestamps: true });

// Ensure a user only has one schedule per project per week
scheduleSchema.index({ user_id: 1, project_id: 1, week_start: 1 }, { unique: true });

module.exports = mongoose.model("Schedule", scheduleSchema);
