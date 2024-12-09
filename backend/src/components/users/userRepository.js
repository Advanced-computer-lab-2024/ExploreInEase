const Users = require('../../models/user');
const Tourist = require('../../models/tourist');
const Itinerary = require('../../models/itinerary');
const Activity = require('../../models/activity');
const HistoricalPlace = require('../../models/historicalPlace');
const Product = require('../../models/product');
const Order = require('../../models/order');
const PromoCode = require('../../models/promoCode');
const Notification = require('../../models/notification');
const fs = require('fs');
const path = require('path');

const updateUserStatus = async (userId, status) => {
    try {
        const user = await findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if(status === 'accepted'){
            user.docStatus = 'approved'
        }
        else{
            if(status === 'rejected'){
                user.docStatus = 'rejected';
            }
        }
        await user.save();
        return user;
    } catch (error) {
        throw new Error(`Error updating user status: ${error.message}`);
    }
};

const getTouristByUsername = async (username) => {
    console.log(username);
    return await Tourist.findOne({ username });
};

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

// Find all users with requestDeletion set to true
const getAllUsersForDeletion = async () => {
    const usersToDelete = await Users.find({ requestDeletion: true });
    const touristsToDelete = await Tourist.find({ requestDeletion: true });
    return { users: usersToDelete, tourists: touristsToDelete };
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
const createActivity = async (activityData) => {
    const activity = new Activity(activityData);
    const newActivity = await activity.save();
    const createdActivity = {
      _id: newActivity._id,
      name: newActivity.name,
      date: newActivity.date,
      time: newActivity.time,
      location: newActivity.location,
      price: newActivity.price,
      category: newActivity.category,
      tags: newActivity.tags,
      specialDiscounts: newActivity.specialDiscounts,
      isOpen: newActivity.isOpen,
      created_by: newActivity.created_by,
    }
    console.log(createdActivity);
    return createdActivity;
  };


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

const updateHistoricalPlacesRatings = async (historicalPlaceId, updatedFields) => {
    try {
        // Use Mongoose's `findByIdAndUpdate` to update the tour guide's comments
        const updatedHistoricalPlace = await HistoricalPlace.findByIdAndUpdate(
            historicalPlaceId,
            { $set: updatedFields },
            { new: true, runValidators: true } // `new: true` returns the updated document
        );

        if (!updatedHistoricalPlace) {
            throw new Error("Historical Place not found or could not be updated.");
        }

        return updatedHistoricalPlace;
    } catch (error) {
        console.error("Error updating historical place ratings:", error);
        throw error;
    }
};

const updateHistoricalPlacesComments = async (historicalPlaceId, updateOperation) => {
    try {
        // Use Mongoose's `findByIdAndUpdate` to apply the update operation (like $push for comments)
        const updatedHistoricalPlace = await HistoricalPlace.findByIdAndUpdate(
            historicalPlaceId,
            updateOperation,
            { new: true, runValidators: true } // `new: true` returns the updated document
        );

        if (!updatedHistoricalPlace) {
            throw new Error("Historical Place not found or could not be updated.");
        }

        return updatedHistoricalPlace;
    } catch (error) {
        console.error("Error updating Historical Place comments:", error);
        throw error;
    }
};


//Saif, Tasnim

const login = async (username, password) => {
    try {
        console.log(`Looking for user with username: ${username}`);
        
        const user = await Users.findOne({ username });
        if (user !== null) {
            console.log(`User found in Users table. Checking password for ${username}`);
            const isMatch = password === user.password;
            if (!isMatch) {
                console.log('Password mismatch for user');
                throw new Error('Incorrect username or password');
            }
            console.log(`Password matched for user: ${username}`);
            return { user, userType: user.type };  // Return user object and type
        } else {
            console.log(`User not found in Users table. Checking Tourist table for ${username}`);
            const tourist = await Tourist.findOne({ username });
            if (tourist !== null) {
                console.log(`Tourist found. Checking password for ${username}`);
                const isMatch = password === tourist.password;
                if (!isMatch) {
                    console.log('Password mismatch for tourist');
                    throw new Error('Incorrect username or password');
                }
                console.log(`Password matched for tourist: ${username}`);
                return { user: tourist, userType: "tourist" };  // Return tourist object and type
            } else {
                console.log(`User not found in either Users or Tourist tables for ${username}`);
                throw new Error('Incorrect username or password');
            }
        }
    } catch (error) {
        console.error(`Error logging in: ${error.message}`);  // Log the error message
        return { user: null, userType: null };
    }
};



const getUserbyUsername = async (username) => {
    const user = await Users.findOne({ username: username });
    if (user) {
        return user;
    } else {
        const tourist = await Tourist.findOne({ username: username });
        if (tourist) {
            return tourist;
        } else {
            return null;
        }
    }
};

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
const findTouristById = async (userId) => {
    try {
        const user = await Tourist.findById(userId); // Assuming Mongoose is used
        return user;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error; // Let the calling function handle it
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


const userReport = async (user) => {
    try {
        let tourists = [];
        let eventObject = {};
        let monthlyReport = {};

        // Predefined array of months for sorting
        const monthOrder = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        if (user.type === "tourGuide") {
            const itineraries = await Itinerary.find({ created_by: user._id });
            const itineraryIds = itineraries.map(itinerary => itinerary._id.toString());

            tourists = await Tourist.find({
                "itineraryId.id": { $in: itineraryIds }
            });

            for (const itinerary of itineraries) {
                const count = tourists.filter(tourist => 
                    tourist.itineraryId.some(itineraryRef => 
                        itineraryRef.id.toString() === itinerary._id.toString()
                    )
                ).length;

                const createdAt = new Date(itinerary.dateTimeAvailable[0]);
                const month = createdAt.toLocaleString('default', { month: 'long' });

                if (!eventObject[month]) {
                    eventObject[month] = [];
                }

                eventObject[month].push({
                    name: itinerary.name,
                    price: itinerary.price * 0.9,
                    totalPeople: count
                });
            }
        } else if (user.type === "advertiser") {
            const activities = await Activity.find({ created_by: user._id });
            const activityIds = activities.map(activity => activity._id.toString());

            tourists = await Tourist.find({
                "activityId.id": { $in: activityIds }
            });

            for (const activity of activities) {
                const count = tourists.filter(tourist => 
                    tourist.activityId.some(activityRef => 
                        activityRef.id.toString() === activity._id.toString()
                    )
                ).length;

                const createdAt = new Date(activity.date);
                const month = createdAt.toLocaleString('default', { month: 'long' });

                if (!eventObject[month]) {
                    eventObject[month] = [];
                }

                eventObject[month].push({
                    name: activity.name,
                    price: activity.price * 0.9,
                    totalPeople: count
                });
            }
        } else if (user.type === "seller") {
            const products = await Product.find({ sellerId: user._id });
            const productIds = products.map(product => product._id.toString());

            const orders = await Order.find({
                "productsIdsQuantity.id": { $in: productIds }
            });

            for (const product of products) {
                const count = orders.reduce((total, order) => {
                    const productExists = order.productsIdsQuantity.some(
                        item => item.id.toString() === product._id.toString()
                    );
                    return productExists ? total + 1 : total;
                }, 0);

                const createdAt = new Date(product.createdAt);
                const month = createdAt.toLocaleString('default', { month: 'long' });

                if (!eventObject[month]) {
                    eventObject[month] = [];
                }

                eventObject[month].push({
                    name: product.name,
                    price: product.price * 0.9,
                    totalPeople: count
                });
            }
        }

        // Group filtered tourists by their creation month and year
        tourists.forEach((tourist) => {
            const createdAt = new Date(tourist.createdAt);
            const month = createdAt.toLocaleString('default', { month: 'long' });
            const year = createdAt.getFullYear();
            const key = `${month} ${year}`;

            if (!monthlyReport[key]) {
                monthlyReport[key] = 0;
            }
            monthlyReport[key]++;
        });

        // Transform and sort the monthlyReport into an array of objects
        const monthlyReportArray = Object.keys(monthlyReport)
            .map((key) => {
                const [month, year] = key.split(" ");
                return {
                    Month: key,
                    Tourists: monthlyReport[key],
                    sortIndex: parseInt(year) * 12 + monthOrder.indexOf(month)
                };
            })
            .sort((a, b) => a.sortIndex - b.sortIndex)
            .map(({ Month, Tourists }) => ({ Month, Tourists }));

            const formattedEventObject = Object.keys(eventObject).map(month => {
                const key = user.type === "advertiser" ? "activities" : "itineraries";
            
                // Calculate total revenue and extract names
                const itinerariesOrActivities = eventObject[month];
                const names = itinerariesOrActivities.map(item => item.name);
                const totalRevenue = itinerariesOrActivities.reduce((sum, item) => sum + item.price, 0);
            
                return {
                    month,
                    [key]: names,
                    totalRevenue
                };
            });
            


            const totalTouristinEventObject = formattedEventObject.reduce((total, month) => {
                const key = user.type === "advertiser" ? "activities" : "itineraries";
                return total + (month[key] || []).reduce((sum, event) => sum + event.totalPeople, 0);
            }, 0);

            const sortedEventObject = formattedEventObject.sort((a, b) => {
                return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
            });

            const totalRevenueinAllMonthes = sortedEventObject.reduce((total, month) => total + month.totalRevenue, 0);

        return {
            eventObject: sortedEventObject,
            totalRevenue: totalRevenueinAllMonthes,
            monthlyReport: monthlyReportArray,
        };
    } catch (error) {
        throw new Error(`Error fetching tourist report: ${error.message}`);
    }
};


const findUserByEmail = async (email) => {
    try {
        const user = await Users.findOne({ email });
        const tourist = await Tourist.findOne({ email });
        if (user) {
            return user;
        } else if (tourist) {
            return tourist;
        } else {
            return null;
        }
    } catch (error) {
        throw new Error(`Error finding user by email: ${error.message}`);
    }
};

const updateUserOtp = async (email, otp) => {
    try {
        const user = await findUserByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        user.otp = otp;
        await user.save();
    } catch (error) {
        throw new Error(`Error updating user OTP: ${error.message}`);
    }
}

const findSellerById = async (id) => {
    try {
        const seller = await Users.findById({_id: id});
        return seller;
    } catch (error) {
        console.error('Error fetching seller by ID:', error);
        throw error;
    }
}

const savePromoCode = async (promoCodes) => {
    try {
        const promoCode = {
            promoCodes: promoCodes
        }
        const newPromoCode = new PromoCode(promoCode);
        const savedPromoCode = await newPromoCode.save();
        return savedPromoCode;
    } catch (error) {
        throw new Error(`Error saving promo code: ${error.message}`);
    }
};

const updatePromoCode = async (touristIds, promoCodes) => {
    try {
        if (touristIds.length !== promoCodes.length) {
            throw new Error('Number of tourist IDs and promo codes must be the same');
        }
        console.log('Tourist IDs:', touristIds);

        // Validate that all touristIds are valid MongoDB ObjectIDs
        touristIds.forEach((id) => {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error(`Invalid tourist ID: ${id}`);
            }
        });

        // Perform updates
        const updates = touristIds.map(async (touristId, index) => {
            const promoCode = promoCodes[index].promoCodes; // Fetch promo code directly

            // Find the tourist by ID
            const tourist = await Tourist.findOne({ _id: touristId });
            if (!tourist) {
                throw new Error(`Tourist with ID ${touristId} not found`);
            }

            // Add the promoCode to the tourist's promoCodes array
            tourist.promoCodes.push(promoCode ); // Adjust based on your schema

            // Save the updated tourist
            const updatedTourist = await tourist.save();
            return updatedTourist;
        });

        // Wait for all updates to complete
        const updatedTourists = await Promise.all(updates);

        return updatedTourists; // Return updated tourists
    } catch (error) {
        console.error(`Error updating promo codes: ${error.message}`);
        throw new Error(`Error updating promo codes: ${error.message}`);
    }
};


const fetchAllPromoCodes = async () => {
    try {
        const promoCodes = await PromoCode.find().select('promoCodes');
        return promoCodes;
    } catch (error) {
        throw new Error(`Error fetching first user: ${error.message}`);
    }
};






const addInterestedIn = async (user, eventId, eventType) => {
    try {
        const event = {
            id: eventId,
            type: eventType
        };
        user.interestedIn.push(event);
        const updatedUser = await user.save();
        return updatedUser;
    } catch (error) {
        throw new Error(`Error adding interestedIn: ${error.message}`);
    }
};

const addAddresses = async (user, address) => {
    try {
        user.addresses.push(address);
        const updatedUser = await user.save();
        return updatedUser;
    } catch (error) {
        throw new Error(`Error adding address: ${error.message}`);
    }
}

const getAddresses = async (user) => {
    try {
        return user.addresses;
    } catch (error) {
        throw new Error(`Error fetching user addresses: ${error.message}`);
    }
}


const getAllNotifications = async (user) => {
    try {
        const notifications = await Notification.find({ 'user.user_id': user._id });
        return notifications;
    } catch (error) {
        throw new Error(`Error fetching notifications: ${error.message}`);
    }
}
const addBookmark = async (touristId, bookmark) => {
    try {
      const tourist = await Tourist.findById(touristId);
      if (!tourist) {
        throw new Error("Tourist not found");
      }
  
      tourist.bookmark.push(bookmark);
      await tourist.save();
  
      return {
        message: "Bookmark added successfully",
      };
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
  const getBookmarks = async (touristId) => {
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      throw new Error("Tourist not found");
    }
  
    // tourist.bookmark is an array of objects: { id: ObjectId, type: String }
    return tourist.bookmark;
  };

  const fetchAllTourists = async () => {
    try {
        return await Tourist.find({});
    } catch (error) {
        throw new Error(`Error fetching tourists: ${error.message}`);
    }
};
const fetchUserStatistics = async () => {
    try {
      return await userRepository.getUserStatistics();
    } catch (error) {
      throw new Error("Error fetching user statistics");
    }
  };

module.exports = {
    fetchUserStatistics,
    getAllNotifications,
    addAddresses,
    getAddresses,
    addBookmark,
    getBookmarks,
    addInterestedIn,
    fetchAllPromoCodes,
    updatePromoCode,
    savePromoCode,
    findSellerById,
    updateUserOtp,
    findUserByEmail,
    getLoyalityLevel,
    pointsAfterPayment,
    updateTermsAndConditions,
    getUserProfilePicture,
    updateUserProfilePicture,
    uploadImage,
    updateUserPassword,
    getUserbyUsername,
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
    updateActivityComments,
    updateHistoricalPlacesComments,
    updateHistoricalPlacesRatings,
    redeemPoints,
    getAllUsersForDeletion,
    getNotAcceptedUsers,
    updateUserStatus,
    findTouristById,
    createActivity,
    updateRequestDeletion,
    checkTouristDeletionCriteria,
    checkTourGuideItineraryDates,
    checkSellerProductStatus,
    checkAdvertiserActivityStatus,
    getTouristByUsername,
    userReport,
    findSellerById

};
