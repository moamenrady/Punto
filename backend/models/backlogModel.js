const mongoose = require("mongoose");

// Counter model
const Counter = require("./Counter");

const backlogSchema = new mongoose.Schema(
  {
    // ===============================
    // 🔥 CUSTOM ID
    // ===============================
    custom_id: {
      type: String,
      unique: true,
    },

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
// 🔥 AUTO GENERATE CUSTOM ID
// ===============================
backlogSchema.pre("save", async function () {
  if (this.custom_id) return;

  const counter = await Counter.findOneAndUpdate(
    { name: "backlog" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.custom_id = `bkl_${counter.seq}`;
});

//
// ===============================
// 🔥 POPULATE
// ===============================
backlogSchema.pre(/^find/, function () {
  this.populate("project_id", "name")
    .populate("created_by", "name email role");
});

module.exports = mongoose.model("Backlog", backlogSchema);