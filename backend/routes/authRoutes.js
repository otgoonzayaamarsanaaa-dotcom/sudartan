const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Энэ имэйл хэдийнэ бүртгэгдсэн байна." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Амжилттай бүртгэгдлээ!" });
  } catch (error) {
    res.status(500).json({ message: "Сервер дээр алдаа гарлаа." });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Имэйл эсвэл нууц үг буруу байна." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Имэйл эсвэл нууц үг буруу байна." });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "sudartan_secret_key", {
      expiresIn: "7d",
    });
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Сервер дээр алдаа гарлаа." });
  }
});

module.exports = router;