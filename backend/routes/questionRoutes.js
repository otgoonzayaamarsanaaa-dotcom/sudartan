const express = require("express");
const router = express.Router();
const sampleQuizzes = [
  {
    _id: "q1",
    title: "Монгол хэлний зөв бичих дүрэм",
    description: "Эгшиг ба гийгүүлэгч үсгийн дүрмийн сорил",
    questions: [
      {
        id: 1,
        question: "'Авьяас' гэдэг үгийн зөв бичих хэлбэр ямар вэ?",
        options: ["Авъяас", "Авьяас", "Авиас", "Авъяс"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "Ямар үсгийн дараа зөөлний тэмдэг бичих вэ?",
        options: ["Заримдаг гийгүүлэгч", "Эгшиг үсэг", "Буйлны гийгүүлэгч", "Хэлний угийн гийгүүлэгч"],
        correctAnswer: 0,
      },
    ],
  },
];
router.get("/", async (req, res) => {
  try {
    res.json(sampleQuizzes);
  } catch (error) {
    console.error("Fetch quizzes error:", error);
    res.status(500).json({ message: "Серверийн алдаа гарлаа" });
  }
});

module.exports = router;