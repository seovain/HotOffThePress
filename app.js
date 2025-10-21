var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

// Routers
var indexRouter = require('./routes/index');
var submissionRouter = require('./routes/submission');
var userRouter = require('./routes/user'); // If you have user routes

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routing
app.use('/', indexRouter); // Home, FAQ, About, Help, etc.
app.use('/submissions', submissionRouter); // Submission routes
app.use('/users', userRouter); // User routes (e.g., /user/submissions)

// MongoDB connection
const url = 'mongodb://localhost:27017/AimForgePractice';
mongoose.connect(url)
    .then(() => console.log("Connected correctly to server :)!"))
    .catch((err) => console.log("this aint working lil bro", err));

// Set the port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Your server is now running on port ${PORT}`);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;