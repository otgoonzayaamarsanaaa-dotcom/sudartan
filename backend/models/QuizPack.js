const mongoose = require("mongoose");
const quizPackSchema = new mongoose.Schema({
  title: { type: String, required: true }, 
  description: { type: String, required: true }, 
  status: { type: String, default: "unlocked" }, 
  color: { type: String, default: "bg-emerald-500" }, 
}, { timestamps: true });
module.exports = mongoose.model("QuizPack", quizPackSchema);