const mongoose = require("mongoose");

// Counter model
const Counter = require("./Counter");

const planSchema = new mongoose.Schema(
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
      required: true,
    },

    value: {
      type: Number,
      required: true,
    },
    features: [
      {
        type: String,
        enum: [
          "Project Management",
          "Chat System",
          "Ticketing System",
          "Stock Management",
        ],
      },
    ],
  },
  { timestamps: true }
);

//
// ===============================
// 🔥 AUTO GENERATE CUSTOM ID
// ===============================
planSchema.pre("save", async function () {
  if (this.custom_id) return;

  const counter = await Counter.findOneAndUpdate(
    { name: "plan" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.custom_id = `pln_${counter.seq}`;
});

module.exports = mongoose.model("Plan", planSchema);