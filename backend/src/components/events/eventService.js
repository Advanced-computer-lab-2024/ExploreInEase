const eventRepository = require('../events/eventRepository');
const User = require('../../models/user'); 
const HistoricalPlace = require('../../models/historicalPlace');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: "src/.env" });


const getAllEvents=async()=> {
  // Assuming 'flag' is a property in the items of activities and itineraries
const activities = (await eventRepository.getAllActivities()).filter(activity => activity.flag === 1);
const itineraries = (await eventRepository.getAllItineraries2()).filter(itinerary => itinerary.flag === 1);

console.log(itineraries);
  const historicalPlaces = await eventRepository.getAllHistoricalPlaces();

  return {
    activities,
    itineraries,
    historicalPlaces
  };
}
const updateEventFlag = async ( eventType, eventID) => {
  
  if (eventType === 'itinerary') {
      return await eventRepository.setFlagToZeroForItinerary(eventID);
  } else if (eventType === 'activity') {
      return await eventRepository.setFlagToZeroForActivity(eventID);
  } else {
      throw new Error('Invalid event type. Must be "itinerary" or "activity".');
  }
};
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
const deleteCategoryById = async (_id) => {
  return await eventRepository.deleteCategoryById(_id);
};

// Update a category by ID
const updateCategoryById = async (_id, categoryName) => {
  return await eventRepository.updateCategoryById(_id, categoryName);
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


const CategoryNameToId = async (categoryName) => {
  // If categoryName is provided, fetch the corresponding categoryId
  if (categoryName) {
    try {
      const category = await eventRepository.getCategoryByName(categoryName);
      if (category) {
        return category._id; // Return the category ID
      } else {
        return null; // Return null if no category found
      }
    } catch (error) {
      console.error("Error fetching category by name:", error);
      throw new Error("Failed to fetch category ID"); // Handle error appropriately
    }
  }
  return null; // Return null if categoryName is not provided
};

const getFilteredUpcomingActivities = async (filters) => {
  try {
    // Fetch filtered activities from the repository
    const activities = await eventRepository.getFilteredActivities(filters);

    // Format the activities data
    const formattedActivities = activities.map((activity) => ({
      id: activity._id,
      name: activity.name,
      date: activity.date,
      time: activity.time,
      location: activity.location, // Include location details (latitude, longitude)
      budget: activity.price, // Handle budget or price depending on schema
      category: activity.category.categoryName, // Assuming category is populated and has a 'name' field
      tags: activity.tags, // Include tags if applicable
      specialDiscounts: activity.specialDiscounts,
      created_by: activity.created_by,
      flag: activity.flag,
      isOpen: activity.isOpen,
      rating: activity.rating,
      comments: activity.comments,
      createdAt: activity.createdAt,
      description: activity.description,
    }));

    return formattedActivities;
  } catch (error) {
    console.error(`Service Error: ${error.message}`);
    throw new Error("Failed to retrieve filtered activities.");
  }
};

const getAllUpcomingEvents = async (currency) => {
  try {

    let rate = 1;
    if(currency === 'euro') {
      rate = 55;
    } else if(currency === 'dollar') {
      rate = 50;
    }
    else{
      rate = 1;
    }
    // Retrieve upcoming events from the repository
    const { activities, itineraries, historicalPlaces } = await eventRepository.getAllUpcomingEvents();

      const filteredActivities = activities.filter(activity => activity.flag === 1);
      const filteredItineraries = itineraries.filter(itinerary => itinerary.flag === 1);

    // Format activities
     const formattedActivities= filteredActivities.map((activity)=>{
      console.log(1)
      console.log(activity);
      
      lat=activity.location.latitude
      long=activity.location.longitude
      category=activity.category?.categoryName
      loc=[lat,long]
      console.log(2)

      return{
        id: activity._id,
        name: activity.name,
        date: activity.date,
        time: activity.time,
        location: loc, // Include location details (latitude, longitude)
        budget: activity.price/rate, // Handle budget or price depending on schema
        category: category, // Assuming category is populated and has a 'name' field
        tags: activity.tags, // Include tags if applicable
        specialDiscounts: activity.specialDiscounts,
        created_by: activity.created_by,
        flag: activity.flag,
        isOpen: activity.isOpen,
        rating: activity.rating,
        comments: activity.comments,
        createdAt: activity.createdAt,
        description: activity.description,
        type:"Activity"
      }
     })



    // const formattedActivities = activities.map((activity) => ({
    //   id: activity._id,
    //   name: activity.name,
    //   date: activity.date,
    //   time: activity.time,
    //   location: activity.location, // Include location details (latitude, longitude)
    //   budget: activity.price, // Handle budget or price depending on schema
    //   category: activity.category, // Assuming category is populated and has a 'name' field
    //   tags: activity.tags, // Include tags if applicable
    //   specialDiscounts: activity.specialDiscounts,
    //   created_by: activity.created_by,
    //   flag: activity.flag,
    //   isOpen: activity.isOpen,
    //   rating: activity.rating,
    //   comments: activity.comments,
    //   createdAt: activity.createdAt,
    //   description: activity.description,
    //   type:"Activity"
    // }));

    // Format itineraries
    const formattedItineraries = filteredItineraries.map((itinerary) => ({
      id: itinerary._id,
      name:itinerary.name,
      activities: itinerary.activities.map((activity) => activity.name), // Get activity names within the itinerary
      locations: itinerary.locations, // Assuming locations is an array of strings
      timeline: itinerary.timeline,
      directions: itinerary.directions,
      language: itinerary.language,
      price: itinerary.price/rate,
      dateAvailable: itinerary.dateTimeAvailable,
      accessibility: itinerary.accessibility,
      pickupLocation: itinerary.pickupLocation,
      dropoffLocation: itinerary.dropoffLocation,
      isActivated: itinerary.isActivated,
      created_by: itinerary.created_by,
      flag: itinerary.flag,
      rating: itinerary.rating,
      comments: itinerary.comments,
      type:"Itinerary"
    }));

    const formattedHistoricalPlaces = historicalPlaces.map((place)=>{
      lat=place.location.latitude
      long=place.location.longitude
      address= place.location.address

      student=place.ticketPrice.student/rate
      native=place.ticketPrice.native/rate
      foreign=place.ticketPrice.foreign/rate

      ticketPrice=[student,native,foreign]

      loc=[lat,long]
      return {
        id: place._id,
        name: place.name,
        description: place.description,
        pictures: place.pictures, // Array of pictures
        location: loc, // Location details (latitude, longitude, address)
        openingHours: place.openingHours, // Opening hours
        ticketPrice: ticketPrice, // Detailed ticket price (student/native/foreign)
        createdAt: place.createdAt,
        tags: place.tags, // Associated tags if needed
        type:"HistoricalPlace"
      }

    })

    // Format historical places
    // const formattedHistoricalPlaces = historicalPlaces.map((place) => ({
    //   id: place._id,
    //   name:place.name,
    //   description: place.description,
    //   pictures: place.pictures, // Array of pictures
    //   location: place.location, // Location details (latitude, longitude, address)
    //   openingHours: place.openingHours, // Opening hours
    //   ticketPrice: place.ticketPrice, // Detailed ticket price (student/native/foreign)
    //   createdAt: place.createdAt,
    //   tags: place.tags, // Associated tags if needed
    //   type:"HistoricalPlace"
    // }));

    const response= {
      Activity: formattedActivities,
      itineraries: formattedItineraries,
      historicalPlaces: formattedHistoricalPlaces,
    }

    // Return formatted data
    return [formattedActivities, formattedItineraries, formattedHistoricalPlaces];
  } catch (error) {
    console.error(`Service Error: ${error.message}`);
    throw error; // Propagate the error to the controller for further handling
  }
};

const createHistoricalTag = async (tag) => {
  console.log(tag);
  
    return await eventRepository.createHistoricalTag(tag);
    console.log("createHistoricalTag Service:",eventRepository.createHistoricalTag(tag));
    
};

const getActivityById = async (id) => {
  return await eventRepository.getActivityById(id);
};

const getAllActivitiesInDatabase = async () => {
  return await eventRepository.getAllActivitiesInDatabase();
}

const addActivity = async ({ name, date, time, location, price, category, tags, specialDiscounts, isOpen, created_by }) => {
  // Check if the category exists
  const categoryExists = await eventRepository.findCategoryById(category);
  if (!categoryExists) {
    throw new Error('Invalid category.');
  }

  const user = await User.findOne({ _id: created_by, type: 'advertiser' });
  if (!user) {
    throw new Error('Advertiser not found');
  }

  // Construct the new activity object
  const newActivity = {
    name,
    date,
    time,
    location,
    price,
    category,
    tags,
    specialDiscounts,
    isOpen,
    created_by
  };

  // Call the repository to add the activity to the database
  const createdActivity = await eventRepository.createActivity(newActivity);
  
  return createdActivity;
};


const updateActivity = async (id, updateData) => {
  // You can add additional validation or processing here if needed
  return await eventRepository.updateActivity(id, updateData);
};

const deleteActivity = async (_id) => {
  return await eventRepository.deleteActivity(_id);
};

const getAllActivitiesAdvertiser = async (userId) => {
  return await eventRepository.getAllActivitiesAdvertiser(userId);
};

const getAllActivities = async () => {
  return await eventRepository.getAllActivities();
};

const getAllItineraries = async (userId) => {
  const itineraries = await eventRepository.getAllItineraries(userId);
  return itineraries;
};


const getItineraryById = async (id) => {
  return await eventRepository.getItineraryById(id);
};

const createItinerary = async (itineraryData) => {
  return await eventRepository.createItinerary(itineraryData);
};

const updateItinerary = async (_id, itineraryData) => {
  try {
      const currentItinerary = await eventRepository.findItineraryById(_id);
      
      if (!currentItinerary) {
          return null; // Itinerary not found
      }

      // Check if there is a rating in the incoming data and ensure it's an array
      if (itineraryData.rating) {
          // Ensure itineraryData.rating is an array before spreading
          const newRatings = Array.isArray(itineraryData.rating) ? itineraryData.rating : [itineraryData.rating];
          currentItinerary.rating.push(...newRatings); // Add new ratings
      }

      // Update other fields
      Object.keys(itineraryData).forEach(key => {
          if (key !== 'rating') { // Exclude rating to prevent overwriting
              currentItinerary[key] = itineraryData[key];
          }
      });

      // Save the updated itinerary
      await currentItinerary.save();
      
      return currentItinerary;
  } catch (error) {
      throw new Error('Error updating itinerary: ' + error.message);
  }
};

// Service to delete an itinerary by ID
const deleteItinerary = async (_id) => {
  try {
      const deletedItinerary = await eventRepository.deleteItinerary(_id);
      return deletedItinerary;
  } catch (error) {
      throw new Error(error.message);
  }
};

// Create a new Historical Place
const createHistoricalPlace = async (data) => {
  // Check if the user is authorized to create a historical place
  const user = await eventRepository.checkTourismGovernor(data.created_by);
  if (!user) {
    return { status: 403, response: { message: 'You are not authorized to create a Historical Place' } };
  }

  // Create a new historical place
  const newPlace = new HistoricalPlace(data);
  const savedPlace = await newPlace.save();

  return { status: 200, response: { message: "Historical Place created successfully", savedPlace } };
};


// Get all Historical Places
const getAllHistoricalPlaces = async () => {
  return await eventRepository.getAllHistoricalPlaces();
};

// Get a Historical Place by ID
const getHistoricalPlaceById = async (id, userId) => {
  const user = await eventRepository.checkTourismGovernor(userId);
  if (!user) {
    return {status: 400, response: {message: 'You are not authorized to view this Historical Place'}};
  }
  const historicalPlace = await eventRepository.getHistoricalPlaceById(id);
  if (!historicalPlace) {
    return {status: 404, response: {message: 'Historical Place not found'}};
  }
  else{
    if(historicalPlace.created_by != userId) {
      return {status: 400, response: {message: 'You are not authorized to view this Historical Place'}};
    }
    return {status: 200, response: {message: 'Historical Place found', historicalPlace: historicalPlace}};
  }
};

// Update a Historical Place by ID
const updateHistoricalPlace = async (id, userId, data) => {
  const user = await eventRepository.checkTourismGovernor(userId);
  if (!user) {
    return {status: 400, response: {message: 'You are not authorized to update this Historical Place'}};
  }
  const historicalPlace = await eventRepository.getHistoricalPlaceById(id);
  if (!historicalPlace) {
    return {status: 404, response: {message: 'Historical Place not found'}};
  }
  console.log(historicalPlace.created_by.toString());
  if(historicalPlace.created_by.toString() != userId) {
    return {status: 400, response: {message: 'You are not authorized to update this Historical Place'}};
  }
  const updatedHistoricalPlace = await eventRepository.updateHistoricalPlace(id, data);
  console.log("updatedHistoricalPlace", updatedHistoricalPlace)
  if (!updatedHistoricalPlace) {
    return {status: 500, response: {message: 'Failed to update Historical Placeeeeee'}};
  }
  return {status: 200, response: {message: 'Historical Place updated', updatedHistoricalPlace: updatedHistoricalPlace}};
};

// Delete a Historical Place by ID
const deleteHistoricalPlace = async (id, userId) => {
  const user = await eventRepository.checkTourismGovernor(userId);
  if (!user) {
    return {status: 400, response: {message: 'You are not authorized to delete this Historical Place'}};
  }
  const historicalPlace = await eventRepository.getHistoricalPlaceById(id);
  if (!historicalPlace) {
    return {status: 404, response: {message: 'Historical Place not found'}};
  }
  if(historicalPlace.created_by != userId) {
    return {status: 400, response: {message: 'You are not authorized to delete this Historical Place'}};
  }
  const deletedHistoricalPlace = await eventRepository.deleteHistoricalPlace(id);
  if (!deletedHistoricalPlace) {
    return {status: 500, response: {message: 'Failed to delete Historical Place'}};
  }
  return {status: 200, response: {message: 'Historical Place deleted'}};
};

const getFilteredItineraries = async (filters) => {
  try {
    // Pass the filters, page, and limit to the repository to fetch itineraries
    const itineraries = await eventRepository.getFilteredItineraries(filters);

    // Format the fetched itineraries before returning
    return itineraries.map((itinerary) => ({
      id: itinerary._id,
      activities: itinerary.activities,
      activitiesNames: itinerary.activities.name,
      locations: itinerary.locations,
      price: itinerary.price,
      dateTimeAvailable: itinerary.dateTimeAvailable,
      language: itinerary.language,
      accessibility: itinerary.accessibility,
      pickupLocation: itinerary.pickupLocation,
      dropoffLocation: itinerary.dropoffLocation,
      rating: itinerary.rating,
      comments: itinerary.comments,
      tags: itinerary.tags.map((tag) => tag.name), // Extract tag names if populated
    }));
  } catch (error) {
    console.error(`Service Error: ${error.message}`);
    throw error;
  }
};

const getFilteredHistoricalPlaces = async (tags) => {
  try {
    const historicalPlaces = await eventRepository.getFilteredHistoricalPlaces(
      tags
    );

    // Format historical places
    const formattedHistoricalPlaces = historicalPlaces.map((place) => ({
      id: place._id,
      description: place.description,
      pictures: place.pictures,
      location: place.location,
      openingHours: place.openingHours,
      ticketPrice: place.ticketPrice,
      createdAt: place.createdAt,
      createdBy: place.created_by, // Reference to creator's ID
      tags: place.tags, // Include el period we el type
    }));
    console.log(formattedHistoricalPlaces);

    return formattedHistoricalPlaces;
  } catch (error) {
    console.error(`Service Error: ${error.message}`);
    throw error; // Propagate the error to the controller
  }
};
const getAllHistoricalTags = async () => {
  return await eventRepository.getAllHistoricalTags();
}

const getHistoricalTagDetails = async (tagId) => {
  return await eventRepository.getHistoricalTagDetails(tagId);
}
const sendEventEmail = async (touristId, receiverEmail, eventDetails) => {
    
  const touristEmail = await eventRepository.getTouristEmailById(touristId);
  console.log("error1");
  
  if (!touristEmail) {
    console.log("error2");
    throw new Error('Tourist not found');
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: "aclproject7@gmail.com", 
      pass: "qodo imkr adxs jred", 
    },
    tls: {
      rejectUnauthorized: false // Allows self-signed certificates
  }
  });
  console.log("error3");

  const formattedDetails = Object.entries(eventDetails)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
    console.log("error4");

  const mailOptions = {
    from: touristEmail,
    to: receiverEmail,
    subject: 'Event Details',
    text: `Hello!\nYour friend with email ${touristEmail} sent you an event!!\n\nHere are the event details:\n\n${formattedDetails}`, // Including tourist email in the message
  };
  console.log("erro5");

  await transporter.sendMail(mailOptions);
  return { message: 'Email sent successfully' };
};



