const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    priority: { type: String, default: "low" },
    description: String,
    comment: String,
    status: { type: String, default: "open" },
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

    // assigned_to, created_by → بعد Auth
  },
  { timestamps: true }
);

taskSchema.pre(/^find/, function (next) {
  this.populate("backlog_id", "name").populate("sprint_id", "name status");
  next();
});

module.exports = mongoose.model("Task", taskSchema);
