const eventRepository = require('../events/eventRepository');
const User = require('../../models/user'); 
const nodemailer = require('nodemailer');
require('dotenv').config();




const getUserEvents = async (_id, userType) => {
  const user = await User.findById(_id); // Find user by _id
  
  if (!user) {
      throw new Error('User not found');
  }

  let events;

  switch (userType) {
      case 'tourismGovernor':
          events = await eventRepository.getHistoricalPlacesByUserId(_id);
          break;
      case 'tourGuide':
          events = await eventRepository.getItinerariesByUserId(_id);
          break;
      case 'advertiser':
          events = await eventRepository.getActivitiesByUserId(_id);
          break;
      default:
          throw new Error('Invalid userType');
  }

  return events;
};



//CRUD ACTIVITY CATEGORY

// Create a new activity category
const createCategory = async (categoryData) => {
  return await eventRepository.createCategory(categoryData);
};

// Get all activity categories
const getAllCategories = async () => {
  return await eventRepository.getAllCategories();
};

// Delete a category by ID
const deleteCategoryById = async (id) => {
  return await eventRepository.deleteCategoryById(id);
};

// Update a category by ID
const updateCategoryById = async (id, updateData) => {
  return await eventRepository.updateCategoryById(id, updateData);
};


//CRUD PREFTAGS

// Create a new preference tag
const createTag = async (tagData) => {
    return await eventRepository.createTag(tagData);
  };
  
  // Get all preference tags
  const getAllTags = async () => {
    return await eventRepository.getAllTags();
  };
  
  // Update a preference tag by _id
const updateTagById = async (id, updatedData) => {
  return await eventRepository.updateTagById(id, updatedData);
};

// Delete a preference tag by _id
const deleteTagById = async (id) => {
  return await eventRepository.deleteTagById(id);
};




//New Codeeee



const updateItineraryActivation = async (itineraryId, isActivated, userId, userType) => {
 

  return await eventRepository.updateItineraryActivation(itineraryId, isActivated, userId);
};

const updateEventFlag = async ( eventType, eventID) => {
  
  if (eventType === 'itinerary') {
      return await eventRepository.setFlagToZeroForItinerary(eventID);
  } else if (eventType === 'activity') {
      return await eventRepository.setFlagToZeroForActivity(eventID);
  } else {
      throw new Error('Invalid event type. Must be "itinerary" or "activity".');
  }
};


const bookedEvents = async (touristId) => {
  const tourist = await eventRepository.bookedEvents({ touristId });

  if (!tourist) {
    throw new Error('Tourist not found');
  }

  return [
    // Process `activityId` array
    tourist.activityId.length > 0 ? tourist.activityId
      .filter(activity => activity.id)
      .map(activity => ({
        id: activity.id._id.toString(),
        name: activity.id.name,
        date: activity.id.date,
        time: activity.id.time,
        location: [
          activity.id.location.latitude,
          activity.id.location.longitude
        ],
        budget: activity.id.price,
        category: activity.id.category ? activity.id.category.categoryName : 'Unknown', 
        tags: activity.id.tags.map(tag => tag.toString()), 
        specialDiscounts: activity.id.specialDiscounts,
        created_by: activity.id.created_by ? activity.id.created_by.toString() : null,
        flag: activity.id.flag,
        isOpen: activity.id.isOpen,
        comments: activity.id.comments,
        createdAt: activity.id.createdAt,
        type: "Activity"
      })) : [],

    // Process `itineraryId` array
    tourist.itineraryId.length > 0 ? tourist.itineraryId
      .filter(itinerary => itinerary.id)
      .map(itinerary => ({
        id: itinerary.id._id.toString(),
        name: itinerary.id.name,
        activities: itinerary.id.activities ? itinerary.id.activities.map(activity => activity.toString()) : [],
        locations: itinerary.id.locations ? itinerary.id.locations.map(location => location.toString()) : [],
        timeline: itinerary.id.timeline ? itinerary.id.timeline.map(time => time.toString()) : [],
        directions: itinerary.id.directions,
        language: itinerary.id.language,
        price: itinerary.id.price,
        dateAvailable: itinerary.id.dateAvailable ? itinerary.id.dateAvailable.map(date => date.toISOString()) : [],
        accessibility: itinerary.id.accessibility,
        pickupLocation: itinerary.id.pickupLocation,
        dropoffLocation: itinerary.id.dropoffLocation,
        isActivated: itinerary.id.isActivated,
        created_by: itinerary.id.created_by ? { _id: itinerary.id.created_by._id.toString(), username: itinerary.id.created_by.username } : null,
        flag: itinerary.id.flag,
        rating: itinerary.id.rating || [],
        comments: itinerary.id.comments || [],
        type: "Itinerary",
        pricePaid: itinerary.pricePaid
      })) : [],

    // Process `historicalplaceId` array
    tourist.historicalplaceId.length > 0 ? tourist.historicalplaceId
      .filter(historicalPlace => historicalPlace.id)
      .map(historicalPlace => ({
        id: historicalPlace.id._id.toString(),
        name: historicalPlace.id.name,
        description: historicalPlace.id.description,
        pictures: historicalPlace.id.pictures || [],
        location: [
          historicalPlace.id.location.latitude,
          historicalPlace.id.location.longitude,
        ],
        openingHours: historicalPlace.id.openingHours,
        ticketPrice: [
          historicalPlace.id.ticketPrice.student,
          historicalPlace.id.ticketPrice.native,
          historicalPlace.id.ticketPrice.foreign
        ],
        createdAt: historicalPlace.id.createdAt,
        tags: historicalPlace.id.tags ? historicalPlace.id.tags.type : [], // Get tag name
        type: 'HistoricalPlace',
        pricePaid: historicalPlace.pricePaid,
      })) : [],

    // Process `transportationId` array
    tourist.transportationId && tourist.transportationId.length > 0 ? tourist.transportationId
      .filter(transportation => transportation.id)
      .map(transportation => ({
        ...transportation.id._doc,
        pricePaid: transportation.pricePaid
      })) : []
  ];
};



