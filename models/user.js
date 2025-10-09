const mongoose = require('mongoose'); //imports the schema

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, //hashed password
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
module.exports = User;