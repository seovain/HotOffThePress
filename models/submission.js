const mongoose = require('mongoose'); //imports the schema

const submissionSchema = new mongoose.Schema({
    title: { type: String, required: true }, //title of the submission
    url: { type: String, required: true }, //URL of the submission
    content: { type: String, required: true }, //content or description of the submission
    author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, //reference to the User model
    createdAt: { type: Date, default: Date.now } //timestamp
});

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;