//Mohamed APis
const bookedEvents = async (touristId) => {
  const tourist = await eventRepository.bookedEvents({ touristId });

  if (!tourist) {
    throw new Error('Tourist not found');
  }

  return [
    // Process activityId array
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

    // Process itineraryId array
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

    // Process historicalplaceId array
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

    // Process transportationId array
    tourist.transportationId && tourist.transportationId.length > 0 ? tourist.transportationId
      .filter(transportation => transportation.id)
      .map(transportation => ({
        ...transportation.id._doc,
        pricePaid: transportation.pricePaid
      })) : []
  ];
};


const cancelEventToTourist= async (userType, touristId, eventType, eventId) => {
    
    return await eventRepository.cancelEvent(touristId, eventType, eventId);
  }

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
    throw new Error(error.message); // Throw the error message without adding any prefix
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

//Saif, Tasnim
const updateItineraryActivation = async (itineraryId, isActivated, userId, userType) => {
  return await eventRepository.updateItineraryActivation(itineraryId, isActivated, userId);
};





//Buildo + saif apis 


const addEventToTourist = async (userType, touristId, eventType, eventId,ticketType,currency,activityPrice,promoCode) => {
  
  return await eventRepository.bookEvent(touristId, eventType, eventId,ticketType,currency,activityPrice,promoCode);
};


