
const HistoricalPlace = require('../../models/historicalPlace');
const Itinerary = require('../../models/itinerary');
const Activity = require('../../models/activity');
// const ActivityCategory = require('../../models/activityCategory'); 
const PreferenceTags = require('../../models/preferenceTags'); 
const User = require('../../models/user');
const Tourist = require('../../models/tourist');


const searchActivities = async(name, category, tag)=>{
  let query = {};
  if(name){
    query.name = name;
  }
  if(category){
    query.category = category;
  }
  if(tag){
    query.tags = tag;
  }
  return await Activity.find(query);

};


const searchHistoricalPlaces = async(name, tag)=>{
  let query = {};
  if(name){
    query.name = name;
  }
  if(tag){
    query.tags = tag;
  }
  return await HistoricalPlace.find(query);
}

const searchItineraries = async(name, tag)=>{
  let query = {};
  if(name){
    query.name = name;
  }
  if(tag){
    query.tags = tag;
  }
  return await Itinerary.find(query)
}


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


const getActivityById = async (id) => {
  return await Activity.findById(id);
};

const createActivity = async (activityData) => {
  const activity = new Activity(activityData);
  return await activity.save();
};

const findCategoryById = async (categoryId) => {
  return await ActivityCategory.findById(categoryId);
};

const findTagsByNames = async (tags) => {
  return await PreferenceTags.find({ tags: { $in: tags } });
};

const updateActivity = async (id, updateData) => {
  // Use the mongoose method to update an activity
  return await Activity.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

const deleteActivity = async (_id) => {
  // Use the mongoose method to delete an activity
  const deletedActivity = await Activity.findByIdAndDelete(_id);
  return deletedActivity; // Return the deleted activity for confirmation
};

const getItineraryById = async (id) => {
  return await Itinerary.findById(id)
    .populate('activities')
    .populate({
      path: 'comments.user', // Populate user data in comments
      select: 'name', // Assuming user schema has a name field
    });
};


const createItinerary = async (itineraryData) => {
  // Create a new itinerary document in the database
  const newItinerary = new Itinerary(itineraryData);
  return await newItinerary.save();
};

const updateItinerary = async (_id, itineraryData) => {
  try {
      // Find itinerary by ID and update with new data
      const updatedItinerary = await Itinerary.findByIdAndUpdate(_id, itineraryData, { new: true });
      return updatedItinerary;
  } catch (error) {
      throw new Error('Error updating itinerary: ' + error.message);
  }
};

// Delete Itinerary from the database
const deleteItinerary = async (_id) => {
  try {
      // Find itinerary by ID and delete it
      const deletedItinerary = await Itinerary.findByIdAndDelete(_id);
      return deletedItinerary;
  } catch (error) {
      throw new Error('Error deleting itinerary: ' + error.message);
  }
};

// Create a new Historical Place
const createHistoricalPlace = async (data) => {
  const newPlace = new HistoricalPlace(data);
  const savedPlace = await newPlace.save();
  return {status: 200, response: {message: "Historical Place created successfully", savedPlace}};
};

const checkTourismGoverner = async (created_by) => {
  const user = await User.findOne({ _id: created_by, type: 'tourismGovernor' });
  return user;
}

// Get all Historical Places
const getAllHistoricalPlaces = async () => {
  return await HistoricalPlace.find();
};

// Get a Historical Place by ID
const getHistoricalPlaceById = async (id) => {
  return await HistoricalPlace.findById(id);
};

// Update a Historical Place by ID
const updateHistoricalPlace = async (id, data) => {
  return await HistoricalPlace.findByIdAndUpdate(id, data, { new: true });
};

// Delete a Historical Place by ID
const deleteHistoricalPlace = async (id) => {
  return await HistoricalPlace.findByIdAndDelete(id);
};

const getType = async (id) => {
  console.log("da5al");
  const user = await User.findOne({ _id: id });
  const tourist = await Tourist.findOne({ _id: id });
  if (user) {
    console.log(user.type);
    return user.type;
  } else if (tourist) {
    return tourist.type;
  } else {
    throw new Error('User not found');
  }
}


// Function to get historical places by userId
const getHistoricalPlacesByUserId = async (userId) => {
  return await HistoricalPlace.find({ created_by: userId });
};

// Function to get itineraries by userId
const getItinerariesByUserId = async (userId) => {
  return await Itinerary.find({ created_by: userId });
};

// Function to get activities by userId
const getActivitiesByUserId = async (userId) => {
  return await Activity.find({ created_by: userId });
};




//CDUD ACTIVITY CATEGORY


  





module.exports = {
  getHistoricalPlacesByUsername,
  getItinerariesByUsername,
  getActivitiesByUsername,
  createCategory,
  getAllCategories,
  updateCategoryById,
  deleteCategoryById,
  createTag,
  getAllTags,
  updateTagById,
  deleteTagById,
  getActivityById,
  createActivity,
  findCategoryById,
  findTagsByNames,
  updateActivity,
  deleteActivity,
  getItineraryById,
  createItinerary,
  updateItinerary,
  deleteItinerary,
  createHistoricalPlace,
  getAllHistoricalPlaces,
  getHistoricalPlaceById,
  updateHistoricalPlace,
  deleteHistoricalPlace,
  checkTourismGoverner,
  getType,
  getHistoricalPlacesByUserId,
  getItinerariesByUserId,
  getActivitiesByUserId,
  searchActivities,
  searchHistoricalPlaces,
  searchItineraries
  
};