const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TransportationSchema = new Schema({
    advertiserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', 
        required: true,
    },
    pickupLocation: {
        type: String,
    },
    dropoffLocation: {
        type: String,
    },
    dateAvailable: {
        type: Date,
        required: true,
    },
    timeAvailable: {
        type: String, 
        required: true,
    },
    price: {
        type: Number,
    },
    transportationType: {
        type: String,
    }
});

module.exports = mongoose.model('Transportation', TransportationSchema);
