const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const preferenceTagsSchema = new Schema({
  tags: {
    type: String,
    required: true,
    unique: true // Ensures tag names are unique
  }
});

const PreferenceTags = mongoose.model('PreferenceTags', preferenceTagsSchema);

module.exports = PreferenceTags;
