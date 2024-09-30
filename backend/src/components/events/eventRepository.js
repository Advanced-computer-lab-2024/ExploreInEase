const HistoricalPlace = require('../../models/historicalPlace');
const Itinerary = require('../../models/itinerary');
const Activity = require('../../models/activity');
const ActivityCategory = require('../../models/activityCategory'); 
const PreferenceTags = require('../../models/preferenceTags'); 


// Function to get historical places created by a user
const getHistoricalPlacesByUsername = async (userId) => {
  return await HistoricalPlace.find({ created_by: userId });
};

// Function to get itineraries created by a user
const getItinerariesByUsername = async (userId) => {
  return await Itinerary.find({ created_by: userId });
};

// Function to get activities created by a user
const getActivitiesByUsername = async (userId) => {
  return await Activity.find({ created_by: userId });
};


//CDUD ACTIVITY CATEGORY

// Create a new activity category
const createCategory = async (categoryData) => {
  const category = new ActivityCategory(categoryData);
  return await category.save();
};

// Get all activity categories
const getAllCategories = async () => {
  return await ActivityCategory.find();
};

// Update an activity category by name
const updateCategoryByName = async (categoryName, updatedData) => {
  return await ActivityCategory.findOneAndUpdate(
    { categoryName: categoryName },
    updatedData,
    { new: true }
  );
};

// Delete an activity category by name
const deleteCategoryByName = async (categoryName) => {
  return await ActivityCategory.findOneAndDelete({ categoryName: categoryName });
};



//CRUD PREFTAGS

// Create a new preference tag
const createTag = async (tagData) => {
  const tag = new PreferenceTags(tagData);
  return await tag.save();
};

// Get all preference tags
const getAllTags = async () => {
  return await PreferenceTags.find();
};

// Update a preference tag by its name
const updateTagByName = async (tagName, updatedData) => {
  return await PreferenceTags.findOneAndUpdate(
    { tags: tagName },
    updatedData,
    { new: true }
  );
};

// Delete a preference tag by its name
const deleteTagByName = async (tagName) => {
  return await PreferenceTags.findOneAndDelete({ tags: tagName });
};

  


module.exports = {
  getHistoricalPlacesByUsername,
  getItinerariesByUsername,
  getActivitiesByUsername,
  createCategory,
  getAllCategories,
  updateCategoryByName,
  deleteCategoryByName,
  createTag,
  getAllTags,
  updateTagByName,
  deleteTagByName,
};



