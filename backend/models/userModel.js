const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const validator = require("validator");

// Counter model
const Counter = require("./Counter");

// ===============================
// 🔥 USER SCHEMA
// ===============================
const userSchema = new mongoose.Schema(
  {
    // ===============================
    // 🔥 CUSTOM ID (NEW)
    // ===============================
    custom_id: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      required: [true, "User must have a name"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "User must have an email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },

    photo: {
      data: Buffer,
      contentType: String,
    },

    phone: { type: String, default: "" },
    dept: { type: String, default: "" },
    location: { type: String, default: "" },

    role: {
      type: String,
      enum: ["admin", "manager", "user"],
      default: "user",
    },

    password: {
      type: String,
      required: [true, "User must have a password"],
      minlength: 8,
      select: false,
    },

    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },

    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    team_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    features: {
      type: [String],
      default: [],
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: true, // Default to true for existing users, we'll set it to false for new signups
    },
    verificationToken: String,
    verificationExpires: Date,
  },
  {
    timestamps: true,
  }
);

// ===============================
// 🔥 AUTO GENERATE CUSTOM ID
// ===============================
userSchema.pre("save", async function () {
  if (this.custom_id) return;

  const counter = await Counter.findOneAndUpdate(
    { name: "user" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.custom_id = `usr_${counter.seq}`;
});

// ===============================
// 🔥 PASSWORD HASH
// ===============================
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});

userSchema.pre("save", function () {
  if (!this.isModified("password") || this.isNew) return;
  this.passwordChangedAt = Date.now() - 1000;
});

// ===============================
// 🔥 METHODS
// ===============================
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// ===============================
// 🔥 ACTIVE FILTER
// ===============================
userSchema.pre(/^find/, function () {
  this.find({ active: { $ne: false } });
});

module.exports = mongoose.model("User", userSchema);