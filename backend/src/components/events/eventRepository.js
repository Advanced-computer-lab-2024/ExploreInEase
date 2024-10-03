const HistoricalPlace = require("../../models/historicalPlace");
const Itinerary = require("../../models/itinerary");
const Activity = require("../../models/activity");
const ActivityCategory = require("../../models/activityCategory");
const PreferenceTags = require("../../models/preferenceTags");

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
    const updatedCategory = await ActivityCategory.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
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

//sarah
// Function to get activities by IDs
const getActivitiesByIds = async (activityIds) => {
  return await Activity.find({ _id: { $in: activityIds } });
};

// Function to get itineraries by IDs
const getItinerariesByIds = async (itineraryIds) => {
  return await Itinerary.find({ _id: { $in: itineraryIds } });
};

// Function to get historical places by IDs
const getHistoricalPlacesByIds = async (placeIds) => {
  return await HistoricalPlace.find({ _id: { $in: placeIds } });
};

//sarah

const getFilteredActivities = async (filters, page, limit) => {
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
    filter.date = { $gte: new Date(date) }; // Filter for activities on or after the specified date
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
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("category") // Populate the category field to include detailed category information
    .populate("created_by", "username") // Optionally populate created_by to include the creator's username
    .populate("comments.user", "name"); // Optionally populate the user field in comments to include user's name

  return activities;
};

const getCategoryByName = async (categoryName) => {
  return await ActivityCategory.findOne({ name: categoryName });
};

const getAllActivities = async () => {
  return await Activity.find().populate("category"); // Populate category details
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
      dateTimeAvailable: { $gte: currentDate },
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
  // Create a filter object for tags
  const filter = {};
  if (tags && tags.length > 0) {
    filter.tags = { $in: tags }; // Filter by tags (assuming tags is an array)
  }

  // Fetch historical places that match the filter
  return await HistoricalPlace.find(filter);
};

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
  getActivitiesByIds,
  getItinerariesByIds,
  getHistoricalPlacesByIds,
  getCategoryByName,
  getFilteredActivities,
  getAllActivities,
  getAllUpcomingEvents,
  getFilteredHistoricalPlaces,
};
