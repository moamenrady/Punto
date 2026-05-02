const mongoose = require("mongoose");

// Counter model
const Counter = require("./Counter");

const chatMemberSchema = new mongoose.Schema(
  {
    // ===============================
    // 🔥 CUSTOM ID
    // ===============================
    custom_id: {
      type: String,
      unique: true,
    },

    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
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

    last_read_message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

    muted: {
      type: Boolean,
      default: false,
    },

    left_at: Date,
  },
  { timestamps: true }
);

//
// ===============================
// 🔥 AUTO CUSTOM ID
// ===============================
chatMemberSchema.pre("save", async function () {
  if (this.custom_id) return;

  const counter = await Counter.findOneAndUpdate(
    { name: "chatmember" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.custom_id = `cm_${counter.seq}`;
});

//
// ===============================
// 🔥 INDEXES
// ===============================
chatMemberSchema.index({ chat: 1, user: 1 }, { unique: true });
chatMemberSchema.index({ user: 1 });

module.exports = mongoose.model("ChatMember", chatMemberSchema);