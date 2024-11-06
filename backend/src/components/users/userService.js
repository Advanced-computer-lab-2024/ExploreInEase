const userRepository = require('../users/userRepository');
const bcrypt = require('bcrypt');
const getUserById = async (id) => {
    // Retrieve the user from the Users table based on id
    return await userRepository.findUserById(id);
};





const getNotAcceptedUsers = async () => {
    return await userRepository.getNotAcceptedUsers();
};




const fetchUsersForDeletion = async () => {
    try {
        const { users, tourists } = await userRepository.getAllUsersForDeletion();
        return { users, tourists };
    } catch (error) {
        throw new Error('Error fetching users for deletion');
    }
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
        const combinedArray = [...users, ...tourists];
        return combinedArray;
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

const login = async (username, password) => {
    const user = await userRepository.login(username, password);
    return user;
}
// Tour Guide
const createTourGuide = async (_id,tourGuideData) => {
    return await userRepository.updateUserData(_id,tourGuideData);
};

// Get a tour guide
const getTourGuide = async (_id) => {
    res= await userRepository.findUserById(_id);
    console.log(res);
    return res;
};



// Update a tour guide
const updateTourGuide = async (_id, updateData) => {
    return await userRepository.updateUserData(_id, updateData);
};


//Advertiser
const createAdvertiser = async (_id,advertiserData) => {
    console.log(_id,advertiserData);
    return await userRepository.updateUserData(_id,advertiserData);
};

// Get an advertiser
const getAdvertiser = async (_id) => {
    return await userRepository.findUserById(_id);
};

// Update an advertiser
const updateAdvertiser = async (_id, updateData) => {
    return await userRepository.updateUserData(_id, updateData);
};


//Seller
const createSeller = async (_id,sellerData) => {
    return await userRepository.updateUserData(_id,sellerData);
};

// Get a seller
const getSeller = async (_id) => {
    return await userRepository.findUserById(_id);
};

// Update a seller
const updateSeller = async (_id, updateData) => {
    return await userRepository.updateUserData(_id, updateData);
};


//Tourist

// Get a tourist
const getTourist = async (_id) => {
    return await userRepository.getTouristById(_id);
};

// Update a tourist (excluding username and wallet)
const updateTourist = async (_id, updateData) => {
    return await userRepository.updateTourist(_id, updateData);
};

const registerTourist = async (email, username, password, mobileNum, nation, dob,  profession) => {
    const touristExists = await userRepository.checkTouristExists(username);
    if (touristExists) {
        return { status: 409, response: {message: "Tourist already exists"} };
    }

    const newTourist = {
        email: email,
        username: username,
        password: password,
        mobileNum: mobileNum,
        nation: nation,
        dob: dob,
        profession: profession
    };
    const tourist = await userRepository.saveTourist(newTourist);
    return { status: tourist.status, response: {message: "Turist registered successfully", tourist: tourist.tourist, type: 'tourist'} };
    
}

const registerUser = async (type, email, username, password) => {
    try {
        // Check if a user with the same email or username already exists
        const existingUser = await userRepository.findUserByUsername(username);
        if (existingUser) {
            return { status: 400, response: { message: "User already exists" } };
        }

        // Create user data object to be passed to the repository
        const userData = {
            email,
            username,
            password: password,
            type
        };

        // Save the user using the repository
        const savedUser = await userRepository.saveUser(userData);
        console.log(savedUser)
        return { status: 200, response: { message: "User registered successfully", User: savedUser } };
    } catch (error) {
        return { status: 500, response: { message: error.message } };
    }
};

const updatingStatusUser = async (userId, status) => {
    const newUser = await userRepository.updateUserStatus(userId, status);
    return {status: 200, response: { message: "Status updated successfully", user: newUser } };
}




module.exports = {
    updatingStatusUser,
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
  updateTourist,
  registerTourist,
  registerUser,
  login,
  fetchUsersForDeletion,
    getNotAcceptedUsers
};

