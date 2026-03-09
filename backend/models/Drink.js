const mongoose = require("mongoose");

const DrinkSchema = new mongoose.Schema({
  // new Owner field:
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // points to the User collection
    required: true,
  },

  idDrink: { //id from thecocktaildb
    type: String,
    default: "Unknown Drink",
  },
  strDrink: { //name of the drink
    type: String,
    default: "Unknown Drink",
  },
  strTags: { //tags for the drink (e.g. "IBA", "Classic", "Cocktail")
    type: String,
  },
  strCategory: { //category of the drink (e.g. "Cocktail", "Ordinary Drink")
    type: String,
  },
  strIBA: { //IBA category (e.g. "Contemporary Classics", "New Era Drinks")
    type: String,
  },
  strAlcoholic: { //alcoholic or non-alcoholic
    type: String,
  },
  strInstructions: { // instructions for making the drink in English (Other Laungages available as strInstructionsDE, strInstructionsIT, etc. but they are not relevant to our project)
    type: String,
  },
  strGlass: { // type of glass drink is served in
    type: String,
  }, 
  strDrinkThumb: { // URL for the drink's thumbnail
    type: String,
  }, 
  // Ingredients (up to 15)
  strIngredient1: {
    type: String,
  },
  strIngredient2: {
    type: String,
  },
  strIngredient3: {
    type: String,
  },
  strIngredient4: {
    type: String,
  },
  strIngredient5: {
    type: String,
  },
  strIngredient6: {
    type: String,
  },
  strIngredient7: {
    type: String,
  },
  strIngredient8: {
    type: String,
  },
  strIngredient9: {
    type: String,
  },
  strIngredient10: {
    type: String,
  },
  strIngredient11: {
    type: String,
  },
  strIngredient12: {
    type: String,
  },
  strIngredient13: {
    type: String,
  },
  strIngredient14: {
    type: String,
  },
  strIngredient15: {
    type: String,
  },
  strMeasure1: {
    type: String,
  },
  strMeasure2: {
    type: String,
  },
  strMeasure3: {
    type: String,
  },
  strMeasure4: {
    type: String,
  },
  strMeasure5: {
    type: String,
  },
  strMeasure6: {
    type: String,
  },
  strMeasure7: {
    type: String,
  },
  strMeasure8: {
    type: String,
  },
  strMeasure9: {
    type: String,
  },
  strMeasure10: {
    type: String,
  },
  strMeasure11: {
    type: String,
  },
  strMeasure12: {
    type: String,
  },
  strMeasure13: {
    type: String,
  },
  strMeasure14: {
    type: String,
  },
  strMeasure15: {
    type: String,
  },
  strImageSource: { // source of the drink's image for crediting purposes
    type: String,
  },

  strCreativeCommonsConfirmed: { // whether the image is confirmed to be under Creative Commons license (Yes/No)
    type: String,
  },
  dateModified: { // date the drink was last modified in the cocktail database
    type: String,
  },

});

module.exports = mongoose.model("Drink", DrinkSchema);
