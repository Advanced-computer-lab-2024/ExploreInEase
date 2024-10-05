const eventRepository = require("../events/eventRepository");
const User = require("../../models/user");

//sarah

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
      createdAt: place.createdAt.username,
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

const getFilteredHistoricalPlaces = async (tags) => {
  try {
    const historicalPlaces = await eventRepository.getFilteredHistoricalPlaces(
      tags
    );

    // Format historical places
    const formattedHistoricalPlaces = historicalPlaces.map((place) => ({
      id: place._id,
      description: place.description,
      pictures: place.pictures,
      location: place.location,
      openingHours: place.openingHours,
      ticketPrice: place.ticketPrice,
      createdAt: place.createdAt,
      createdBy: place.created_by, // Reference to creator's ID
      tags: place.tags, // Include el period we el type
    }));
    console.log(formattedHistoricalPlaces);

    return formattedHistoricalPlaces;
  } catch (error) {
    console.error(`Service Error: ${error.message}`);
    throw error; // Propagate the error to the controller
  }
};

const getFilteredItineraries = async (filters) => {
  try {
    const itineraries = await eventRepository.getFilteredItineraries(filters);

    // Debugging: Log the fetched itineraries
    console.log("Fetched Itineraries:", itineraries);

    // Proceed only if itineraries is an array
    if (!Array.isArray(itineraries)) {
      throw new Error("Fetched itineraries is not an array");
    }

    // Continue with mapping
    return itineraries.map((itinerary) => {
      // Additional debugging inside the map
      console.log("Processing Itinerary:", itinerary);

      // Ensure 'tags' is an array
      const tags = Array.isArray(itinerary.tags)
        ? itinerary.tags.map((tag) => tag)
        : [];

      // Ensure 'activities' has a 'name' property
      const activitiesNames =
        itinerary.activities && itinerary.activities.name
          ? itinerary.activities.name
          : null;

      return {
        id: itinerary._id,
        activities: itinerary.activities,
        activitiesNames: activitiesNames,
        locations: itinerary.locations,
        price: itinerary.price,
        dateTimeAvailable: itinerary.dateTimeAvailable,
        language: itinerary.language,
        accessibility: itinerary.accessibility,
        pickupLocation: itinerary.pickupLocation,
        dropoffLocation: itinerary.dropoffLocation,
        rating: itinerary.rating,
        comments: itinerary.comments,
        tags: tags, // Safe mapping of tags
      };
    });
  } catch (error) {
    console.error(`Service Error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getFilteredUpcomingActivities,
  CategoryNameToId,
  getAllUpcomingEvents,
  getFilteredHistoricalPlaces,
  getFilteredItineraries,
};
