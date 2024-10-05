const HistoricalPlace = require("../../models/historicalPlace");
const Itinerary = require("../../models/itinerary");
const Activity = require("../../models/activity");
const ActivityCategory = require("../../models/activityCategory");
const PreferenceTags = require("../../models/preferenceTags");
const HistoricalTag = require("../../models/historicalTag");

//sarah

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

    // Check for date filtering
    if (filters.date) {
      // Ensure that we are comparing dates correctly
      query.dateTimeAvailable = {
        $elemMatch: { $gte: new Date(filters.date) },
      };
    } else {
      query.dateTimeAvailable = { $elemMatch: { $gte: currentDate } };
    }

    // Budget filter
    if (filters.budget) {
      query.price = { $lte: parseFloat(filters.budget) }; // Filter by budget
    }

    // Preferences filter (tags)
    if (filters.preferences) {
      const tagsArray = Array.isArray(filters.preferences)
        ? filters.preferences
        : [filters.preferences];
      query.preftag = { $in: tagsArray }; // Filter by tags
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

module.exports = {
  getCategoryByName,
  getFilteredActivities,
  getAllUpcomingEvents,
  getFilteredHistoricalPlaces,
  getFilteredItineraries,
};
