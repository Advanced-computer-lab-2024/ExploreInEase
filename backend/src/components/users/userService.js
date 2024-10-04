const userRepository = require('../users/userRepository');

const getUserById = async (id) => {
    // Retrieve the user from the Users table based on id
    return await userRepository.findUserById(id);
};

const deleteUserByIdAndType = async (_id, userType) => {
    let result = false;

    if (userType === 'tourist') {
        // Delete from Tourist table
        result = await userRepository.deleteTouristById(_id);
    } else {
        // Delete from Users table for other user types
        result = await userRepository.deleteUserById(_id);
    }

    return result;
};


const addGovernorOrAdmin = async (username, password, type) => {
    const newUser = {
        username: username,
        password: password,
        type: type, // The type can be 'admin' or 'tourismGovernor'
        
    };

    return await userRepository.addGovernorOrAdmin(newUser);
};




const fetchAllUsersAndTourists = async () => {
    try {
        const users = await userRepository.fetchAllUsers();
        const tourists = await userRepository.fetchAllTourists();
        return { users, tourists };
    } catch (error) {
        throw new Error(`Error fetching users and tourists: ${error.message}`);
    }
};


const getTouristUpcommingEvents = async (username) => {
  const tourist = await userRepository.getTouristEventDetails(username);

  if (!tourist) {
    throw new Error("Tourist not found");
  }

  const currentDate = new Date();

  // Fetch activities, itineraries, and historical places
  const activities = await eventRepository.getActivitiesByIds(
    tourist.activityId
  );
  const itineraries = await eventRepository.getItinerariesByIds(
    tourist.itinerary
  );
  const historicalPlaces = await eventRepository.getHistoricalPlacesByIds(
    tourist.historicalplaceId
  );

  // Filter upcoming Events using date
  const upcomingActivities = activities.filter(
    (activity) => new Date(activity.date) >= currentDate
  );
  const upcomingItineraries = itineraries.filter(
    (itinerary) => new Date(itinerary.date) >= currentDate
  );
  const upcomingHistoricalPlaces = historicalPlaces.filter(
    (place) => new Date(place.date) >= currentDate
  );

  // Return the upcoming events as objects in JSON format
  return {
    upcomingActivities: upcomingActivities.map((activity) => ({
      id: activity._id,
      name: activity.name,
      date: activity.date,
      description: activity.description,
    })),
    upcomingItineraries: upcomingItineraries.map((itinerary) => ({
      id: itinerary._id,
      title: itinerary.title,
      date: itinerary.date,
      description: itinerary.description,
    })),
    upcomingHistoricalPlaces: upcomingHistoricalPlaces.map((place) => ({
      id: place._id,
      name: place.name,
      date: place.date,
      description: place.description,
    })),
  };
};


module.exports = {
  deleteUserByIdAndType,
  addGovernorOrAdmin,
  fetchAllUsersAndTourists,
  getUserById,
  deleteUserByIdAndType,
  getTouristUpcommingEvents
};

