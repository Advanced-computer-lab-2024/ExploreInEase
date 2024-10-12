const Users = require('../../models/user');
const Tourist = require('../../models/tourist');
const Itinerary = require('../../models/itinerary');
const Product = require('../../models/product');
const Activity = require('../../models/activity');

// Find user by ID
const findUserById = async (id) => {
    try {
        const user = await Users.findById(id);
        return user ? user : null;
    } catch (error) {
        console.error(`Error finding user: ${error.message}`);
        return null;
    }
};

// Delete user from Users table by ID
const deleteUserById = async (id) => {
    try {
        const result = await Users.findByIdAndDelete(id);
        return result ? true : false;
    } catch (error) {
        console.error(`Error deleting user: ${error.message}`);
        return false;
    }
};

// Delete user from Tourist table by ID
const deleteTouristById = async (id) => {
    try {
        const result = await Tourist.findByIdAndDelete(id);
        return result ? true : false;
    } catch (error) {
        console.error(`Error deleting tourist: ${error.message}`);
        return false;
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
const addGovernorOrAdmin = async (userData) => {
    try {
        // Check if username already exists
        const existingUser = await Users.findOne({ username: userData.username });
        if (existingUser) {
            throw new Error('Username already exists');
        }
        
        const newUser = new Users(userData);
        return await newUser.save();
    } catch (error) {
        throw new Error(`Error adding user: ${error.message}`);
    }
};



// Fetch all users
const fetchAllUsers = async () => {
    try {
        return await Users.find({});
    } catch (error) {
        throw new Error(`Error fetching users: ${error.message}`);
    }
};

// Fetch all tourists
const fetchAllTourists = async () => {
    try {
        return await Tourist.find({});
    } catch (error) {
        throw new Error(`Error fetching tourists: ${error.message}`);
    }
};





//New Codeee


// Update terms and conditions for a user by username and type
const updateTermsAndConditions = async (_id, type) => {
    try {
        // Find the user by username and type
        const user = await Users.findOneAndUpdate(
            { _id: _id, type: type },
            { termsAndConditions: true },
            { new: true } 
        );
        return user;
    } catch (error) {
        throw new Error(`Error updating terms and conditions: ${error.message}`);
    }
};


const checkTouristDeletionCriteria = async (_id) => {
    const tourist = await Tourist.findById(_id).populate('itineraryId').populate('activityId');
    if (!tourist) return false;

    const now = new Date();

    // Check itinerary dates for the tourist
    for (const itinerary of tourist.itineraryId) {
        if (itinerary.dateTimeAvailable.some(date => new Date(date) > now)) {
            return false; // Future date found, reject deletion
        }
    }

    // Check activity open status for the tourist
    for (const activity of tourist.activityId) {
        if (activity.isOpen) {
            return false; // Active activity found, reject deletion
        }
    }

    return true; // All conditions met
};

const checkTourGuideItineraryDates = async (tourGuideId) => {
    const now = new Date();

    // Fetch itineraries created by the tour guide
    const itineraries = await Itinerary.find({ created_by: tourGuideId });

    // Check each itinerary's dateTimeAvailable to see if any dates are in the future
    for (const itinerary of itineraries) {
        // Iterate through each date in dateTimeAvailable array
        if (itinerary.dateTimeAvailable.some(date => new Date(date) > now)) {
            return false; // Future date found, reject deletion
        }
    }

    return true; // All dates are in the past, deletion can proceed
};




const checkSellerProductStatus = async (sellerId) => {
    const activeProducts = await Product.find({ sellerId: sellerId, isActive: true });
    return activeProducts.length === 0; // Return true if no active products
};




const checkAdvertiserActivityStatus = async (advertiserId) => {
    const openActivities = await Activity.find({ created_by: advertiserId, isOpen: true });
    return openActivities.length === 0; // Return true if no open activities
};

// Generic update function to set requestDeletion to true
const updateRequestDeletion = async (_id, type) => {
    const Model = type === 'tourist' ? Tourist : Users;
    const result = await Model.findByIdAndUpdate(_id, { requestDeletion: true }, { new: true });
    return result;
};



// Find all users with requestDeletion set to true
const getAllUsersForDeletion = async () => {
    const usersToDelete = await Users.find({ requestDeletion: true });
    const touristsToDelete = await Tourist.find({ requestDeletion: true });
    return { users: usersToDelete, tourists: touristsToDelete };
};



module.exports = { deleteTourist,addGovernorOrAdmin,fetchAllUsers, fetchAllTourists,deleteTouristById,deleteUserById,findUserById,updateTermsAndConditions
,checkTouristDeletionCriteria,updateRequestDeletion,checkTourGuideItineraryDates,checkSellerProductStatus,checkAdvertiserActivityStatus,getAllUsersForDeletion
};
