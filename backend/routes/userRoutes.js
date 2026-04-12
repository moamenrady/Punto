const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const Router = express.Router();

Router.post("/signup", authController.signup);
Router.post("/login", authController.login);
Router.post("/forgotPassword", authController.forgetPassword);
Router.patch("/resetPassword/:token", authController.resetPassword);


 // Google Login
Router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google Callback
Router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
    (req, res) => {
    const token = jwt.sign(
      { id: req.user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      status: "success",
      token,
      user: req.user,
    });
  }
);
// protect all routes after this middleware
Router.use(authController.protect);

Router.patch("/updatePassword/", authController.updatePassword);
Router.get("/me", userController.getMe, userController.getUser);
Router.patch("/updateMe", userController.updateMe);
Router.delete("/deleteMe", userController.deleteMe);

Router.use(authController.restrictTo("admin"));
Router.route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

Router.route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);


module.exports = Router;
