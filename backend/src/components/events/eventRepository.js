const HistoricalPlace = require('../../models/historicalPlace');
const Itinerary = require('../../models/itinerary');
const Activity = require('../../models/activity');
const ActivityCategory = require('../../models/activityCategory'); 
const PreferenceTags = require('../../models/preferenceTags'); 
const Users = require('../../models/user');
const Tourist = require('../../models/tourist');
const mongoose = require('mongoose');
const historicalTags = require('../../models/historicalTag');
const historicalPlace = require('../../models/historicalPlace');

const getActivitiesByUserId = async (userId) => {
  return await Activity.find({ created_by: userId })
    .populate('category', 'categoryName') // Get categoryName from ActivityCategory
    
    .exec(); 
};

const getAllActivitiesInDatabase = async () => {
  return await Activity.find().select('name');
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
const updateCategoryById = async (_id, updatedCategoryName) => {
  try {
      const updatedCategory = await ActivityCategory.findByIdAndUpdate(_id, updatedCategoryName, { new: true });
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


const getFilteredActivities = async (filters) => {
  const { budget, date, categoryId, rating } = filters;
  const currentDate = new Date();

  let filter = {
    date: { $gte: currentDate },
  };

  // Add filters for budget (assuming it's price in your schema)
  if (budget) {
    filter.price = { $lte: parseFloat(budget) };
  }

  // Add filters for specific date, if provided
  if (date) {
    filter.date = { $gte: new Date(date) }; // Filter for activities on or after the specified date el howa el upcomming
  }

  if (categoryId) {
    filter.category = categoryId; // Filter by category (which is an ObjectId referencing "ActivityCategory")
  }

  // Add filters for rating, assuming it's a float value
  if (rating) {
    filter.rating = { $gte: parseint(rating) }; // Filter by rating greater than or equal to the provided rating
  }

  // Pagination logic for skipping and limiting results
  const activities = await Activity.find(filter)
    .populate("category") // Populate the category field to include detailed category information
    .populate("created_by", "username") // Optionally populate created_by to include the creator's username
    .populate("comments.user", "name"); // Optionally populate the user field in comments to include user's name

  return activities;
};

const getCategoryByName = async (categoryName) => {
  return await ActivityCategory.findOne({ name: categoryName });
};

// Function to get all upcoming activities, itineraries, and historical places
const getAllUpcomingEvents = async () => {
  const currentDate = new Date();

  try {
    // Fetch all upcoming activities
    const upcomingActivities = await Activity.find({
      date: { $gte: currentDate },
    })
      .populate("category") // Populating the category of the activity
      .populate("created_by", "username") // Populating user details (creator) with only username
      .exec();

    // Fetch all upcoming historical places (assuming they also have a date field)
    const upcomingHistoricalPlaces = await HistoricalPlace.find({
      // dateTimeAvailable: { $gte: currentDate },
    })
      .populate("created_by", "username") // Populating user details (creator) with only username
      .exec();

    // Fetch all upcoming itineraries
    const upcomingItineraries = await Itinerary.find({
      dateTimeAvailable: { $gte: currentDate },
    })
      .populate("activities") // Populating the activities in the itinerary
      .populate("created_by", "username") // Populating user details (creator) with only username
      .exec();

    // Return a combined result of all upcoming events
    return {
      activities: upcomingActivities,
      historicalPlaces: upcomingHistoricalPlaces,
      itineraries: upcomingItineraries,
    };
  } catch (error) {
    console.error(`Error fetching events: ${error.message}`);
    throw new Error("Failed to fetch upcoming events");
  }
};

const getFilteredHistoricalPlaces = async (tags) => {
  try {
    // Create a filter object for tags
    let filter = {};

    if (tags && tags.length > 0) {
      filter.tags = { $in: tags }; // Assuming tagIds is an array of tag IDs
    }

    // Fetch historical places that match the filter
    return await HistoricalPlace.find(filter).populate("tags"); // Populate the tag details
  } catch (error) {
    console.error(`Error in getFilteredHistoricalPlaces: ${error.message}`);
    throw error;
  }
};

const getFilteredItineraries = async (filters) => {
  try {
    let query = {};

    const currentDate = new Date();

    if (filters.Date) {
      query.dateTimeAvailable = { $gte: new Date(filters.Date) };
    } else {
      query.dateTimeAvailable = { $gte: currentDate };
    }

    if (filters.budget) {
      query.price = { $lte: parseFloat(filters.budget) };
    }

    // Preferences filter (tags)
    if (filters.preferences) {
      const tagsArray = Array.isArray(filters.preferences)
        ? filters.preferences
        : [filters.preferences];
      query.tags = { $in: tagsArray }; // Filter by tags
    }

    // Language filter
    if (filters.language) {
      query.language = filters.language; // Filter by language
    }

    // Perform the query without pagination
    return await Itinerary.find(query).populate("activities preftag"); // Populate activities and tags with details
  } catch (error) {
    console.error(`Repository Error: ${error.message}`);
    throw error;
  }
};

const createHistoricalTag = async (tagData) => {
  const tag = new HistoricalTag(tagData);
  return await tag.save();
};  

const getTypeForTag = async (id) => {
  const user = await User.findOne({ _id: id });
  return user.type
};
  

const getActivityById = async (id) => {
  return await Activity.findById(id);
};

const createActivity = async (activityData) => {
  const activity = new Activity(activityData);
  const newActivity = await activity.save();
  const createdActivity = {
    _id: newActivity._id,
    name: newActivity.name,
    date: newActivity.date,
    time: newActivity.time,
    location: newActivity.location,
    price: newActivity.price,
    category: newActivity.category,
    tags: newActivity.tags,
    specialDiscounts: newActivity.specialDiscounts,
    isOpen: newActivity.isOpen,
    created_by: newActivity.created_by,
  }
  console.log(createdActivity);
  return createdActivity;
};

const findCategoryById = async (categoryId) => {
  return await ActivityCategory.findById(categoryId);
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

const getAllActivities = async (userId) => {
  return await Activity.find();
};

const getAllActivitiesAdvertiser = async (userId) => {
  return await Activity.find({ created_by: userId });
};


const getAllItineraries = async (userId) => {
  const itineraries = await Itinerary.find({ created_by: userId });

  // Optional: Ensure each itinerary has a name
  itineraries.forEach(itinerary => {
    if (!itinerary.name) {
      console.error(`Itinerary with ID ${itinerary._id} does not have a name.`);
    }
  });

  return itineraries;
};


const getItineraryById = async (id) => {
  const itinerary = await Itinerary.findById(id)
    .populate('activities')
    .populate({
      path: 'comments.user', // Populate user data in comments
      select: 'name', // Assuming user schema has a name field
    });

  return itinerary;
};


const createItinerary = async (itineraryData) => {
  // Create a new itinerary document in the database
  const newItinerary = new Itinerary(itineraryData);
  return await newItinerary.save();
};

const findItineraryById = async (_id) => {
  return await Itinerary.findById(_id);
};

const updateItinerary = async (_id, itineraryData) => {
  return await Itinerary.findByIdAndUpdate(_id, itineraryData, { new: true });
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

const createHistoricalPlace = async (data) => {
  const newPlace = new HistoricalPlace(data);
  const savedPlace = await newPlace.save();
  return { status: 200, response: { message: "Historical Place created successfully", savedPlace } };
};

const findTagByTypeAndPeriod = async (type) => {
  return await historicalTags.findOne({type:type});
};

const checkTourismGovernor = async (userId) => {
  const user = await Users.findById(userId);
  return user && user.type === 'tourismGovernor';
};


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
  const user = await Users.findOne({ _id: id });
  const tourist = await Tourist.findOne({ _id: id });
  if (user) {
    return user.type;
  } else if (tourist) {
    return "tourist";
  } else {
    throw new Error('User not found');
  }
};

const getAllHistoricalTags = async () => {
  return await historicalTags.find();
}

const getHistoricalTagDetails = async (id) => {
  return await historicalTags.find({ _id: id });
}

const getTouristEmailById = async (touristId) => {
  try {
      const tourist = await Tourist.findById(touristId);
      return tourist ? tourist.username : null;
  } catch (error) {
      console.error(`Error fetching tourist email: ${error.message}`);
      throw new Error('Could not fetch tourist email');
  }
};

module.exports = {
  getHistoricalTagDetails,
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
  getCategoryByName,
  getFilteredActivities,
  getAllUpcomingEvents,
  getFilteredHistoricalPlaces,
  getFilteredItineraries,
  createHistoricalTag,
  getActivityById,
  createActivity,
  findCategoryById,
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
  getType,
  getAllItineraries,
  getAllActivities,
  getAllActivitiesAdvertiser,
  findItineraryById,
  findTagByTypeAndPeriod,
  checkTourismGovernor,
  getTypeForTag,
  getAllHistoricalTags,
  getAllActivitiesInDatabase,
  getTouristEmailById
};



