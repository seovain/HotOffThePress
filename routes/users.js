var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// GET register form
router.get('/register', function(req, res, next) {
  res.render('createaccount', { title: 'Create Account', error: null });
});

// POST register form
router.post('/register', async function(req, res, next) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.render('createaccount', { title: 'Create Account', error: 'All fields required' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hash });
    await user.save();
    req.session.userId = user._id;
    res.redirect('/');
  } catch (err) {
    if (err.code === 11000) {
      return res.render('createaccount', { title: 'Create Account', error: 'Username or email already in use' });
    }
    console.error(err);
    res.render('createaccount', { title: 'Create Account', error: 'Server error' });
  }
});

// GET login form
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login', error: null });
});

// POST login
router.post('/login', async function(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.render('login', { title: 'Login', error: 'All fields required' });
    const user = await User.findOne({ username });
    if (!user) return res.render('login', { title: 'Login', error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.render('login', { title: 'Login', error: 'Invalid credentials' });
    req.session.userId = user._id;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('login', { title: 'Login', error: 'Server error' });
  }
});

// GET account page
router.get('/account', async function(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.redirect('/users/account');
  }
  try {
    const user = await User.findById(req.session.userId).select('username email createdAt');
    if (!user) return res.redirect('/users/login');
    res.render('account', { title: 'My Account', user: user });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});


// GET logout
router.get('/logout', function(req, res, next) {
  req.session.destroy(function() {
    res.redirect('/users/login');
  });
});

// POST logout (perform logout)
router.post('/logout', function(req, res, next) {
  req.session.destroy(function() {
    res.redirect('/users/login');
  });
});

module.exports = router;