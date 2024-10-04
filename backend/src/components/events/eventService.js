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


const CategoryNameToId = async (categoryName) => {
  // If categoryName is provided, fetch the corresponding categoryId
  if (categoryName) {
    try {
      const category = await eventRepository.getCategoryByName(categoryName);
      if (category) {
        return category._id; // Return the category ID
      } else {
        return null; // Return null if no category found
      }
    } catch (error) {
      console.error("Error fetching category by name:", error);
      throw new Error("Failed to fetch category ID"); // Handle error appropriately
    }
  }
  return null; // Return null if categoryName is not provided
};

const getFilteredUpcomingActivities = async (filters) => {
  try {
    // Fetch filtered activities from the repository
    const activities = await eventRepository.getFilteredActivities(filters);

    // Format the activities data
    const formattedActivities = activities.map((activity) => ({
      id: activity._id,
      name: activity.name,
      date: activity.date,

      time: activity.time,
      location: activity.location, // Include location details (latitude, longitude)
      budget: activity.price, // Handle budget or price depending on schema
      category: activity.category.categoryName, // Assuming category is populated and has a 'name' field
      tags: activity.tags, // Include tags if applicable
      specialDiscounts: activity.specialDiscounts,
      created_by: activity.created_by,
      flag: activity.flag,
      isOpen: activity.isOpen,
      rating: activity.rating,
      comments: activity.comments,
      createdAt: activity.createdAt,
      description: activity.description,
    }));

    return formattedActivities;
  } catch (error) {
    console.error(`Service Error: ${error.message}`);
    throw new Error("Failed to retrieve filtered activities.");
  }
};

const getAllUpcomingEvents = async () => {
  try {
    // Retrieve upcoming events from the repository
    const { activities, itineraries, historicalPlaces } =
      await eventRepository.getAllUpcomingEvents();

    // Format activities
    const formattedActivities = activities.map((activity) => ({
      id: activity._id,
      name: activity.name,
      date: activity.date,

      time: activity.time,
      location: activity.location, // Include location details (latitude, longitude)
      budget: activity.price, // Handle budget or price depending on schema
      category: activity.category, // Assuming category is populated and has a 'name' field
      tags: activity.tags, // Include tags if applicable
      specialDiscounts: activity.specialDiscounts,
      created_by: activity.created_by,
      flag: activity.flag,
      isOpen: activity.isOpen,
      rating: activity.rating,
      comments: activity.comments,
      createdAt: activity.createdAt,
      description: activity.description,
    }));

    // Format itineraries
    const formattedItineraries = itineraries.map((itinerary) => ({
      id: itinerary._id,
      activities: itinerary.activities.map((activity) => activity.name), // Get activity names within the itinerary
      locations: itinerary.locations, // Assuming locations is an array of strings
      timeline: itinerary.timeline,
      directions: itinerary.directions,
      language: itinerary.language,
      price: itinerary.price,
      dateAvailable: itinerary.dateTimeAvailable,
      accessibility: itinerary.accessibility,
      pickupLocation: itinerary.pickupLocation,
      dropoffLocation: itinerary.dropoffLocation,
      isActivated: itinerary.isActivated,
      created_by: itinerary.created_by,
      flag: itinerary.flag,
      rating: itinerary.rating,
      comments: itinerary.comments,
    }));

    // Format historical places
    const formattedHistoricalPlaces = historicalPlaces.map((place) => ({
      id: place._id,
      description: place.description,
      pictures: place.pictures, // Array of pictures

      location: place.location, // Location details (latitude, longitude, address)
      openingHours: place.openingHours, // Opening hours
      ticketPrice: place.ticketPrice, // Detailed ticket price (student/native/foreign)
      createdAt: place.createdAt,
      tags: place.tags, // Associated tags if needed
    }));

    // Return formatted data
    return {
      activities: formattedActivities,
      itineraries: formattedItineraries,
      historicalPlaces: formattedHistoricalPlaces,
    };
  } catch (error) {
    console.error(`Service Error: ${error.message}`);
    throw error; // Propagate the error to the controller for further handling
  }
};

const createHistoricalTag = async (tag) => {
    return await eventRepository.createHistoricalTag(tag);
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
  CategoryNameToId,
  getFilteredUpcomingActivities,
  getAllUpcomingEvents,
  createHistoricalTag
};

