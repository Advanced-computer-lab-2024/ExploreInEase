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


const addGovernerOrAdmin = async (username, password, type,email) => {
    const newUser = {
        username: username,
        password: password,
        type: type, // The type can be 'admin' or 'tourismGovernor'
        email: email
    };

    return await userRepository.addGovernerOrAdmin(newUser);
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



module.exports = { deleteUserByIdAndType, addGovernerOrAdmin, fetchAllUsersAndTourists,getUserById, deleteUserByIdAndType };

