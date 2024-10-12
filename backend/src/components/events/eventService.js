const eventRepository = require('../events/eventRepository');
const User = require('../../models/user'); 



const getUserEvents = async (_id, userType) => {
  const user = await User.findById(_id); // Find user by _id
  
  if (!user) {
      throw new Error('User not found');
  }

  let events;

  switch (userType) {
      case 'tourismGovernor':
          events = await eventRepository.getHistoricalPlacesByUserId(_id);
          break;
      case 'tourGuide':
          events = await eventRepository.getItinerariesByUserId(_id);
          break;
      case 'advertiser':
          events = await eventRepository.getActivitiesByUserId(_id);
          break;
      default:
          throw new Error('Invalid userType');
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




//New Codeeee



const updateItineraryActivation = async (itineraryId, isActivated, userId, userType) => {
 

  return await eventRepository.updateItineraryActivation(itineraryId, isActivated, userId);
};

const updateEventFlag = async ( eventType, eventID) => {
  
  if (eventType === 'itinerary') {
      return await eventRepository.setFlagToZeroForItinerary(eventID);
  } else if (eventType === 'activity') {
      return await eventRepository.setFlagToZeroForActivity(eventID);
  } else {
      throw new Error('Invalid event type. Must be "itinerary" or "activity".');
  }
};


const addEventToTourist = async (userType, touristId, eventType, eventId) => {
  
  return await eventRepository.bookEvent(touristId, eventType, eventId);
};

const cancelEventToTourist= async (userType, touristId, eventType, eventId) => {
    
    return await eventRepository.cancelEvent(touristId, eventType, eventId);
  }
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
  updateItineraryActivation,
  updateEventFlag,
  addEventToTourist,
  cancelEventToTourist
};

