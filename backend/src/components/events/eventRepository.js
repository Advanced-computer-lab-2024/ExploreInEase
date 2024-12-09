const HistoricalPlace = require('../../models/historicalPlace');
const Itinerary = require('../../models/itinerary');
const Activity = require('../../models/activity');
const ActivityCategory = require('../../models/activityCategory'); 
const PreferenceTags = require('../../models/preferenceTags'); 
const Users = require('../../models/user');
const Tourist = require('../../models/tourist');
const mongoose = require('mongoose');
const historicalTags = require('../../models/historicalTag');
const historicalPlace = require('../../models/historicalPlace');
const Transportation = require('../../models/transportation');
const BookedFlight = require('../../models/bookedFlights');
const BookedHotel = require('../../models/bookedHotels');
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer");


const getActivitiesByUserId = async (userId) => {
  return await Activity.find({ created_by: userId })
    .populate('category', 'categoryName') // Get categoryName from ActivityCategory
    
    .exec(); 
};

const getAllActivitiesInDatabase = async () => {
  return await Activity.find().select('name');
};

const getHistoricalPlacesByUserId = async (userId) => {
  return await HistoricalPlace.find({ created_by: userId })
    .populate('tags', 'type period') // Get type and period from historicalTags
    .exec();
};

const getItinerariesByUserId = async (userId) => {
  return await Itinerary.find({ created_by: userId })
    .populate('activities') // Populate activities as per existing design
    .populate('preftag', 'tags') // Get tags from PreferenceTags
    .exec();
};





//CDUD ACTIVITY CATEGORY

// Create a new activity category
const createCategory = async (categoryData) => {
  const category = new ActivityCategory(categoryData);
  return await category.save();
};

// Get all activity categories
const getAllCategories = async () => {
  return await ActivityCategory.find();
};

// Delete a category by ID
const deleteCategoryById = async (id) => {
  try {
      const result = await ActivityCategory.findByIdAndDelete(id);
      return result ? true : false; // Return true if a category was deleted
  } catch (error) {
      console.error(`Error deleting category: ${error.message}`);
      return false;
  }
};

// Update a category by ID
const updateCategoryById = async (_id, updatedCategoryName) => {
  try {
      const updatedCategory = await ActivityCategory.findByIdAndUpdate(_id, updatedCategoryName, { new: true });
      return updatedCategory; // Return the updated category
  } catch (error) {
      console.error(`Error updating category: ${error.message}`);
      return null; // Return null if the update fails
  }
};



//CRUD PREFTAGS

// Create a new preference tag
const createTag = async (tagData) => {
  const tag = new PreferenceTags(tagData);
  return await tag.save();
};

// Get all preference tags
const getAllTags = async () => {
  return await PreferenceTags.find();
};

// Update a preference tag by its _id
const updateTagById = async (id, updatedData) => {
  return await PreferenceTags.findByIdAndUpdate(id, updatedData, { new: true });
};

// Delete a preference tag by its _id
const deleteTagById = async (id) => {
  return await PreferenceTags.findByIdAndDelete(id);
};


const getFilteredActivities = async (filters) => {
  const { budget, date, categoryId, rating } = filters;
  const currentDate = new Date();

  let filter = {
    date: { $gte: currentDate },
  };

  // Add filters for budget (assuming it's price in your schema)
  if (budget) {
    filter.price = { $lte: parseFloat(budget) };
  }

  // Add filters for specific date, if provided
  if (date) {
    filter.date = { $gte: new Date(date) }; // Filter for activities on or after the specified date el howa el upcomming
  }

  if (categoryId) {
    filter.category = categoryId; // Filter by category (which is an ObjectId referencing "ActivityCategory")
  }

  // Add filters for rating, assuming it's a float value
  if (rating) {
    filter.rating = { $gte: parseint(rating) }; // Filter by rating greater than or equal to the provided rating
  }

  // Pagination logic for skipping and limiting results
  const activities = await Activity.find(filter)
    .populate("category") // Populate the category field to include detailed category information
    .populate("created_by", "username") // Optionally populate created_by to include the creator's username
    .populate("comments.user", "name"); // Optionally populate the user field in comments to include user's name

  return activities;
};

