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

// Generate a unique ID based on date and random string
const timestamp = Date.now();
const randomSuffix = Math.random().toString(36).substring(2, 8);
const generatedId = `user-${timestamp}-${randomSuffix}`;

router.post("/", verifyToken, async (req, res) => {
  try {
    // explicitly mapping incoming request body to the schema
    const drink = new Drink({
      // the 'owner' must always come from the trusted decoded JWT, never the body
      owner: req.userId,
      // generate unique drink ID if not provided
      idDrink: req.body.idDrink || generatedId,
      // Unique fields
      strDrink: req.body.strDrink,
      strCategory: req.body.strCategory,
      strAlcoholic: req.body.strAlcoholic,
      strInstructions: req.body.strInstructions,
      strGlass: req.body.strGlass,
      strDrinkThumb: req.body.strDrinkThumb,
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


// READ (personalized)
// fetch only the drinks belonging to the currently logged-in user
// this powers the personalized view in the Dashboard
router.get("/my-drinks", verifyToken, async (req, res) => {
  try {
    // we filter the database search by the owner ID extracted from the JWT
    const drinks = await Drink.find({ owner: req.userId });
    res.json(drinks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE / REMOVE
// removes a drink, but only after verifying that the requester
// is the actual owner of the document or has an admin role
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const drink = await Drink.findById(req.params.id);

    // check if Drink exists
    if (!drink) {
      return res.status(404).json({ message: "Drink not found" });
    }

    //allow admins to delete any drink, or owners to delete their own by checking the role and ID for ownership authorization 
    if (req.userRole === "admin" || drink.owner.toString() === req.userId) {
       await Drink.findByIdAndDelete(req.params.id);
    res.json({ message: "Drink successfully deleted" });
    }
    else{
      return res.status(403).json({
        message: "Forbidden: You do not have permission to delete this drink.",
      });
    } 
   
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// get full drink details from single ID
router.get("/:id", async (req, res) => {
  try {
    const drink = await Drink.findById(req.params.id);

    if(!drink) {
      return res.status(404).json({ error: "Drink not found" });
    }

    res.json(drink);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
