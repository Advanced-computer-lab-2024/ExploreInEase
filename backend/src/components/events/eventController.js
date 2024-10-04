const eventService = require('../events/eventService');
const { validationResult } = require('express-validator');

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

const createHistoricalTag = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const tag = await eventService.createHistoricalTag(req.body);
        res.status(201).json(tag);
    } catch (error) {
        res.status(400).json({ message: error.message });
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
  GetupcommingActivitesFilter,
  getUpcomingEvents,
  filterHistoricalPlacesByTags,
  getFilteredItineraries,
  createHistoricalTag
  };
  