const getCategoryByName = async (categoryName) => {
  return await ActivityCategory.findOne({ name: categoryName });
};

// Function to get all upcoming activities, itineraries, and historical places
const getAllUpcomingEvents = async () => {
  const currentDate = new Date();

  try {
    // Fetch all upcoming activities
    const upcomingActivities = await Activity.find({
      date: { $gte: currentDate },
    })
      .populate("category") // Populating the category of the activity
      .populate("created_by", "username") // Populating user details (creator) with only username
      .exec();

    // Fetch all upcoming historical places (assuming they also have a date field)
    const upcomingHistoricalPlaces = await HistoricalPlace.find({
      // dateTimeAvailable: { $gte: currentDate },
    })
      .populate("created_by", "username") // Populating user details (creator) with only username
      .exec();

    // Fetch all upcoming itineraries
    const upcomingItineraries = await Itinerary.find({
      dateTimeAvailable: { $gte: currentDate },
    })
      .populate("activities") // Populating the activities in the itinerary
      .populate("created_by", "username") // Populating user details (creator) with only username
      .exec();

    // Return a combined result of all upcoming events
    return {
      activities: upcomingActivities,
      historicalPlaces: upcomingHistoricalPlaces,
      itineraries: upcomingItineraries,
    };
  } catch (error) {
    console.error(`Error fetching events: ${error.message}`);
    throw new Error("Failed to fetch upcoming events");
  }
};

const getFilteredHistoricalPlaces = async (tags) => {
  try {
    // Create a filter object for tags
    let filter = {};

    if (tags && tags.length > 0) {
      filter.tags = { $in: tags }; // Assuming tagIds is an array of tag IDs
    }

    // Fetch historical places that match the filter
    return await HistoricalPlace.find(filter).populate("tags"); // Populate the tag details
  } catch (error) {
    console.error(`Error in getFilteredHistoricalPlaces: ${error.message}`);
    throw error;
  }
};

const getFilteredItineraries = async (filters) => {
  try {
    let query = {};

    const currentDate = new Date();

    if (filters.Date) {
      query.dateTimeAvailable = { $gte: new Date(filters.Date) };
    } else {
      query.dateTimeAvailable = { $gte: currentDate };
    }

    if (filters.budget) {
      query.price = { $lte: parseFloat(filters.budget) };
    }

    // Preferences filter (tags)
    if (filters.preferences) {
      const tagsArray = Array.isArray(filters.preferences)
        ? filters.preferences
        : [filters.preferences];
      query.tags = { $in: tagsArray }; // Filter by tags
    }

    // Language filter
    if (filters.language) {
      query.language = filters.language; // Filter by language
    }

    // Perform the query without pagination
    return await Itinerary.find(query).populate("activities preftag"); // Populate activities and tags with details
  } catch (error) {
    console.error(`Repository Error: ${error.message}`);
    throw error;
  }
};

const createHistoricalTag = async (tagData) => {
  console.log(tagData);
  
  const tag = new historicalTags(tagData);
  return await tag.save();
};  

const getTypeForTag = async (id) => {
  const user = await Users.findOne({ _id: id });
  return user.type
};
  

