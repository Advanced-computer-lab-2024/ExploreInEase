const Activity = require('../../models/activity');
const Itinerary = require('../../models/itinerary');
const Users = require('../../models/user');
const HistoricalPlace = require('../../models/historicalPlace');
const userRepository = require('../users/userRepository');
const bcrypt = require('bcrypt');
const path = require('path');


const getUserById = async (id) => {
    // Retrieve the user from the Users table based on id
    return await userRepository.findUserById(id);
};
const fetchUsersForDeletion = async () => {
    try {
        const { users, tourists } = await userRepository.getAllUsersForDeletion();
        return { users, tourists };
    } catch (error) {
        throw new Error('Error fetching users for deletion');
    }
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
        const combinedArray = [...users, ...tourists];
        return combinedArray;
    } catch (error) {
        throw new Error(`Error fetching users and tourists: ${error.message}`);
    }
};


const getTouristUpcommingEvents = async (username) => {
  const tourist = await userRepository.getTouristByUsername(username);

  if (!tourist) {
    throw new Error("Tourist not found");
  }

  const currentDate = new Date();

  // Fetch activities, itineraries, and historical places
  const activities = await eventRepository.getActivitiesByIds(
    tourist.activityId
  );
  const itineraries = await eventRepository.getItinerariesByIds(
    tourist.itinerary
  );
  const historicalPlaces = await eventRepository.getHistoricalPlacesByIds(
    tourist.historicalplaceId
  );

  // Filter upcoming Events using date
  const upcomingActivities = activities.filter(
    (activity) => new Date(activity.date) >= currentDate
  );
  const upcomingItineraries = itineraries.filter(
    (itinerary) => new Date(itinerary.date) >= currentDate
  );
  const upcomingHistoricalPlaces = historicalPlaces.filter(
    (place) => new Date(place.date) >= currentDate
  );

  // Return the upcoming events as objects in JSON format
  return {
    upcomingActivities: upcomingActivities.map((activity) => ({
      id: activity._id,
      name: activity.name,
      date: activity.date,
      description: activity.description,
    })),
    upcomingItineraries: upcomingItineraries.map((itinerary) => ({
      id: itinerary._id,
      title: itinerary.title,
      date: itinerary.date,
      description: itinerary.description,
    })),
    upcomingHistoricalPlaces: upcomingHistoricalPlaces.map((place) => ({
      id: place._id,
      name: place.name,
      date: place.date,
      description: place.description,
    })),
  };
};

const login = async (username, password) => {
    const user = await userRepository.login(username, password);
    return user;
}
// Tour Guide
const createTourGuide = async (_id,tourGuideData) => {
    return await userRepository.updateUserData(_id,tourGuideData);
};

// Get a tour guide
const getTourGuide = async (_id) => {
    res= await userRepository.findUserById(_id);
    console.log(res);
    return res;
};



// Update a tour guide
const updateTourGuide = async (_id, updateData) => {
    return await userRepository.updateUserData(_id, updateData);
};


//Advertiser
const createAdvertiser = async (_id,advertiserData) => {
    console.log(_id,advertiserData);
    return await userRepository.updateUserData(_id,advertiserData);
};

// Get an advertiser
const getAdvertiser = async (_id) => {
    return await userRepository.findUserById(_id);
};

// Update an advertiser
const updateAdvertiser = async (_id, updateData) => {
    return await userRepository.updateUserData(_id, updateData);
};


//Seller
const createSeller = async (_id,sellerData) => {
    return await userRepository.updateUserData(_id,sellerData);
};

// Get a seller
const getSeller = async (_id) => {
    return await userRepository.findUserById(_id);
};

// Update a seller
const updateSeller = async (_id, updateData) => {
    return await userRepository.updateUserData(_id, updateData);
};


//Tourist

// Get a tourist
const getTourist = async (_id) => {
    return await userRepository.getTouristById(_id);
};

// Update a tourist (excluding username and wallet)
const updateTourist = async (_id, updateData) => {
    return await userRepository.updateTourist(_id, updateData);
};


