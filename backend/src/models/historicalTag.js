const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the activity category
const historicalTagsSchema = new Schema({
  type: {
    type: String,
    required: true,
    unique: true // Ensures tag names are unique
  },
  period: {
    type: String,
    required: true,
    
  }

});

const HistoricalTags = mongoose.model('HistoricalTags', historicalTagsSchema);
module.exports = HistoricalTags;
