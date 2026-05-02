const mongoose = require("mongoose");

// Counter model
const Counter = require("./Counter");

const chatSchema = new mongoose.Schema(
  {
    // ===============================
    // 🔥 CUSTOM ID
    // ===============================
    custom_id: {
      type: String,
      unique: true,
    },

    type: {
      type: String,
      enum: ["group", "private"],
      required: true,
    },

    name: {
      type: String,
      trim: true,
    },

    description: String,

    avatar: {
      data: Buffer,
      contentType: String,
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

    last_message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//
// ===============================
// 🔥 AUTO CUSTOM ID
// ===============================
chatSchema.pre("save", async function () {
  if (this.custom_id) return;

  const counter = await Counter.findOneAndUpdate(
    { name: "chat" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.custom_id = `cht_${counter.seq}`;
});

module.exports = mongoose.model("Chat", chatSchema);