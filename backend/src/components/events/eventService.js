const eventRepository = require('./eventRepository');
const User = require('../models/user'); 



const getUserEvents = async (username, userType) => {
  const user = await User.findOne({ username });
  
  if (!user) {
    throw new Error('User not found');
  }

  let events;

  switch (userType) {
    case 'tourismGovernor':
      events = await eventRepository.getHistoricalPlacesByUsername(user._id);
      break;
    case 'tourGuide':
      events = await eventRepository.getItinerariesByUsername(user._id);
      break;
    case 'advertiser':
      events = await eventRepository.getActivitiesByUsername(user._id);
      break;
    default:
      throw new Error('Invalid user type');
  }

  return events;
};



//CRUD ACTIVITY CATEGORY

// Create a new activity category
const createCategory = async (categoryData) => {
  return await eventRepository.createCategory(categoryData);
};

// Get all activity categories
const getAllCategories = async () => {
  return await eventRepository.getAllCategories();
};

// Update an activity category by name
const updateCategoryByName = async (categoryName, updatedData) => {
  return await eventRepository.updateCategoryByName(categoryName, updatedData);
};

// Delete an activity category by name
const deleteCategoryByName = async (categoryName) => {
  return await eventRepository.deleteCategoryByName(categoryName);
};


//CRUD PREFTAGS

// Create a new preference tag
const createTag = async (tagData) => {
    return await eventRepository.createTag(tagData);
  };
  
  // Get all preference tags
  const getAllTags = async () => {
    return await eventRepository.getAllTags();
  };
  
  // Update a preference tag by name
  const updateTagByName = async (tagName, updatedData) => {
    return await eventRepository.updateTagByName(tagName, updatedData);
  };
  
  // Delete a preference tag by name
  const deleteTagByName = async (tagName) => {
    return await eventRepository.deleteTagByName(tagName);
  };
  


module.exports = {
  getUserEvents,
  createCategory,
  getAllCategories,
  updateCategoryByName,
  deleteCategoryByName,
  createTag,
  getAllTags,
  updateTagByName,
  deleteTagByName,
};

