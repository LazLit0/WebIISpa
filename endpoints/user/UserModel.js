var mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    id: Number,
    userID: { type: String, unique: true },
    userName: String,
    email: String,
    password: String,
    image: String,
    isAdministrator: { type: Boolean, default: false }
},                                     { timestamp: true}
                                      );

