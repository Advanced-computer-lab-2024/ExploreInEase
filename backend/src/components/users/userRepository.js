const Users = require('../../models/user');
const Tourist = require('../../models/tourist');
const Order = require('../../models/order');
const fs = require('fs');
const path = require('path');

// Find user by ID
const findUserById = async (id) => {
    try {
        const user = await Users.findById(id); // This will include the `specialist` field only
        console.log(user);
        
        return user ? user : null;
    } catch (error) {
        console.error(`Error finding user: ${error.message}`);
        return null;
    }
};

const findTouristById = async (id) => {
    try {
        const tourist = await Tourist.findById(id);
        return tourist ? tourist : null;
    } catch (error) {
        console.error(`Error finding tourist: ${error.message}`);
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
        console.log(tourist);
        if (user !== null) {
            const isMatch = await password === user.password;
            if (!isMatch) {
                throw new Error('Incorrect username or password');
            }
            return "user";
        }
        else{
            if(tourist !== null){
                const isMatch = await password === tourist.password;
                if (!isMatch) {
                    throw new Error('Incorrect username or password');
                }
                console.log("Tourist: ",tourist);
                return "tourist";
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

const getUserbyUsername = async (username) => {
        const user = await Users.findOne({ username: username });
        if(user){
            return user;
        }
        else{
            const tourist = await Tourist.findOne({ username: username });
            if(tourist){
                return tourist;
            }
            else{
                return null;
            }
        }
}

const updateUserPassword = async (user, password) => {
    try {
        user.password = password;
        const updatedUser = await user.save();
        return updatedUser;
    } catch (error) {
        throw new Error(`Error updating user password: ${error.message}`);
    }
}

const uploadImage = async (userId, fileName, fileBuffer) => {
    try {
        const imagesDir = path.join(__dirname, '../images');
        
        // Check if the 'images' directory exists, and create it if it doesn't
        if (!fs.existsSync(imagesDir)) {
            fs.mkdirSync(imagesDir, { recursive: true });
        }

        const filePath = path.join(imagesDir, fileName);
        
        // Write the file to the filesystem
        await fs.promises.writeFile(filePath, fileBuffer);

        return { message: 'Image uploaded successfully', fileName: fileName };
    } catch (error) {
        throw new Error(`Error uploading image: ${error.message}`);
    }
};


const updateUserProfilePicture = async (userId, fileName) => {
    try {
        const user = await findUserById(userId);
        const tourist = await findTouristById(userId);
        if (!user) {
            if(!tourist){
                throw new Error('User not found');
            }
            else{
                tourist.photo = fileName;
                await tourist.save();
            }
        }
        else{
            if(user.type === 'tourGuide'){
                user.photo.selfPicture = fileName;
            }
            else if(user.type === 'advertiser' || user.type === 'seller'){
                user.photo.logo = fileName;
            }
            await user.save();
        }
    } catch (error) {
        throw new Error(`Error updating profile picture: ${error.message}`);
    }
};

const getUserProfilePicture = async (userId) => {
    try {
        const user = await findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if(user.type === 'tourGuide'){
            return user.photo.selfPicture;
        }
        else if(user.type === 'advertiser' || user.type === 'seller'){
            return user.photo.logo;
        }
        else{
            return null;
        }
    } catch (error) {
        throw new Error(`Error getting profile picture: ${error.message}`);
    }
}

const getNotAcceptedUsers = async () => {
    try {
        return await Users.find({ docStatus: "pending" });
    } catch (error) {
        throw new Error(`Error fetching not accepted users: ${error.message}`);
    }
};


const redeemPoints = async (userId, points) => {
    const user = await findTouristById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    user.redeemedPoints = 0;

    user.wallet = user.wallet + points;
    
    user.points=0
    await user.save();
    return user;
}

const getLoyalityLevel = async (totalAmount) => {
    let level = 0;
    if(totalAmount < 100000){
        level = 1;
    }
    else{ 
        if(totalAmount <500000){
            level = 2;
        }
        else{
            level = 3;
        }
    }
    return level;
}

const pointsAfterPayment = async (userId, amount) => {
    const user = await findTouristById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    user.points = user.points + amount;
    user.totalPoints = user.totalPoints + amount;
    await user.save();
    return user;
}

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

const checkTouristDeletionCriteria = async (id) => {
    const tourist = await Tourist.findById(id)
        .populate('itineraryId.id') 
        .populate('activityId.id'); 

    if (!tourist) return false;

    const now = new Date();

    // Check if the itineraryId array is empty
    if (!tourist.itineraryId || tourist.itineraryId.length === 0) {
        return true;
    }

    for (const itineraryObj of tourist.itineraryId) {
        const itinerary = itineraryObj.id;
        if (itinerary && itinerary.dateTimeAvailable && itinerary.dateTimeAvailable.some(date => new Date(date) > now)) {
            return false; 
        }
    }

    // Check if the activityId array is empty
    if (!tourist.activityId || tourist.activityId.length === 0) {
        return true;
    }

    for (const activityObj of tourist.activityId) {
        const activity = activityObj.id; 
        if (activity && activity.date && new Date(activity.date) > now) {
            return false; 
        }
    }

    return true; 
};



const checkTourGuideItineraryDates = async (tourGuideId) => {
    const now = new Date();
    console.log(tourGuideId);
    const itineraries = await Itinerary.find({ created_by: tourGuideId });
    console.log(itineraries)
    if (itineraries.length==0){
        return true;
    }

    for (const itinerary of itineraries) {        
        if (itinerary.dateTimeAvailable.some(date => new Date(date) > now)) {
            return false; 
        }
    }
    return true; 
};




const checkSellerProductStatus = async (sellerId) => {
    const activeProducts = await Product.find({ sellerId: sellerId, isActive: true });
    return activeProducts.length === 0; // Return true if no active products
};




const checkAdvertiserActivityStatus = async (advertiserId) => {
    const now = new Date();

    const futureActivities = await Activity.find({ 
        created_by: advertiserId, 
        date: { $gt: now } 
    });

    return futureActivities.length === 0; 
};





const updateRequestDeletion = async (userId, type) => {
    const Model = type === 'tourist' ? Tourist : Users;
    const result = await Model.findByIdAndUpdate(userId, { requestDeletion: true }, { new: true });
    return result;
};


module.exports = {
    updateRequestDeletion,
    checkAdvertiserActivityStatus,
    checkSellerProductStatus,
    checkTourGuideItineraryDates,
    checkTouristDeletionCriteria,
    updateTermsAndConditions,
    pointsAfterPayment,
    getLoyalityLevel,
    findTouristById,
    redeemPoints,
    getUserbyUsername,
    getNotAcceptedUsers,
    getUserProfilePicture,
    uploadImage,
    updateUserProfilePicture,
    updateUserPassword,
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
    login
};
