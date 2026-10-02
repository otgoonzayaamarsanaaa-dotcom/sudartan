const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/shop/buy", async (req, res) => {
  try {
    const { userId, itemType, cost } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return.json({ success: false, message: "Хэрэглэгч олдсонгүй" });
    }

    if (user.coins < cost) {
      return.json({ success: false, message: "Зоос хүрэлцэхгүй байна" });
    }

    user.coins -= cost;
    if (itemType === "freeze") {
      user.streakFreeze = (user.streakFreeze || 0) + 1;
    }

    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;