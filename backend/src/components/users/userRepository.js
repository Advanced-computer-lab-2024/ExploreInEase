const Users = require("../../models/user");
const Tourist = require("../../models/tourist");
const Activity = require("../../models/activity");
const HistoricalPlace = require("../../models/historicalPlace");
const Itinerary = require("../../models/itinerary");


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


module.exports = {
  getTouristEventDetails,
  findTouristByUsername,
};
