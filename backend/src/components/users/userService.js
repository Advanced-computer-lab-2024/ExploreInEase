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


// Tour Guide
const createTourGuide = async (_id,tourGuideData) => {
    return await userRepo.updateUserData(_id,tourGuideData);
};

// Get a tour guide
const getTourGuide = async (_id) => {
    return await userRepo.findUserById(_id);
};



// Update a tour guide
const updateTourGuide = async (_id, updateData) => {
    return await userRepo.updateUserData(_id, updateData);
};


//Advertiser
const createAdvertiser = async (_id,advertiserData) => {
    console.log(_id,advertiserData);
    return await userRepo.updateUserData(_id,advertiserData);
};

// Get an advertiser
const getAdvertiser = async (_id) => {
    return await userRepo.findUserById(_id);
};

// Update an advertiser
const updateAdvertiser = async (_id, updateData) => {
    return await userRepo.updateUserData(_id, updateData);
};


//Seller
const createSeller = async (_id,sellerData) => {
    return await userRepo.updateUserData(_id,sellerData);
};

// Get a seller
const getSeller = async (_id) => {
    return await userRepo.findUserById(_id);
};

// Update a seller
const updateSeller = async (_id, updateData) => {
    return await userRepo.updateUserData(_id, updateData);
};


//Tourist

// Get a tourist
const getTourist = async (_id) => {
    return await userRepo.getTouristById(_id);
};

// Update a tourist (excluding username and wallet)
const updateTourist = async (_id, updateData) => {
    return await userRepo.updateTourist(_id, updateData);
};


module.exports = {
  deleteUserByIdAndType,
  addGovernorOrAdmin,
  fetchAllUsersAndTourists,
  getUserById,
  deleteUserByIdAndType,
  getTouristUpcommingEvents,
  createTourGuide,
  getTourGuide,
  updateTourGuide,
  createAdvertiser,
  getAdvertiser,
  updateAdvertiser,
  createSeller,
  getSeller,
  updateSeller,
  getTourist,
  updateTourist
};