const addEventToTourist = async (userType, touristId, eventType, eventId,ticketType,currency,activityPrice) => {
  
  return await eventRepository.bookEvent(touristId, eventType, eventId,ticketType,currency,activityPrice);
};

const cancelEventToTourist= async (userType, touristId, eventType, eventId) => {
    
    return await eventRepository.cancelEvent(touristId, eventType, eventId);
  }




  const sendEventEmail = async (touristId, receiverEmail, eventDetails) => {
    
    const touristEmail = await eventRepository.getTouristEmailById(touristId);
    if (!touristEmail) {
      throw new Error('Tourist not found');
    }
  
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: "aclproject7@gmail.com", 
        pass: "qodo imkr adxs jred", 
      },
    });
  
    const formattedDetails = Object.entries(eventDetails)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  
    const mailOptions = {
      from: touristEmail,
      to: receiverEmail,
      subject: 'Event Details',
      text: `Hello!\nYour friend with email ${touristEmail} sent you an event!!\n\nHere are the event details:\n\n${formattedDetails}`, // Including tourist email in the message
    };
  
    await transporter.sendMail(mailOptions);
    return { message: 'Email sent successfully' };
  };
  









const Amadeus = require('amadeus');

const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID4, 
    clientSecret: process.env.AMADEUS_CLIENT_SECRET4,
});


const fetchCityCode = async (city) => {
  try {
    const response = await amadeus.referenceData.locations.cities.get({ keyword: city });

    const simplifiedResponse = response.data
      .filter(location => location.iataCode)
      .map(location => ({
        name: location.name,
        iataCode: location.iataCode
      }));

    if (simplifiedResponse.length === 0) {
      throw new Error("No city found with the specified name. Please try again.");
    }

    return simplifiedResponse;
  } catch (error) {
    console.error("Error in fetchCityCode:", error); // Log the error object for debugging
    throw new Error(error.message || "An error occurred while fetching city code."); // Add a fallback message
  }
};




