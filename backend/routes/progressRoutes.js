const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Progress = require("../models/Progress");

const saveProgressHandler = async (req, res) => {
  try {
    const { userId, quizTitle, totalQuestions, correctAnswers } = req.body;

    if (!userId || !quizTitle || totalQuestions === undefined || correctAnswers === undefined) {
      return res.status(400).json({ message: "Мэдээлэл дутуу байна." });
    }

    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

    const newProgress = new Progress({
      userId,
      quizTitle,
      totalQuestions,
      correctAnswers,
      accuracy,
    });

    await newProgress.save();
    res.status(201).json({ message: "Үр дүн амжилттай хадгалагдлаа", progress: newProgress });
  } catch (error) {
    console.error("Save progress error:", error);
    res.status(500).json({ message: "Серверийн алдаа гарлаа" });
  }
};

router.post("/save", saveProgressHandler);
router.post("/", saveProgressHandler);
router.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = await Progress.aggregate([
      {
        $group: {
          _id: "$userId",
          totalQuizzes: { $sum: 1 },
          averageAccuracy: { $avg: "$accuracy" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: {
          path: "$userInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          username: { $ifNull: ["$userInfo.username", "Суралцагч"] },
          totalQuizzes: 1,
          averageAccuracy: { $round: ["$averageAccuracy", 0] },
          xp: { $multiply: [{ $round: ["$averageAccuracy", 0] }, 10] },
        },
      },
      {
        $sort: { xp: -1, averageAccuracy: -1 },
      },
    ]);

    res.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    res.status(500).json({ message: "Серверийн алдаа гарлаа" });
  }
});
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    let filter = { userId };
    if (mongoose.Types.ObjectId.isValid(userId)) {
      filter = { userId: new mongoose.Types.ObjectId(userId) };
    }

    const history = await Progress.find(filter)
      .sort({ createdAt: -1 })
      .limit(10);

    if (!history || history.length === 0) {
      return res.json({ history: [], averageAccuracy: 0, totalQuizzes: 0 });
    }

    const totalAccuracy = history.reduce((acc, curr) => acc + curr.accuracy, 0);
    const averageAccuracy = Math.round(totalAccuracy / history.length);

    res.json({
      history,
      averageAccuracy,
      totalQuizzes: history.length,
    });
  } catch (error) {
    console.error("User history fetch error:", error);
    res.status(500).json({ message: "Серверийн алдаа гарлаа" });
  }
});

module.exports = router;