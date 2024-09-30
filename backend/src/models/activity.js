const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the activity
const activitySchema = new Schema({
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
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    enum: ['historic areas', 'beaches', 'family-friendly', 'shopping', 'budget family'],
  },
  specialDiscounts: {
    type: Number, 
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  flag: {
    type: Number,
    enum: [0, 1], // 0: inappropriate, 1: appropriate
    default: 1,
  },
  isOpen: {
    type: Number,
    enum: [0, 1], // 0: closed, 1: opened
    default: 0,
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
  }
});

// Create and export the model
const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;
