const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const bookings = require('../models/booking');
const mongo = require('mongodb');

const bookingRouter = express.Router();

//all of the endpoints / URI's

bookingRouter.get('/help', function(req, res, next) {
    res.render('help', { title: 'help' });
});
bookingRouter.get('/', function(req, res, next) {
    res.render('home', { title: 'home' })
});
bookingRouter.get('/table', function(req, res, next) {
    res.render('table', { title: 'table' })
})

bookingRouter.route('/')
    .get((req, res, next) => {
        res.end("just checking --> nothing to do")
    })

    bookingRouter.route('/create')
    .get((req, res, next) => {
        res.render('newbooking.ejs', { title: 'AimForge' });
    })


//Creating a new entry, sending to mongo, finding the data, rendering table page
.post((req, res, next) => {
    bookings.create(req.body)
        .then((bookingcreated) => {
            bookings.find()
                .then((bookingsfound) => {
                    res.render('table.ejs', { 'bookinglist': bookingsfound, title: 'All bookings' });
                }, (err) => next(err))
                .catch((err) => next(err));
        }, (err) => next(err))
        .catch((err) => next(err));
})


// error pages...
.put((req, res, next) => {
        res.send('PUT operation not supported on /phones/create');
    })
    // error pages
    .delete((req, res, next) => {
        res.end('Delete operation not  supported on /phones/create');

    });
//deleting user by id
bookingRouter.route('/delete')
    .post((req, res, next) => {
        bookings.findByIdAndDelete(req.body.id).then(reportsfound => {
                res.render("success.ejs", { title: "table page" });

            }, (err) => next(err))
            .catch((err) => next(err));
    });


//takes the id of the user you want to update/edit, puts details on page
// Route to find and display the booking for editing
bookingRouter.route('/update')
    .post((req, res, next) => {
        bookings.findOneAndUpdate({ id: req.body.id }) // Query by the "id" field
            .then((bookingsfound) => {
                if (!bookingsfound) {
                    return res.status(404).send('Booking not found'); // Handle case where no booking is found
                }
                console.log(bookingsfound);
                res.render("updatePage.ejs", { "bookinglist": bookingsfound, title: "Editing bookings" });
            })
            .catch((err) => next(err)); // Handle errors
    });

// Route to update the booking in the database and render a success page
bookingRouter.route('/updateComplete')
    .post((req, res, next) => {
        bookings.findOneAndUpdate(
            { id: req.body.id }, // Query by the "id" field
            req.body,            // Update data from the form
            { new: true }        // Return the updated document
        )
            .then((updatedBooking) => {
                if (!updatedBooking) {
                    return res.status(404).send('Booking not found'); // Handle case where no booking is found for update
                }
                // Fetch all bookings after the update
                return bookings.find()
                    .then((bookingsfound) => {
                        res.render("updatesuccess.ejs", { "bookinglist": bookingsfound, title: "Editing reports" });
                    });
            })
            .catch((err) => next(err)); // Handle errors
    });


// report generation    
bookingRouter.get('/reportform', (req, res) => {
    res.render('reportform');
});

// route to fetch and display report 
bookingRouter.post('/report', async (req, res) => {
    const { name, startDate, endDate } = req.body;

    try {

        const booking = await bookings.find({
            name,
            sessionDate: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            } 
        });

        //rendering the report page and passing bookings onto it
        res.render('report.ejs', { name , booking, startDate, endDate });
    } catch (err) {
        console.error(err);

        res.status(500).send('Internal Server Error')
    }
});

module.exports = bookingRouter; //exports from this file so that other files are allowed to access the exported code