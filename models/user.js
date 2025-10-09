const mongoose = require('mongoose'); //imports the schema

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, //username for the user
    password: { type: String, required: true }, //hashed password
    email: { type: String, required: true, unique: true }, //user email
    createdAt: { type: Date, default: Date.now } //timestamp
});

const User = mongoose.model('User', userSchema);
module.exports = User;