const addEventToTouristWithCard = async (userType,touristId,eventType,eventId,ticketType,currency,activityPrice,cardNumber,expMonth,expYear,cvc,promoCode) => {
  return await eventRepository.bookEventWithCard(
    touristId,
    eventType,
    eventId,
    ticketType,
    currency,
    activityPrice,
    cardNumber,
    expMonth,
    expYear,
    cvc,promoCode
  );
};


module.exports = {
  updateItineraryActivation,
  getHistoricalTagDetails,
  getUserEvents,
  createCategory,
  getAllCategories,
  updateCategoryById,
  deleteCategoryById,
  createTag,
  getAllTags,
  updateTagById,
  deleteTagById,
  CategoryNameToId,
  getFilteredUpcomingActivities,
  getAllUpcomingEvents,
  createHistoricalTag,
  getActivityById,
  addActivity,
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
  getAllItineraries,
  getAllActivities,
  getAllActivitiesAdvertiser,
  getFilteredItineraries,
  getFilteredHistoricalPlaces,
  getAllHistoricalTags,
  getAllActivitiesInDatabase,
  getFilteredHistoricalPlaces,
  bookedEvents,
  addEventToTourist,
  cancelEventToTourist,
  fetchCityCode,
  flightOffers,
  flightBooking,
  fetchHotelsByCityCode,
  bookingHotel,
  createTransportation,
  getTransportations,
  bookTransportation,
  sendEventEmail,
  updateEventFlag,
  getAllEvents,
  addEventToTouristWithCard
};

