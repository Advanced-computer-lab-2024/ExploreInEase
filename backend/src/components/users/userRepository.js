const Users = require("../../models/user");
const Tourist = require("../../models/tourist");
const Activity = require("../../models/activity");
const HistoricalPlace = require("../../models/historicalPlace");
const Itinerary = require("../../models/itinerary");

// Delete user from Users table
const deleteUser = async (username) => {
  try {
    const result = await Users.findOneAndDelete({ username });
    return result ? true : false;
  } catch (error) {
    console.error(`Error deleting user: ${error.message}`);
    return false;
  }
};

// Find user by username from Tourist table
const findTouristByUsername = async (username) => {
  try {
    const tourist = await Tourist.findOne({ username });
    return tourist;
  } catch (error) {
    console.error(`Error finding tourist: ${error.message}`);
    return null;
  }
};

// Function to get tourist details by username
const getTouristEventDetails = async (username) => {
  try {
    const tourist = await Tourist.findOne({ username })
      .populate("activityId")
      .populate("itinerary")
      .populate("historicalplaceId");
    return tourist;
  } catch (error) {
    console.error(`Error finding tourist: ${error.message}`);
    return null;
  }
};

// Delete user from Tourist table
const deleteTourist = async (username) => {
  try {
    const result = await Tourist.findOneAndDelete({ username });
    return result ? true : false;
  } catch (error) {
    console.error(`Error deleting tourist: ${error.message}`);
    return false;
  }
};

// Add a new user wether admin or tourism governer
const addGovernerOrAdmin = async (userData) => {
  try {
    // Check if username already exists
    const existingUser = await Users.findOne({ username: userData.username });
    if (existingUser) {
      throw new Error("Username already exists");
    }

    const newUser = new Users(userData);
    return await newUser.save();
  } catch (error) {
    throw new Error(`Error adding user: ${error.message}`);
  }
};

module.exports = {
  deleteUser,
  deleteTourist,
  addGovernerOrAdmin,
  getTouristEventDetails,
  findTouristByUsername,
};
