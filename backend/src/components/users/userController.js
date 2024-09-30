const userService = require('./userService');

// Delete user by username
const deleteUserByUsername = async (req, res) => {
    const { username } = req.params;

    // Validation
    if (!username || typeof username !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing username' });
    }

    try {
        // Call the service to delete the user
        const result = await userService.deleteUserByUsername(username);

        if (result) {
            return res.status(200).json({ message: `User ${username} deleted successfully` });
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while deleting the user' });
    }
};

// Add a new tourismGovernor or a new Admin
const addGovernerOrAdmin = async (req, res) => {
    const { username, password, type } = req.body;

    // Check if username and password are provided
    if (!username || !password || !type) {
        return res.status(400).json({ message: "Username and password are required." });
    }


    try {
        // Send data to the service layer to create a new tourismGovernor
        const result = await userService.addGovernerOrAdmin(username, password, type);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 



module.exports = { deleteUserByUsername ,addGovernerOrAdmin};
