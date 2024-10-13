const userService = require('../users/userService');

// Delete user by _id and userType, ensuring self-id check
const deleteUserByIdAndType = async (req, res) => {
    const { _id, userType, selfId } = req.body;

    // Validation
    if (!_id || !userType || !selfId) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    if (typeof _id !== 'string' || typeof userType !== 'string' || typeof selfId !== 'string') {
        return res.status(400).json({ error: 'Invalid parameter types' });
    }

    try {
        // Check if the selfId belongs to an admin
        const selfUser = await userService.getUserById(selfId);
        if (!selfUser || selfUser.type !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized action' });
        }

        // Prevent self-deletion
        if (_id === selfId) {
            return res.status(400).json({ error: 'Cannot delete yourself' });
        }

        // Call the service to delete the user based on userType
        const result = await userService.deleteUserByIdAndType(_id, userType);

        if (result) {
            return res.status(200).json({ message: `User with ID ${_id} deleted successfully` });
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while deleting the user' });
    }
};



// Add a new tourismGovernor or a new Admin
const addGovernorOrAdmin = async (req, res) => {
    const { username, password, type } = req.body;

    // Check if username and password are provided
    if (!username || !password || !type) {
        return res.status(400).json({ message: "Username and password and usertype are required." });
    }


    try {
        // Send data to the service layer to create a new tourismGovernor
        const result = await userService.addGovernorOrAdmin(username, password, type);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetch all data from Users and Tourists tables
const fetchAllUsersAndTourists = async (req, res) => {
    try {
        const data = await userService.fetchAllUsersAndTourists();
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching users and tourists:', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};









//New Codeee




const acceptTerms = async (req, res) => {
    const { _id, type } = req.body;

    // Check if username and type are provided
    if (!_id || !type) {
        return res.status(400).json({ message: "ID and type are required." });
    }

    try {
        
        const result = await userService.acceptTerms(_id, type);
       
        if (!result) {
            return res.status(404).json({ message: "User not found." });
        }
        
        res.status(200).json({ message: "Terms and conditions accepted.", user: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





const requestDeletion = async (req, res) => {
    const { _id, type } = req.body;

    // Check if username and type are provided
    if (!_id || !type) {
        return res.status(400).json({ message: "ID and type are required." });
    }

    try {
        
        const result = await userService.requestDeletion(_id, type);
       
        if (!result) {
            return res.status(404).json({ message: "User not found." });
        }
        
        res.status(200).json({ message: "Request to be deleted accepted.", user: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Controller to handle request for users with requestDeletion set to true
const getUsersForDeletion = async (req, res) => {
    try {
        const result = await userService.fetchUsersForDeletion();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = { deleteUserByIdAndType ,addGovernorOrAdmin,fetchAllUsersAndTourists,acceptTerms,requestDeletion,getUsersForDeletion};