const getActivityById = async (id) => {
  return await Activity.findById(id);
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

const findCategoryById = async (categoryId) => {
  return await ActivityCategory.findById(categoryId);
};

const updateActivity = async (id, updateData) => {
  // Use the mongoose method to update an activity
  return await Activity.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

const deleteActivity = async (_id) => {
  // Use the mongoose method to delete an activity
  const deletedActivity = await Activity.findByIdAndDelete(_id);
  return deletedActivity; // Return the deleted activity for confirmation
};

const getAllActivities = async (userId) => {
  return await Activity.find();
};
const getAllItineraries2 = async () => {
  return Itinerary.find()
    .populate({
      path: 'activities',
      populate: { path: 'category tags' } 
    });
};

const getAllActivitiesAdvertiser = async (userId) => {
  return await Activity.find({ created_by: userId });
};


const getAllItineraries = async (userId) => {
  const itineraries = await Itinerary.find({ created_by: userId });

  // Optional: Ensure each itinerary has a name
  itineraries.forEach(itinerary => {
    if (!itinerary.name) {
      console.error(`Itinerary with ID ${itinerary._id} does not have a name.`);
    }
  });

  return itineraries;
};


const getItineraryById = async (id) => {
  const itinerary = await Itinerary.findById(id)
    .populate('activities')
    .populate({
      path: 'comments.user', // Populate user data in comments
      select: 'name', // Assuming user schema has a name field
    });

  return itinerary;
};


const createItinerary = async (itineraryData) => {
  // Create a new itinerary document in the database
  const newItinerary = new Itinerary(itineraryData);
  return await newItinerary.save();
};

const findItineraryById = async (_id) => {
  return await Itinerary.findById(_id);
};

const updateItinerary = async (_id, itineraryData) => {
  return await Itinerary.findByIdAndUpdate(_id, itineraryData, { new: true });
};

// Delete Itinerary from the database
const deleteItinerary = async (_id) => {
  try {
      // Find itinerary by ID and delete it
      const deletedItinerary = await Itinerary.findByIdAndDelete(_id);
      return deletedItinerary;
  } catch (error) {
      throw new Error('Error deleting itinerary: ' + error.message);
  }
};

const createHistoricalPlace = async (data) => {
  const newPlace = new HistoricalPlace(data);
  const savedPlace = await newPlace.save();
  return { status: 200, response: { message: "Historical Place created successfully", savedPlace } };
};

const findTagByTypeAndPeriod = async (type) => {
  return await historicalTags.findOne({_id:type});
};

const checkTourismGovernor = async (userId) => {
  const user = await Users.findById(userId);
  return user && user.type === 'tourismGovernor';
};


// Get all Historical Places
const getAllHistoricalPlaces = async () => {
  return await HistoricalPlace.find();
};

// Get a Historical Place by ID
const getHistoricalPlaceById = async (id) => {
  return await HistoricalPlace.findById(id);
};

// Update a Historical Place by ID
const updateHistoricalPlace = async (_id, data) => {
  console.log("data:", data.updateValues);
  return await HistoricalPlace.findByIdAndUpdate(_id, data.updateValues);
};                      

// Delete a Historical Place by ID
const deleteHistoricalPlace = async (id) => {
  return await HistoricalPlace.findByIdAndDelete(id);
};

const getType = async (id) => {
  const user = await Users.findOne({ _id: id });
  const tourist = await Tourist.findOne({ _id: id });
  if (user) {
    return user.type;
  } else if (tourist) {
    return "tourist";
  } else {
    throw new Error('User not found');
  }
};

const getAllHistoricalTags = async () => {
  return await historicalTags.find();
}

const getHistoricalTagDetails = async (id) => {
  return await historicalTags.find({ _id: id });
}
const getTouristEmailById = async (touristId) => {
  try {
      const tourist = await Tourist.findById(touristId);
      return tourist ? tourist.email : null;
  } catch (error) {
      console.error(`Error fetching tourist email: ${error.message}`);
      throw new Error('Could not fetch tourist email');
  }
};

//Mohamed Apis
const bookedEvents = async ({ touristId }) => {
  return await Tourist.findById(touristId)
      .populate({
        path: 'activityId.id',
        populate: { path: 'category', model: 'ActivityCategory' } // Populate category in Activity
      })
      .populate({
        path: 'historicalplaceId.id',
        populate: { path: 'tags', model: 'HistoricalTags' } // Populate tags in HistoricalPlace
      })
      .populate('itineraryId.id')
      .populate('transportationId.id')
      .exec();
};



const cancelEvent = async (touristId, eventType, eventId) => {
  const currentTime = new Date();
  const fortyEightHoursInMs = 48 * 60 * 60 * 1000;

  const updateData = {};
  let eventPrice = 0;
  let startDate;

  
  const eventObjectId = new mongoose.Types.ObjectId(eventId); 

  switch (eventType) {
    case 'itinerary':
      const itinerary = await Itinerary.findById(eventObjectId);
      if (!itinerary) throw new Error('Itinerary not found');

      startDate = itinerary.dateTimeAvailable.sort((a, b) => a - b)[0];
      if (!startDate || (startDate - currentTime) < fortyEightHoursInMs) {
        throw new Error('Cancellations must be made at least 48 hours before the itinerary start date.');
      }

      
      const touristItinerary = await Tourist.findById(touristId).select('itineraryId');

      
      const itineraryItem = touristItinerary.itineraryId.find(item => {
         
        return item.id.equals(eventObjectId);
      });

      if (!itineraryItem) throw new Error('Itinerary not found in tourist data');

      eventPrice = itineraryItem.pricePaid;

      
      updateData.$pull = { itineraryId: { id: eventObjectId } };
      break;

    case 'activity':
      const activity = await Activity.findById(eventObjectId);
      if (!activity) throw new Error('Activity not found');

      startDate = activity.date;
      if (!startDate || (startDate - currentTime) < fortyEightHoursInMs) {
        throw new Error('Cancellations must be made at least 48 hours before the activity start date.');
      }

      
      const touristActivity = await Tourist.findById(touristId).select('activityId');

      
      const activityItem = touristActivity.activityId.find(item => {
        return item.id.equals(eventObjectId);
      });

      if (!activityItem) throw new Error('Activity not found in tourist data');

      eventPrice = activityItem.pricePaid; 

      
      updateData.$pull = { activityId: { id: eventObjectId } };
      break;

    case 'historicalPlace':
      const historicalPlace = await HistoricalPlace.findById(eventObjectId);
      if (!historicalPlace) throw new Error('Historical place event not found');

      
      const touristHistoricalPlace = await Tourist.findById(touristId).select('historicalplaceId');

      
      const historicalPlaceItem = touristHistoricalPlace.historicalplaceId.find(item => {
        return item.id.equals(eventObjectId);
      });

      if (!historicalPlaceItem) throw new Error('Historical place event not found in tourist data');

      eventPrice = historicalPlaceItem.pricePaid; 

      
      updateData.$pull = { historicalplaceId: { id: eventObjectId } };
      break;

    default:
      throw new Error('Invalid event type');
  }

  
  updateData.$inc = { wallet: eventPrice };

  const updatedTourist = await Tourist.findByIdAndUpdate(touristId, updateData, { new: true });

  if (!updatedTourist) throw new Error('Tourist not found');

  return {
    message: `${eventType} event cancelled successfully.`,
    eventPriceRefunded: eventPrice,
    updatedTourist,
  };
};


const flightBooking = async ({ bookedBy, price, departureTime, arrivalTime, personCount,currency,originCode,destinationCode }) => {
  try {

    switch (currency) {
      case 'euro':
          price = (price * 55).toFixed(2); 
          break;
      case 'dollar':
          price = (price * 50).toFixed(2); 
          break;
      case 'EGP':
          price = price.toFixed(2); 
          break;
      default:
          throw new Error('Invalid currency'); 
    }



      const tourist = await Tourist.findById(bookedBy);
      if (!tourist) {
        throw new Error('Tourist not found');
      }

      if (tourist.wallet < price) {
        throw new Error('Insufficient funds to book this Flight by Wallet');
      }


      tourist.wallet -= price;
      await tourist.save();


      const newBooking = new BookedFlight({
          bookedBy,
          price,
          departureTime,
          arrivalTime,
          personCount,
          originCode,
          destinationCode
      });

      
      await newBooking.save();
      return {
        message: 'Booking has been made successfully',
        booking: newBooking,
      };
  } catch (error) {
      console.error('Error saving booking:', error);
      throw new Error("Unable to create booking");
  }
};


const bookingHotel = async ({ bookedBy, price, iataCode, hotelName, hotelId, startDate, endDate, personCount, currency }) => {
  try {
    
    switch (currency) {
      case 'euro':
        price = (price * 55).toFixed(2);
        break;
      case 'dollar':
        price = (price * 50).toFixed(2);
        break;
      case 'EGP':
        price = price.toFixed(2);
        break;
      default:
        price = price;
    }

    
    const tourist = await Tourist.findById(bookedBy);
    if (!tourist) {
      throw new Error('Tourist not found');
    }

    
    if (tourist.wallet < price) {
      throw new Error('Insufficient funds to book this hotel');
    }

    tourist.wallet -= price;
    await tourist.save();

    
    const newBooking = new BookedHotel({
      bookedBy,
      price,
      iataCode,
      hotelName,
      hotelId,
      startDate,
      endDate,
      personCount,
      currency,
    });

    
    await newBooking.save();

   
    return {
      message: 'Booking has been made successfully',
      booking: newBooking,
    };
  } catch (error) {
    console.error('Error saving booking:', error);
    throw new Error("Unable to create booking");
  }
};

const createTransportation = async (advertiserId, pickupLocation, dropoffLocation, dateAvailable,timeAvailable, price, transportationType) => {
  
  const transportation = new Transportation({
    advertiserId,
    pickupLocation,
    dropoffLocation,
    dateAvailable,
    timeAvailable,
    price,
    transportationType,
    
  });

  await transportation.save(); 
  return transportation; 
};


const getTransportations = async (currency) => { 
  const transportations = await Transportation.find();

  
  const convertedTransportations = transportations.map(transportation => {
      let convertedPrice;
      
      switch (currency) {
          case 'euro':
              convertedPrice = (transportation.price / 55).toFixed(2);
              break;
          case 'dollar':
              convertedPrice = (transportation.price / 55).toFixed(2);
              break;
          case 'EGP':
              convertedPrice = (transportation.price).toFixed(2); 
              break;
          default:
              convertedPrice = transportation.price; 
      }

      
      return {
          ...transportation.toObject(), 
          price: convertedPrice
      };
  });

  return convertedTransportations;
};



const bookTransportation = async (touristId, transportationId) => {
  
  const transportation = await Transportation.findById(transportationId);
  if (!transportation) {
    throw new Error('Transportation not found');
  }

  const price = transportation.price;

  const tourist = await Tourist.findById(touristId);
  if (!tourist) {
    throw new Error('Tourist not found');
  }

  // Check if transportationId already exists in tourist's transportationId array
  const alreadyBooked = tourist.transportationId.some(entry => entry.id.equals(transportationId));
  if (alreadyBooked) {
    throw new Error('Transportation already booked');
  }

  if (tourist.wallet < price) {
    throw new Error('Insufficient funds to book this transportation');
  }

  // Deduct the price from the tourist's wallet
  tourist.wallet -= price;

  // Add the transportation to the tourist's transportationId array
  tourist.transportationId.push({ id: transportationId, pricePaid: price });
  await tourist.save();

  return { message: 'Transportation booked successfully', tourist };
};

const setFlagToZeroForItinerary = async (_id) => {
  return await Itinerary.findByIdAndUpdate(_id, { flag: 0 }, { new: true });
};

const setFlagToZeroForActivity = async (_id) => {
  return await Activity.findByIdAndUpdate(_id, { flag: 0 }, { new: true });
};



// Saif, Tasnim

const updateItineraryActivation = async (itineraryId, isActivated, userId) => {
  const updatedItinerary = await Itinerary.findOneAndUpdate(
      { _id: itineraryId, created_by: userId }, 
      { isActivated: isActivated },
      { new: true } 
  );

  return updatedItinerary; 
};



//Buildo + saif apis 

const bookEvent = async (
  touristId,
  eventType,
  eventId,
  ticketType,
  currency,
  activityPrice,
  promoCode
) => {
  const tourist = await Tourist.findById(touristId);
  if (!tourist) {
    throw new Error("Tourist not found");
  }

  let eventPrice = 0;
  let eventName = ""; // Add this for email purposes

  if (promoCode) {
    const validPromo = tourist.promoCodes.includes(promoCode);
    if (validPromo) {
      tourist.promoCodes = tourist.promoCodes.filter((pc) => pc !== promoCode);
      await tourist.save();
    } else {
      throw new Error("Invalid promo code");
    }
  }

  switch (eventType) {
    case "itinerary":
      const itinerary = await Itinerary.findById(eventId);
      if (!itinerary) {
        throw new Error("Itinerary not found");
      }
      if (
        tourist.itineraryId.some((event) => event.id.toString() === eventId)
      ) {
        throw new Error("This itinerary has already been booked.");
      }
      eventPrice = itinerary.price;
      eventName = itinerary.name; // For email

      if (promoCode) {
        eventPrice *= 0.7; // Apply 30% discount
      }
      break;

    case "activity":
      if (tourist.activityId.some((event) => event.id.toString() === eventId)) {
        throw new Error("This activity has already been booked.");
      }
      const activity = await Activity.findById(eventId);
      if (!activity) {
        throw new Error("Activity not found");
      }
      eventName = activity.name; // For email

      switch (currency) {
        case "euro":
          eventPrice = (activityPrice * 55).toFixed(2);
          break;
        case "dollar":
          eventPrice = (activityPrice * 50).toFixed(2);
          break;
        case "EGP":
          eventPrice = (activityPrice * 1).toFixed(2);
          break;
        default:
          throw new Error("Invalid currency");
      }

      if (promoCode) {
        eventPrice *= 0.7; // Apply 30% discount
      }
      break;

    case "historicalPlace":
      const historicalPlace = await HistoricalPlace.findById(eventId);
      if (!historicalPlace) {
        throw new Error("Historical place not found");
      }
      if (
        tourist.historicalplaceId.some(
          (event) => event.id.toString() === eventId
        )
      ) {
        throw new Error("This historical place has already been booked.");
      }
      eventPrice =
        ticketType === "student"
          ? historicalPlace.ticketPrice.student
          : ticketType === "native"
          ? historicalPlace.ticketPrice.native
          : historicalPlace.ticketPrice.foreign;
      eventName = historicalPlace.name; // For email

      if (promoCode) {
        eventPrice *= 0.7; // Apply 30% discount
      }
      break;

    default:
      throw new Error("Invalid event type");
  }

  if (tourist.wallet < eventPrice) {
    throw new Error("Insufficient funds to book this event");
  }

  tourist.wallet -= eventPrice;

  const eventData = { id: eventId, pricePaid: eventPrice };
  switch (eventType) {
    case "itinerary":
      tourist.itineraryId.push(eventData);
      break;
    case "activity":
      tourist.activityId.push(eventData);
      break;
    case "historicalPlace":
      tourist.historicalplaceId.push(eventData);
      break;
  }

  await tourist.save();

  // Send a booking confirmation email
  await sendBookingConfirmationEmail(
    tourist.email,
    tourist.username,
    eventName,
    eventPrice
  );

  return tourist;
};



const sendBookingConfirmationEmail = async (
  touristEmail,
  username,
  eventName,
  pricePaid
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "aclproject7@gmail.com",
      pass: "qodo imkr adxs jred", // Store securely in environment variables
    },
  });

  const mailOptions = {
    from: "aclproject7@gmail.com",
    to: touristEmail,
    subject: "Booking Confirmation for Your Event",
    text: `Hello ${username},\n\nThank you for your booking!\n\nEvent Name: ${eventName}\nAmount Paid by wallet: ${pricePaid} EGP\n\nWe hope you enjoy your event!\n\nBest regards,\nThe ExploreInEase Team`,
  };

  await transporter.sendMail(mailOptions);
};



