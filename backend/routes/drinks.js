const express = require("express");
const router = express.Router();
const Drink = require("../models/Drink"); // Import the Drink model
const verifyToken = require("../middleware/authMiddleware");


// GET ROUTE (fetch first 3)
router.get("/", async (req, res) => {
  try {
    const drinks = await Drink.find().limit(3);
    res.json(drinks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// NEW POST ROUTE (create Drink)
router.post("/", verifyToken, async (req, res) => {
  try {
    const newDrink = new Drink({...req.body, user: req.userId});
    await newDrink.save();
    res.status(201).json(newDrink);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedDrink = await Drink.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!deletedDrink) {
      return res.status(403).json({message:"Forbidden: You do not have permission to delete this drink."
      });
    }

    res.json({ message: "Drink deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
