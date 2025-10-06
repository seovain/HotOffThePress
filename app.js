var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var bookingRouter = require('./routes/Booking');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routing to index and to phone, used in form and database
app.use('/', indexRouter);
app.use('/booking', bookingRouter);




//creating the databas/connecting to existing database
const url = 'mongodb://localhost:27017/AimForgePractice'; // mongodb connection string (local)
const connect = mongoose.connect(url); 

//logging in console if connected to database or not
connect.then((db) => {
    console.log("Connected correctly to server :)!"); // success logged
}, (err) => { console.log("this aint working lil bro", err); }); // error logged 

// setting the port where the webpage is hosted
const PORT = process.env.PORT || 3000;

// start the server and host on specified port
app.listen(PORT, () => {
  console.log(`Your server is now running on port ${PORT}`); // mesage is logged in the terminal
});

// catch 404 error, forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;