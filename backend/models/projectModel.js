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

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// auto populate created_by and members
projectSchema.pre(/^find/, function () {
  this.populate("created_by", "name email role").populate(
    "members",
    "name email role photo"
  );
});

module.exports = mongoose.model("Project", projectSchema);
