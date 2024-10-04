const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historicalTagsSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  period: {
    type: String,
    required: true,
    
  }

});

const historicalTags = mongoose.model('historicalTags', historicalTagsSchema);

module.exports = historicalTags;
