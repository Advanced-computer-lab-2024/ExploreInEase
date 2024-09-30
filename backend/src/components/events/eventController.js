const eventService = require('./eventService');

//Get all my events by username
const getUserEvents = async (req, res) => {
    const { username, userType } = req.params;
  
    if (typeof username !== 'string' || typeof userType !== 'string') {
      return res.status(400).json({ error: 'Invalid username or usertype' });
  }
  if (!username || !userType ) {
      return res.status(400).json({ message: "Username and password are required." });
  }
  
    
    try {
      const events = await eventService.getUserEvents(username, userType);
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

// Update an activity category by name
const updateCategoryByName = async (req, res) => {
  const { categoryName } = req.params;
  try {
    const updatedCategory = await eventService.updateCategoryByName(categoryName, req.body);
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    return res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// Delete an activity category by name
const deleteCategoryByName = async (req, res) => {
  const { categoryName } = req.params;
  try {
    const deletedCategory = await eventService.deleteCategoryByName(categoryName);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    return res.status(204).send(); 
  } catch (error) {
    console.error('Error deleting category:', error.message);
    return res.status(500).json({ message: error.message });
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

// Update a preference tag by its name
const updateTagByName = async (req, res) => {
  const { tagName } = req.params; // Assuming the name is passed in the URL
  const updatedData = req.body;

  try {
    const updatedTag = await eventService.updateTagByName(tagName, updatedData);
    return res.status(200).json(updatedTag);
  } catch (error) {
    console.error('Error updating tag:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// Delete a preference tag by its name
const deleteTagByName = async (req, res) => {
  const { tagName } = req.params; // Assuming the name is passed in the URL

  try {
    const deletedTag = await eventService.deleteTagByName(tagName);
    return res.status(200).json(deletedTag);
  } catch (error) {
    console.error('Error deleting tag:', error.message);
    return res.status(500).json({ message: error.message });
  }
};


module.exports = {
    getUserEvents,
    createCategory,
    getAllCategories,
    updateCategoryByName,
    deleteCategoryByName,
    createTag,
    getAllTags,
    updateTagByName,
    deleteTagByName,
  };
  