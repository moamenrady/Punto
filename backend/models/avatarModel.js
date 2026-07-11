const mongoose = require("mongoose");

const avatarSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
      unique: true,
    },
    data: {
      type: Buffer,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Avatar", avatarSchema);
