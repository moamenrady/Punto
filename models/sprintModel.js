const mongoose = require("mongoose");

const sprintSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sprint must have a name"],
    },

    status: {
      type: String,
      enum: ["planned", "active", "completed"],
      default: "planned",
    },

    start_date: Date,
    end_date: Date,
    sprint_goal: String,

    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    // created_by → علّقناه لحد الـ user/auth
    // created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

sprintSchema.pre(/^find/, function (next) {
  this.populate("project_id", "name");
  // next();
});

// you add next line if you want to auto populate tasks in sprint
// sprintSchema.pre(/^find/, function (next) {
//   this.populate("task_id", "name");
//   next();
// });

module.exports = mongoose.model("Sprint", sprintSchema);
