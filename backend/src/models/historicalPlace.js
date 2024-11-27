const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the HistoricalPlaces schema
const historicalPlaceSchema = new Schema({
  name:{
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  pictures: {
    type: [String], // Array of picture URLs or file paths
  },
  location: {
    type: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    required: true,
  },
  openingHours: {
    type: String, // Example: "9:00 AM - 6:00 PM"
    required: true,
  },
  ticketPrice: {
    student: {
      type: Number,
      required: true,
    },
    native: {
      type: Number,
      required: true,
    },
    foreign: {
      type: Number,
      required: true,
    },
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  ratingSum: {
    type: Number,
    default: 0,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Tourist' }, // Comments related to the itinerary
    text: { type: String, required: true },
    date: { type: Date, default: Date.now },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users', // Assuming 'User' is the creator of the itinerary
    required: true,
  },
  tags: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HistoricalTags', // Update this to match the corrected model name
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
  
});

// Create and export the model
const HistoricalPlace = mongoose.model('HistoricalPlace', historicalPlaceSchema);
module.exports = HistoricalPlace;