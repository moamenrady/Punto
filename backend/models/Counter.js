const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  name: String,   // user, task, project
  seq: Number,    // الرقم الحالي
});

module.exports = mongoose.model("Counter", counterSchema);