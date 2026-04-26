const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    comment: String,
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
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

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assigned_to: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

taskSchema.pre(/^find/, function () {
  this.populate("backlog_id", "name")
    .populate("sprint_id", "name status")
    .populate("created_by", "name email role photo")
    .populate("assigned_to", "name email role photo");
});

module.exports = mongoose.model("Task", taskSchema);
