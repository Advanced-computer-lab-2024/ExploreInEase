const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itinerarySchema = new Schema({
  activities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity', 
    required: true,
  }],
  preftag: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PreferenceTags', 
    required: true,
  }],
  locations: {
    type: [String], // An array of strings for location names
    required: true,
  },
  timeline: {
    type: [String], // An array of strings representing the timeline for each activity
    required: true,
  },
  directions: {
    type: String, // Directions to follow during the itinerary
    required: true,
  },
  language: {
    type: String, 
    required: true,
  },
  price: {
    type: Number, 
    required: true,
  },
  dateTimeAvailable: {
    type: [Date], // Array of available dates and times for the itinerary
    required: true,
  },
  accessibility: {
    type: Boolean, // Indicates if the tour is accessible for disabled persons
    default: false,
  },
  pickupLocation: {
    type: String, 
    required: true,
  },
  dropoffLocation: {
    type: String, 
    required: true,
  },
  isActivated: {
    type: Number, 
    default: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users', 
    required: true,
  },
  flag: {
    type: Number,
    enum: [0, 1], 
    default: 1,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5, // Rating on a scale of 0 to 5
  },
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isSpecial: {
    type: Boolean,
    default: false,
  },
});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
module.exports = Itinerary;