const rateTourGuide = async (touristId, tourGuideId, itineraryId, rating) => {
    try {
        // Check if the tourist has completed the itinerary with the specified tour guide
        const hasCompleted = await userRepository.hasCompletedItinerary(touristId, itineraryId, tourGuideId);
        
        if (!hasCompleted) {
            throw new Error("You cannot rate this tour guide because you havent attended an itinerary with them yet.");
        }

        // Retrieve the tour guide directly by querying the user repository
        const tourGuide = await Users.findOne({ _id: tourGuideId, type: 'tourGuide' });
        if (!tourGuide) {
            throw new Error("Tour guide not found.");
        }

        // Validate the rating value to ensure it's between 1 and 5 inclusive
        if (rating < 1 || rating > 5) {
            throw new Error("Rating must be between 1 and 5 inclusive.");
        }

        // Update the rating sum and count
        tourGuide.ratingSum += rating; // Add the new rating to the sum
        tourGuide.ratingCount += 1;     // Increment the count of ratings
        
        // Calculate the new average rating
        tourGuide.rating = tourGuide.ratingSum / tourGuide.ratingCount; // Update the average rating

        // Update the activity with the new rating values
        await userRepository.updateTourGuideRatings(tourGuideId, {
            rating: tourGuide.rating,
            ratingSum: tourGuide.ratingSum,
            ratingCount: tourGuide.ratingCount,
        });

        return { message: "Rating added successfully", updatedTourGuide: tourGuide };
    } catch (error) {
        console.error("Error adding rating to tour guide:", error);
        throw error;
    }
};



const commentOnTourGuide = async (touristId, tourGuideId, itineraryId, commentText) => {
    try {
        // Check if the tourist has completed the itinerary with the specified tour guide
        const hasCompleted = await userRepository.hasCompletedItinerary(touristId, itineraryId, tourGuideId);
        
        if (!hasCompleted) {
            throw new Error("You cannot comment on this tour guide because you haven't completed this itinerary with them.");
        }

        // Retrieve the tour guide directly by querying the user repository
        const tourGuide = await Users.findOne({ _id: tourGuideId, type: 'tourGuide' });
        if (!tourGuide) {
            throw new Error("Tour guide not found.");
        }   
        // Add the comment to the tour guide's comments array
        tourGuide.comment.push(commentText);    

        // Update the tour guide with the new comment
        await userRepository.updateTourGuideComments(tourGuideId, { comment: tourGuide.comment });

        return { message: "Comment added successfully", updatedTourGuide: tourGuide };
    } catch (error) {
        console.error("Error adding comment to tour guide:", error);
        throw error;
    }
};

const commentOnItinerary = async (touristId, tourGuideId, itineraryId, commentText) => {
    try {
        // Check if the tourist has completed the itinerary with the specified tour guide
        const hasCompleted = await userRepository.hasCompletedItinerary(touristId, itineraryId, tourGuideId);
        
        if (!hasCompleted) {
            throw new Error("You cannot comment on this itinerary because you haven't completed this itinerary yet.");
        }

        const itinerary = await Itinerary.findOne({ _id: itineraryId});
        if (!itinerary) {
            throw new Error("itinerary not found.");
        }   
        // Create the new comment
        const newComment = {
            user: touristId,
            text: commentText,
            date: new Date()
        };

        // Use the repository method to push the new comment to the comments array
        const updatedItinerary = await userRepository.updateItineraryComments(itineraryId, { $push: { comments: newComment } });


        return { message: "Comment added successfully", updatedItinerary };
    } catch (error) {
        console.error("Error adding comment to itinerary:", error);
        throw error;
    }
};

