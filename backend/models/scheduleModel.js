const mongoose = require("mongoose");

const SHIFT_TYPES = ["morning", "afternoon", "night", "off", "arrived", "timeout"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const scheduleSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    // ISO date string of the Sunday that starts this week
    week_start: {
      type: Date,
      required: true,
    },
    entries: [
      {
        day:        { type: String, enum: DAYS, required: true },
        date:       { type: Date, required: true },
        shift_type: { type: String, enum: SHIFT_TYPES, default: "off" },
      },
    ],
  },
  { timestamps: true }
);

// Unique schedule per user per project per week
scheduleSchema.index({ user_id: 1, project_id: 1, week_start: 1 }, { unique: true });

scheduleSchema.pre(/^find/, function () {
  this.populate("user_id", "name email role photo").populate(
    "project_id",
    "name"
  );
});

module.exports = mongoose.model("Schedule", scheduleSchema);
