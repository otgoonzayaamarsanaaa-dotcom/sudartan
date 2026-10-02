const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quizTitle: { type: String, default: "Ерөнхий дасгал" },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  accuracy: { type: Number, required: true }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Progress", ProgressSchema);