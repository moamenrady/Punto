const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");
const crypto = require("crypto");
const sendEmail = require("../utils/email");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/v1/users/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("👤 Google Profile received:", profile.displayName);
        if (!profile.emails || profile.emails.length === 0) {
          throw new Error("No email found in Google profile");
        }
        const email = profile.emails[0].value;
        console.log("📧 Google Email:", email);

        let user = await User.findOne({ email });

        if (!user) {
          // New Google signup — still require email verification
          const verificationToken = crypto.randomBytes(32).toString("hex");
          const oauthPassword =
            "google-oauth-" + crypto.randomBytes(16).toString("hex");

          user = await User.create({
            name: profile.displayName,
            email: email,
            password: oauthPassword,
            confirmPassword: oauthPassword,
            isVerified: false,
            verificationToken: crypto
              .createHash("sha256")
              .update(verificationToken)
              .digest("hex"),
            verificationExpires: Date.now() + 24 * 60 * 60 * 1000,
          });

          // Send verification email (Wrapped in its own try/catch to prevent crashes)
          const verificationURL = `${process.env.FRONTEND_URL || "http://localhost:5175"}/verify-email/${verificationToken}`;

          sendEmail({
            email: user.email,
            subject: "Verify your Punto account",
            message: `Welcome to Punto, ${profile.displayName}!\n\nPlease verify your email by clicking the link below:\n\n${verificationURL}\n\nThis link expires in 24 hours.`,
          })
            .then(() => console.log("📨 Verification email sent to:", email))
            .catch((emailErr) => {
              console.error(
                "⚠️ Failed to send verification email (background), but user was created:",
                emailErr.message,
              );
            });
        } else if (!user.isVerified) {
          // Existing unverified user returning via Google — auto-verify them
          user.isVerified = true;
          user.verificationToken = undefined;
          user.verificationExpires = undefined;
          await user.save({ validateBeforeSave: false });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

module.exports = passport;
