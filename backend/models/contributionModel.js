// models/contributionModel.js
const mongoose = require("mongoose");

const contributionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ["repo", "commit", "issue"], required: true }
});

module.exports = mongoose.model("Contribution", contributionSchema);
