const express = require("express");
const router = express.Router();
const QuizPack = require("../models/QuizPack");
const Question = require("../models/Question");
router.get("/quiz-packs", async (req, res) => {
  try {
    const packs = await QuizPack.find();
    res.json({ success: true, packs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.get("/quiz-packs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const questions = await Question.find({ packId: id });
    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;