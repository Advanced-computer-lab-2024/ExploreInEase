const eventService = require('../events/eventService');
const nodemailer = require('nodemailer');
const eventRepository = require('./eventRepository');
const checkoutRepository = require('../checkouts/checkoutRepository');
require('dotenv').config();


// Get all user events by _id and userType
const getUserEvents = async (req, res) => {
  const { _id, userType } = req.body;

  // Validate input
  if (!_id || !userType) {
      return res.status(400).json({ message: "User ID and userType are required." });
  }

  if (typeof _id !== 'string' || typeof userType !== 'string') {
      return res.status(400).json({ error: 'Invalid userId or userType format' });
  }

  try {
      const events = await eventService.getUserEvents(_id, userType);
      return res.status(200).json(events);
  } catch (error) {
      console.error('Error fetching user events:', error.message);
      return res.status(500).json({ message: error.message });
  }
};
  
//CRUD ACTIVITY CATEGORY    
// Create an activity category
const createCategory = async (req, res) => {
  try {
    const category = await eventService.createCategory(req.body);
    return res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// Get all activity categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await eventService.getAllCategories();
    return res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// Update an activity category by ID
const updateCategoryById = async (req, res) => {
  const { id } = req.params; 
  const updateData = req.body; // Get the update data from the request body

  try {
    const updatedCategory = await eventService.updateCategoryById(id, updateData);
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    return res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

const deleteCategoryById = async (req, res) => {
  const { id } = req.params; // Get the ID from the URL
  

  try {
      const result = await eventService.deleteCategoryById(id); 
      if (!result) {
          return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};

//CRUD PREFTAGS


// Create a new preference tag
const createTag = async (req, res) => {
  const { tags } = req.body;

  try {
    const newTag = await eventService.createTag({ tags });
    return res.status(201).json(newTag);
  } catch (error) {
    console.error('Error creating tag:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// Get all preference tags
const getAllTags = async (req, res) => {
  try {
    const tags = await eventService.getAllTags();
    return res.status(200).json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// Update a preference tag by its _id
const updateTagById = async (req, res) => {
  const { id } = req.params; // Get the id from the URL
  const updatedData = req.body; // Get the updated data from the request body

  try {
    const updatedTag = await eventService.updateTagById(id, updatedData);
    if (!updatedTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    return res.status(200).json(updatedTag);
  } catch (error) {
    console.error('Error updating tag:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// Delete a preference tag by its _id
const deleteTagById = async (req, res) => {
  const { id } = req.params; // Get the id from the URL

  try {
    const deletedTag = await eventService.deleteTagById(id);
    if (!deletedTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    return res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Error deleting tag:', error.message);
    return res.status(500).json({ message: error.message });
  }
};





//New Codeeee


const updateItineraryActivation = async (req, res) => {
  
  const { itineraryId, isActivated, userId, userType } = req.body;


  
  if (!itineraryId || isActivated === undefined || !userId || !userType) {
      return res.status(400).json({ message: "Itinerary ID, activation status, user ID, and userType are required." });
  }
  if (userType !== 'tourGuide') {
    throw new Error('Only tour guides can update itineraries.');
  }
  if ( (isActivated !== 0 && isActivated !== 1)) {
      return res.status(400).json({ error: 'isActivated must be 0 (deactivate) or 1 (activate)' });
  }

  try {
      const updatedItinerary = await eventService.updateItineraryActivation(itineraryId, isActivated, userId, userType);
      if (!updatedItinerary) {
          return res.status(404).json({ message: 'Itinerary not found or not created by this user.' });
      }
      return res.status(200).json(updatedItinerary);
  } catch (error) {
      console.error('Error updating itinerary activation:', error.message);
      return res.status(500).json({ message: error.message });
  }
};


const updateEventFlagController = async (req, res) => {
  const { userType, eventType, eventID } = req.body;

  try {
        if (userType !== 'admin') {
          throw new Error('Only admins can update the flag.');
      }

      const updatedEvent = await eventService.updateEventFlag(eventType, eventID);
      if (!updatedEvent) {
          return res.status(404).json({ message: 'Event not found.' });
      }
      return res.status(200).json({ message: 'Event flag updated successfully.', updatedEvent });
  } catch (error) {
      console.error('Error updating event flag:', error.message);
      return res.status(400).json({ message: error.message });
  }
};


const bookedEvents = async (req, res) => {
  try {
      const { touristId } = req.params;

      
      if (!touristId) {
          return res.status(400).json({ error: "touristId is required in the request body" });
      }

     
      const result = await eventService.bookedEvents(touristId);
      return res.status(200).json(result);
  } catch (error) {
      return res.status(500).json({ error: error.message });
  }
};





const cancelBookingEvent = async (req, res) => {
  const { userType, touristId, eventType, eventID } = req.body;

  try {
    if (userType !== 'tourist') {
      throw new Error('User type must be tourist');
     }

      const updatedTourist = await eventService.cancelEventToTourist(userType, touristId, eventType, eventID);
      return res.status(200).json({
          success: true,
          message: 'Event updated successfully',
          data: updatedTourist,
      });
  } catch (error) {
      return res.status(400).json({
          success: false,
          message: error.message,
      });
  }
};

const sendEventEmail = async (req, res) => {
  const { touristId, receiverEmail } = req.params;
  const eventDetails = req.body;

  try {
      const result = await eventService.sendEventEmail(touristId, receiverEmail, eventDetails);
      res.status(200).json(result);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};






const getCityCode = async (req, res) => {
  try {
      const response = await eventService.fetchCityCode(req.params.city);
      res.status(200).json(response);  
  } catch (error) {
      console.error("Error in getCityCode:", error); // Log the error object for debugging
      res.status(500).json({ error: error.message || "An unexpected error occurred." });
  }
};
const flightOffers = async (req, res) => {
  const { originCode, destinationCode, dateOfDeparture,currency,personCount } = req.body;

  if (!originCode || !destinationCode || !dateOfDeparture  || !currency || !personCount) {
      return res.status(400).json({ message: "Origin, destination, and departure date are required." });
  }

  try {
      
      const flights = await eventService.flightOffers( originCode, destinationCode, dateOfDeparture,currency,personCount);
      return res.status(200).json(flights);
  } catch (error) {
      console.error('Error searching flights:', error.message);
      return res.status(500).json({ message: error.message });
  }
};


const bookFlight = async (req, res) => {
  const { bookedBy, price, departureTime, arrivalTime, personCount,currency,originCode,destinationCode } = req.body;

  
  if (!bookedBy || !price || !departureTime || !arrivalTime || !personCount || !currency || !originCode || !destinationCode) {
      return res.status(400).json({ message: "All fields are required." });
  }

  try {
      const newBooking = await eventService.flightBooking({ bookedBy, price, departureTime, arrivalTime, personCount,currency ,originCode,destinationCode });
      return res.status(201).json(newBooking);
  } catch (error) {
      console.error('Error booking flight:', error.message);
      return res.status(500).json({ message: error.message });
  }
};









const getHotelsByCityCode = async (req, res) => {
  try {
      const { startDate, endDate, currency, personCount } = req.body; 
      const response = await eventService.fetchHotelsByCityCode(
          req.params.cityCode,
          startDate,
          endDate,
          currency,  
          parseInt(personCount) || 1  
      );
      res.status(200).json(response); 
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

const bookHotel = async (req, res) => {
  const { bookedBy, price, iataCode, hotelName, hotelId,startDate,endDate,personCount,currency } = req.body;

  
  if (!bookedBy || !price || !iataCode || !hotelName || !hotelId || !startDate || !endDate || !personCount || !currency) {
      return res.status(400).json({ message: "All fields are required." });
  }

  try {
      const newBooking = await eventService.bookingHotel({ bookedBy, price, iataCode, hotelName, hotelId,startDate ,endDate,personCount,currency });
      return res.status(201).json(newBooking);
  } catch (error) {
      console.error('Error booking hotel:', error.message);
      return res.status(500).json({ message: error.message });
  }
};






const createTransportation = async (req, res) => {
  try {
    const { advertiserId, pickupLocation, dropoffLocation, dateAvailable,timeAvailable, price, transportationType } = req.body; 

    if (!advertiserId || !pickupLocation || !dropoffLocation || !dateAvailable || !timeAvailable || !price || !transportationType ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newTransportation = await eventService.createTransportation(advertiserId, pickupLocation, dropoffLocation, dateAvailable,timeAvailable, price, transportationType);
    return res.status(201).json({
      success: true,
      message: 'Transportation created successfully.',
      data: newTransportation,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



const getTransportations = async (req, res) => {
  try {
    const{currency} = req.params;
    const transportation = await eventService.getTransportations(currency);
    return res.status(200).json(transportation);
  } catch (error) {
    console.error('Error fetching transportation:', error.message);
    return res.status(500).json({ message: error.message });
  }
}


const bookTransportation = async (req, res) => {
  const { touristId, transportationId } = req.body;

  try {
      const result = await eventService.bookTransportation(touristId, transportationId);
      return res.status(200).json(result);
  } catch (error) {
      console.error('Error in booking transportation:', error.message);
      return res.status(400).json({ message: error.message });
  }
};


const getAllEvents= async(req, res) => {
  try {
    const data = await eventService.getAllEvents();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
}



//New ElNew code 



const bookEvent = async (req, res) => {
  const { userType, touristId, eventType, eventID, ticketType, currency, activityPrice,promoCode } = req.body;

  try {
    if (userType !== 'tourist') {
      throw new Error('User type must be tourist');
    }
    if (!touristId || !userType || !eventType || !eventID) {
      return res.status(400).json({ error: "All attributes are required in the request body" });
    }

    const updatedTourist = await eventService.addEventToTourist(userType, touristId, eventType, eventID, ticketType, currency, activityPrice,promoCode);

    const allTourists = await eventRepository.findTourists();
    
    allTourists.forEach(async tourist => {
  const isInterested = tourist.interestedIn.some(interested => 
      interested.id.toString() === eventID && 
      interested.type === eventType
  );

  if (isInterested) {
      const event = eventRepository.findEventById(eventID, eventType);
      if (event) {
          if(!event.isBooked) {
            const body = `${eventType} with Name ${event.name} started its first booking`;
            const notificationData = {
                body,
                user: {
                    user_id: touristId,
                    user_type: "tourist"
                }
            };
            const notification = await checkoutRepository.addNotification(notificationData);
            console.log("NOTIFICATION: ",notification);
            
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
                to: tourist.email,
                subject: 'Event Booking',
                text: `${eventType} with Name ${event.name} started its first booking.\n\nBest regards,\n${process.env.EMAIL2_USER}`
            };
        
            await transporter.sendMail(mailOptions); 
          }
      }
  }
    });


    return res.status(200).json({
      success: true,
      message: 'Event booked successfully',
      data: updatedTourist,
    });
  } catch (error) {
    if (error.message.includes('already been booked')) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


const bookEventWithCard = async (req, res) => {
  const {
    userType,
    touristId,
    eventType,
    eventID,
    ticketType,
    currency,
    activityPrice,
    cardNumber,
    expMonth,
    expYear,
    cvc,
    promoCode
  } = req.body;

  try {
    if (userType !== "tourist") {
      throw new Error("User type must be tourist");
    }
    if (
      !touristId ||
      !userType ||
      !eventType ||
      !eventID ||
      !cardNumber ||
      !expMonth ||
      !expYear ||
      !cvc
    ) {
      return res.status(400).json({
        success: false,
        message: "All attributes are required in the request body",
      });
    }

    const result = await eventService.addEventToTouristWithCard(
      userType,touristId,eventType,eventID,ticketType,currency,activityPrice,cardNumber,expMonth,expYear,cvc,promoCode
    );

    const allTourists = await eventRepository.findTourists();
    
    allTourists.forEach(async tourist => {
      const isInterested = tourist.interestedIn.some(interested => 
          interested.id.toString() === eventID && 
          interested.type === eventType
      );
    
      if (isInterested) {
          const event = eventRepository.findEventById(eventID, eventType);
          if (event) {
              if(!event.isBooked) {
                const body = `${eventType} with Name ${event.name} started its first booking`;
                const notificationData = {
                    body,
                    user: {
                        user_id: touristId,
                        user_type: "tourist"
                    }
                };
                const notification = await checkoutRepository.addNotification(notificationData);
                console.log("NOTIFICATION: ",notification);
                
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
                    to: tourist.email,
                    subject: 'Event Booking',
                    text: `${eventType} with Name ${event.name} started its first booking.\n\nBest regards,\n${process.env.EMAIL2_USER}`
                };
            
                await transporter.sendMail(mailOptions); 
              }
          }
      }
    });

    return res.status(200).json({
      success: true,
      message: "Event booked successfully, Payment successful and Email sent",
      data: result.tourist,
      paymentStatus: result.paymentStatus,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};







module.exports = {
    getUserEvents,
    createCategory,
    getAllCategories,
    updateCategoryById,
    deleteCategoryById,
    createTag,
    getAllTags,
    updateTagById,
    deleteTagById,
    updateItineraryActivation,
    updateEventFlagController,
    bookEvent,
    cancelBookingEvent,
    sendEventEmail,
    getCityCode,
    getHotelsByCityCode,
    createTransportation,
    getTransportations,
    bookTransportation,
    bookedEvents,
    flightOffers,
    bookFlight,
    bookHotel,
    getAllEvents,
    bookEventWithCard

  };
  