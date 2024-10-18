const HistoricalPlace = require('../../models/historicalPlace');
const Itinerary = require('../../models/itinerary');
const Activity = require('../../models/activity');
const ActivityCategory = require('../../models/activityCategory'); 
const PreferenceTags = require('../../models/preferenceTags'); 
const Tourist = require('../../models/tourist');

const getActivitiesByUserId = async (userId) => {
  return await Activity.find({ created_by: userId })
    .populate('category', 'categoryName') // Get categoryName from ActivityCategory
    
    .exec(); 
};


const getHistoricalPlacesByUserId = async (userId) => {
  return await HistoricalPlace.find({ created_by: userId })
    .populate('tags', 'type period') // Get type and period from historicalTags
    .exec();
};

const getItinerariesByUserId = async (userId) => {
  return await Itinerary.find({ created_by: userId })
    .populate('activities') // Populate activities as per existing design
    .populate('preftag', 'tags') // Get tags from PreferenceTags
    .exec();
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

// Delete a category by ID
const deleteCategoryById = async (id) => {
  try {
      const result = await ActivityCategory.findByIdAndDelete(id);
      return result ? true : false; // Return true if a category was deleted
  } catch (error) {
      console.error(`Error deleting category: ${error.message}`);
      return false;
  }
};

// Update a category by ID
const updateCategoryById = async (id, updateData) => {
  try {
      const updatedCategory = await ActivityCategory.findByIdAndUpdate(id, updateData, { new: true });
      return updatedCategory; // Return the updated category
  } catch (error) {
      console.error(`Error updating category: ${error.message}`);
      return null; // Return null if the update fails
  }
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

// Update a preference tag by its _id
const updateTagById = async (id, updatedData) => {
  return await PreferenceTags.findByIdAndUpdate(id, updatedData, { new: true });
};

// Delete a preference tag by its _id
const deleteTagById = async (id) => {
  return await PreferenceTags.findByIdAndDelete(id);
};


  



//New Codeee
const updateItineraryActivation = async (itineraryId, isActivated, userId) => {
  const updatedItinerary = await Itinerary.findOneAndUpdate(
      { _id: itineraryId, created_by: userId }, // Ensure the itinerary is created by the user
      { isActivated: isActivated },
      { new: true } // Return the updated document
  );

  return updatedItinerary; // Return the updated itinerary
};

const setFlagToZeroForItinerary = async (_id) => {
  return await Itinerary.findByIdAndUpdate(_id, { flag: 0 }, { new: true });
};

const setFlagToZeroForActivity = async (_id) => {
  return await Activity.findByIdAndUpdate(_id, { flag: 0 }, { new: true });
};


const bookEvent = async (touristId, eventType, eventId) => {
  // Retrieve the tourist's wallet balance
  const tourist = await Tourist.findById(touristId);
  if (!tourist) {
    throw new Error('Tourist not found');
  }
  
  let eventPrice = 0;

  // Retrieve the price based on event type
  switch (eventType) {
    case 'itinerary':
      const itinerary = await Itinerary.findById(eventId);
      if (!itinerary) {
        throw new Error('Itinerary not found');
      }
      eventPrice = itinerary.price;
      break;
      
    case 'activity':
      const activity = await Activity.findById(eventId);
      if (!activity) {
        throw new Error('Activity not found');
      }
      eventPrice = activity.price;
      break;

    case 'historicalPlace':
      const historicalPlace = await HistoricalPlace.findById(eventId);
      if (!historicalPlace) {
        throw new Error('Historical place not found');
      }
      eventPrice = historicalPlace.ticketPrice.native; // Use native, student, or foreign based on logic
      break;

    default:
      throw new Error('Invalid event type');
  }

  // Check if the tourist has enough funds in their wallet
  if (tourist.wallet < eventPrice) {
    throw new Error('Insufficient funds to book this event');
  }

  // Deduct the event price from the tourist's wallet
  tourist.wallet -= eventPrice;
  await tourist.save(); // Save the updated wallet balance

  // Update the tourist's event list
  const updateData = {};
  switch (eventType) {
    case 'itinerary':
      updateData.$addToSet = { itineraryId: eventId }; // Avoid duplicates
      break;
    case 'activity':
      updateData.$addToSet = { activityId: eventId }; // Avoid duplicates
      break;
    case 'historicalPlace':
      updateData.$addToSet = { historicalplaceId: eventId }; // Avoid duplicates
      break;
  }

  // Update the tourist's events
  return await Tourist.findByIdAndUpdate(touristId, updateData, { new: true });
};



const cancelEvent = async (touristId, eventType, eventId) => {
  const currentTime = new Date();
  const fortyEightHoursInMs = 48 * 60 * 60 * 1000; // 48 hours in milliseconds

  // Define the update data
  const updateData = {};

  // Initialize variable for event price
  let eventPrice = 0;

  // Check event type and validate cancellation eligibility
  let startDate;

  switch (eventType) {
    case 'itinerary':
      // Retrieve the itinerary and its start date
      const itinerary = await Itinerary.findById(eventId);
      if (!itinerary) throw new Error('Itinerary not found');
      
      // Check the soonest available date in dateTimeAvailable
      startDate = itinerary.dateTimeAvailable.sort((a, b) => a - b)[0];
      if (!startDate || (startDate - currentTime) < fortyEightHoursInMs) {
        throw new Error('Cancellations must be made at least 48 hours before the itinerary start date.');
      }

      // Get itinerary price to refund
      eventPrice = itinerary.price;

      updateData.$pull = { itineraryId: eventId };
      break;

    case 'activity':
      // Retrieve the activity and its start date
      const activity = await Activity.findById(eventId);
      if (!activity) throw new Error('Activity not found');
      
      // Check activity date
      startDate = activity.date;
      if (!startDate || (startDate - currentTime) < fortyEightHoursInMs) {
        throw new Error('Cancellations must be made at least 48 hours before the activity start date.');
      }

      // Get activity price to refund
      eventPrice = activity.price;

      updateData.$pull = { activityId: eventId };
      break;

    case 'historicalPlace':
      // Retrieve the historical place event price
      const historicalPlace = await HistoricalPlace.findById(eventId);
      if (!historicalPlace) throw new Error('Historical place event not found');
      
      // Get historical place event price to refund
      eventPrice = historicalPlace.price;

      updateData.$pull = { historicalplaceId: eventId };
      break;

    default:
      throw new Error('Invalid event type');
  }

  // Update the Tourist's record to remove the event
  const updatedTourist = await Tourist.findByIdAndUpdate(touristId, updateData, { new: true });

  if (updatedTourist) {
    // Refund the event price to the tourist's wallet
    updatedTourist.wallet += eventPrice;

    // Save the updated wallet balance
    await updatedTourist.save();
  }

  return updatedTourist;
};




const getTouristEmailById = async (touristId) => {
  try {
      const tourist = await Tourist.findById(touristId);
      return tourist ? tourist.email : null;
  } catch (error) {
      console.error(`Error fetching tourist email: ${error.message}`);
      throw new Error('Could not fetch tourist email');
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategoryById,
  deleteCategoryById,
  createTag,
  getAllTags,
  updateTagById,
  deleteTagById,
  getHistoricalPlacesByUserId,
  getItinerariesByUserId,
  getActivitiesByUserId,
  updateItineraryActivation,
  setFlagToZeroForItinerary,
  setFlagToZeroForActivity,
  bookEvent,
  cancelEvent,
  getTouristEmailById
 
};