const flightOffers = async (originCode, destinationCode, dateOfDeparture, currency, personCount) => {
  try {
    switch (currency) {
      case 'euro':
        currency = "EUR";
        break;
      case 'dollar':
        currency = "USD";
        break;
      case 'EGP':
        currency = "EGP";
        break;
      default:
        throw new Error('Invalid currency');
    }
    
    const requestBody = {
      currencyCode: currency,
      originDestinations: [
        {
          id: '1',
          originLocationCode: originCode,
          destinationLocationCode: destinationCode,
          departureDateTimeRange: {
            date: dateOfDeparture,
            time: '10:00:00'
          }
        }
      ],
      travelers: [
        {
          id: '1',
          travelerType: 'ADULT'
        }
      ],
      sources: ['GDS'],
      searchCriteria: {
        maxFlightOffers: 8,
        flightFilters: {
          cabinRestrictions: [
            {
              cabin: 'BUSINESS',
              coverage: 'MOST_SEGMENTS',
              originDestinationIds: ['1']
            }
          ]
        }
      }
    };

    const response = await amadeus.shopping.flightOffersSearch.post(requestBody);

    if (!response.data || response.data.length === 0) {
      // No flights available
      return { message: "No flights are available." };
    }

    const formattedFlights = response.data.map(flightOffer => ({
      id: flightOffer.id,
      price: (flightOffer.price.total) * personCount,
      currency: flightOffer.price.currency,
      departure: flightOffer.itineraries[0].segments[0].departure,
      arrival: flightOffer.itineraries[0].segments.slice(-1)[0].arrival,
      carrierCode: flightOffer.validatingAirlineCodes[0],
      segments: flightOffer.itineraries[0].segments.map(segment => ({
        carrierCode: segment.carrierCode,
        departure: segment.departure,
        arrival: segment.arrival,
        duration: segment.duration,
      })),
    }));

    return formattedFlights;
  } catch (error) {
    let errorMessage;

    if (error.response && error.response.data) {
      errorMessage = error.response.data;
      console.error(`API response error: ${errorMessage}`);
    } else if (error.message) {
      errorMessage = error.message;
      console.error(`Network error: ${errorMessage}`);
    } else {
      errorMessage = "Server busy, try again please";
      console.error(errorMessage);
    }

    throw new Error(errorMessage);
  }
};






const flightBooking = async ({ bookedBy, price, departureTime, arrivalTime, personCount,currency,originCode,destinationCode }) => {
  
  return await eventRepository.flightBooking({ bookedBy, price, departureTime, arrivalTime, personCount,currency,originCode,destinationCode });
};



const fetchHotelsByCityCode = async (cityCode, startDate, endDate, currency, personCount) => {
  try {
      const response = await amadeus.referenceData.locations.hotels.byCity.get({ cityCode });
      
      const simplifiedResponse = response.data.map(hotel => {
          let basePrice = Math.floor(Math.random() * (6000 - 3000 + 1)) + 3000; 
        
          if (currency === 'euro') {
              basePrice = basePrice / 55;
          } else if (currency === 'dollar') {
              basePrice = basePrice / 50;
          }

          
          const start = new Date(startDate);
          const end = new Date(endDate);
          const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24))); 

          
          const price = Math.round(basePrice * personCount * days * 100) / 100;

          return {
              iataCode: hotel.iataCode,
              name: hotel.name,
              hotelId: hotel.hotelId,
              startDate: startDate || null,
              endDate: endDate || null,
              price: price
          };
      });
      
      return simplifiedResponse; 
  } catch (error) {
      throw new Error(`Error fetching hotels: ${error.message}`);
  }
};


const bookingHotel = async ({ bookedBy, price, iataCode, hotelName, hotelId,startDate ,endDate,personCount,currency }) => {
  
  return await eventRepository.bookingHotel({ bookedBy, price, iataCode, hotelName, hotelId,startDate ,endDate,personCount,currency });
};


const createTransportation = async (advertiserId, pickupLocation, dropoffLocation, dateAvailable,timeAvailable, price, transportationType) => {
  return await eventRepository.createTransportation(advertiserId, pickupLocation, dropoffLocation, dateAvailable,timeAvailable, price, transportationType);
};

const getTransportations = async (currency) => {
  return await eventRepository.getTransportations(currency);
}

const bookTransportation = async (touristId, transportationId) => {
  return await eventRepository.bookTransportation(touristId, transportationId);
};


const  getAllEvents=async()=> {
  const activities = await eventRepository.getAllActivities();
  const itineraries = await eventRepository.getAllItineraries();
  const historicalPlaces = await eventRepository.getAllHistoricalPlaces();

  return {
    activities,
    itineraries,
    historicalPlaces
  };
}
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
  updateEventFlag,
  addEventToTourist,
  cancelEventToTourist,
  sendEventEmail,
  fetchCityCode,
  fetchHotelsByCityCode,
  createTransportation,
  getTransportations,
  bookTransportation,
  bookedEvents,
  flightOffers,
  flightBooking,
  bookingHotel,
  getAllEvents
};

