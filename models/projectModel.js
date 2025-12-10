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
      // لحد ما نعمل user/auth هنسيبها اختيارية
      // required: true
    },
  },
  { timestamps: true }
);

// auto populate created_by later
// projectSchema.pre(/^find/, function (next) {
//   this.populate("created_by", "name email");
//   next();
// });

module.exports = mongoose.model("Project", projectSchema);