const rateItinerary = async (touristId, tourGuideId, itineraryId, rating) => {
    try {
        // Check if the tourist has completed the itinerary with the specified tour guide
        const hasCompleted = await userRepository.hasCompletedItinerary(touristId, itineraryId, tourGuideId);
        
        if (!hasCompleted) {
            throw new Error("You cannot rate this itinerary because you havent attended it yet.");
        }

        // Retrieve the tour guide directly by querying the user repository
        const itinerary = await Itinerary.findOne({ _id: itineraryId });
        if (!itinerary) {
            throw new Error("Itinerary not found.");
        }

        // Validate the rating value to ensure it's between 1 and 5 inclusive
        if (rating < 1 || rating > 5) {
            throw new Error("Rating must be between 1 and 5 inclusive.");
        }

        // Update the rating sum and count
        itinerary.ratingSum += rating; // Add the new rating to the sum
        itinerary.ratingCount += 1;     // Increment the count of ratings
        
        // Calculate the new average rating
        itinerary.rating = itinerary.ratingSum / itinerary.ratingCount; // Update the average rating

        // Update the activity with the new rating values
        await userRepository.updateItineraryRatings(itineraryId, {
            rating: itinerary.rating,
            ratingSum: itinerary.ratingSum,
            ratingCount: itinerary.ratingCount,
        });

        return { message: "Rating added successfully", updatedItinerary: itinerary };
    } catch (error) {
        console.error("Error adding rating to itinerary:", error);
        throw error;
    }
};

const rateActivity = async (touristId, activityId, rating) => {
    try {
        // Check if the tourist has completed the itinerary with the specified tour guide
        const hasAttended = await userRepository.hasAttendedActivity(touristId, activityId);
        
        if (!hasAttended) {
            throw new Error("You cannot rate this activity because you havent attended this activity yet.");
        }

        // Retrieve the tour guide directly by querying the user repository
        const activity = await Activity.findOne({ _id: activityId });
        if (!activity) {
            throw new Error("activity not found.");
        }

        // Validate the rating value to ensure it's between 1 and 5 inclusive
        if (rating < 1 || rating > 5) {
            throw new Error("Rating must be between 1 and 5 inclusive.");
        }

        // Update the rating sum and count
        activity.ratingSum += rating; // Add the new rating to the sum
        activity.ratingCount += 1;     // Increment the count of ratings
        
        // Calculate the new average rating
        activity.rating = activity.ratingSum / activity.ratingCount; // Update the average rating

        // Update the activity with the new rating values
        await userRepository.updateActivityRatings(activityId, {
            rating: activity.rating,
            ratingSum: activity.ratingSum,
            ratingCount: activity.ratingCount,
        });

        return { message: "Rating added successfully", updatedActivity: activity };
    } catch (error) {
        console.error("Error adding rating to activity:", error);
        throw error;
    }
};

const commentOnActivity = async (touristId, activityId, commentText) => {
    try {
        // Check if the tourist has completed the itinerary with the specified tour guide
        const hasAttended = await userRepository.hasAttendedActivity(touristId, activityId);
        
        if (!hasAttended) {
            throw new Error("You cannot comment on this Activity because you haven't attended this activity yet.");
        }

        // Retrieve the tour guide directly by querying the user repository
        const activity = await Activity.findOne({ _id: activityId});
        if (!activity) {
            throw new Error("activity not found.");
        }   
        // Create the new comment
        const newComment = {
            user: touristId,
            text: commentText,
            date: new Date(),
        };

        // Use the repository method to push the new comment to the comments array
        const updatedActivity = await userRepository.updateActivityComments(activityId, { $push: { comments: newComment } });


        return { message: "Comment added successfully", updatedActivity };
    } catch (error) {
        console.error("Error adding comment to activity:", error);
        throw error;
    }
};

