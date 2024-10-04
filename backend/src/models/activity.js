const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
  name: {
    type: String,
    required: true,
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
    type: String, 
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
    enum: [0, 1], 
    default: 1,
  },
  isOpen: {
    type: Number,
    enum: [0, 1], 
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

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;
