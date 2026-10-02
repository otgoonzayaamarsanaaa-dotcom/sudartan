const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); 
const app = express();
app.use(cors());
app.use(express.json());
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sudartan"; 
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB-тэй амжилттай холбогдлоо ✅"))
  .catch((err) => console.error("MongoDB холболтын алдаа ❌:", err));
const questionRoutes = require("./routes/questionRoutes");
const progressRoutes = require("./routes/progressRoutes");
app.use("/api/quizzes", questionRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/leaderboard", (req, res, next) => {
  req.url = "/leaderboard";
  progressRoutes(req, res, next);
});
app.get("/", (req, res) => {
  res.send("Sudartan Backend API Server is running...");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🚀`);
});
app.get('/api/leaderboard', async (req, res) => {
  try {
    const users = await User.find().sort({ xp: -1 }).limit(10);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Серверийн алдаа гарлаа" });
  }
});