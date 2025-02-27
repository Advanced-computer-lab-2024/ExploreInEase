const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the activity
const activitySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
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
      }
    },
    required: true,
  },
  price: {
    type: String, // Example: "$", "$$" for range or you can use Number if it's specific
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ActivityCategory', 
    required: true,
  },
  specialDiscounts: {
    type: Number, 
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  flag: {
    type: Number,
    enum: [0, 1], // 0: inappropriate, 1: appropriate
    default: 1,
  },
  isOpen: {
    type: Boolean,
    enum: [false, true], // 0: closed, 1: opened
    default: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Tourist' },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PreferenceTags',
    required: true,
  }],
  isBooked: {
    type: Boolean,
    default: false,
  },
});

// Create and export the model
const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;
