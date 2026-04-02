// models/ticketModel.js
const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A ticket must have a name"],
    },

    description: {
      type: String,
      required: [true, "A ticket must have a description"],
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },

    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assign_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    chat_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    attachments: String,
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

// Auto populate
ticketSchema.pre(/^find/, function () {
  this.populate("created_by", "name email role")
    .populate("assign_to", "name email role")
    .populate("chat_id", "name");
});

module.exports = mongoose.model("Ticket", ticketSchema);
