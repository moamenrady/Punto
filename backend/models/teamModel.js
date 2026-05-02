const mongoose = require("mongoose");

// Counter model
const Counter = require("./Counter");

const teamMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },

    joined_at: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema(
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
      required: [true, "Team must have a name"],
      trim: true,
    },

    description: {
      type: String,
    },

    members: [teamMemberSchema],

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
teamSchema.pre("save", async function () {
  if (this.custom_id) return;

  const counter = await Counter.findOneAndUpdate(
    { name: "team" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.custom_id = `tm_${counter.seq}`;
});

//
// ===============================
// 🔥 POPULATE
// ===============================
teamSchema.pre(/^find/, function () {
  this.populate("created_by", "name email role")
    .populate("members.user", "name email role");
});

module.exports = mongoose.model("Team", teamSchema);