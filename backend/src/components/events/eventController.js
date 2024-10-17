const eventService = require('../events/eventService');
const { validationResult } = require('express-validator');
const eventRepository = require('../events/eventRepository');

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
  const { _id } = req.params; 
  const categoryName = req.body; // Use req.body directly
  console.log(categoryName); // Ensure correct data is being logged
  try {
    const updatedCategory = await eventService.updateCategoryById(_id, categoryName);
    console.log(updatedCategory);
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
  const { _id } = req.params; // Get the ID from the URL
  

  try {
      const result = await eventService.deleteCategoryById(_id); 
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
    const tagsArray = tags.map(tag => tag.tags);
    return res.status(200).json({message: 'Fetched all tags', tags: tags});
  } catch (error) {
    console.error('Error fetching tags:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// Update a preference tag by its _id
const updateTagById = async (req, res) => {
  const { _id } = req.params; // Get the id from the URL
  const updatedData = req.body; // Get the updated data from the request body

  try {
    const updatedTag = await eventService.updateTagById(_id, updatedData);
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
  const { _id } = req.params; // Get the id from the URL

  try {
    const deletedTag = await eventService.deleteTagById(_id);
    if (!deletedTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    return res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Error deleting tag:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

const GetupcommingActivitesFilter = async (req, res) => {
  try {
    const {
      budget,
      date,
      categoryId,
      rating,
    } = req.query;

    const filters = {
      budget: budget ? parseFloat(budget) : undefined, //ye7welo to float
      date,
      categoryId,
      rating: rating ? parseint(rating) : undefined,
    };

    console.log("Filters:", filters);
    const activities = await eventService.getFilteredUpcomingActivities(
      filters
    );

    return res.status(200).json(activities);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
};

const getUpcomingEvents = async (req, res) => {
  try {
    const upcomingEvents = await eventService.getAllUpcomingEvents();
    return res.status(200).json(upcomingEvents);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
};

const filterHistoricalPlacesByTags = async (req, res) => {
  try {
    const { tags } = req.query; // Extract tags from query parameters

    // Convert tags into an array
    const tagsArray = Array.isArray(tags) ? tags : [tags];

    const filteredHistoricalPlaces =
      await eventService.getFilteredHistoricalPlaces(tagsArray);
    return res.status(200).json(filteredHistoricalPlaces);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
};



const getFilteredItineraries = async (req, res) => {
  try {
    const { budget, date, preferences, language } = req.query;

    // Pass the query parameters to the service
    const itineraries = await eventService.getFilteredItineraries({
      budget,
      date,
      preferences,
      language,
    });

    return res.status(200).json({
      success: true,
      total: itineraries.length,
      itineraries,
    });
  } catch (error) {
    console.error(`Controller Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching itineraries",
      details: error.message,
    });
  }
};

// Create a new preference tag
const createHistoricalTag = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("TAG Error 1");
      return res.status(400).json({ errors: errors.array() });
  }

  try {
      const checkUserType =await eventRepository.getTypeForTag(req.params._id);
      if(checkUserType !== 'tourismGovernor'){
        console.log("TAG Error 2");

          return res.status(400).json({ message: 'Only tourism governors can create historical tags' });
      }

      const checkTagType = req.body.type.toLowerCase();

      if (
      checkTagType === 'monuments' || 
      checkTagType === 'museums' || 
      checkTagType === 'religious' || 
      checkTagType === 'sites' || 
      checkTagType === 'palaces' || 
      checkTagType === 'castles' || 
      checkTagType === 'palaces/castles'
      ) {

          try{
              const tag = await eventService.createHistoricalTag(req.body);
              response={
                  message: "Historical tag created successfully",
                  tag: tag
              }
              res.status(201).json(response);
          }
          catch (error) {
              res.status(400).json({ message: error.message });
              console.log("TAG Error 3:",error.message);
          }

      }else{
        console.log("TAG Error 4");
          return res.status(400).json({ message: 'Only historical tags can be created' });
      }


      
  } catch (error) {

      res.status(400).json({ message: error.message });
      console.log("TAG Error 5",error.message);

  }
};

const getActivityById = async (req, res) => {
  const { _id, userId } = req.params;
  if(!_id || !userId) {
    res.status(400).json({ message: 'Missing inputs' });
  }
  const type = await eventRepository.getType(userId);
  if (type !== 'advertiser') {
    return res.status(400).json({ message: 'Invalid type' });
  }
  try {
    const activity = await eventService.getActivityById(_id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    if (activity.created_by !== userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    return res.status(200).json(activity);
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
};

const getAllActivities = async (req, res) => {
  const {userId} = req.params;
  if (!userId) {
    return res.status(400).json({ message: 'Missing userId' });
  }
  try {
    const type = await eventRepository.getType(userId);
    if (type !== 'advertiser') {
      return res.status(400).json({ message: 'Invalid user type' });
    }
    const activities = await eventService.getAllActivitiesAdvertiser(userId); // Same here
    console.log(activities);
    return res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching activitiesss:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

const addActivity = async (req, res) => {
  const { name, date, time, location, price, category, tags, specialDiscounts, isOpen, created_by } = req.body;

  // Validate required fields
  if (!name || !date || !time || !location || !price || !category || !tags || typeof isOpen === 'undefined' || !created_by) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const type = await eventRepository.getType(created_by);
  if (type !== 'advertiser') {
    return res.status(400).json({ message: 'Invalid type' });
  }

  try {
    // Call service layer to add the activity
    const activity = await eventService.addActivity({
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
    });

    return res.status(200).json({message: 'Activity created successfully', activity: activity });
  } catch (error) {
    console.error('Error creating activity:', error.message);
    return res.status(500).json({ message: error.message });
  }
};
const getAllActivitiesInDatabase = async (req, res) => {
  try {
    const activities = await eventService.getAllActivitiesInDatabase();
    return res.status(200).json({ activities });
  } catch (error) {
    console.error('Error fetching activities:', error.message);
    return res.status(500).json({ message: 'Server error.' });
  }
}
const updateActivity = async (req, res) => {
  const { _id, userId } = req.params;
  const updateData = req.body; 
  if(!_id || !userId) {
    return res.status(400).json({ message: 'Missing inputs' });
  }
  const type = await eventRepository.getType(userId);
  if (type !== 'advertiser') {
    return res.status(400).json({ message: 'Invalid type' });
  }

  const allowedUpdates = ['date', 'time', 'location', 'price', 'category', 'tags', 'specialDiscounts', 'isOpen'];
  const invalidUpdates = Object.keys(updateData).filter(key => !allowedUpdates.includes(key));

  if (invalidUpdates.length) {
    console.log("hena  ");
    console.log("Invalid fields here:",invalidUpdates);
    return res.status(400).json({ message: `Invalid fields: ${invalidUpdates.join(', ')}` });
  }

  try {
    const getActivity = await eventService.getActivityById(_id);
    if (!getActivity) {
      return res.status(404).json({ message: 'Activity not found.' });
    }

    if (getActivity.created_by.toString() !== userId) {
      return res.status(400).json({ message: 'You are not authorized to update this activity.' });
    }
    const updatedActivity = await eventService.updateActivity(_id, updateData);
    console.log("Updated activity:",updatedActivity);
  
    if (!updatedActivity) {
      return res.status(404).json({ message: 'Activity not found.' });
    }
    return res.status(200).json({message: 'Activity updated successfully', activity: updatedActivity});
  } catch (error) {
    console.error('Error updating activity:', error.message);
    return res.status(500).json({ message: error.message });
  }
 
};

const deleteActivity = async (req, res) => {
  const { _id, userId } = req.params; // Extract the activity ID from the request parameters

  if(!_id || !userId) {
    return res.status(400).json({ message: 'Missing inputs' });
  }

  const type = await eventRepository.getType(userId);
  if (type !== 'advertiser') {
    return res.status(400).json({ message: 'Invalid type' });
  }
  try {
    const getActivity = await eventService.getActivityById(_id);
    if (!getActivity) {
      return res.status(404).json({ message: 'Activity not found.' });
    }
    if(getActivity.created_by.toString()
       !== userId) {
      return res.status(400).json({ message: 'Cannot Delete the Activity as it is not yours.' });
    }
    const deletedActivity = await eventService.deleteActivity(_id);
    
    if (!deletedActivity) {
      return res.status(404).json({ message: 'Activity not found.' });
    }

    return res.status(200).json({ message: 'Activity deleted successfully.' });
  } catch (error) {
    console.error('Error deleting activity:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getAllItineraries = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: 'Missing userId' });
  }

  try {
    const type = await eventRepository.getType(userId);
    if (type !== 'tourGuide') {
      return res.status(400).json({ message: 'Invalid type' });
    }

    const itineraries = await eventService.getAllItineraries(userId);
    return res.status(200).json({message: "Itineraries fetched successfully" ,Itineraries: itineraries});  } catch (error) {
    console.error('Error fetching itineraries:', error.message);
    return res.status(500).json({ message: 'Server error.' });
  }
};


const getItineraryById = async (req, res) => {
  const { _id, userId } = req.params;
  
  if(!_id){
    return res.status(400).json({ message: 'Missing id' });
  }

  const type = await eventRepository.getType(userId);

  if(type !== 'tourGuide'){
    return res.status(400).json({ message: 'Invalid type' });
  }

  try {
    const itinerary = await eventService.getItineraryById(_id);
    
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found.' });
    }

    if(itinerary.created_by !== userId){
      return res.status(400).json({ message: 'Cannot access the itinerary as it is not yours.' });
    }

    return res.status(200).json(itinerary);
  } catch (error) {
    console.error('Error fetching itinerary:', error.message);
    return res.status(500).json({ message: 'Server error.' });
  }
};


const createItinerary = async (req, res) => {
  try {
    const {activities,
       locations,
        timeline,
         directions,
          language,
          price,
          dateTimeAvailable,
         accessibility,
         pickupLocation,
         dropoffLocation,
         isActivated, 
        created_by, 
        flag,        
       isSpecial} = req.body;
    
    if(!activities || !locations || !timeline || !directions || !language || !price || !dateTimeAvailable || !accessibility || !pickupLocation || !dropoffLocation || !isActivated || !created_by || !flag) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if(!isSpecial){
      const isSpecial = false;
    }
    else{
      const isSpecial = true;
    }
    const type = await eventRepository.getType(created_by);

    if(type !== 'tourGuide'){
      return res.status(400).json({ message: 'Invalid type' });
    }
    
    const allActivities = await eventRepository.getAllActivities();

    if(!allActivities) {
      return res.status(404).json({ message: 'Activities not found.' });
    }

    const allActivitiesIds = allActivities.map(activity => activity._id.toString());
    const areAllActivitiesValid = activities.every(activityId => allActivitiesIds.includes(activityId));

    if (!areAllActivitiesValid) {
      return res.status(400).json({ message: 'One or more provided activities are invalid.' });
    }
    
    const itineraryData = { activities, locations, timeline, directions, language, price, dateTimeAvailable, accessibility, pickupLocation, dropoffLocation, isActivated, created_by, flag, isSpecial };
    
    // Call the service to create the itinerary
    const newItinerary = await eventService.createItinerary(itineraryData);
    
    return res.status(200).json({message: "Itinerary created successfully", Itinerary: newItinerary});
  } catch (error) {
    console.error('Error creating itinerary:', error.message);
    return res.status(500).json({ message: 'Server error.' });
  }
};

const updateItinerary = async (req, res) => {
  const { _id, userId } = req.params;
  const itineraryData = req.body;

  if (!_id) {
      return res.status(400).json({ message: 'Missing id' });
  }

  const type = await eventRepository.getType(userId);

  if (type !== 'tourGuide') {
      return res.status(400).json({ message: 'Invalid type' });
  }

  try {
    const getItinerary = await eventService.getItineraryById(_id);
    if (!getItinerary) {
      return res.status(404).json({ message: 'Itinerary not found.' });
    }
    if(getItinerary.created_by !== userId) {
      return res.status(400).json({ message: 'Cannot Delete the Itinerary as it is not yours.' });
    }
      const updatedItinerary = await eventService.updateItinerary(_id, itineraryData);
      
      if (!updatedItinerary) {
          return res.status(404).json({ message: 'Itinerary not found' });
      }
      
      return res.status(200).json(updatedItinerary);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error updating itinerary', error: error.message });
  }
};

// Delete Itinerary by ID
const deleteItinerary = async (req, res) => {
  const { _id, userId } = req.params;

  if (!_id) {
      return res.status(400).json({ message: 'Missing id' });
  }

  const type = await eventRepository.getType(userId);

  if (type !== 'tourGuide') {
      return res.status(400).json({ message: 'Invalid type' });
  }

  try {
    const getItinerary = await eventService.getItineraryById(_id);
    if (!getItinerary) {
      return res.status(404).json({ message: 'Itinerary not found.' });
    }
    if(getItinerary.created_by !== userId) {
      return res.status(400).json({ message: 'Cannot Delete the Itinerary as it is not yours.' });
    }
      const deletedItinerary = await eventService.deleteItinerary(_id);
      if (!deletedItinerary) {
          return res.status(404).json({ message: 'Itinerary not found' });
      }
      res.status(200).json({ message: 'Itinerary deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting itinerary', error: error.message });
  }
};

// Create a new Historical Place
const createHistoricalPlace = async (req, res) => {
  const {
    name,
    description,
    pictures,
    location,
    openingHours,
    ticketPrice,
    created_by,
  } = req.body;

  // Validate required fields
  if (!name || !description || !pictures || !location || !openingHours || !ticketPrice  || !created_by) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Check if the user has the right type
  const typeData = await eventRepository.getType(created_by);
  if (typeData !== 'tourismGovernor') {
    return res.status(403).json({ message: 'You are not authorized to create a Historical Place' });
  }

  try {
    // const tag = await eventRepository.findTagByTypeAndPeriod(type);
    // if (!tag) {
    //   return res.status(400).json({ message: 'Invalid tag type' });
    // }
    const historicalPlaceData = {
      name,
      description,
      pictures,
      location,
      openingHours,
      ticketPrice,
      created_by,
    };

    // Call the service to create the historical place
    const historicalPlace = await eventService.createHistoricalPlace(historicalPlaceData);
    return res.status(historicalPlace.status).json(historicalPlace.response);
  } catch (error) {
    console.error('Error creating historical place:', error.message);
    return res.status(500).json({ message: 'Error creating historical place', error: error.message });
  }
};


// Get all Historical Places
const getAllHistoricalPlaces = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
      return res.status(400).json({ message: 'Missing userId' });
  }
  const type = await eventRepository.getType(userId);
  if (type !== 'tourismGovernor') {
      return res.status(400).json({ message: 'Invalid type' });
  }
  try {
      const historicalPlaces = await eventService.getAllHistoricalPlaces();
      res.status(200).json(historicalPlaces);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching historical places', error: error.message });
  }
};

// Get Historical Place by ID
const getHistoricalPlaceById = async (req, res) => {
  try {
      const { _id, userId } = req.params;
      if (!_id || !userId) {
          return res.status(400).json({ message: 'Missing inputs' });
      }
      const type = await eventRepository.getType(userId);
      if (type !== 'tourismGovernor') {
          return res.status(400).json({ message: 'Invalid type' });
      }
      const historicalPlace = await eventService.getHistoricalPlaceById(_id, userId);
      res.status(historicalPlace.status).json(historicalPlace.response);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching historical place', error: error.message });
  }
};

// Update a Historical Place by ID
const updateHistoricalPlace = async (req, res) => {
  try {
      const { _id, userId } = req.params;
      const { updateValues } = req.body;

      if (!_id || !userId) {
          return res.status(400).json({ message: 'Missing inputs' });
      }

      const type = await eventRepository.getType(userId);
      if (type !== 'tourismGovernor') {
          return res.status(400).json({ message: 'Invalid type' });
      }
      const getHistoricalPlace = await eventService.getHistoricalPlaceById(_id);
      if (!getHistoricalPlace) {
        return res.status(404).json({ message: 'Historical Place not found.' });
      }
      if(getHistoricalPlace.created_by !== userId) {
        return res.status(400).json({ message: 'Cannot Update the Historical Place as it is not yours.' });
      }
      const updatedPlace = await eventService.updateHistoricalPlace(_id, userId, updateValues);
      if (!updatedPlace) {
          return res.status(404).json({ message: 'Historical place not found' });
      }
      res.status(updatedPlace.status).json(updatedPlace.response);
  } catch (error) {
      res.status(500).json({ message: 'Error updating historical place', error: error.message });
  }
};

// Delete a Historical Place by ID
const deleteHistoricalPlace = async (req, res) => {
  try {
      const { _id, userId } = req.params;
      if(!_id || !userId) {
          return res.status(400).json({ message: 'Missing inputs' });
      }

      const type = await eventRepository.getType(userId);
      if (type !== 'tourismGovernor') {
          return res.status(400).json({ message: 'Invalid type' });
      }
      const getHistoricalPlace = await eventService.getHistoricalPlaceById(_id);
      if (!getHistoricalPlace) {
        return res.status(404).json({ message: 'Historical Place not found.' });
      }
      if(getHistoricalPlace.created_by !== userId) {
        return res.status(400).json({ message: 'Cannot Delete the Historical Place as it is not yours.' });
      }
      const deletedPlace = await eventService.deleteHistoricalPlace(_id, userId);
      if (!deletedPlace) {
          return res.status(404).json({ message: 'Historical place not found' });
      }
      res.status(deletedPlace.status).json(deletedPlace.response);
  } catch (error) {
      res.status(500).json({ message: 'Error deleting historical place', error: error.message });
  }
};
const getAllHistoricalTags = async (req, res) => {
  const { userId } = req.params;
  if(!userId) {
    res.status(400).json({ message: 'Missing inputs' });
  }
  const type = await eventRepository.getType(userId);
  if (type !== 'tourGuide' || type !== 'tourist' || type != 'guest') {
    return res.status(400).json({ message: 'Invalid type' });
  }
  try {
    const tags = await eventService.getAllHistoricalTags();
    return res.status(200).json({message: "Tags fetched successfully", tags: tags});
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
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
  GetupcommingActivitesFilter,
  getUpcomingEvents,
  filterHistoricalPlacesByTags,
  getFilteredItineraries,
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
  getAllHistoricalTags,
  getAllActivitiesInDatabase
  };
  