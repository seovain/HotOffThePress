const mongoose = require('mongoose');

const hnStorySchema = new mongoose.Schema({
  hnId: { type: Number, required: true, unique: true },
  title: String,
  by: String,
  url: String,
  time: Number,
  score: Number,
  descendants: Number,
  text: String,
  fetchedAt: { type: Date, default: Date.now }
});

const HNStory = mongoose.model('HNStory', hnStorySchema);
module.exports = HNStory;