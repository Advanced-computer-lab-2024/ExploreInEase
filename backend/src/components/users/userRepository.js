const Users = require('../../models/user');
const Tourist = require('../../models/tourist');
const Itinerary = require('../../models/itinerary');
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


const updateUserData = async (id, updateData) => {
    return await Users.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

const getTouristById = async (id) => {
    return await Tourist.findById(id);
};

// Update a tourist by ID (excluding username and wallet)
const updateTourist = async (id, updateData) => {
    return await Tourist.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

const checkTouristExists = async (username) => {
    try {
        const result = await Tourist.findOne({ username });
        return result ? true : false;
    } catch (error) {
        console.error(`Error checking if tourist exists: ${error.message}`);
        return false;
    }
};

const findUserByUsername = async (username) => {
    return await Users.findOne({ username });
};

// Save a new user
const saveUser = async (userData) => {
    const newUser = new Users(userData);
    const savedUser = await newUser.save();
    return savedUser; // Return the entire user document
};


const saveTourist = async (tourist) => {
    try {
        console.log(tourist);
        const newTourist = new Tourist(tourist);
        const savedTourist = await newTourist.save();
        return { status: 201, tourist: savedTourist }; // Return the entire tourist document
    } catch (error) {
        throw new Error(`Error saving tourist: ${error.message}`);
    }
};


const checkUserExists = async (username) => {
    try {
        const existsUser = await Users.findOne({ username });
        const existsTourist = await Tourist.findOne({ username });
        if (existsUser || existsTourist) {
            return true;
        }
    } catch (error) {
        console.error(`Error checking if user exists: ${error.message}`);
        return false;
    }
};

const checkUserExistsByEmail = async (email) => {
    try {
        const existsUser = await Users.findOne({ email });
        const existsTourist = await Tourist.findOne({ email });
        if (existsUser || existsTourist) {
            return true;
        }
    } catch (error) {
        console.error(`Error checking if user exists: ${error.message}`);
        return false;
    }
};
const login = async (username, password) => {
    try {
        const user = await Users.findOne({ username });
        const tourist = await Tourist.findOne({ username });
        if (user !== null) {
            const isMatch = await password === user.password;
            if (!isMatch) {
                throw new Error('Incorrect username or password');
            }
            return user;
        }
        else{
            if(tourist !== null){
                const isMatch = await password === tourist.password;
                if (!isMatch) {
                    throw new Error('Incorrect username or password');
                }
                return tourist;
            }
            else{
                throw new Error('Incorrect username or password');
            }
        }
        
    } catch (error) {
        console.error(`Error logging in: ${error.message}`);
        return null;
    }
}

// Check if the itinerary was completed by the tourist (after date passed and booked)
const hasCompletedItinerary = async (touristId, ItineraryId, guideId) => {
    try {
        // Step 1: Retrieve the itinerary to check if its date has passed and if it was created by the specified tourGuide
        const tourist = await Tourist.findOne({
            _id: touristId,
            itineraryId: { $elemMatch: { id: ItineraryId } }
        });

        const itinerary = await Itinerary.findOne ({ _id: ItineraryId, created_by: guideId });
        if (!tourist){
            throw new Error("Itinerary does not belong to the specified tourist");
        }
        else if(!itinerary) {
            throw new Error("Itinerary is not found or does not belong to the specified tour guide");
        }
        else{
            // Check if any of the itinerary dates have passed
            const now = new Date();
            const hasDatePassed = itinerary.dateTimeAvailable.some(date => date < now);
            if (!hasDatePassed) {
                // If no dates have passed, the itinerary isn't considered completed
                return false;
            }
            return true;
        }        

    } catch (error) {
        console.error("Error checking itinerary completion:", error);
        throw error;
    }
};

const updateTourGuideComments = async (tourGuideId, updatedFields) => {
    try {
        // Use Mongoose's `findByIdAndUpdate` to update the tour guide's comments
        const updatedTourGuide = await Users.findByIdAndUpdate(
            tourGuideId,
            { $set: updatedFields },
            { new: true, runValidators: true } // `new: true` returns the updated document
        );

        if (!updatedTourGuide) {
            throw new Error("Tour guide not found or could not be updated.");
        }

        return updatedTourGuide;
    } catch (error) {
        console.error("Error updating tour guide comments:", error);
        throw error;
    }
};

const updateTourGuideRatings = async (tourGuideId, updatedFields) => {
    try {
        // Use Mongoose's `findByIdAndUpdate` to update the tour guide's comments
        const updatedTourGuide = await Users.findByIdAndUpdate(
            tourGuideId,
            { $set: updatedFields },
            { new: true, runValidators: true } // `new: true` returns the updated document
        );

        if (!updatedTourGuide) {
            throw new Error("Tour guide not found or could not be updated.");
        }

        return updatedTourGuide;
    } catch (error) {
        console.error("Error updating tour guide ratings:", error);
        throw error;
    }
};

const updateItineraryComments = async (itineraryId, updatedFields) => {
    try {
        // Use Mongoose's `findByIdAndUpdate` to update the tour guide's comments
        const updatedItinerary = await Itinerary.findByIdAndUpdate(
            itineraryId,
            updatedFields,
            { new: true, runValidators: true } // `new: true` returns the updated document
        );
        
        if (!updatedItinerary) {
            throw new Error("Itinerary not found or could not be updated.");
        }

        return updatedItinerary;
    } catch (error) {
        console.error("Error updating itinerary comments:", error);
        throw error;
    }
};

const updateItineraryRatings = async (itineraryId, updatedFields) => {
    try {
        const updatedItinerary = await Itinerary.findByIdAndUpdate(
            itineraryId,
            { $set: updatedFields },
            { new: true, runValidators: true } // `new: true` returns the updated document
        );

        if (!updatedItinerary) {
            throw new Error("Itinerary not found or could not be updated.");
        }

        return updatedItinerary;
    } catch (error) {
        console.error("Error updating itinerary ratings:", error);
        throw error;
    }
};

// Check if the activty was completed by the tourist (after date passed and booked)
const hasAttendedActivity = async (touristId, ActivityId) => {
    try {
        // Step 1: Retrieve the itinerary to check if its date has passed and if it was created by the specified tourGuide
        const tourist = await Tourist.findOne({
            _id: touristId,
            activityId: { $elemMatch: { id: ActivityId } }
        });        
        if (!tourist) {
            throw new Error("No such activity exists or the tourist did not sign up for this activity");
        }
        else{
            const activity = await Activity.findOne({ _id: ActivityId });
            // Check if any of the itinerary dates have passed
            const now = new Date();
            const hasDatePassed = activity.date < now;
            console.log(hasDatePassed);
            if (!hasDatePassed) {
                // If no dates have passed, the itinerary isn't considered completed
                return false;
            }
            return true;
        }

    } catch (error) {
        console.error("Error checking Activity completion:", error);
        throw error;
    }
};

const updateActivityRatings = async (activityId, updatedFields) => {
    try {
        // Use Mongoose's `findByIdAndUpdate` to update the tour guide's comments
        const updatedActivity = await Activity.findByIdAndUpdate(
            activityId,
            { $set: updatedFields },
            { new: true, runValidators: true } // `new: true` returns the updated document
        );

        if (!updatedActivity) {
            throw new Error("Activity not found or could not be updated.");
        }

        return updatedActivity;
    } catch (error) {
        console.error("Error updating Activity ratings:", error);
        throw error;
    }
};

const updateActivityComments = async (activityId, updateOperation) => {
    try {
        // Use Mongoose's `findByIdAndUpdate` to apply the update operation (like $push for comments)
        const updatedActivity = await Activity.findByIdAndUpdate(
            activityId,
            updateOperation,
            { new: true, runValidators: true } // `new: true` returns the updated document
        );

        if (!updatedActivity) {
            throw new Error("Activity not found or could not be updated.");
        }

        return updatedActivity;
    } catch (error) {
        console.error("Error updating Activity comments:", error);
        throw error;
    }
};

module.exports = {
    addGovernorOrAdmin,
    fetchAllUsers,
    fetchAllTourists,
    deleteTouristById,
    deleteUserById,
    findUserById,
    updateUserData,
    getTouristById,
    updateTourist,
    checkTouristExists,
    findUserByUsername,
    saveUser,
    saveTourist,
    checkUserExists,
    checkUserExistsByEmail,
    login,
    hasCompletedItinerary,
    updateTourGuideRatings,
    updateTourGuideComments,
    updateItineraryComments,
    updateItineraryRatings,
    hasAttendedActivity,
    updateActivityRatings,
    updateActivityComments
};
