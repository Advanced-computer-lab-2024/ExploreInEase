const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the activity category
const preferenceTagsSchema = new Schema({
  tags: {
    type: String,
    required: true,
    unique: true // Ensures tag names are unique
  }
});

// Create and export the model
const PreferenceTags = mongoose.model('PreferenceTags', preferenceTagsSchema);

module.exports = PreferenceTags;
