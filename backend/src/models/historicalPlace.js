const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the HistoricalPlaces schema
const historicalPlaceSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  pictures: {
    type: [String], // Array of picture URLs or file paths
    required: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users", // Assuming 'User' is the creator of the itinerary
    required: true,
  },
  tags: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "historicalTags", // Assuming 'User' is the creator of the itinerary
  },
});

// Create and export the model
const HistoricalPlace = mongoose.model(
  "HistoricalPlace",
  historicalPlaceSchema
);
module.exports = HistoricalPlace;
