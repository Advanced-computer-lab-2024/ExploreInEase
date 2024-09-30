const userRepository = require('../users/userRepository');

const deleteUserByUsername = async (username) => {
    // Try to delete from both tables (users and tourists)
    const deletedUser = await userRepository.deleteUser(username);
    const deletedTourist = await userRepository.deleteTourist(username);

    // Return true if a user/tourist was deleted from either table
    return deletedUser || deletedTourist;
};


const addGovernerOrAdmin = async (username, password, type) => {
    const newUser = {
        username: username,
        password: password,
        type: type // The type can be 'admin' or 'tourismGovernor'
    };

    return await userRepository.addGovernerOrAdmin(newUser);
};






module.exports = { deleteUserByUsername,addGovernerOrAdmin };
