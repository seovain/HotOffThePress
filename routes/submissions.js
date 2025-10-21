const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Submission = require('../models/submission'); // Import Submission schema
const mongo = require('mongodb');
const submissionRouter = express.Router();

// Render help page
submissionRouter.get('/help', function(req, res, next) {
    res.render('help', { title: 'Help' });
});

// Render home page
submissionRouter.get('/', function(req, res, next) {
    res.render('home', { title: 'Home' });
});

// Render all submissions table
submissionRouter.get('/table', async function(req, res, next) {
    try {
        const submissions = await Submission.find().populate('author', 'username');
        res.render('table', { title: 'All Submissions', submissionList: submissions });
    } catch (err) {
        next(err);
    }
});

// Render new submission form
submissionRouter.get('/create', function(req, res, next) {
    res.render('newsubmission.ejs', { title: 'Submit Story' });
});

// Create a new submission
submissionRouter.post('/create', async (req, res, next) => {
    try {
        // You should have authentication middleware to set req.user._id
        const { title, url, content } = req.body;
        const author = req.user._id; // Make sure req.user is set by your auth middleware

        const submission = await Submission.create({ title, url, content, author });
        const submissions = await Submission.find().populate('author', 'username');
        res.render('table.ejs', { submissionList: submissions, title: 'All Submissions' });
    } catch (err) {
        next(err);
    }
});

// Upvote a submission
submissionRouter.post('/upvote', async (req, res, next) => {
    try {
        const { id } = req.body;
        const submission = await Submission.findByIdAndUpdate(
            id,
            { $inc: { upvotes: 1 } },
            { new: true }
        );
        if (!submission) {
            return res.status(404).send('Submission not found');
        }
        res.json({ upvotes: submission.upvotes });
    } catch (err) {
        next(err);
    }
});

// Delete a submission by id
submissionRouter.post('/delete', async (req, res, next) => {
    try {
        await Submission.findByIdAndDelete(req.body.id);
        res.render("success.ejs", { title: "Submission Deleted" });
    } catch (err) {
        next(err);
    }
});

// Render update form for a submission
submissionRouter.post('/update', async (req, res, next) => {
    try {
        const submission = await Submission.findById(req.body.id);
        if (!submission) {
            return res.status(404).send('Submission not found');
        }
        res.render("updatePage.ejs", { submission, title: "Edit Submission" });
    } catch (err) {
        next(err);
    }
});

// Update a submission in the database
submissionRouter.post('/updateComplete', async (req, res, next) => {
    try {
        const updatedSubmission = await Submission.findByIdAndUpdate(
            req.body.id,
            req.body,
            { new: true }
        );
        if (!updatedSubmission) {
            return res.status(404).send('Submission not found');
        }
        const submissions = await Submission.find().populate('author', 'username');
        res.render("updatesuccess.ejs", { submissionList: submissions, title: "Submission Updated" });
    } catch (err) {
        next(err);
    }
});

// Render report form
submissionRouter.get('/reportform', (req, res) => {
    res.render('reportform');
});

// Generate a report of submissions by author and date range
submissionRouter.post('/report', async (req, res) => {
    const { author, startDate, endDate } = req.body;
    try {
        const submissions = await Submission.find({
            author,
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            }
        }).populate('author', 'username');
        res.render('report.ejs', { author, submissions, startDate, endDate });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = submissionRouter;