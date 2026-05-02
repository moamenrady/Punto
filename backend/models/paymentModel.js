const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    features: [String],

    amount: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ["visa", "instapay", "vodafone_cash"],
      default: "visa"
    },

    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending"
    },

    expireDate: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);