const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the activity category
const activityCategorySchema = new Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true // Ensures category names are unique
  }
});

// Create and export the model
const ActivityCategory = mongoose.model('ActivityCategory', activityCategorySchema);

module.exports = ActivityCategory;
