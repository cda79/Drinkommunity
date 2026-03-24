const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // 2. hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. save the user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. find user
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    // 2. compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // 3. generate token  ("wristband")
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role, // Include the user's role in the token to manage permissions 
      },
      process.env.JWT_SECRET || "fallbackSecret",
      { expiresIn: "1h" },
    );

    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get username by id
// Return current user info (authenticated)
router.get("/me", require("../middleware/authMiddleware"), (req, res) => {
  // verifyToken already attached `req.user` (from DB) and `req.userRole` this allows us to check if the user is truly an admin without trusting the claim they're making (I.E. they can't just edit the token)
  try {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    res.json({ id: req.user._id, username: req.user.username, role: req.user.role });
  } catch (err) {
    console.error("Error in /me handler:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// get username by id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("username");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
