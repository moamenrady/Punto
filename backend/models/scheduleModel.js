const mongoose = require("mongoose");

// ===============================
// 🔥 SHIFT ENUM
// ===============================
const SHIFT_TYPES = ["Morning", "Afternoon", "Night", "Off", "Arrived", "Timeout"];

// ===============================
// 🔥 DAY SCHEMA (per user)
// ===============================
const dayShiftSchema = new mongoose.Schema(
  {
    sun: { type: String, enum: SHIFT_TYPES, default: "Off" },
    mon: { type: String, enum: SHIFT_TYPES, default: "Off" },
    tue: { type: String, enum: SHIFT_TYPES, default: "Off" },
    wed: { type: String, enum: SHIFT_TYPES, default: "Off" },
    thu: { type: String, enum: SHIFT_TYPES, default: "Off" },
    fri: { type: String, enum: SHIFT_TYPES, default: "Off" },
    sat: { type: String, enum: SHIFT_TYPES, default: "Off" },
  },
  { _id: false }
);

// ===============================
// 🔥 MEMBER WEEK ASSIGNMENT
// ===============================
const memberScheduleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shifts: {
      type: dayShiftSchema,
      required: true,
    },
  },
  { _id: false }
);

// ===============================
// 🔥 WEEKLY SHIFT SCHEDULE
// ===============================
const weeklyShiftSchema = new mongoose.Schema(
  {
    // 🔥 which team this week belongs to
    team_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    // 🔥 week range (important for locking logic later)
    week_start: {
      type: Date,
      required: true,
    },

    week_end: {
      type: Date,
      required: true,
    },

    // 🔥 snapshot status
    is_locked: {
      type: Boolean,
      default: false,
    },

    // 🔥 all members shifts for this week
    members: [memberScheduleSchema],
  },
  {
    timestamps: true,
  }
);

// ===============================
// 🔥 INDEX (important for queries per team/week)
// ===============================
weeklyShiftSchema.index({ team_id: 1, week_start: 1 }, { unique: true });

module.exports = mongoose.model("WeeklyShift", weeklyShiftSchema);