const bookEventWithCard = async (
  touristId,
  eventType,
  eventId,
  ticketType,
  currency,
  activityPrice,
  cardNumber,
  expMonth,
  expYear,
  cvc,
  promoCode
) => {
  const tourist = await Tourist.findById(touristId);
  if (!tourist) {
    throw new Error("Tourist not found");
  }

  let eventPrice = 0;
  let eventName = "";




  if (promoCode) {
    const validPromo = tourist.promoCodes.includes(promoCode); // Correct validation
    if (validPromo) {
      // Remove the promo code from the array
      tourist.promoCodes = tourist.promoCodes.filter((pc) => pc !== promoCode);
      await tourist.save(); // Save the updated promo codes
    } else {
      throw new Error("Invalid promo code");
    }
  }

  // Determine event price and name based on the event type
  switch (eventType) {
    case "itinerary":
      const itinerary = await Itinerary.findById(eventId);
      if (!itinerary) {
        throw new Error("Itinerary not found");
      }
      if (tourist.itineraryId.some((event) => event.id.toString() === eventId)) {
        throw new Error("This itinerary has already been booked.");
      }
      eventPrice = itinerary.price;
      eventName = itinerary.name;

      // Apply discount if promo code was valid
      if (promoCode) {
        eventPrice *= 0.7; // Apply 30% discount
      } 

      break;

    case "activity":
      if (tourist.activityId.some((event) => event.id.toString() === eventId)) {
        throw new Error("This activity has already been booked.");
      }
      const activity = await Activity.findById(eventId);
      if (!activity) {
        throw new Error("Activity not found");
      }
      eventName = activity.name;

      switch (currency) {
        case "euro":
          eventPrice = (activityPrice * 55).toFixed(2);
          break;
        case "dollar":
          eventPrice = (activityPrice * 50).toFixed(2);
          break;
        case "EGP":
          eventPrice = (activityPrice * 1).toFixed(2);
          break;
        default:
          throw new Error("Invalid currency");
      }

      // Apply discount if promo code was valid
      if (promoCode) {
        eventPrice *= 0.7; // Apply 30% discount
      }
      break;

    case "historicalPlace":
      const historicalPlace = await HistoricalPlace.findById(eventId);
      if (!historicalPlace) {
        throw new Error("Historical place not found");
      }
      if (
        tourist.historicalplaceId.some(
          (event) => event.id.toString() === eventId
        )
      ) {
        throw new Error("This historical place has already been booked.");
      }
      eventPrice =
        ticketType === "student"
          ? historicalPlace.ticketPrice.student
          : ticketType === "native"
          ? historicalPlace.ticketPrice.native
          : historicalPlace.ticketPrice.foreign;
      eventName = historicalPlace.name;


      // Apply discount if promo code was valid
      if (promoCode) {
        eventPrice *= 0.7; // Apply 30% discount
      }
      break;

    default:
      throw new Error("Invalid event type");
  }

  try {
    // Create a Payment Method
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number: cardNumber,
        exp_month: expMonth,
        exp_year: expYear,
        cvc: cvc,
      },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(eventPrice * 100), // Convert to cents
      currency: "EGP",
      payment_method: paymentMethod.id,
      confirm: true, // Automatically confirm the payment
      description: `Payment for order by Tourist with username: ${tourist.username}`,
      automatic_payment_methods: {
        enabled: true, // Enable automatic methods
        allow_redirects: "never", // Explicitly disable redirect-based methods
      },
    });
    

    // Add the event to the tourist's record
    const eventData = { id: eventId, pricePaid: eventPrice };
    switch (eventType) {
      case "itinerary":
        tourist.itineraryId.push(eventData);
        break;
      case "activity":
        tourist.activityId.push(eventData);
        break;
      case "historicalPlace":
        tourist.historicalplaceId.push(eventData);
        break;
    }

    await tourist.save();

    // Send a payment receipt email
    const lastFourDigits = paymentMethod.card.last4;
    await sendPaymentReceiptEmail(
      tourist.email,
      tourist.username,
      eventName,
      eventPrice,
      lastFourDigits
    );

    // Return a success object
    return {
      success: true,
      tourist,
      paymentStatus: paymentIntent.status,
    };
  } catch (error) {
    throw new Error(`Stripe Payment Failed: ${error.message}`);
  }
};

