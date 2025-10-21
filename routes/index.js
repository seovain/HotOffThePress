var express = require('express');
var router = express.Router();

// Homepage
router.get('/', function(req, res, next) {
    res.render('home', { title: 'Home' });
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