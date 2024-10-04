const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the activity category
const historicalTagsSchema = new Schema({
  type: {
    type: String,
    required: true
    },
  period: {
    type: String,
    required: true,
    
  }

});

// Create and export the model
const historicalTags = mongoose.model('historicalTags', historicalTagsSchema);

module.exports = historicalTags;
