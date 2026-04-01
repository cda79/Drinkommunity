const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, //No two users can have the same name
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'], 
        default: 'user', //Default role is 'user', have to give admin permissions manually in mongoDB
    },
    favourites: [{
        type: String
    }],
});

module.exports = mongoose.model("User", UserSchema);