const rateHistoricalPlace = async (touristId, historicalPlaceId, rating) => {
    try {
        // // Check if the tourist has completed the itinerary with the specified tour guide
        // const hasAttended = await userRepository.hasAttendedActivity(touristId, activityId);
        
        // if (!hasAttended) {
        //     throw new Error("You cannot rate this activity because you havent attended this activity yet.");
        // }

        const historicalPlace = await HistoricalPlace.findOne({ _id: historicalPlaceId });
        if (!historicalPlace) {
            throw new Error("historical place not found.");
        }

        // Validate the rating value to ensure it's between 1 and 5 inclusive
        if (rating < 1 || rating > 5) {
            throw new Error("Rating must be between 1 and 5 inclusive.");
        }

        // Update the rating sum and count
        historicalPlace.ratingSum += rating; // Add the new rating to the sum
        historicalPlace.ratingCount += 1;     // Increment the count of ratings
        
        // Calculate the new average rating
        historicalPlace.rating = historicalPlace.ratingSum / historicalPlace.ratingCount; // Update the average rating

        // Update the activity with the new rating values
        await userRepository.updateHistoricalPlacesRatings(historicalPlaceId, {
            rating: historicalPlace.rating,
            ratingSum: historicalPlace.ratingSum,
            ratingCount: historicalPlace.ratingCount,
        });

        return { message: "Rating added successfully", updatedHistoricalPlace: historicalPlace };
    } catch (error) {
        console.error("Error adding rating to historical place:", error);
        throw error;
    }
};

const commentOnHistoricalPlace = async (touristId, historicalPlaceId, commentText) => {
    try {
        // Check if the tourist has completed the itinerary with the specified tour guide
        // const hasAttended = await userRepository.hasAttendedActivity(touristId, activityId);
        
        // if (!hasAttended) {
        //     throw new Error("You cannot comment on this Activity because you haven't attended this activity yet.");
        // }

        // Retrieve the tour guide directly by querying the user repository
        const historicalPlace = await HistoricalPlace.findOne({ _id: historicalPlaceId});
        if (!historicalPlace) {
            throw new Error("Historical place not found.");
        }   
        // Create the new comment
        const newComment = {
            user: touristId,
            text: commentText,
            date: new Date(),
        };

        // Use the repository method to push the new comment to the comments array
        const updatedHistoricalPlace = await userRepository.updateHistoricalPlacesComments(historicalPlaceId, { $push: { comments: newComment } });


        return { message: "Comment added successfully", updatedHistoricalPlace };
    } catch (error) {
        console.error("Error adding comment to historical place:", error);
        throw error;
    }
};
const updatingStatusUser = async (userId, status) => {
    const newUser = await userRepository.updateUserStatus(userId, status);
    return {status: 200, response: { message: "Status updated successfully", user: newUser } };

}


//Saif, Tasnim

const changePassword = async (userId, oldPassword, newPassword) => {
    const user = await userRepository.findUserById(userId);
    const tourist = await userRepository.findTouristById(userId);
    console.log("User: ",user);
    console.log("Tourist: ",tourist);
    if (user) {
        if(user.password !== oldPassword) {
            return { status: 400, response: { message: "Incorrect password" } };
        }
        const newUser = await userRepository.updateUserPassword(user, newPassword);
        return { status: 200, response: { message: "Password updated successfully", user: newUser } };
    }
    else{
        if(tourist){
            if(tourist.password !== oldPassword){
                return { status: 400, response: { message: "Incorrect password" } };
            }
            const newUser = await userRepository.updateUserPassword(tourist, newPassword);
            return { status: 200, response: { message: "Password updated successfully", user: tourist } };
        }

        else{
            return { status: 400, response: { message: "User not found" } };
        }
    }
};

const uploadImage = async (userId, file) => {
    const validExtensions = ['.jpg', '.jpeg', '.png'];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
        throw new Error('Only image files are allowed (jpg, jpeg, png).');
    }

    const fileName = `${userId}-${Date.now()}${fileExtension}`;
    const fileBuffer = file.buffer;

    await userRepository.uploadImage(userId, fileName, fileBuffer); 
    const imageUrl = `http://localhost:3030/images/${fileName}`; // Adjust to match how you access images

    await userRepository.updateUserProfilePicture(userId, fileName);

    return { message: 'Image uploaded successfully', imageUrl: imageUrl };
};


const getNotAcceptedUsers = async () => {
    return await userRepository.getNotAcceptedUsers();
};

