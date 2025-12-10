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
      enum: ["open", "in-progress", "pending", "closed"],
      default: "open",
    },

    attachment: {
      type: String,
    },

    // created_by: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },

    assign_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    chat_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

// Auto populate   give error next is not a function
// ticketSchema.pre(/^find/, function (next) {
//   this.populate("created_by", "name email")
//     .populate("assign_to", "name email")
//     .populate("chat_id", "name");
//   next();
// });

module.exports = mongoose.model("Ticket", ticketSchema);