const sendPaymentReceiptEmail = async (
  touristEmail,
  username,
  eventName,
  pricePaid,
  lastFourDigits
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "aclproject7@gmail.com",
      pass: "qodo imkr adxs jred", // Ensure this is stored securely (e.g., using environment variables)
    },
  });

  const mailOptions = {
    from: "aclproject7@gmail.com",
    to: touristEmail,
    subject: "Payment Receipt for Your Booking",
    text: `Hello ${username},\n\nThank you for your booking!\n\nEvent Name: ${eventName}\nAmount Paid: ${pricePaid} EGP\nPayment Method: Card ending in ****${lastFourDigits}\n\nWe hope you enjoy your event!\n\nBest regards,\nThe ExploreInEase Team`,
  };

  await transporter.sendMail(mailOptions);
};




//saif functions 
const findTourists = async () => {
  return await Tourist.find();
};




const findEventById = async (eventId) => {
  const activity = await Activity.findById(eventId);
  const historicalPlace = await HistoricalPlace.findById(eventId);
  const itinerary = await Itinerary.findById(eventId);

  if(activity){
    return activity;
  }

  if(historicalPlace){
    return historicalPlace;
  }

  if(itinerary){
    return itinerary;
  }

  return null;
}

module.exports = {
  updateItineraryActivation,
  getHistoricalTagDetails,
  createCategory,
  getAllCategories,
  updateCategoryById,
  deleteCategoryById,
  createTag,
  getAllTags,
  updateTagById,
  deleteTagById,
  getHistoricalPlacesByUserId,
  getItinerariesByUserId,
  getActivitiesByUserId,
  getCategoryByName,
  getFilteredActivities,
  getAllUpcomingEvents,
  getFilteredHistoricalPlaces,
  getFilteredItineraries,
  createHistoricalTag,
  getActivityById,
  createActivity,
  findCategoryById,
  updateActivity,
  deleteActivity,
  getItineraryById,
  createItinerary,
  updateItinerary,
  deleteItinerary,
  createHistoricalPlace,
  getAllHistoricalPlaces,
  getHistoricalPlaceById,
  updateHistoricalPlace,
  deleteHistoricalPlace,
  getType,
  getAllItineraries,
  getAllActivities,
  getAllActivitiesAdvertiser,
  findItineraryById,
  findTagByTypeAndPeriod,
  checkTourismGovernor,
  getTypeForTag,
  getAllHistoricalTags,
  getAllActivitiesInDatabase,
  createTransportation,
  getTransportations,
  bookTransportation,
  bookedEvents,
  bookEvent,
  cancelEvent,
  flightBooking,
  bookingHotel,
  getTypeForTag,
  setFlagToZeroForItinerary,
  setFlagToZeroForActivity,
  getAllItineraries2,
  getTouristEmailById,
  bookEventWithCard,
  findTourists,
  findEventById



  
};