const redeemPoints = async (userId, points) => {
    const user = await userRepository.findTouristById(userId);
    console.log(user);
    if (!user) {
        return {status: 400, response: {message: "User is not a tourist"} };
    }
    if(user.points < points){
        return {status: 400, response: {message: "Not enough points"} };
    }
    const amount = points/100;
    const userNewPoints = user.points - amount;
    const userAfterRedeemed = userRepository.redeemPoints(userId, amount);
    return {status: 200, response:{message: "Redeemed Points successfully", leftPoints: userNewPoints, redeemedPoints: amount, user: userAfterRedeemed}};
}

const pointsAfterPayment = async (userId, amount) => {
    const user = await userRepository.findTouristById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const addedPoints = amount/100;
    const userAfterPoints = await userRepository.pointsAfterPayment(userId, addedPoints);
    return {message: "Points updated successfully", user: userAfterPoints};
}

const getLevel = async (userId) => {
    const user = await userRepository.findTouristById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const level = await userRepository.getLoyalityLevel(user.totalPoints);
    return {level: level};
}

const acceptTerms = async (_id, type) => {
   
    return await userRepository.updateTermsAndConditions(_id, type);
};


const requestDeletion = async (userId, type) => {
    let canDelete = false;

    if (type === 'tourist') {
        // Check conditions for tourist
        canDelete = await userRepository.checkTouristDeletionCriteria(userId);
    } else if (type === 'tourGuide') {
        console.log('a7a');
        // Check conditions for tour guide in itinerary
        canDelete = await userRepository.checkTourGuideItineraryDates(userId);
    } else if (type === 'seller') {
        // Check conditions for seller in product table
        canDelete = await userRepository.checkSellerProductStatus(userId);
    } else if (type === 'advertiser') {
        // Check conditions for advertiser in activity table
        canDelete = await userRepository.checkAdvertiserActivityStatus(userId);
    } else {
        throw new Error("Invalid user type");
    }

    if (!canDelete) {
        throw new Error("Request deletion rejected due to active records.");
    }

    // Update requestDeletion in the respective table
    const updateResult = await userRepository.updateRequestDeletion(userId, type);
    return updateResult;
};

const registerTourist = async (email, username, password, mobileNum, nation, dob,  profession,currency) => {
    const touristExists = await userRepository.checkTouristExists(username);
    if (touristExists) {
        return { status: 409, response: {message: "Tourist already exists"} };
    }

    const newTourist = {
        email: email,
        username: username,
        password: password,
        mobileNum: mobileNum,
        nation: nation,
        dob: dob,
        profession: profession,
        wallet: 1000000,
        currency
    };
    const tourist = await userRepository.saveTourist(newTourist);
    return { status: tourist.status, response: {message: "Turist registered successfully", tourist: tourist.tourist, type: 'tourist'} };
    
}

const registerUser = async (type, email, username, password, currency) => {
    try {
        // Check if a user with the same email or username already exists
        const existingUser = await userRepository.findUserByUsername(username);
        if (existingUser) {
            return { status: 400, response: { message: "User already exists" } };
        }

        // Create user data object to be passed to the repository
        const userData = {
            email,
            username,
            password: password,
            type,
            docStatus: 'pending',
            currency
        };

        // Save the user using the repository
        const savedUser = await userRepository.saveUser(userData);
        console.log(savedUser)
        return { status: 200, response: { message: "User registered successfully", User: savedUser } };
    } catch (error) {
        return { status: 500, response: { message: error.message } };
    }
};

const forgetPassword = async (email) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
        return { status: 400, response: { message: "User not found" } };
    }

    // Generate an OTP and send it to the user's email
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp);
    // Send the OTP to the user's email
    await sendEmail(user.username, user.email, `Your OTP is: ${otp}`);
    console.log("Email sent");
    // Update the user's OTP in the database
    await userRepository.updateUserOtp(email, otp);

    return { status: 200, response: { message: "User found", user: user } };
};

