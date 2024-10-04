const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activityCategorySchema = new Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true // Ensures category names are unique
  }
});

const ActivityCategory = mongoose.model('ActivityCategory', activityCategorySchema);

module.exports = ActivityCategory;
