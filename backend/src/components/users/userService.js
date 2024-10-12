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






// New Codeeee



const acceptTerms = async (_id, type) => {
   
    return await userRepository.updateTermsAndConditions(_id, type);
};

const requestDeletion = async (_id, type) => {
    let canDelete = false;

    if (type === 'tourist') {
        // Check conditions for tourist
        canDelete = await userRepository.checkTouristDeletionCriteria(_id);
    } else if (type === 'tourGuide') {
        // Check conditions for tour guide in itinerary
        canDelete = await userRepository.checkTourGuideItineraryDates(_id);
    } else if (type === 'seller') {
        // Check conditions for seller in product table
        canDelete = await userRepository.checkSellerProductStatus(_id);
    } else if (type === 'advertiser') {
        // Check conditions for advertiser in activity table
        canDelete = await userRepository.checkAdvertiserActivityStatus(_id);
    } else {
        throw new Error("Invalid user type");
    }

    if (!canDelete) {
        throw new Error("Request deletion rejected due to active records.");
    }

    // Update requestDeletion in the respective table
    const updateResult = await userRepository.updateRequestDeletion(_id, type);
    return updateResult;
};



const fetchUsersForDeletion = async () => {
    try {
        const { users, tourists } = await userRepository.getAllUsersForDeletion();
        return { users, tourists };
    } catch (error) {
        throw new Error('Error fetching users for deletion');
    }
};



module.exports = { deleteUserByIdAndType, addGovernorOrAdmin, fetchAllUsersAndTourists,getUserById, deleteUserByIdAndType,acceptTerms
    ,requestDeletion,fetchUsersForDeletion 
};