const sendEmail = async (username, email, message) => {
    console.log(username);
    console.log(email);
    console.log(message);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL2_USER,
            pass: process.env.EMAIL2_PASS
        }
    });

    console.log("Transporter created");
    
    const mailOptions = {
        from: process.env.EMAIL2_USER,
        to: email,
        subject: 'Your Account Password',
        text: `Hello ${username},\n\n ${message}\n\nBest regards,\n${process.env.EMAIL2_USER}`
    };

    await transporter.sendMail(mailOptions);
}

const creatingPromoCode = async (promoCode) => {
    console.log(promoCode);
    const promoCodeResult = await userRepository.savePromoCode(promoCode);
    return promoCodeResult;
}

const updatePromoCode = async (birthdayTourists) => {
    const allPromoCodes = await userRepository.fetchAllPromoCodes(); // Fetch users with adminPromoCodes
    console.log("All PromoCodes: ",allPromoCodes);

    if (!allPromoCodes || allPromoCodes.length === 0) {
        throw new Error('No promo codes available in adminPromoCodes.');
    }

    // Randomly assign a promo code for each birthday tourist
    const assignedPromoCodes = birthdayTourists.map(() => {
        const randomIndex = Math.floor(Math.random() * allPromoCodes.length);
        return allPromoCodes[randomIndex]; // Randomly select a promo code
    });

    console.log("Assigned: ", assignedPromoCodes);

    // Update promo codes for the birthday tourists
    const promoCodeResult = await userRepository.updatePromoCode(birthdayTourists, assignedPromoCodes);
    return promoCodeResult;
};





const addInterestedIn = async (userId, eventId, eventType) => {
    const user = await userRepository.findTouristById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const updatedUser = await userRepository.addInterestedIn(user, eventId, eventType);
    return updatedUser;
}

const changePasswordAfterOTP = async (_id, newPassword) => {
    let user = await userRepository.findUserById(_id);
    if (!user) {
        user = await userRepository.findTouristById(_id);
        if (!user) {
            throw new Error('User not found');
        }
    }

    const updatedUser = await userRepository.updateUserPassword(user, newPassword);
    return updatedUser;
}

const verifyOtP = async (_id, otp) => {
    let user = await userRepository.findUserById(_id);
    if (!user) {
        user = await userRepository.findTouristById(_id);
        if (!user) {
            throw new Error('User not found');
        }
    }
    const savedOTP = user.otp;
    if (savedOTP === otp) {
        return true;
    } else {
        return false;
    }
}

const addAddresses = async (userId, address) => {
    const user = await userRepository.findTouristById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const updatedUser = await userRepository.addAddresses(user, address);
    return updatedUser;
}

const getAddresses = async (userId) => {
    const user = await userRepository.findTouristById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const addresses = await userRepository.getAddresses(user);
    return addresses;
}


const userReport = async (userId) => {
    const user = await userRepository.findUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const report = await userRepository.userReport(user);
    return report;
}

const getAllNotifications = async (userId) => {
    const user = await userRepository.findTouristById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const notifications = await userRepository.getAllNotifications(user);
    return notifications;
}

module.exports = {
    getAllNotifications,
    verifyOtP,
    addAddresses,
    getAddresses,
    addInterestedIn,
    creatingPromoCode,
    updatePromoCode,
    changePasswordAfterOTP,
    sendEmail,
    changePassword,
    uploadImage,
    acceptTerms,
    requestDeletion,
    pointsAfterPayment,
    getLevel,
  deleteUserByIdAndType,
  addGovernorOrAdmin,
  fetchAllUsersAndTourists,
  getUserById,
  deleteUserByIdAndType,
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
  registerTourist,
  registerUser,
  login,
  rateTourGuide,
  commentOnTourGuide,
  rateItinerary,
  commentOnItinerary,
  rateActivity,
  commentOnActivity,
  rateHistoricalPlace,
  commentOnHistoricalPlace,
  redeemPoints,
  fetchUsersForDeletion,
  getNotAcceptedUsers,
  updatingStatusUser,
  userReport

};

