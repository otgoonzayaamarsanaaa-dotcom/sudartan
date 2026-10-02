const mongoose = require("mongoose");
const questionSchema = new mongoose.Schema({
  packId: { type: mongoose.Schema.Types.ObjectId, ref: "QuizPack", required: true }, 
  question: { type: String, required: true }, 
  options: [{ type: String, required: true }],
  correct: { type: Number, required: true }, 
}, { timestamps: true });
module.exports = mongoose.model("Question", questionSchema);