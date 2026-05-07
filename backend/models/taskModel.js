const mongoose = require("mongoose");

// Counter model
const Counter = require("./Counter");

// ===============================
// 🔥 Allowed transitions
// ===============================
const allowedTransitions = {
  todo: ["in_progress"],
  in_progress: ["completed"],
  completed: [],
};

const taskSchema = new mongoose.Schema(
  {
    // ===============================
    // 🔥 CUSTOM ID
    // ===============================
    custom_id: {
      type: String,
      unique: true,
    },

    name: { type: String, required: true },
    description: String,
    comment: String,

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    status: {
      type: String,
      enum: ["todo", "in_progress", "completed"],
      default: "todo",
    },

    status_changed_at: {
      type: Date,
      default: null,
    },

    assigned_to: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    assigned: { type: Boolean, default: false },

    backlog_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Backlog",
      required: true,
    },

    sprint_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sprint",
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true }
);

//
// ===============================
// 🔥 AUTO CUSTOM ID
// ===============================
taskSchema.pre("save", async function () {
  if (this.custom_id) return;

  const counter = await Counter.findOneAndUpdate(
    { name: "task" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.custom_id = `tsk_${counter.seq}`;
});

//
// ===============================
// 🔥 KEEP ORIGINAL STATUS
// ===============================
taskSchema.pre("init", function (doc) {
  this._originalStatus = doc.status;
});

//
// ===============================
// 🔥 SAVE MIDDLEWARE
// ===============================
taskSchema.pre("save", async function () {
  if (!this.isModified("status")) return;

  const from = this._originalStatus;
  const to = this.status;

  if (!this.isNew) {
    if (!allowedTransitions[from]?.includes(to)) {
      throw new Error(`Invalid status transition from ${from} to ${to}`);
    }
  }

  this.status_changed_at = new Date();
});

//
// ===============================
// 🔥 UPDATE MIDDLEWARE
// ===============================
taskSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();

  if (!update.status) return;

  const doc = await this.model.findOne(this.getQuery());
  if (!doc) return;

  const from = doc.status;
  const to = update.status;

  if (from === to) return;

  if (!allowedTransitions[from]?.includes(to)) {
    throw new Error(`Invalid status transition from ${from} to ${to}`);
  }

  update.status_changed_at = new Date();

  this.setUpdate(update);
});

//
// ===============================
// 🔥 POPULATE
// ===============================
taskSchema.pre(/^find/, function () {
  this.populate("backlog_id", "name")
    .populate("sprint_id", "name status")
    .populate("assigned_to", "name email role");
});

taskSchema.pre(/^find/, function () {
  this.populate("created_by", "name email role");
});

module.exports = mongoose.model("Task", taskSchema);