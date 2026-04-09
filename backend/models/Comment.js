const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  drinkId: {
    type: String,
    required: true,
  },
  imageThumb: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Comment", CommentSchema);
