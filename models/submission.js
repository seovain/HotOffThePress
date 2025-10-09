const mongoose = require('mongoose'); //imports the schema

const submissionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    content: { type: String, required: true },
    author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;