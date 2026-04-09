const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const verifyToken = require("../middleware/authMiddleware");

// GET comments for a specific drink
router.get("/:drinkId", async (req, res) => {
  try {
    const comments = await Comment.find({ drinkId: req.params.drinkId })
      .populate("user", "username imageThumb")
      .sort({ createdAt: -1 }); // Newest first
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new comment (Logged in users only)
router.post("/", verifyToken, async (req, res) => {
  try {
    const newComment = new Comment({
      drinkId: req.body.drinkId,
      imageThumb: req.user.imageThumb,
      user: req.userId,
      text: req.body.text,
    });

    const savedComment = await newComment.save();
    const populatedComment = await savedComment.populate(
      "user",
      "username imageThumb",
    );

    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
