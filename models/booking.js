const mongoose = require('mongoose'); //imports the schema

const bookingSchema = new mongoose.Schema ({
    name:{ type: String, required: true },
    id: { type: String, required: true },
    sessionDate: { type: Date, require: true },
    sessionTime: { type: String, required: true },
    cardNumber: { type: String, required: true },
    expiryDate: { type: String, required: true },
    securityCode: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const booking = mongoose.model('Booking', bookingSchema); // creates model called booking

module.exports = booking;