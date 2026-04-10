const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A project must have a name"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "A project must have a description"],
      trim: true,
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// auto populate created_by later
projectSchema.pre(/^find/, function () {
  this.populate("created_by", "name email role");
});

module.exports = mongoose.model("Project", projectSchema);
