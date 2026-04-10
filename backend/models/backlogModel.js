const mongoose = require("mongoose");

const backlogSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: String, default: "open" },
    start_date: Date,
    end_date: Date,
    backlog_goal: String,

    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    // لحد ما نعمل user/auth هنسيبه فاضي
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

backlogSchema.pre(/^find/, function () {
  this.populate("project_id", "name");
  // next();
});

backlogSchema.pre(/^find/, function () {
  this.populate("created_by", "name email role");
});

module.exports = mongoose.model("Backlog", backlogSchema);
