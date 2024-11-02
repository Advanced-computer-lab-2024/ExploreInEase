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

  return {
     
      itineraries: tourist.itineraryId.map(itinerary => ({
          ...itinerary._doc,
          timeline: itinerary.timeline.map(item => item.toString()) 
      })),
      activities: tourist.activityId,
      historicalPlaces: tourist.historicalplaceId
  };
};




const addEventToTourist = async (userType, touristId, eventType, eventId,ticketType,currency,itineraryPrice) => {
  
  return await eventRepository.bookEvent(touristId, eventType, eventId,ticketType,currency,itineraryPrice);
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
      text: `Hello!\nYour friend sent you an event!!\nHere are the event details:\n\n${formattedDetails}`, // Use the formatted details
    };
  
    
    await transporter.sendMail(mailOptions);
    return { message: 'Email sent successfully' };
  };









const Amadeus = require('amadeus');

const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID2, 
    clientSecret: process.env.AMADEUS_CLIENT_SECRET2,
});


// Fetch city code by city name (returns city name and IATA code only)
const fetchCityCode = async (city) => {
  try {
      const response = await amadeus.referenceData.locations.cities.get({ keyword: city });
      
      // Extract and return only the city name and IATA code, excluding those without an IATA code
      const simplifiedResponse = response.data
        .filter(location => location.iataCode) // Exclude locations without an IATA code
        .map(location => ({
            name: location.name,
            iataCode: location.iataCode
        }));
      
      return simplifiedResponse;
  } catch (error) {
      throw new Error(`Error fetching city code: ${error.message}`);
  }
};


const flightOffers = async ({ originCode, destinationCode, dateOfDeparture }) => {
  try {
      
      const requestBody = {
          currencyCode: 'USD', 
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
              maxFlightOffers: 5,
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

      
      if (Object.keys(response.data).length === 0) {
          throw new Error("No flights available");
      }

      
      const formattedFlights = response.data.map(flightOffer => ({
          id: flightOffer.id,
          price: flightOffer.price.total,
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
     
      if (error.message === "Error fetching flights: undefined") {
          throw new Error("Server busy, try again");
      } else if (error.message === "No flights available") {
          throw new Error("No flights available");
      } else {
          
         
          throw new Error("Server busy, try again");
      }
  }
};













// Fetch hotels by city code (returns only iata code, name, and hotel id)
const fetchHotelsByCityCode = async (cityCode) => {
  try {
      const response = await amadeus.referenceData.locations.hotels.byCity.get({ cityCode });
      
      // Extract only the iataCode, name, and hotelId from the response
      const simplifiedResponse = response.data.map(hotel => ({
          iataCode: hotel.iataCode,
          name: hotel.name,
          hotelId: hotel.hotelId
      }));
      
      return simplifiedResponse;  // Return the simplified response
  } catch (error) {
      throw new Error(`Error fetching hotels: ${error.message}`);
  }
};


// Fetch offers by hotel ID (returns formatted response for all offers)
const fetchOffersByHotelId = async (hotelId) => {
    try {
        const response = await amadeus.shopping.hotelOffersSearch.get({ hotelIds: hotelId, adults: '2' });

        // Check if response data contains offers
        const formattedResponse = response.data.flatMap(hotel => {
            return hotel.offers.map(offer => {
                const roomType = offer.room.typeEstimated;  // Extract room type information

                return {
                    hotelId: hotel.hotel.hotelId,
                    name: hotel.hotel.name,
                    cityCode: hotel.hotel.cityCode,
                    checkInDate: offer.checkInDate,
                    checkOutDate: offer.checkOutDate,
                    boardType: offer.boardType,
                    category: roomType ? roomType.category : null,
                    beds: roomType ? roomType.beds : null,
                    bedType: roomType ? roomType.bedType : null,
                    text: offer.room.description ? offer.room.description.text : null,
                    adults: offer.guests ? offer.guests.adults : null,
                    total: offer.price ? offer.price.total : null
                };
            });
        });

        return formattedResponse;  // Return the formatted response
    } catch (error) {
        throw new Error(`Error fetching hotel offers: ${error.message}`);
    }
};


// Service method to search for transfer offers
const searchTransferOffers = async (transferData) => {
  try {
      const response = await amadeus.shopping.transferOffers.post(transferData);
      return response.data; // Return the response data
  } catch (error) {
      throw new Error(`Error fetching transfer offers: ${error.message}`);
  }
};

// Service method to book a transfer
const bookTransfer = async (offerId, bookingData) => {
  try {
      const response = await amadeus.ordering.transferOrders.post(bookingData, offerId);
      return response.data; // Return the response data
  } catch (error) {
      throw new Error(`Error booking transfer: ${error.message}`);
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
  updateEventFlag,
  addEventToTourist,
  cancelEventToTourist,
  sendEventEmail,
  fetchCityCode,
  fetchHotelsByCityCode,
  fetchOffersByHotelId,
  searchTransferOffers,
  bookTransfer,
  bookedEvents,
  flightOffers

};

