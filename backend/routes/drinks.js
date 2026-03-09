const express = require("express");
const router = express.Router();
const Drink = require("../models/Drink"); // Import the Drink model
const verifyToken = require("../middleware/authMiddleware");


// public view
// returns every new drink from every user.
router.get("/", async (req, res) => {
  try {
    const drinks = await Drink.find(); // No filter, returns all
    res.json(drinks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE / ADD A DRINK
// Adds a new drink and automatically
// adds an owner using the ID extracted 
// from the JWT token.
router.post("/", verifyToken, async (req, res) => {
  try {
    // explicitly mapping incoming request body to the schema
    const drink = new Drink({
      // the 'owner' must always come from the trusted decoded JWT, never the body
      owner: req.userId,
      // Unique fields
      strDrink: req.body.strDrink,
      strCategory: req.body.strCategory,
      strAlcoholic: req.body.strAlcoholic,
      strInstructions: req.body.strInstructions,
      strImageSource: req.body.strImageSource,
      // Ingredients
      strIngredient1: req.body.strIngredient1,
      strIngredient2: req.body.strIngredient2,
      strIngredient3: req.body.strIngredient3,
      strIngredient4: req.body.strIngredient4,
      strIngredient5: req.body.strIngredient5,
      strIngredient6: req.body.strIngredient6,
      strIngredient7: req.body.strIngredient7,
      strIngredient8: req.body.strIngredient8,
      strIngredient9: req.body.strIngredient9,
      strIngredient10: req.body.strIngredient10,
      strIngredient11: req.body.strIngredient11,
      strIngredient12: req.body.strIngredient12,
      strIngredient13: req.body.strIngredient13,
      strIngredient14: req.body.strIngredient14,
      strIngredient15: req.body.strIngredient15,
      // Measures
      strMeasure1: req.body.strMeasure1,
      strMeasure2: req.body.strMeasure2,
      strMeasure3: req.body.strMeasure3,
      strMeasure4: req.body.strMeasure4,
      strMeasure5: req.body.strMeasure5,
      strMeasure6: req.body.strMeasure6,
      strMeasure7: req.body.strMeasure7,
      strMeasure8: req.body.strMeasure8,
      strMeasure9: req.body.strMeasure9,
      strMeasure10: req.body.strMeasure10,
      strMeasure11: req.body.strMeasure11,
      strMeasure12: req.body.strMeasure12,
      strMeasure13: req.body.strMeasure13,
      strMeasure14: req.body.strMeasure14,
      strMeasure15: req.body.strMeasure15,
    });

    await drink.save();
    res.status(201).json(drink);
  } catch (err) {
    res.status(400).json({ message: "Error saving drink", error: err.message });
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
