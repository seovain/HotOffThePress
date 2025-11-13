var express = require('express');
var router = express.Router();
const Submission = require('../models/submission');
const User = require('../models/user');

// simple auth middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) return next();
  return res.redirect('/users/login');
}

// GET all submissions (public)
router.get('/', async function(req, res, next) {
  try {
    const submissions = await Submission.find().populate('author', 'username').sort({ createdAt: -1 });
    res.render('allsubmissions', { title: 'All Submissions', submissions });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// GET form to create a new submission (requires login)
router.get('/create', requireAuth, function(req, res, next) {
  res.render('newsubmission', { title: 'Submit Story', error: null });
});

// POST create new submission
router.post('/create', requireAuth, async function(req, res, next) {
  try {
    const { title, url, content } = req.body;
    if (!title || !content) {
      // render an error page for missing fields
      return res.status(400).render('submission-error', {
        title: 'Submission Error',
        message: 'Title and content are required.'
      });
    }

    const submission = new Submission({
      title,
      url: url || '',
      content,
      author: req.session.userId
    });

    await submission.save();

    // render success page with saved submission info
    return res.status(201).render('submission-success', {
      title: 'Submission Successful',
      submission: submission
    });
  } catch (err) {
    console.error(err);
    return res.status(500).render('submission-error', {
      title: 'Submission Error',
      message: 'Could not save submission. Please try again later.'
    });
  }
});
// GET current user's submissions
router.get('/mine', requireAuth, async function(req, res, next) {
  try {
    const submissions = await Submission.find({ author: req.session.userId }).sort({ createdAt: -1 });
    res.render('mysubmissions', { title: 'My Submissions', submissions });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

module.exports = router;