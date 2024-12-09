const userService = require('../users/userService');
const userRepository = require('../users/userRepository');
const bcrypt = require('bcrypt');



// Controller to handle request for users with requestDeletion set to true
const getUsersForDeletion = async (req, res) => {
    try {
        const result = await userService.fetchUsersForDeletion();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getNotAcceptedUsers = async (req, res) => {
    try {
        const users = await userService.getNotAcceptedUsers();
        return res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
}
// Delete user by _id and userType, ensuring self-id check
const deleteUserByIdAndType = async (req, res) => {
    const { _id, userType, selfId } = req.body;
    
    console.log(req.body);
    // Validation
    if (!_id || !userType || !selfId) {
        console.log("here");
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
    
    

    try {
        const updateData = { ...req.body };
        if(updateData.username){
            return res.status(400).json({ message: 'Cannot update username' });
        }else if(updateData.wallet){
            return res.status(400).json({ message: 'Cannot update wallet' });
        }

        console.log(updateData)

        console.log('dakhal')

        const updatedTourist = await userService.updateTourist(req.params._id, updateData);
        if (!updatedTourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }
        reponse={
            message: "Tourist updated successfully",
            tourist: updatedTourist
        }

        console.log('3adda')
        console.log(updatedTourist)

        res.status(200).json(reponse);
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error);
        
    }
};

const checkUsername = (username) => {
    return /^[a-zA-Z0-9]+$/.test(username);
}

const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const differenceInMilliseconds = Date.now() - birthDate.getTime();
    const ageDate = new Date(differenceInMilliseconds);

    return Math.abs(ageDate.getUTCFullYear() - 1970); // Calculate age
};

const rateTourGuide = async (req, res) => {
    const { touristId } = req.params; // Get the userId from the route
    const { tourGuideId, itineraryId, rating } = req.body;

    try {
        const result = await userService.rateTourGuide(touristId, tourGuideId, itineraryId, rating);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const commentOnTourGuide = async (req, res) => {
    const { touristId } = req.params; // Get the userId from the route
    const { tourGuideId, itineraryId, commentText } = req.body;

    try {
        const result = await userService.commentOnTourGuide(touristId, tourGuideId, itineraryId, commentText);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const rateItinerary = async (req, res) => {
    const { touristId } = req.params; // Get the userId from the route
    const { tourGuideId, itineraryId, rating } = req.body;

    try {
        const result = await userService.rateItinerary(touristId, tourGuideId, itineraryId, rating);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const commentOnItinerary = async (req, res) => {
    const { touristId } = req.params; // Get the userId from the route
    const { tourGuideId, itineraryId, commentText } = req.body;

    try {
        const result = await userService.commentOnItinerary(touristId, tourGuideId, itineraryId, commentText);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const rateActivity = async (req, res) => {
    const { touristId } = req.params; // Get the userId from the route
    const { activityId, rating } = req.body;

    try {
        const result = await userService.rateActivity(touristId,activityId,rating);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const commentOnActivity = async (req, res) => {
    const { touristId } = req.params; // Get the userId from the route
    const { activityId, commentText } = req.body;

    try {
        const result = await userService.commentOnActivity(touristId,activityId,commentText);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const rateHistoricalPlace = async (req, res) => {
    const { touristId } = req.params; // Get the userId from the route
    const { historicalPlaceId, rating } = req.body;

    try {
        const result = await userService.rateHistoricalPlace(touristId,historicalPlaceId,rating);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const commentOnHistoricalPlace = async (req, res) => {
    const { touristId } = req.params; // Get the userId from the route
    const { historicalPlaceId, commentText } = req.body;

    try {
        const result = await userService.commentOnHistoricalPlace(touristId,historicalPlaceId,commentText);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}
const updatingStatusUser = async (req, res) => {
    const { userId, status } = req.params;
    if (!userId || !status) {
        return res.status(400).json({ message: "Missing inputs" });
    }
    const user = await userRepository.findUserById(userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    try {
        const result = await userService.updatingStatusUser(userId, status);
        res.status(result.status).json(result.response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//Saif, Tasnim

const changePassword = async (req, res) => {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;
    console.log(userId);
    console.log(oldPassword, newPassword);

    if (!userId) {
        return res.status(400).json({ message: "Missing userId" });
    }
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Missing Input" });
    }

    try {
        const result = await userService.changePassword(userId, oldPassword, newPassword);
        res.status(result.status).json(result.response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const uploadImage = async (req, res) => {
    const { userId } = req.params;
    const file = req.file;

    try {
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        // Call service to upload image
        const result = await userService.uploadImage(userId, file);

        // Return the image URL in the response
        return res.status(200).send({
            message: result.message,
            imageUrl: result.imageUrl // Send back the image URL
        });

    } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).send({ error: 'Error uploading image.' });
    }
};

const redeemPoints = async (req, res) => {
    const { userId,points } = req.params;
    console.log(userId)
    console.log(points)

    if (!userId || !points) {
        return res.status(400).json({ message: 'Missing userId or points parameter.' });
    }
    try {
        const result = await userService.redeemPoints(userId, points);
        return res.status(result.status).json(result.response);
    } catch (error) {
        console.error('Error redeeming points:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

const pointsAfterPayment = async (req, res) => {
    const { userId, amount } = req.params;
    console.log(userId, amount);

    if (!userId || !amount) {
        return res.status(400).json({ message: 'Missing userId or amount parameter.' });
    }
    try {
        const result = await userService.pointsAfterPayment(userId, amount);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error redeeming amount:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

const getLevel = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: 'Missing userId parameter.' });
    }
    const user = await userRepository.findTouristById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }   

    try {
        const level = await userService.getLevel(userId);
        return res.status(200).json({message: "Level fetched successfully", level});
    } catch (error) {
        console.error('Error fetching user level:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

const acceptTerms = async (req, res) => {
    const { _id, type } = req.params;
    

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
    const { userId, type } = req.params;
    if (!userId || !type) {
        return res.status(400).json({ message: "ID and type are required." });
    }

    try {
        
        const result = await userService.requestDeletion(userId, type);
       
        if (!result) {
            return res.status(404).json({ message: "User not found." });
        }
        
        res.status(200).json({ message: "Request is Made.", user: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const registerUser = async (req, res) => {
    const { type } = req.params;
    const { email, username, password, mobileNum, nation, dob,  profession, currency} = req.body;
    if (!type) {
        return res.status(400).json({ message: "User type is required" });
    }
    if (!checkUsername(username)) {
        return res.status(400).json({ message: "Username can only contain letters and numbers" });
    }

    const usernameExists = await userRepository.checkUserExists(username);
    if (usernameExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // const emailExists = await userRepository.checkUserExistsByEmail(email);
    // if (emailExists) {
    //     return res.status(409).json({ message: "Email already exists" });
    // }

    if(type == 'tourist') {
        if (!email||!username||!password||!mobileNum||!nation||!dob||!profession||!currency) {
            return res.status(400).json({ message: "Missing Input" });
        }
        try {
            const result = await userService.registerTourist(email, username, password, mobileNum, nation, dob,  profession, currency);
            res.status(result.status).json(result.response);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    else{
        if(type == 'tourGuide' || type == 'advertiser' || type == 'seller'){
            if (!email||!username||!password||!currency) {
                return res.status(400).json({ message: "Missing Input" });
            }
            try {
                const result = await userService.registerUser(type, email, username, password, currency);
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

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ error: 'Invalid parameter types' });
    }

    try {
        // Fetch user or tourist from the service
        const { user, userType } = await userService.login(username, password);   
        if (!user || !userType) {
            return res.status(404).json({ error: 'Invalid username or password' });
        }
        let imageUrl = null;
        if (userType !== 'tourist') {
            imageUrl = await userRepository.getUserProfilePicture(user._id);
            // If terms and conditions are not accepted, return the formatted response
            if (!user.termsAndConditions) {
                return res.status(200).json({
                    message: "Terms and Conditions not accepted",
                    user: {
                        documents: user.documents,
                        photo: user.photo,
                        _id: user._id,
                        username: user.username,
                        password: user.password,
                        email: user.email,
                        ratingSum: user.ratingSum,
                        ratingCount: user.ratingCount,
                        hotline: user.hotline,
                        type: user.type,
                        comment: user.comment,
                        docStatus: user.docStatus,
                        termsAndConditions: user.termsAndConditions,
                        requestDeletion: user.requestDeletion,
                        specialist: user.specialist,
                        status: user.status,
                        otp: user.otp,
                        currency: user.currency,
                        sellerType: user.sellerType,
                        promoCodes: user.promoCodes,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt
                    },
                    userType: user.type
                });
            }
        }

        // If terms and conditions are accepted or for tourists
        return res.status(200).json({
            message: "Logged in Successfully",
            user: {
                documents: user.documents || {},
                photo: user.photo || {},
                _id: user._id,
                username: user.username,
                password: user.password,
                email: user.email,
                ratingSum: user.ratingSum,
                ratingCount: user.ratingCount,
                hotline: user.hotline || '',
                type: user.type,
                comment: user.comment || [],
                docStatus: user.docStatus || '',
                termsAndConditions: user.termsAndConditions || false,
                requestDeletion: user.requestDeletion || false,
                specialist: user.specialist || '',
                status: user.status || false,
                otp: user.otp || 0,
                currency: user.currency || 'EGP',
                sellerType: user.sellerType || '',
                promoCodes: user.promoCodes || [],
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            userType: userType,
            imageUrl
        });

    } catch (error) {
        console.error("Error in login controller:", error.message);  // Log the error message
        return res.status(500).json({ error: 'An error occurred while logging in the user' });
    }
};

const forgetPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    try{
        const user = await userService.forgetPassword(email);
        if (!user) {
            return res.status(404).json({ error: 'Invalid email' });
        }
        return res.status(200).json({message: "Email sent successfully", status: user.status, response: user.response});
    }catch(error){
        return res.status(500).json({ error: 'An error occurred while logging in the user' });
    }
}

const creatingPromoCode = async (req, res) => {
    try{
        const {promoCode} = req.body;
        const promoCodeResult = await userService.creatingPromoCode(promoCode);
        return res.status(200).json({message: "Promo code created successfully", promoCode: promoCodeResult});
    }catch(error){
        return res.status(500).json({ error: 'An error occurred while logging in the user' });
    }
}

const updatePromoCode = async (req, res) => {
    try {
        // Fetch all tourists
        const tourists = await Tourist.find();

        // Get today's date (month and day only, ignoring year)
        const today = new Date();
        const todayMonth = today.getMonth() + 1; // JavaScript months are 0-based
        const todayDay = today.getDate();

        // Loop through tourists to check if it's their birthday today
        const birthdayTourists = await Promise.all(tourists.map(async (tourist) => {
            const birthDate = new Date(tourist.dob);
            const isBirthdayToday = birthDate.getMonth() + 1 === todayMonth && birthDate.getDate() === todayDay;

            // If it's their birthday, set the flag to true, otherwise false
            if (isBirthdayToday && !tourist.promoCodeFlag) {
                // Update the tourist's flag and save
                tourist.promoCodeFlag = true;
                await tourist.save();

                // Return the tourist's ID if the flag is true (birthday today)
                return tourist._id;
            } else if (!isBirthdayToday && tourist.promoCodeFlag) {
                // If not their birthday, and the flag was previously true, reset it to false
                tourist.promoCodeFlag = false;
                await tourist.save();
            }
            // If it's not the tourist's birthday today and the flag is already false, return null
            return null;
        }));

        // Filter out nulls (tourists whose birthday isn't today or whose flag was already true)
        const birthdayTouristIds = birthdayTourists.filter(id => id !== null);

        console.log("Birthday Tourists: ", birthdayTouristIds); // Log the IDs for debugging

        if (birthdayTouristIds.length === 0) {
            return res.status(404).json({
                message: "No tourists with birthdays today or all have already received a promo code",
            });
        }

        // Pass the tourist IDs to update the promo code
        const promoCodeResult = await userService.updatePromoCode(birthdayTouristIds);

        return res.status(200).json({
            message: "Promo code updated successfully",
            promoCode: promoCodeResult,
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({
            error: 'An error occurred while updating the promo code',
        });
    }
};

const addInterestedIn = async (req, res) => {
    const { _id, eventId, eventType } = req.params;
    if(!eventId || !_id || !eventType){
        return res.status(400).json({ message: "Missing parameters" });
    }
    try {
        const result = await userService.addInterestedIn(_id, eventId, eventType);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const changePasswordAfterOTP = async (req, res) => {
    const { userId } = req.params;
    const { newPassword } = req.body;
    if(!userId || !newPassword){
        return res.status(400).json({ message: "Missing parameters" });
    }
    try {
        const result = await userService.changePasswordAfterOTP(userId, newPassword);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const verifyOtP = async (req, res) => {
    const { userId, otp } = req.params;
    if(!userId || !otp){
        return res.status(400).json({ message: "Missing parameters" });
    }
    try {
        const result = await userService.verifyOtP(userId, otp);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}


const addAddresses = async (req, res) => {
    const { userId,address } = req.params;

    //console.log(address);
    //console.log(userId);

    if(!userId || !address){
        return res.status(400).json({ message: "Missing parameters" });
    }
    try {
        const result = await userService.addAddresses(userId, address);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const getAddresses = async (req, res) => {
    const { userId } = req.params;
    //console.log(userId);
    if(!userId){
        return res.status(400).json({ message: "Missing parameters" });
    }
    try {
        const result = await userService.getAddresses(userId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const userReport = async (req, res) => {
    const { userId } = req.params;
    if(!userId){
        return res.status(400).json({ message: "Missing parameters" });
    }
    try {
        const result = await userService.userReport(userId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const getAllNotifications = async (req, res) => {
    const { userId } = req.params;
    if(!userId){
        return res.status(400).json({ message: "Missing parameters" });
    }
    try {
        const result = await userService.getAllNotifications(userId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}
const addBookmark = async (req, res) => {
    const { touristId,id,type } = req.params;
    console.log(touristId);
    console.log(type);
    console.log(id);

    
  
    if (!id || !type) {
      return res.status(400).json({
        success: false,
        message: "Both id and type are required",
      });
    }
  
    try {
      const bookmark = { id, type };
      console.log(bookmark);
      const updatedBookmarks = await userService.addBookmark(touristId, bookmark);
      res.status(201).json({
        success: true,
        data: updatedBookmarks,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  // Controller method to handle retrieving all bookmarks
  const getBookmarks = async (req, res) => {
    const { touristId } = req.params;
  
    try {
      const bookmarks = await userService.getBookmarks(touristId);
  
      res.status(200).json({
        success: true,
        data: bookmarks,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  const adminReport = async (req, res) => {
    const { userId } = req.params;
    if(!userId){
        return res.status(400).json({ message: "Missing parameters" });
    }
    try {
        const result = await userService.adminReport(userId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}


module.exports = {
    getAllNotifications,
    addInterestedIn,
    adminReport,
    changePasswordAfterOTP,
    verifyOtP,
    addAddresses,
    addBookmark,
    getBookmarks,
    getAddresses,
    forgetPassword,
    creatingPromoCode,
    updatePromoCode,
    changePassword,
    uploadImage,
    acceptTerms,
    requestDeletion,
    pointsAfterPayment,
    getLevel,
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
  registerUser,
  login,
  rateTourGuide,
  commentOnTourGuide,
  rateActivity,
  commentOnActivity,
  rateItinerary,
  commentOnItinerary,
  rateHistoricalPlace,
  commentOnHistoricalPlace,
  redeemPoints,
  getUsersForDeletion,
  getNotAcceptedUsers,
  updatingStatusUser,
  userReport
};
