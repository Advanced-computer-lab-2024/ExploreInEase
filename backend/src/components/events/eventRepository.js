const HistoricalPlace = require('../../models/historicalPlace');
const Itinerary = require('../../models/itinerary');
const Activity = require('../../models/activity');
const ActivityCategory = require('../../models/activityCategory'); 
const PreferenceTags = require('../../models/preferenceTags'); 
const Tourist = require('../../models/tourist');
const BookedFlight = require('../../models/bookedFlights');
const BookedHotel = require('../../models/bookedHotels');


const getActivitiesByUserId = async (userId) => {
  return await Activity.find({ created_by: userId })
    .populate('category', 'categoryName') // Get categoryName from ActivityCategory
    
    .exec(); 
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
const updateCategoryById = async (id, updateData) => {
  try {
      const updatedCategory = await ActivityCategory.findByIdAndUpdate(id, updateData, { new: true });
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


  



//New Codeee
const updateItineraryActivation = async (itineraryId, isActivated, userId) => {
  const updatedItinerary = await Itinerary.findOneAndUpdate(
      { _id: itineraryId, created_by: userId }, 
      { isActivated: isActivated },
      { new: true } 
  );

  return updatedItinerary; 
};

const setFlagToZeroForItinerary = async (_id) => {
  return await Itinerary.findByIdAndUpdate(_id, { flag: 0 }, { new: true });
};

const setFlagToZeroForActivity = async (_id) => {
  return await Activity.findByIdAndUpdate(_id, { flag: 0 }, { new: true });
};






const bookedEvents = async ({ touristId }) => {
  return await Tourist.findById(touristId)
      .populate('itineraryId.id')  // Populate the 'id' field within itineraryId
      .populate('activityId.id')    // Populate the 'id' field within activityId
      .populate('historicalplaceId.id') // Populate the 'id' field within historicalplaceId
      .exec();
};


const bookEvent = async (touristId, eventType, eventId, ticketType, currency, activityPrice) => {
  const tourist = await Tourist.findById(touristId);
  if (!tourist) {
    throw new Error('Tourist not found');
  }

  let eventPrice = 0;

  switch (eventType) {
    case 'itinerary':
      const itinerary = await Itinerary.findById(eventId);
      if (!itinerary) {
        throw new Error('Itinerary not found');
      }
      if (tourist.itineraryId.some(event => event.id.toString() === eventId)) {
        throw new Error('This itinerary has already been booked.');
      }
      eventPrice = itinerary.price;
      break;

    case 'activity':
      if (tourist.activityId.some(event => event.id.toString() === eventId)) {
        throw new Error('This activity has already been booked.');
      }
      switch (currency) {
        case 'euro':
          eventPrice = (activityPrice * 55).toFixed(2);
          break;
        case 'dollar':
          eventPrice = (activityPrice * 50).toFixed(2);
          break;
        case 'EGP':
          eventPrice = (activityPrice * 1).toFixed(2);
          break;
        default:
          throw new Error('Invalid currency');
      }
      break;

    case 'historicalPlace':
      const historicalPlace = await HistoricalPlace.findById(eventId);
      if (!historicalPlace) {
        throw new Error('Historical place not found');
      }
      if (tourist.historicalplaceId.some(event => event.id.toString() === eventId)) {
        throw new Error('This historical place has already been booked.');
      }
      eventPrice = ticketType === "student" ? historicalPlace.ticketPrice.student :
                   ticketType === "native" ? historicalPlace.ticketPrice.native :
                   historicalPlace.ticketPrice.foreign;
      break;

    default:
      throw new Error('Invalid event type');
  }

  if (tourist.wallet < eventPrice) {
    throw new Error('Insufficient funds to book this event');
  }

  // Deduct event price from wallet
  tourist.wallet -= eventPrice;

  // Prepare the update data for adding event details
  const eventData = { id: eventId, pricePaid: eventPrice };
  switch (eventType) {
    case 'itinerary':
      tourist.itineraryId.push(eventData);
      break;
    case 'activity':
      tourist.activityId.push(eventData);
      break;
    case 'historicalPlace':
      tourist.historicalplaceId.push(eventData);
      break;
  }

  // Save the tourist with the updated data
  await tourist.save();

  return tourist;
};


const mongoose = require('mongoose');
const cancelEvent = async (touristId, eventType, eventId) => {
  const currentTime = new Date();
  const fortyEightHoursInMs = 48 * 60 * 60 * 1000;

  const updateData = {};
  let eventPrice = 0;
  let startDate;

  // Ensure eventId is a valid ObjectId
  const eventObjectId = new mongoose.Types.ObjectId(eventId); // Use 'new' keyword

  switch (eventType) {
    case 'itinerary':
      const itinerary = await Itinerary.findById(eventObjectId);
      if (!itinerary) throw new Error('Itinerary not found');

      startDate = itinerary.dateTimeAvailable.sort((a, b) => a - b)[0];
      if (!startDate || (startDate - currentTime) < fortyEightHoursInMs) {
        throw new Error('Cancellations must be made at least 48 hours before the itinerary start date.');
      }

      // Retrieve the tourist's itinerary
      const touristItinerary = await Tourist.findById(touristId).select('itineraryId');

      // Find the itinerary item using .equals() for ObjectId comparison
      const itineraryItem = touristItinerary.itineraryId.find(item => {
        console.log('Comparing item id:', item.id, 'with eventObjectId:', eventObjectId); // Debug log
        return item.id.equals(eventObjectId);
      });

      if (!itineraryItem) throw new Error('Itinerary not found in tourist data');

      eventPrice = itineraryItem.pricePaid; // Use pricePaid

      // Remove the whole object from the itineraryId array based on the id
      updateData.$pull = { itineraryId: { id: eventObjectId } };
      break;

    case 'activity':
      const activity = await Activity.findById(eventObjectId);
      if (!activity) throw new Error('Activity not found');

      startDate = activity.date;
      if (!startDate || (startDate - currentTime) < fortyEightHoursInMs) {
        throw new Error('Cancellations must be made at least 48 hours before the activity start date.');
      }

      // Retrieve the tourist's activity
      const touristActivity = await Tourist.findById(touristId).select('activityId');

      // Find the activity item using .equals() for ObjectId comparison
      const activityItem = touristActivity.activityId.find(item => {
        return item.id.equals(eventObjectId);
      });

      if (!activityItem) throw new Error('Activity not found in tourist data');

      eventPrice = activityItem.pricePaid; // Use pricePaid

      // Remove the whole object from the activityId array based on the id
      updateData.$pull = { activityId: { id: eventObjectId } };
      break;

    case 'historicalPlace':
      const historicalPlace = await HistoricalPlace.findById(eventObjectId);
      if (!historicalPlace) throw new Error('Historical place event not found');

      // Retrieve the tourist's historical place events
      const touristHistoricalPlace = await Tourist.findById(touristId).select('historicalplaceId');

      // Find the historical place item using .equals() for ObjectId comparison
      const historicalPlaceItem = touristHistoricalPlace.historicalplaceId.find(item => {
        return item.id.equals(eventObjectId);
      });

      if (!historicalPlaceItem) throw new Error('Historical place event not found in tourist data');

      eventPrice = historicalPlaceItem.pricePaid; // Use pricePaid

      // Remove the whole object from the historicalplaceId array based on the id
      updateData.$pull = { historicalplaceId: { id: eventObjectId } };
      break;

    default:
      throw new Error('Invalid event type');
  }

  // Increment the wallet by the event price
  updateData.$inc = { wallet: eventPrice };

  const updatedTourist = await Tourist.findByIdAndUpdate(touristId, updateData, { new: true });

  if (!updatedTourist) throw new Error('Tourist not found');

  return {
    message: `${eventType} event cancelled successfully.`,
    eventPriceRefunded: eventPrice,
    updatedTourist,
  };
};




const getTouristEmailById = async (touristId) => {
  try {
      const tourist = await Tourist.findById(touristId);
      return tourist ? tourist.email : null;
  } catch (error) {
      console.error(`Error fetching tourist email: ${error.message}`);
      throw new Error('Could not fetch tourist email');
  }
};



const createBooking = async ({ bookedBy, price, departureTime, arrivalTime, personCount,currency,originCode,destinationCode }) => {
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
        throw new Error('Invalid currency');
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




module.exports = {
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
  updateItineraryActivation,
  setFlagToZeroForItinerary,
  setFlagToZeroForActivity,
  bookEvent,
  cancelEvent,
  getTouristEmailById,
  bookedEvents,
  createBooking,
  bookingHotel
 
};



