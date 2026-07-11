const mongoose = require("mongoose");
const Counter = require("./Counter");

const companySchema = new mongoose.Schema(
  {
    custom_id: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "A company must have a name"],
      trim: true,
      unique: true,
    },
    plan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: [true, "A company must be linked to a plan"],
    },
    logo: String,
    industry: String,
    address: String,
    website: String,
    active: {
      type: Boolean,
      default: true,
    },
    managers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    company_users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    departments: [
      {
        name: {
          type: String,
          required: [true, "A department must have a name"],
          trim: true,
        },
        users: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Populate departments.users automatically
companySchema.pre(/^find/, function (next) {
  this.populate({
    path: "departments.users",
    select: "name email role photo dept",
  });
  next();
});

// Auto-generate custom_id
companySchema.pre("save", async function () {
  if (this.custom_id) return;

  const counter = await Counter.findOneAndUpdate(
    { name: "company" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.custom_id = `cmp_${counter.seq}`;
});

module.exports = mongoose.model("Company", companySchema);
