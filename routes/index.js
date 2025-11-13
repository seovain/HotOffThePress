var express = require('express');
var router = express.Router();
const HNStory = require('../models/HNStory');

// Homepage
router.get('/', async function(req, res, next) {
    try {
        // fetch cached HN stories (most recent/favored)
        const hnStories = await HNStory.find().sort({ score: -1, time: -1 }).limit(10);
        res.render('home', { title: 'Home', hnStories: hnStories });
    } catch (err) {
        console.error(err);
        res.render('home', { title: 'Home', hnStories: [] });
    }
});
// Help page
router.get('/help', function(req, res, next) {
    res.render('help', { title: 'Help' });
});

// About page
router.get('/about', function(req, res, next) {
    res.render('about', { title: 'About Us' });
});

// FAQ page
router.get('/faq', function(req, res, next) {
    res.render('faq', { title: 'FAQ' });
});

// Report form page
router.get('/reportform', function(req, res, next) {
    res.render('reportform', { title: 'Report' });
});

// Report results page
router.get('/report', function(req, res, next) {
    res.render('report', { title: 'Submission Report' });
});

module.exports = router;