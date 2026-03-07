const express = require("express");
const router = express.Router();
const Drink = require("../models/Drink"); // Import the Drink model

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
router.post("/", async (req, res) => {
  try {
    const newDrink = new Drink(req.body);
    await newDrink.save();
    res.status(201).json(newDrink);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Drink.findByIdAndDelete(req.params.id);
    res.json({ message: "Drink deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
