const eventService = require('../events/eventService');

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


  // Validate input
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

const bookEvent = async (req, res) => {
  const { userType, touristId, eventType, eventID } = req.body;

  try {
    if (userType !== 'tourist') {
      throw new Error('User type must be tourist');
     }

      const updatedTourist = await eventService.addEventToTourist(userType, touristId, eventType, eventID);
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
    sendEventEmail
  };
  