const eventRepository = require('../events/eventRepository');
const User = require('../../models/user'); 



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

// Delete a category by ID
const deleteCategoryById = async (id) => {
  return await eventRepository.deleteCategoryById(id);
};

// Update a category by ID
const updateCategoryById = async (id, updateData) => {
  return await eventRepository.updateCategoryById(id, updateData);
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
  
  // Update a preference tag by _id
const updateTagById = async (id, updatedData) => {
  return await eventRepository.updateTagById(id, updatedData);
};

// Delete a preference tag by _id
const deleteTagById = async (id) => {
  return await eventRepository.deleteTagById(id);
};



module.exports = {
  getUserEvents,
  createCategory,
  getAllCategories,
  updateCategoryById,
  deleteCategoryById,
  createTag,
  getAllTags,
  updateTagById,
  deleteTagById,
};

