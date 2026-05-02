const mongoose = require("mongoose");

// Counter model
const Counter = require("./Counter");

const workingTaskSchema = new mongoose.Schema(
  {
    // ===============================
    // 🔥 CUSTOM ID
    // ===============================
    custom_id: {
      type: String,
      unique: true,
    },

    task_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },

    team_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    start_date: Date,
    end_date: Date,
  },
  {
    timestamps: true,
  }
);

//
// ===============================
// 🔥 AUTO CUSTOM ID
// ===============================
workingTaskSchema.pre("save", async function () {
  if (this.custom_id) return;

  const counter = await Counter.findOneAndUpdate(
    { name: "workingtask" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.custom_id = `wkt_${counter.seq}`;
});

module.exports = mongoose.model("WorkingTask", workingTaskSchema);