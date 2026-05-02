const mongoose = require("mongoose");

// Counter model
const Counter = require("./Counter");

// ===============================
// 🔥 Allowed transitions
// ===============================
const allowedTransitions = {
  planned: ["active"],
  active: ["completed"],
  completed: [],
};

const sprintSchema = new mongoose.Schema(
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
      required: [true, "Sprint must have a name"],
    },

    status: {
      type: String,
      enum: ["planned", "active", "completed"],
      default: "planned",
    },

    status_changed_at: {
      type: Date,
      default: null,
    },

    start_date: Date,
    end_date: Date,
    sprint_goal: String,

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
// 🔥 AUTO CUSTOM ID
// ===============================
sprintSchema.pre("save", async function () {
  if (this.custom_id) return;

  const counter = await Counter.findOneAndUpdate(
    { name: "sprint" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.custom_id = `spr_${counter.seq}`;
});

//
// 🔥 HANDLE save()
// (status logic preserved)
//
sprintSchema.pre("save", async function () {
  if (!this.isModified("status")) return;

  const from = this._originalStatus;
  const to = this.status;

  if (!this.isNew) {
    if (!allowedTransitions[from]?.includes(to)) {
      throw new Error(`Invalid status transition from ${from} to ${to}`);
    }
  }

  this.status_changed_at = new Date();

  if (to === "active") this.start_date = new Date();
  if (to === "completed") this.end_date = new Date();
});

//
// 🔥 KEEP OLD STATUS
//
sprintSchema.pre("init", function (doc) {
  this._originalStatus = doc.status;
});

//
// 🔥 HANDLE update()
//
sprintSchema.pre("findOneAndUpdate", async function () {
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

  if (to === "active") update.start_date = new Date();
  if (to === "completed") update.end_date = new Date();

  this.setUpdate(update);
});

//
// 🔥 POPULATE
//
sprintSchema.pre(/^find/, function () {
  this.populate("project_id", "name");
});

sprintSchema.pre(/^find/, function () {
  this.populate("created_by", "name email role");
});

module.exports = mongoose.model("Sprint", sprintSchema);