const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Itinerary schema
const itinerarySchema = new Schema({
  name:{
    type: String,
  },
  activities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity', // Referencing the Activity schema
    required: true,
  }],
  preftag: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PreferenceTags', // Referencing the Activity schema
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
    type: String, // Language used in the tour
    required: true,
  },
  price: {
    type: Number, // Price of the tour
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
    type: String, // The location where participants are picked up
    required: true,
  },
  dropoffLocation: {
    type: String, // The location where participants are dropped off
    required: true,
  },
  isActivated: {
    type: Number, // Whether the itinerary is active or not
    default: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users', // Assuming 'User' is the creator of the itinerary
    required: true,
  },
  flag: {
    type: Number,
    enum: [0, 1], // 0: inappropriate, 1: appropriate
    default: 1,
  },
  rating: {
    type: [Number], // Changed from Number to an array of Numbers
    min: 0,
    max: 5, // Rating on a scale of 0 to 5
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
  isSpecial: {
    type: Boolean,
    default: false,
  },
});

// Create and export the model
const Itinerary = mongoose.model('Itinerary', itinerarySchema);
module.exports = Itinerary;
