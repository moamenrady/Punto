const mongoose = require("mongoose");

// Counter model
const Counter = require("./Counter");

const projectSchema = new mongoose.Schema(
  {
    // ===============================
    // 🔥 CUSTOM ID
    // ===============================
    custom_id: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      required: [true, "A project must have a name"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "A project must have a description"],
      trim: true,
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
projectSchema.pre("save", async function () {
  if (this.custom_id) return;

  const counter = await Counter.findOneAndUpdate(
    { name: "project" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.custom_id = `prj_${counter.seq}`;
});

//
// ===============================
// 🔥 POPULATE
// ===============================
projectSchema.pre(/^find/, function () {
  this.populate("created_by", "name email role");
});

module.exports = mongoose.model("Project", projectSchema);