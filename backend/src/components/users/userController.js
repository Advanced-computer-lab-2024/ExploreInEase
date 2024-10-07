const userService = require('../users/userService');
const userRepository = require('../users/userRepository');
const bcrypt = require('bcrypt');

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

//get all tourist upcomming activity
const getTouristUpcommingEvents = async (req, res) => {
  const { username } = req.params;

  // Check if username is not a string
  if (typeof username !== "string") {
    return res.status(400).json({ error: "Username must be a string" });
  }
  if (!username) {
    return res.status(400).json({ message: "username is required" });
  }
  try {
    const events = await userService.getTouristUpcommingEvents(username);
    return res.status(200).json({message: "Fetched Upcomming Events successfully", events: events});
  } catch (error) {
    return res.status(500).json({ error: "An error occurred", details: error.message });
  }
};

//Tour Guide
const createTourGuide = async (req, res) => {
    try {
        const tourGuide = await userService.createTourGuide(req.params._id,req.body);
        if (!tourGuide) {
            return res.status(404).json({ message: 'Tour guide not found' });
        }
        response={
            message: "Tour guide Profile created successfully",
            tourGuide: tourGuide
        }
        res.status(201).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a tour guide profile
const getTourGuide = async (req, res) => {
    try {
        const tourGuide = await userService.getTourGuide(req.params._id);
        if (!tourGuide) {
            return res.status(404).json({ message: 'Tour guide not found' });
        }
        res.status(200).json({message: "Tour Guide Profile fetched successfully", tourGuide: tourGuide});    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a tour guide profile
const updateTourGuide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updatedTourGuide = await userService.updateTourGuide(req.params._id, req.body);
        if (!updatedTourGuide) {
            return res.status(404).json({ message: 'Tour guide not found' });
        }
        response={
            message: "Tour guide updated successfully",
            tourGuide: updatedTourGuide
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


//Advertiser
const createAdvertiser = async (req, res) => {
    console.log("dakahal");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        console.log("conroller : ",req.params._id,req.body)
        const advertiser = await userService.createAdvertiser(req.params._id,req.body);
        if(!advertiser){
            return res.status(404).json({ message: 'Advertiser not found' });
        }
        response = {
            message: "Advertiser Profile created successfully",
            advertiser: advertiser
        }
        res.status(201).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get an advertiser profile
const getAdvertiser = async (req, res) => {
    try {
        const advertiser = await userService.getAdvertiser(req.params._id);
        if (!advertiser) {
            return res.status(404).json({ message: 'Advertiser not found' });
        }
        res.status(200).json({message: "Advertiser profile fetched successfully", advertiser: advertiser});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an advertiser profile
const updateAdvertiser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updatedAdvertiser = await userService.updateAdvertiser(req.params._id, req.body);
        if (!updatedAdvertiser) {
            return res.status(404).json({ message: 'Advertiser not found' });
        }
        response = {
            message: "Advertiser updated successfully",
            advertiser: updatedAdvertiser
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


//Seller


// Create a seller
const createSeller = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const seller = await userService.createSeller(req.params._id,req.body);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        reponse={
            message: "Seller Profile created successfully",
            seller: seller
        }
        res.status(201).json(reponse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a seller profile
const getSeller = async (req, res) => {
    try {
        const seller = await userService.getSeller(req.params._id);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        res.status(200).json({message: "Seller profile retrieved successfully", seller: seller});    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a seller profile
const updateSeller = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updatedSeller = await userService.updateSeller(req.params._id, req.body);
        if (!updatedSeller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        reponse={
            message: "Seller updated successfully",
            seller: updatedSeller
        }
        res.status(200).json(reponse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


//Tourist


// Get a tourist profile
const getTourist = async (req, res) => {
    try {
        const tourist = await userService.getTourist(req.params._id);
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }
        res.status(200).json(tourist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a tourist profile (excluding username and wallet)
const updateTourist = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updateData = { ...req.body };
        if(updateData.username){
            return res.status(400).json({ message: 'Cannot update username' });
        }else if(updateData.wallet){
            return res.status(400).json({ message: 'Cannot update wallet' });
        }

        const updatedTourist = await userService.updateTourist(req.params._id, updateData);
        if (!updatedTourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }
        reponse={
            message: "Tourist updated successfully",
            tourist: updatedTourist
        }

        res.status(200).json(reponse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// const checkUsername = (username) => {
//     return /^[a-zA-Z0-9]+$/.test(username);
// }
const registerUser = async (req, res) => {
    const { type } = req.params;
    const { email, username, password, mobileNum, nation, dob,  profession} = req.body;
    // if (!type) {
    //     return res.status(400).json({ message: "User type is required" });
    // }

    const usernameExists = await userRepository.checkUserExists(username);
    if (usernameExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    const emailExists = await userRepository.checkUserExistsByEmail(email);
    if (emailExists) {
        return res.status(409).json({ message: "Email already exists" });
    }

    if(type == 'tourist'){
        if (!email||!username||!password||!mobileNum||!nation||!dob||!profession) {
            return res.status(400).json({ message: "Missing Input" });
        }
        try {
            const result = await userService.registerTourist(email, username, password, mobileNum, nation, dob,  profession);
            res.status(result.status).json(result.response);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    else{
        if(type == 'tourGuide' || type == 'advertiser' || type == 'seller'){
            if (!email||!username||!password) {
                return res.status(400).json({ message: "Missing Input" });
            }
            try {
                const result = await userService.registerUser(type, email, username, password);
                res.status(result.status).json(result.response);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        }
        else{
            res.status(400).json({ message: "Invalid usertype" });
        }
    }
};

const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const differenceInMilliseconds = Date.now() - birthDate.getTime();
    const ageDate = new Date(differenceInMilliseconds);

    return Math.abs(ageDate.getUTCFullYear() - 1970); // Calculate age
};

const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ error: 'Invalid parameter types' });
    }
    try{
        const user = await userService.login(username, password);
        if (!user) {
            return res.status(404).json({ error: 'Invalid username or password' });
        }
        return res.status(200).json({message: "Logged in Successfully", user: user});
    }catch(error){
        return res.status(500).json({ error: 'An error occurred while logging in the user' });
    }
}
module.exports = {
  deleteUserByIdAndType,
  addGovernorOrAdmin,
  fetchAllUsersAndTourists,
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
  registerUser
};
