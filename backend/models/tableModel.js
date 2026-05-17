const mongoose = require("mongoose");

// Counter model
const Counter = require("./Counter");

const tableSchema = new mongoose.Schema(
  {
    // ===============================
    // 🔥 CUSTOM ID
    // ===============================
    custom_id: {
      type: String,
      unique: true,
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

    filename: String,

    data: [
      {
        type: Map,
        of: String,
      },
    ],
  },
  { timestamps: true },
);

//
// ===============================
// 🔥 AUTO CUSTOM ID
// ===============================
tableSchema.pre("save", async function () {
  if (this.custom_id) return;

  const counter = await Counter.findOneAndUpdate(
    { name: "table" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );

  this.custom_id = `tbl_${counter.seq}`;
});

module.exports = mongoose.model("Table", tableSchema);
