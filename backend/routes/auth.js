const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/authMiddleware")

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
    if (err && err.code === 11000) {
      return res.status(400).json({ message: "Username already exists" });
    }
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
    res.json({ 
      id: req.user._id, 
      username: req.user.username, 
      role: req.user.role, 
      favourites: req.user.favourites || [],
      nickname: req.user.nickname || null,
      imageThumb: req.user.imageThumb || null,
    });
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

// toggle favourite drinks and get all favourited drinks

router.post("/favourite/:drinkId", verifyToken, async (req, res) => {
  try{ 
    const user = await User.findById(req.userId);
    const drinkId = req.params.drinkId;

    const index = user.favourites.indexOf(drinkId);

    if (index > -1) {
      user.favourites.splice(index, 1);
      await user.save();
      return res.json({ message: "Removed from favourites", favourites: user.favourites })
    } else {
      user.favourites.push(drinkId);
      await user.save()
      return res.json({ message: "Added to favourites", favourites: user.favourites })
    }
  } catch (err) {
    res.status(500).json({error: err.message });
  };
});

router.get("/favourites", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("favourites");
    res.json(user.favourites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  };
});

router.put("/update-thumbnail", verifyToken, async (req, res) => { //updating user profile pic
  try {
    const user = await User.findById(req.userId);
    const { imageThumb } = req.body;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.imageThumb = imageThumb;
    await user.save();

    res.json({ message: "Thumbnail updated successfully", imageThumb: user.imageThumb });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/update", verifyToken, async (req, res) => { //updating user settings (username, password, nickname)
    try {
        const user = await User.findById(req.userId);
        const { newNickname, newUsername, newPassword, confirmNewPassword } = req.body;
        const updateData = {};

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // only update if the field is filled out
        if (typeof newNickname === 'string' && newNickname.trim() !== '') {
            updateData.nickname = newNickname.trim();
        }

        if (typeof newUsername === 'string' && newUsername.trim() !== '' && newUsername !== user.username) {
          const trimmed = newUsername.trim();
          // check if the new username is already taken by another user
          const usernameTaken = await User.findOne({ username: trimmed });
          if (usernameTaken && usernameTaken._id.toString() !== user._id.toString()) {
            return res.status(400).json({ message: "Username already taken" });
          }
          updateData.username = trimmed;
        }

        if (typeof newPassword === 'string' && newPassword !== '') {
            if (typeof confirmNewPassword !== 'string' || newPassword !== confirmNewPassword) {
                return res.status(400).json({ message: "Passwords do not match!" });
            }
            updateData.password = await bcrypt.hash(newPassword, 10);
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "Please enter at least one field to update." });
        }

        Object.assign(user, updateData);
        await user.save();
        res.json({ message: "User settings updated successfully!" });
    } catch (error) {
      console.error("Error updating user settings:", error);
      if (error && error.code === 11000) {
        return res.status(400).json({ message: "Username already exists" });
      }
      res.status(500).json({ error: "An error occurred while updating user settings." });
    }
});

module.exports = router;
