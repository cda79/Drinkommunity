const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    drinkId: {
      type: String, // Matches your idDrink or _id
      required: true,
    },
    imageThumb: {
      //thumbnail for the user profile pic
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links to your User model
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
); // Automatically adds 'createdAt'

module.exports = mongoose.model("Comment", CommentSchema);
