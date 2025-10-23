var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo');

// ...existing code...

// Routers
var indexRouter = require('./routes/index');
var submissionRouter = require('./routes/submissions');
var userRouter = require('./routes/users'); // <-- fixed filename

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
const url = 'mongodb://localhost:27017/AimForgePractice';
mongoose.connect(url)
    .then(() => console.log("Connected correctly to server :)!"))
    .catch((err) => console.log("this aint working lil bro", err));

// Session (use Mongo store so sessions survive server restarts)
app.use(session({
  secret: process.env.SESSION_SECRET || 'change_this_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: url }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Authentication middleware: require login for all routes except /users/*
app.use(function(req, res, next) {
  // allow auth routes and static assets
  if (req.path.startsWith('/users') || req.path.startsWith('/public') || req.path === '/favicon.ico') {
    return next();
  }
  if (req.session && req.session.userId) {
    return next();
  }
  return res.redirect('/users/login');
});

// Routing
app.use('/', indexRouter); // Home, FAQ, About, Help, etc.
app.use('/submissions', submissionRouter); // Submission routes
app.use('/users', userRouter); // User routes (register/login/logout)

// Set the port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Your server is now running on port ${PORT}`);
});

// ...existing error handling code...
module.exports = app;